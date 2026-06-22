"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createPair(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const maleBirdId = String(formData.get("male_bird_id") || "").trim();
  const femaleBirdId = String(formData.get("female_bird_id") || "").trim();
  const maleRing = String(formData.get("male_ring") || "").trim();
  const femaleRing = String(formData.get("female_ring") || "").trim();

  const [{ data: male }, { data: female }, { data: season }] = await Promise.all([
    maleBirdId
      ? supabase.from("birds").select("id").eq("aviary_id", aviary.id).eq("id", maleBirdId).maybeSingle()
      : supabase.from("birds").select("id").eq("aviary_id", aviary.id).eq("ring_number", maleRing).maybeSingle(),
    femaleBirdId
      ? supabase.from("birds").select("id").eq("aviary_id", aviary.id).eq("id", femaleBirdId).maybeSingle()
      : supabase.from("birds").select("id").eq("aviary_id", aviary.id).eq("ring_number", femaleRing).maybeSingle(),
    supabase.from("breeding_seasons").select("id").eq("aviary_id", aviary.id).eq("is_active", true).maybeSingle(),
  ]);

  if (!male?.id || !female?.id) throw new Error("Both bird ring numbers must exist before creating a pair.");

  const { error } = await supabase.from("pairs").insert({
    aviary_id: aviary.id,
    season_id: season?.id ?? null,
    male_bird_id: male.id,
    female_bird_id: female.id,
    cage: String(formData.get("cage") || "").trim() || null,
    nest_number: String(formData.get("nest_number") || "").trim() || null,
    start_date: String(formData.get("start_date") || "").trim() || null,
    end_date: String(formData.get("end_date") || "").trim() || null,
    status: String(formData.get("status") || "active"),
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/breeding");
}
