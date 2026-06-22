import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getSeasonRangeLabel, getSelectedSeasonYear } from "@/lib/season";
import { getSeasonDefinitionByYear, getSeasonDefinitions, getUserAndAviary } from "@/lib/aviary";

async function getSidebarCounts(supabase: Awaited<ReturnType<typeof getUserAndAviary>>["supabase"], aviaryId: string) {
  const today = new Date().toISOString().slice(0, 10);

  const [incubating, ringPending] = await Promise.all([
    supabase
      .from("eggs")
      .select("id", { count: "exact", head: true })
      .eq("aviary_id", aviaryId)
      .eq("status", "incubating"),
    supabase
      .from("chicks")
      .select("id", { count: "exact", head: true })
      .eq("aviary_id", aviaryId)
      .lte("ring_due_date", today)
      .in("status", ["alive", "hatched"]),
  ]);

  return {
    incubating: incubating.error ? 0 : incubating.count ?? 0,
    ringPending: ringPending.error ? 0 : ringPending.count ?? 0,
  };
}

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { supabase, user, aviary } = await getUserAndAviary();
  const seasons = await getSeasonDefinitions(supabase, aviary.id);
  const selectedSeasonYear = await getSelectedSeasonYear(seasons.map((season) => season.year));
  const selectedSeason = getSeasonDefinitionByYear(seasons, selectedSeasonYear);
  const counts = await getSidebarCounts(supabase, aviary.id);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  return (
    <div className="page">
      <Sidebar counts={counts} />
      <div className="page-wrapper">
        <Topbar
          email={user.email || ""}
          selectedSeason={selectedSeason.year}
          seasonOptions={seasons.map((season) => season.year)}
          seasonRangeLabel={getSeasonRangeLabel(selectedSeason)}
        />
        <div className="page-body">
          <div className="container-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
