import { cookies } from "next/headers";

export const MIN_SEASON_YEAR = 2023;
export const SEASON_COOKIE_NAME = "aviary-season";

export type SeasonDefinition = {
  id?: string;
  aviary_id?: string;
  name: string;
  year: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at?: string | null;
};

function getCurrentSeasonYear() {
  return new Date().getFullYear();
}

export function getSeasonOptions(currentYear = getCurrentSeasonYear()) {
  const maxYear = Math.max(currentYear, MIN_SEASON_YEAR);
  const years: number[] = [];

  for (let year = maxYear; year >= MIN_SEASON_YEAR; year -= 1) {
    years.push(year);
  }

  return years;
}

export function createDefaultSeasonDefinition(year: number): SeasonDefinition {
  return {
    name: `Season ${year}`,
    year,
    start_date: `${year}-01-01`,
    end_date: `${year}-12-31`,
    is_active: false,
  };
}

export function mergeSeasonDefinitions(seasons: SeasonDefinition[], currentYear = getCurrentSeasonYear()) {
  const years = getSeasonOptions(Math.max(currentYear, seasons[0]?.year ?? MIN_SEASON_YEAR));

  return years.map((year) => {
    const existing = seasons.find((season) => season.year === year);
    return existing ?? createDefaultSeasonDefinition(year);
  });
}

export function normaliseSeasonYear(
  value: string | number | null | undefined,
  availableYears = getSeasonOptions()
) {
  const fallbackYear = availableYears[0] ?? getCurrentSeasonYear();
  const maxYear = Math.max(...availableYears, fallbackYear, MIN_SEASON_YEAR);
  const parsed = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(parsed) || parsed < MIN_SEASON_YEAR || parsed > maxYear || !availableYears.includes(parsed)) {
    return fallbackYear;
  }

  return parsed;
}

export async function getSelectedSeasonYear(availableYears = getSeasonOptions()) {
  const cookieStore = await cookies();
  return normaliseSeasonYear(cookieStore.get(SEASON_COOKIE_NAME)?.value, availableYears);
}

export function getSeasonRangeLabel(season: Pick<SeasonDefinition, "year" | "start_date" | "end_date">) {
  if (!season.start_date || !season.end_date) {
    return `January to December ${season.year}`;
  }

  const start = new Date(`${season.start_date}T00:00:00Z`);
  const end = new Date(`${season.end_date}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `January to December ${season.year}`;
  }

  return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })} to ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
}

export function getSeasonBounds(season: Pick<SeasonDefinition, "year" | "start_date" | "end_date">) {
  const defaultSeason = createDefaultSeasonDefinition(season.year);
  const startValue = season.start_date ?? defaultSeason.start_date!;
  const endValue = season.end_date ?? defaultSeason.end_date!;

  return {
    start: new Date(`${startValue}T00:00:00Z`),
    end: new Date(`${endValue}T23:59:59.999Z`),
  };
}

function parseSeasonDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function isDateInSeason(
  value: string | null | undefined,
  season: Pick<SeasonDefinition, "year" | "start_date" | "end_date">
) {
  const date = parseSeasonDate(value);
  if (!date) return false;

  const { start, end } = getSeasonBounds(season);
  return date >= start && date <= end;
}

export function matchesSeason(
  season: Pick<SeasonDefinition, "year" | "start_date" | "end_date">,
  ...values: Array<string | null | undefined>
) {
  for (const value of values) {
    if (isDateInSeason(value, season)) return true;
  }

  return false;
}
