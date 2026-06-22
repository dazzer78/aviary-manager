import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getSeasonRangeLabel, getSelectedSeasonYear } from "@/lib/season";
import { getSeasonDefinitionByYear, getSeasonDefinitions, getUserAndAviary } from "@/lib/aviary";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { supabase, user, aviary } = await getUserAndAviary();
  const seasons = await getSeasonDefinitions(supabase, aviary.id);
  const selectedSeasonYear = await getSelectedSeasonYear(seasons.map((season) => season.year));
  const selectedSeason = getSeasonDefinitionByYear(seasons, selectedSeasonYear);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  return (
    <div className="page">
      <Sidebar />
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
