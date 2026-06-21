import { createClient } from "@supabase/supabase-js";
import { Bird, Cage, Species, Task } from "../types";

// Example query functions for server-side operations
// Use these in your Server Components and API routes

export async function getBirds(supabase: any, userId: string): Promise<Bird[]> {
  const { data, error } = await supabase
    .from("birds")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCages(supabase: any, userId: string): Promise<Cage[]> {
  const { data, error } = await supabase
    .from("cages")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getSpecies(
  supabase: any,
  userId: string
): Promise<Species[]> {
  const { data, error } = await supabase
    .from("species")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPendingTasks(
  supabase: any,
  userId: string
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["pending", "overdue"])
    .order("due_date", { ascending: true })
    .limit(10);

  if (error) throw error;
  return data;
}

export async function getDashboardStats(supabase: any, userId: string) {
  const [birds, cages, tasks] = await Promise.all([
    supabase.from("birds").select("id", { count: "exact" }).eq("user_id", userId),
    supabase.from("cages").select("id", { count: "exact" }).eq("user_id", userId),
    supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .eq("status", "pending"),
  ]);

  return {
    totalBirds: birds.count || 0,
    totalCages: cages.count || 0,
    pendingTasks: tasks.count || 0,
  };
}
