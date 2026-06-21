"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createCage(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Cage name is required");

  const capacityValue = String(formData.get("capacity") || "").trim();

  const { error } = await supabase.from("cages").insert({
    aviary_id: aviary.id,
    name,
    cage_type: String(formData.get("cage_type") || "breeding"),
    location: String(formData.get("location") || "").trim() || null,
    dimensions: String(formData.get("dimensions") || "").trim() || null,
    capacity: capacityValue ? Number(capacityValue) : null,
    status: String(formData.get("status") || "active"),
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/cages");
}
