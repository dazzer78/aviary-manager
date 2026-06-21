"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createSale(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const ring = String(formData.get("ring_number") || "").trim();
  let birdId: string | null = null;

  if (ring) {
    const { data: bird } = await supabase.from("birds").select("id").eq("aviary_id", aviary.id).eq("ring_number", ring).maybeSingle();
    birdId = bird?.id ?? null;
  }

  const { error } = await supabase.from("sales").insert({
    aviary_id: aviary.id,
    bird_id: birdId,
    buyer_name: String(formData.get("buyer_name") || "").trim() || null,
    sale_date: String(formData.get("sale_date") || "") || null,
    amount: Number(formData.get("amount") || 0),
    payment_status: String(formData.get("payment_status") || "paid"),
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard");
}
