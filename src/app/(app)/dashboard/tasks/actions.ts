"use server";

import { revalidatePath } from "next/cache";
import { getUserAndAviary } from "@/lib/aviary";

export async function completeTask(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const { error } = await supabase
    .from("tasks")
    .update({ status: "completed", completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("aviary_id", aviary.id)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/tasks");
}
