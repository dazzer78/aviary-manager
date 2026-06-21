import type { SupabaseClient } from "@supabase/supabase-js";
import type { Bird, Cage, Species, Task } from "@/lib/aviary";

type QueryClient = Pick<SupabaseClient, "from">;

export async function getBirds(supabase: QueryClient, aviaryId: string): Promise<Bird[]> {
  const { data, error } = await supabase
    .from("birds")
    .select("*")
    .eq("aviary_id", aviaryId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Bird[];
}

export async function getCages(supabase: QueryClient, aviaryId: string): Promise<Cage[]> {
  const { data, error } = await supabase
    .from("cages")
    .select("*")
    .eq("aviary_id", aviaryId)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Cage[];
}

export async function getSpecies(
  supabase: QueryClient,
  aviaryId: string
): Promise<Species[]> {
  const { data, error } = await supabase
    .from("species")
    .select("*")
    .eq("aviary_id", aviaryId)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Species[];
}

export async function getPendingTasks(
  supabase: QueryClient,
  aviaryId: string
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("aviary_id", aviaryId)
    .in("status", ["pending", "overdue"])
    .order("due_at", { ascending: true })
    .limit(10);

  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function getDashboardStats(supabase: QueryClient, aviaryId: string) {
  const [birds, cages, tasks] = await Promise.all([
    supabase.from("birds").select("id", { count: "exact" }).eq("aviary_id", aviaryId),
    supabase.from("cages").select("id", { count: "exact" }).eq("aviary_id", aviaryId),
    supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .eq("aviary_id", aviaryId)
      .eq("status", "pending"),
  ]);

  return {
    totalBirds: birds.count || 0,
    totalCages: cages.count || 0,
    pendingTasks: tasks.count || 0,
  };
}
