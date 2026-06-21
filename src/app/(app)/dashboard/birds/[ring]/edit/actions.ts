"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function updateBird(ring: string, formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const currentRing = decodeURIComponent(ring);
  const ringNumber = String(formData.get("ring_number") || "").trim();
  if (!ringNumber) throw new Error("Ring number is required");

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

  const { error } = await supabase
    .from("birds")
    .update({
      ring_number: ringNumber,
      name: ringNumber,
      species_id: speciesId,
      sex: String(formData.get("sex") || "unknown"),
      mutation: String(formData.get("mutation") || "").trim() || null,
      date_of_birth: String(formData.get("date_of_birth") || "") || null,
      status: String(formData.get("status") || "active"),
      photo_url: String(formData.get("photo_url") || "").trim() || null,
      notes: String(formData.get("notes") || "").trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("aviary_id", aviary.id)
    .eq("ring_number", currentRing);

  if (error) throw new Error(error.message);
  redirect(`/dashboard/birds/${encodeURIComponent(ringNumber)}`);
}

export async function deleteBird(ring: string) {
  const { supabase, aviary } = await getUserAndAviary();
  const currentRing = decodeURIComponent(ring);

  const { error } = await supabase
    .from("birds")
    .delete()
    .eq("aviary_id", aviary.id)
    .eq("ring_number", currentRing);

  if (error) throw new Error(error.message);
  redirect("/dashboard/birds");
}
