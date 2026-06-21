import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Bird = {
  id: string;
  ring_number: string;
  name: string | null;
  sex: "male" | "female" | "unknown";
  mutation: string | null;
  date_of_birth: string | null;
  status: string;
  photo_url: string | null;
  notes: string | null;
  cage_id?: string | null;
  species?: { name: string } | null;
};

export async function getUserAndAviary() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: existing, error } = await supabase
    .from("aviaries")
    .select("id, name")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (existing) return { supabase, user, aviary: existing };

  const { data: created, error: createError } = await supabase
    .from("aviaries")
    .insert({ owner_id: user.id, name: "My Aviary" })
    .select("id, name")
    .single();

  if (createError) throw new Error(createError.message);
  return { supabase, user, aviary: created };
}

export async function getDashboardData() {
  const { supabase, aviary } = await getUserAndAviary();

  const [birds, pairs, eggs, chicks, treatments, sales, cages, tasks] = await Promise.all([
    supabase.from("birds").select("*, species(name)").eq("aviary_id", aviary.id).order("created_at", { ascending: false }).limit(50),
    supabase.from("pairs").select("id, status, created_at").eq("aviary_id", aviary.id),
    supabase.from("eggs").select("id, status, expected_hatch_date, hatch_date").eq("aviary_id", aviary.id),
    supabase.from("chicks").select("id, status, ring_due_date").eq("aviary_id", aviary.id),
    supabase.from("treatments").select("id, treatment_name, follow_up_date").eq("aviary_id", aviary.id).order("treatment_date", { ascending: false }).limit(20),
    supabase.from("sales").select("id, amount, sale_date").eq("aviary_id", aviary.id).order("sale_date", { ascending: false }).limit(5),
    supabase.from("cages").select("id, name, capacity, status").eq("aviary_id", aviary.id),
    supabase.from("tasks").select("id, title, due_at, status, priority").eq("aviary_id", aviary.id).neq("status", "completed").order("due_at", { ascending: true, nullsFirst: false }).limit(20),
  ]);

  for (const result of [birds, pairs, eggs, chicks, treatments, sales, cages, tasks]) {
    if (result.error) throw new Error(result.error.message);
  }

  return {
    aviary,
    birds: (birds.data ?? []) as Bird[],
    pairs: pairs.data ?? [],
    eggs: eggs.data ?? [],
    chicks: chicks.data ?? [],
    treatments: treatments.data ?? [],
    sales: sales.data ?? [],
    cages: cages.data ?? [],
    tasks: tasks.data ?? [],
  };
}

export function fallbackImage(status?: string | null) {
  if (status === "young") return "/images/birds/zebra-1.svg";
  return "/images/birds/gouldian-1.svg";
}
