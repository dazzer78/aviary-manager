"use server";

import { redirect } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";

export async function createTask(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Task title is required");

  const { error } = await supabase.from("tasks").insert({
    aviary_id: aviary.id,
    title,
    task_type: String(formData.get("task_type") || "general"),
    priority: String(formData.get("priority") || "medium"),
    status: "pending",
    due_at: String(formData.get("due_at") || "") || null,
    description: String(formData.get("description") || "").trim() || null,
  });

  if (error) throw new Error(error.message);
  redirect("/dashboard/tasks");
}
