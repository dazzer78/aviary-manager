import { NextResponse } from "next/server";
import { SEASON_COOKIE_NAME, normaliseSeasonYear } from "@/lib/season";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { season?: string | number } | null;
  const season = normaliseSeasonYear(payload?.season);

  const response = NextResponse.json({ season });
  response.cookies.set(SEASON_COOKIE_NAME, String(season), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 5,
  });

  return response;
}
