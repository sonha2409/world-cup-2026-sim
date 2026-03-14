"use client";

import { RouteMatch } from "@/lib/simulatorState";
import { teams } from "@/data/groups";

export default function RouteSummary({
  teamCode,
  route,
}: {
  teamCode: string;
  route: RouteMatch[];
}) {
  const team = teams.find((t) => t.code === teamCode);
  if (!team || route.length === 0) return null;

  return (
    <div className="rounded-xl bg-navy-light p-4 shadow-lg">
      <h3 className="text-sm font-bold tracking-wider text-gold uppercase mb-3">
        {team.flag} {team.name} — Projected Route
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {route.map((match) => (
          <div
            key={match.matchNumber}
            className="flex-shrink-0 rounded-lg border border-gold/30 bg-gold/5 px-3 py-2 min-w-[140px]"
          >
            <div className="text-[10px] text-gold font-bold uppercase">
              {match.round}
            </div>
            <div className="text-xs text-white font-medium mt-0.5 truncate">
              vs {match.opponentLabel}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 truncate">
              {match.venueName}
            </div>
            <div className="text-[9px] text-gray-500 truncate">
              {match.venueCity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
