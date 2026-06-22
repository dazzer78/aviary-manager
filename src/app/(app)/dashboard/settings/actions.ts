"use server";

import { redirect } from "next/navigation";
import { getSeasonOptions } from "@/lib/season";
import { getSeasonDefinitions, getUserAndAviary } from "@/lib/aviary";

export async function saveSeasonSettings(formData: FormData) {
  const { supabase, aviary } = await getUserAndAviary();
  const existingSeasons = await getSeasonDefinitions(supabase, aviary.id);

  const seasons = getSeasonOptions().map((year) => {
    const existing = existingSeasons.find((season) => season.year === year);
    const startDate = String(formData.get(`start_date_${year}`) || "").trim() || `${year}-01-01`;
    const endDate = String(formData.get(`end_date_${year}`) || "").trim() || `${year}-12-31`;

    if (new Date(`${endDate}T23:59:59Z`) < new Date(`${startDate}T00:00:00Z`)) {
      throw new Error(`Season ${year} end date must be on or after the start date.`);
    }

    return {
      aviary_id: aviary.id,
      year,
      name: existing?.name ?? `Season ${year}`,
      start_date: startDate,
      end_date: endDate,
      is_active: existing?.is_active ?? false,
    };
  });

  const { error } = await supabase
    .from("breeding_seasons")
    .upsert(seasons, { onConflict: "aviary_id,year" });

  if (error) throw new Error(error.message);
  redirect("/dashboard/settings?saved=1");
}
