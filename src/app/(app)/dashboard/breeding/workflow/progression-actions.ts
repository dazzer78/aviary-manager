"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function recordHatch(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const eggId = String(formData.get("egg_id") || "");
  const hatchDate = String(formData.get("hatch_date") || "");
  const ringDays = Number(formData.get("ring_days") || 7);

  if (!eggId || !hatchDate) throw new Error("Egg and hatch date are required");

  const { error } = await supabase.rpc("record_hatch_tx", {
    p_aviary_id: aviary.id,
    p_egg_id: eggId,
    p_hatch_date: hatchDate,
    p_ring_days: ringDays,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/breeding/workflow");
}

export async function markRinged(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const chickId = String(formData.get("chick_id") || "");
  const ringNumber = String(formData.get("ring_number") || "").trim();
  const ringedDate = String(formData.get("ringed_date") || "");

  if (!chickId || !ringNumber || !ringedDate) throw new Error("Chick, ring number and ringed date are required");

  const { error } = await supabase.rpc("mark_ringed_tx", {
    p_aviary_id: aviary.id,
    p_chick_id: chickId,
    p_ring_number: ringNumber,
    p_ringed_date: ringedDate,
  });

  if (error) throw new Error(error.message);
  redirect(`/dashboard/birds/${ringNumber}`);
}
