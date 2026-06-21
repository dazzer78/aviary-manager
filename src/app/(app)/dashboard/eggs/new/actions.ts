"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createEgg(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const clutchId = String(formData.get("clutch_id") || "");
  if (!clutchId) throw new Error("Clutch is required");

  const status = String(formData.get("status") || "incubating");
  const { error } = await supabase.from("eggs").insert({
    aviary_id: aviary.id,
    clutch_id: clutchId,
    egg_number: Number(formData.get("egg_number") || 1),
    laid_date: String(formData.get("laid_date") || "") || null,
    expected_hatch_date: String(formData.get("expected_hatch_date") || "") || null,
    fertile: String(formData.get("fertile") || "") === "true" ? true : String(formData.get("fertile") || "") === "false" ? false : null,
    status,
    hatched: status === "hatched",
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/breeding/workflow");
}
