import { NextResponse } from "next/server";

export async function GET() {
  const now = Date.now();
  const data = [
    { sport: "FOOTBALL", league: "Premier League", matchId: "epl1", homeTeam: "City United", awayTeam: "River Rovers", startTime: new Date(now - 600000), status: "Live", homeScore: 1, awayScore: 0, continent: "Europe", country: "UK" },
    { sport: "FOOTBALL", league: "MLS", matchId: "mls1", homeTeam: "LA Stars", awayTeam: "NYC Blue", startTime: new Date(now - 1200000), status: "Live", homeScore: 2, awayScore: 2, continent: "America", country: "USA" },
    { sport: "FOOTBALL", league: "CAF CL", matchId: "caf1", homeTeam: "Accra Hearts", awayTeam: "Tunis Eagles", startTime: new Date(now - 300000), status: "Live", homeScore: 0, awayScore: 0, continent: "Africa", country: "Ghana" },
    { sport: "BASKETBALL", league: "NBL", matchId: "aus1", homeTeam: "Sydney", awayTeam: "Perth", startTime: new Date(now - 900000), status: "Live", homeScore: 55, awayScore: 61, continent: "Australia", country: "Australia" },
    { sport: "TENNIS", league: "ATP 250", matchId: "asia1", homeTeam: "Player A", awayTeam: "Player B", startTime: new Date(now - 1800000), status: "Live", homeScore: 1, awayScore: 1, continent: "Asia", country: "UAE" },
  ];
  return NextResponse.json(data);
}