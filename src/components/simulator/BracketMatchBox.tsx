"use client";

import { BracketSlot } from "@/lib/simulatorState";
import { venues } from "@/data/venues";

export default function BracketMatchBox({
  slot,
  highlighted,
  compact,
}: {
  slot: BracketSlot;
  highlighted: boolean;
  compact?: boolean;
}) {
  const venue = venues[slot.venueId];
  const venueName = venue?.name ?? slot.venueId;

  return (
    <div
      data-match={slot.matchNumber}
      className={`rounded-lg border transition-all duration-200 ${
        highlighted
          ? "border-gold bg-gold/10 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          : "border-white/10 bg-navy-light"
      } ${compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"}`}
    >
      <div className="flex flex-col gap-0.5">
        <div
          className={`font-medium truncate ${
            highlighted ? "text-gold" : "text-white"
          }`}
        >
          {slot.homeTeam?.flag && <span className="mr-1">{slot.homeTeam.flag}</span>}
          {slot.homeLabel}
        </div>
        <div className="text-gray-500 text-center text-[10px]">vs</div>
        <div
          className={`font-medium truncate ${
            highlighted ? "text-gold" : "text-white"
          }`}
        >
          {slot.awayTeam?.flag && <span className="mr-1">{slot.awayTeam.flag}</span>}
          {slot.awayLabel}
        </div>
      </div>
      <div className="mt-1 text-[10px] text-gray-400 leading-tight">{venueName}{venue?.city && `, ${venue.city}`}</div>
      <div className="text-[9px] text-gray-500">M{slot.matchNumber}</div>
    </div>
  );
}
