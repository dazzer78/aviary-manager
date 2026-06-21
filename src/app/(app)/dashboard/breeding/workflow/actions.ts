"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createClutch(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const pairId = String(formData.get("pair_id") || "");
  if (!pairId) throw new Error("Pair is required");

  const { error } = await supabase.from("clutches").insert({
    aviary_id: aviary.id,
    pair_id: pairId,
    nest_number: String(formData.get("nest_number") || "").trim() || null,
    laid_start_date: String(formData.get("laid_start_date") || "") || null,
    status: "active",
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/breeding/workflow");
}
