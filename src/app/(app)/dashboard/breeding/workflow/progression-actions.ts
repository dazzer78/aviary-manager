"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function recordHatch(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const eggId = String(formData.get("egg_id") || "");
  const hatchDate = String(formData.get("hatch_date") || "");
  const ringDays = Number(formData.get("ring_days") || 7);
  if (!eggId || !hatchDate) throw new Error("Egg and hatch date are required");

  const due = new Date(hatchDate);
  due.setDate(due.getDate() + ringDays);
  const ringDueDate = due.toISOString().slice(0, 10);

  const { error: eggError } = await supabase
    .from("eggs")
    .update({ status: "hatched", hatched: true, hatch_date: hatchDate })
    .eq("id", eggId)
    .eq("aviary_id", aviary.id);

  if (eggError) throw new Error(eggError.message);

  const { error: chickError } = await supabase.from("chicks").insert({
    aviary_id: aviary.id,
    egg_id: eggId,
    hatch_date: hatchDate,
    ring_due_date: ringDueDate,
    status: "alive",
  });

  if (chickError) throw new Error(chickError.message);

  await supabase.from("breeding_events").insert({
    aviary_id: aviary.id,
    egg_id: eggId,
    event_type: "hatched",
    title: "Chick hatched",
    notes: `Ring due ${ringDueDate}`,
  });

  redirect("/dashboard/breeding/workflow");
}

export async function markRinged(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const chickId = String(formData.get("chick_id") || "");
  const ringNumber = String(formData.get("ring_number") || "").trim();
  const ringedDate = String(formData.get("ringed_date") || "");
  if (!chickId || !ringNumber || !ringedDate) throw new Error("Required fields missing");

  const { data: bird, error: birdError } = await supabase
    .from("birds")
    .insert({ aviary_id: aviary.id, ring_number: ringNumber, status: "young", notes: "Created from breeding workflow" })
    .select("id")
    .single();

  if (birdError) throw new Error(birdError.message);

  const { error } = await supabase
    .from("chicks")
    .update({ status: "ringed", ringed_date: ringedDate, bird_id: bird.id })
    .eq("id", chickId)
    .eq("aviary_id", aviary.id);

  if (error) throw new Error(error.message);

  await supabase.from("breeding_events").insert({
    aviary_id: aviary.id,
    chick_id: chickId,
    bird_id: bird.id,
    event_type: "ringed",
    title: `Ringed as ${ringNumber}`,
  });

  redirect(`/dashboard/birds/${ringNumber}`);
}
