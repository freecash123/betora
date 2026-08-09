import { NextResponse } from "next/server";

export async function GET() {
  const sports = [
    { id: "football", name: "Football", icon: "⚽", slug: "football", leagues: "28+", matches: "5,986" },
    { id: "basketball", name: "Basketball", icon: "🏀", slug: "basketball", leagues: "7", matches: "2,848" },
    { id: "tennis", name: "Tennis", icon: "🎾", slug: "tennis", leagues: "6", matches: "16,808" },
    { id: "nfl", name: "NFL", icon: "🏈", slug: "nfl", leagues: "2", matches: "1,258" },
    { id: "cricket", name: "Cricket", icon: "🏏", slug: "cricket", leagues: "6", matches: "270" },
    { id: "baseball", name: "Baseball", icon: "⚾", slug: "baseball", leagues: "3", matches: "4,008" },
    { id: "hockey", name: "Ice Hockey", icon: "🏒", slug: "hockey", leagues: "4", matches: "2,874" },
    { id: "mma", name: "MMA", icon: "🤼", slug: "mma", leagues: "3", matches: "90" },
    { id: "boxing", name: "Boxing", icon: "🥊", slug: "boxing", leagues: "2", matches: "230" },
    { id: "rugby", name: "Rugby", icon: "🏉", slug: "rugby", leagues: "5", matches: "545" },
    { id: "esports", name: "Esports", icon: "🎮", slug: "esports", leagues: "6", matches: "850" },
    { id: "golf", name: "Golf", icon: "⛳", slug: "golf", leagues: "3", matches: "89" },
    { id: "f1", name: "F1", icon: "🏎️", slug: "f1", leagues: "1", matches: "24" },
    { id: "volleyball", name: "Volleyball", icon: "🏐", slug: "volleyball", leagues: "2", matches: "282" },
  ];
  return NextResponse.json(sports, { headers: { "Cache-Control": "public, s-maxage=3600" } });
}
