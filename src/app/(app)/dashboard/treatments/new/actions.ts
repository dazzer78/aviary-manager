"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createTreatment(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const ring = String(formData.get("ring_number") || "").trim();
  const { data: bird } = await supabase.from("birds").select("id").eq("aviary_id", aviary.id).eq("ring_number", ring).maybeSingle();
  if (!bird?.id) throw new Error("Bird ring number was not found.");

  const { error } = await supabase.from("treatments").insert({
    aviary_id: aviary.id,
    bird_id: bird.id,
    treatment_name: String(formData.get("treatment_name") || "").trim(),
    treatment_date: String(formData.get("treatment_date") || ""),
    follow_up_date: String(formData.get("follow_up_date") || "") || null,
    dosage: String(formData.get("dosage") || "").trim() || null,
    reason: String(formData.get("reason") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect(`/dashboard/birds/${ring}`);
}
