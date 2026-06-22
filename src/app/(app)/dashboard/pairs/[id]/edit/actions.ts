"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function updatePair(pairId: string, formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const currentPairId = decodeURIComponent(pairId);
  const maleBirdId = String(formData.get("male_bird_id") || "").trim();
  const femaleBirdId = String(formData.get("female_bird_id") || "").trim();

  if (!maleBirdId || !femaleBirdId) {
    throw new Error("Both male and female birds are required.");
  }

  const { error } = await supabase
    .from("pairs")
    .update({
      male_bird_id: maleBirdId,
      female_bird_id: femaleBirdId,
      cage: String(formData.get("cage") || "").trim() || null,
      nest_number: String(formData.get("nest_number") || "").trim() || null,
      start_date: String(formData.get("start_date") || "").trim() || null,
      end_date: String(formData.get("end_date") || "").trim() || null,
      status: String(formData.get("status") || "active"),
      notes: String(formData.get("notes") || "").trim() || null,
    })
    .eq("aviary_id", aviary.id)
    .eq("id", currentPairId);

  if (error) throw new Error(error.message);
  redirect("/dashboard/breeding");
}
