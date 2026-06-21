"use server";

import { revalidatePath } from "next/cache";
import { getUserAndAviary } from "@/lib/aviary";

const BUCKET = "bird-photos";

export async function uploadBirdPhoto(ring: string, formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const ringNumber = decodeURIComponent(ring);
  const file = formData.get("photo") as File | null;
  const caption = String(formData.get("caption") || "").trim() || null;

  if (!file || file.size === 0) throw new Error("Please choose a photo to upload.");

  const { data: bird, error: birdError } = await supabase
    .from("birds")
    .select("id, ring_number")
    .eq("aviary_id", aviary.id)
    .eq("ring_number", ringNumber)
    .single();

  if (birdError) throw new Error(birdError.message);

  const extension = file.name.split(".").pop() || "jpg";
  const safeName = `${Date.now()}-${bird.ring_number.replace(/[^a-z0-9-]/gi, "-")}.${extension}`;
  const storagePath = `${aviary.id}/${bird.id}/${safeName}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  const { data: existingPrimary } = await supabase
    .from("bird_photos")
    .select("id")
    .eq("aviary_id", aviary.id)
    .eq("bird_id", bird.id)
    .eq("is_primary", true)
    .limit(1);

  const isPrimary = !existingPrimary || existingPrimary.length === 0;

  const { error: insertError } = await supabase.from("bird_photos").insert({
    aviary_id: aviary.id,
    bird_id: bird.id,
    image_url: publicUrl.publicUrl,
    storage_path: storagePath,
    file_name: file.name,
    caption,
    is_primary: isPrimary,
  });

  if (insertError) throw new Error(insertError.message);

  if (isPrimary) {
    await supabase.from("birds").update({ photo_url: publicUrl.publicUrl }).eq("aviary_id", aviary.id).eq("id", bird.id);
  }

  revalidatePath(`/dashboard/birds/${encodeURIComponent(ringNumber)}`);
}

export async function setPrimaryPhoto(ring: string, formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const ringNumber = decodeURIComponent(ring);
  const photoId = String(formData.get("photo_id") || "");
  if (!photoId) return;

  const { data: photo, error } = await supabase
    .from("bird_photos")
    .select("id, bird_id, image_url")
    .eq("aviary_id", aviary.id)
    .eq("id", photoId)
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("bird_photos").update({ is_primary: false }).eq("aviary_id", aviary.id).eq("bird_id", photo.bird_id);
  await supabase.from("bird_photos").update({ is_primary: true }).eq("aviary_id", aviary.id).eq("id", photoId);
  await supabase.from("birds").update({ photo_url: photo.image_url }).eq("aviary_id", aviary.id).eq("id", photo.bird_id);

  revalidatePath(`/dashboard/birds/${encodeURIComponent(ringNumber)}`);
}

export async function deleteBirdPhoto(ring: string, formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const ringNumber = decodeURIComponent(ring);
  const photoId = String(formData.get("photo_id") || "");
  if (!photoId) return;

  const { data: photo, error } = await supabase
    .from("bird_photos")
    .select("id, bird_id, storage_path, is_primary")
    .eq("aviary_id", aviary.id)
    .eq("id", photoId)
    .single();

  if (error) throw new Error(error.message);
  if (photo.storage_path) await supabase.storage.from(BUCKET).remove([photo.storage_path]);
  await supabase.from("bird_photos").delete().eq("aviary_id", aviary.id).eq("id", photoId);

  if (photo.is_primary) {
    const { data: nextPhoto } = await supabase
      .from("bird_photos")
      .select("id, image_url")
      .eq("aviary_id", aviary.id)
      .eq("bird_id", photo.bird_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (nextPhoto) {
      await supabase.from("bird_photos").update({ is_primary: true }).eq("id", nextPhoto.id);
      await supabase.from("birds").update({ photo_url: nextPhoto.image_url }).eq("aviary_id", aviary.id).eq("id", photo.bird_id);
    } else {
      await supabase.from("birds").update({ photo_url: null }).eq("aviary_id", aviary.id).eq("id", photo.bird_id);
    }
  }

  revalidatePath(`/dashboard/birds/${encodeURIComponent(ringNumber)}`);
}
