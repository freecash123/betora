import { NextRequest, NextResponse } from "next/server";

const ODDS_API_KEY = process.env.ODDS_API_KEY || "";
const ODDS_API_BASE = "https://api.theoddsapi.com";

const SPORT_KEY_MAP: Record<string, string> = {
  football: "soccer_epl", basketball: "basketball_nba", baseball: "baseball_mlb",
  hockey: "icehockey_nhl", nfl: "americanfootball_nfl", tennis: "tennis_atp",
  cricket: "cricket_t20", mma: "mma_mixed_martial_arts", rugby: "rugbyleague_nrl",
  boxing: "boxing", esports: "esports", golf: "golf_pga", f1: "f1", volleyball: "volleyball",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport") || "basketball";
  const sportKey = SPORT_KEY_MAP[sport] || sport;
  const regions = searchParams.get("regions") || "us";
  const markets = searchParams.get("markets") || "h2h,spreads,totals";
  const oddsFormat = searchParams.get("oddsFormat") || "decimal";

  if (!ODDS_API_KEY) {
    return NextResponse.json({ error: "ODDS_API_KEY not configured" }, { status: 500 });
  }

  try {
    const url = `${ODDS_API_BASE}/odds/?sport_key=${sportKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}`;
    const res = await fetch(url, { headers: { "x-api-key": ODDS_API_KEY }, next: { revalidate: 30 } });
    if (!res.ok) { const errText = await res.text(); return NextResponse.json({ error: `API error ${res.status}`, detail: errText }, { status: res.status }); }
    const data = await res.json();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
