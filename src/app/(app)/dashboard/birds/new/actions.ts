"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createBird(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();

  const speciesName = String(formData.get("species") || "").trim();
  let speciesId: string | null = null;

  if (speciesName) {
    const { data: existingSpecies } = await supabase
      .from("species")
      .select("id")
      .eq("aviary_id", aviary.id)
      .eq("name", speciesName)
      .maybeSingle();

    if (existingSpecies) {
      speciesId = existingSpecies.id;
    } else {
      const { data: createdSpecies, error: speciesError } = await supabase
        .from("species")
        .insert({ aviary_id: aviary.id, name: speciesName })
        .select("id")
        .single();

      if (speciesError) throw new Error(speciesError.message);
      speciesId = createdSpecies.id;
    }
  }

  const ringNumber = String(formData.get("ring_number") || "").trim();
  if (!ringNumber) throw new Error("Ring number is required");

  const { error } = await supabase.from("birds").insert({
    aviary_id: aviary.id,
    species_id: speciesId,
    ring_number: ringNumber,
    name: String(formData.get("name") || "").trim() || null,
    sex: String(formData.get("sex") || "unknown"),
    mutation: String(formData.get("mutation") || "").trim() || null,
    date_of_birth: String(formData.get("date_of_birth") || "") || null,
    status: String(formData.get("status") || "active"),
    photo_url: String(formData.get("photo_url") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/birds");
}
