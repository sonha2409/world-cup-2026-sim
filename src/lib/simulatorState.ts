"use client";

import { useState, useMemo, useCallback } from "react";
import { Team } from "@/data/types";
import { teams, groups, getTeamsByGroup } from "@/data/groups";
import { r32Matches, bracketFeeds, getThirdPlaceAssignment } from "@/data/bracket";
import { venues } from "@/data/venues";
import { matches } from "@/data/matches";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GroupStandings = Record<string, Team[]>;

export type BracketSlot = {
  matchNumber: number;
  round: "R32" | "R16" | "QF" | "SF" | "3rd" | "Final";
  homeTeam?: Team;
  awayTeam?: Team;
  homeLabel: string;
  awayLabel: string;
  venueId: string;
};

export type BracketSides = {
  left: BracketSlot[];
  right: BracketSlot[];
  thirdPlace: BracketSlot;
  final: BracketSlot;
};

export type RouteMatch = {
  matchNumber: number;
  round: string;
  venueName: string;
  venueCity: string;
  opponentLabel: string;
};

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

export function initGroupStandings(): GroupStandings {
  const standings: GroupStandings = {};
  for (const g of groups) {
    standings[g] = getTeamsByGroup(g);
  }
  return standings;
}

function resolveTeamFromSource(
  source: string,
  standings: GroupStandings,
  thirdPlaceAssignment: Record<number, string> | null,
  matchNumber?: number,
): { team?: Team; label: string } {
  // "2A" → 2nd place in group A
  const posMatch = source.match(/^([12])([A-L])$/);
  if (posMatch) {
    const pos = parseInt(posMatch[1]) - 1;
    const group = posMatch[2];
    const groupTeams = standings[group];
    if (groupTeams && groupTeams[pos]) {
      return { team: groupTeams[pos], label: groupTeams[pos].name };
    }
    return { label: source };
  }

  // "1E" → 1st place in group E
  const firstMatch = source.match(/^1([A-L])$/);
  if (firstMatch) {
    const group = firstMatch[1];
    const groupTeams = standings[group];
    if (groupTeams && groupTeams[0]) {
      return { team: groupTeams[0], label: groupTeams[0].name };
    }
    return { label: source };
  }

  // "3rd" → 3rd-place team, resolved via assignment
  if (source === "3rd" && matchNumber && thirdPlaceAssignment) {
    const assignedGroup = thirdPlaceAssignment[matchNumber];
    if (assignedGroup) {
      const groupTeams = standings[assignedGroup];
      if (groupTeams && groupTeams[2]) {
        return { team: groupTeams[2], label: `${groupTeams[2].name} (3rd ${assignedGroup})` };
      }
    }
    // Show placeholder with possible groups
    const r32 = r32Matches.find((m) => m.matchNumber === matchNumber);
    if (r32?.possibleThirdPlaceGroups) {
      return { label: `3rd (${r32.possibleThirdPlaceGroups.join("/")})` };
    }
    return { label: "3rd place TBD" };
  }

  if (source === "3rd" && matchNumber) {
    const r32 = r32Matches.find((m) => m.matchNumber === matchNumber);
    if (r32?.possibleThirdPlaceGroups) {
      return { label: `3rd (${r32.possibleThirdPlaceGroups.join("/")})` };
    }
    return { label: "3rd place TBD" };
  }

  return { label: source };
}

export function resolveR32Bracket(
  standings: GroupStandings,
  thirdPlaceGroups: string[],
): BracketSlot[] {
  const thirdPlaceAssignment =
    thirdPlaceGroups.length === 8
      ? getThirdPlaceAssignment(thirdPlaceGroups)
      : null;

  return r32Matches.map((m) => {
    const home = resolveTeamFromSource(m.homeSource, standings, thirdPlaceAssignment, m.matchNumber);
    const away = resolveTeamFromSource(m.awaySource, standings, thirdPlaceAssignment, m.matchNumber);

    return {
      matchNumber: m.matchNumber,
      round: "R32" as const,
      homeTeam: home.team,
      awayTeam: away.team,
      homeLabel: home.label,
      awayLabel: away.label,
      venueId: m.venueId,
    };
  });
}

export function resolveFullBracket(r32Slots: BracketSlot[]): BracketSlot[] {
  const allSlots: BracketSlot[] = [...r32Slots];
  const slotMap = new Map<number, BracketSlot>();
  for (const s of r32Slots) {
    slotMap.set(s.matchNumber, s);
  }

  const roundForMatch = (mn: number): "R16" | "QF" | "SF" | "3rd" | "Final" => {
    if (mn >= 89 && mn <= 96) return "R16";
    if (mn >= 97 && mn <= 100) return "QF";
    if (mn === 101 || mn === 102) return "SF";
    if (mn === 103) return "3rd";
    return "Final";
  };

  // Process bracket feeds in order
  const feedEntries = Object.entries(bracketFeeds)
    .map(([k, v]) => ({ matchNumber: parseInt(k), ...v }))
    .sort((a, b) => a.matchNumber - b.matchNumber);

  for (const feed of feedEntries) {
    const homeSlot = slotMap.get(feed.homeFrom);
    const awaySlot = slotMap.get(feed.awayFrom);

    // Match 103 uses losers of SFs, not winners
    const prefix = feed.matchNumber === 103 ? "L" : "W";
    const homeLabel = `${prefix}${feed.homeFrom}`;
    const awayLabel = `${prefix}${feed.awayFrom}`;

    const slot: BracketSlot = {
      matchNumber: feed.matchNumber,
      round: roundForMatch(feed.matchNumber),
      homeLabel,
      awayLabel,
      venueId: feed.venueId,
    };

    allSlots.push(slot);
    slotMap.set(feed.matchNumber, slot);
  }

  return allSlots;
}

// Left side: R32 73,74,75,77 → R16 89,90 → QF 97 → SF 101
//            R32 83,84,81,82 → R16 93,94 → QF 98 → SF 101
// Right side: R32 76,78,79,80 → R16 91,92 → QF 99 → SF 102
//             R32 86,88,85,87 → R16 95,96 → QF 100 → SF 102
const LEFT_R32 = [73, 74, 75, 77, 83, 84, 81, 82];
const LEFT_R16 = [89, 90, 93, 94];
const LEFT_QF = [97, 98];
const LEFT_SF = [101];

const RIGHT_R32 = [76, 78, 79, 80, 86, 88, 85, 87];
const RIGHT_R16 = [91, 92, 95, 96];
const RIGHT_QF = [99, 100];
const RIGHT_SF = [102];

const LEFT_ALL = new Set([...LEFT_R32, ...LEFT_R16, ...LEFT_QF, ...LEFT_SF]);
const RIGHT_ALL = new Set([...RIGHT_R32, ...RIGHT_R16, ...RIGHT_QF, ...RIGHT_SF]);

export function getBracketSides(fullBracket: BracketSlot[]): BracketSides {
  const slotMap = new Map<number, BracketSlot>();
  for (const s of fullBracket) {
    slotMap.set(s.matchNumber, s);
  }

  const left = [...LEFT_R32, ...LEFT_R16, ...LEFT_QF, ...LEFT_SF]
    .map((mn) => slotMap.get(mn)!)
    .filter(Boolean);

  const right = [...RIGHT_R32, ...RIGHT_R16, ...RIGHT_QF, ...RIGHT_SF]
    .map((mn) => slotMap.get(mn)!)
    .filter(Boolean);

  const thirdPlace = slotMap.get(103)!;
  const final = slotMap.get(104)!;

  return { left, right, thirdPlace, final };
}

export function getTeamRoute(
  teamCode: string,
  standings: GroupStandings,
  thirdPlaceGroups: string[],
): RouteMatch[] {
  const team = teams.find((t) => t.code === teamCode);
  if (!team) return [];

  const group = team.group;
  const groupTeams = standings[group];
  if (!groupTeams) return [];

  const position = groupTeams.findIndex((t) => t.code === teamCode);
  if (position === -1) return [];

  const route: RouteMatch[] = [];

  // Group stage matches
  const groupMatches = matches.filter(
    (m) => m.group === group && (m.homeTeam === teamCode || m.awayTeam === teamCode),
  );
  for (const m of groupMatches) {
    const oppCode = m.homeTeam === teamCode ? m.awayTeam : m.homeTeam;
    const oppTeam = teams.find((t) => t.code === oppCode);
    const venue = venues[m.venueId];
    route.push({
      matchNumber: m.matchNumber,
      round: m.round,
      venueName: venue?.name ?? m.venueId,
      venueCity: venue?.city ?? "",
      opponentLabel: oppTeam?.name ?? oppCode,
    });
  }

  // Determine knockout entry
  if (position === 0) {
    // 1st place
    const source = `1${group}`;
    const r32 = r32Matches.find((m) => m.homeSource === source);
    if (r32) {
      traceKnockoutRoute(r32.matchNumber, route, standings, thirdPlaceGroups, teamCode);
    }
  } else if (position === 1) {
    // 2nd place
    const source = `2${group}`;
    const r32 = r32Matches.find((m) => m.homeSource === source || m.awaySource === source);
    if (r32) {
      traceKnockoutRoute(r32.matchNumber, route, standings, thirdPlaceGroups, teamCode);
    }
  } else if (position === 2) {
    // 3rd place — needs assignment
    if (thirdPlaceGroups.length === 8 && thirdPlaceGroups.includes(group)) {
      const assignment = getThirdPlaceAssignment(thirdPlaceGroups);
      if (assignment) {
        const entry = Object.entries(assignment).find(([, g]) => g === group);
        if (entry) {
          traceKnockoutRoute(parseInt(entry[0]), route, standings, thirdPlaceGroups, teamCode);
        }
      }
    }
    // If not selected or not enough groups, no knockout route
  }
  // 4th place: no knockout

  return route;
}

function traceKnockoutRoute(
  startMatch: number,
  route: RouteMatch[],
  standings: GroupStandings,
  thirdPlaceGroups: string[],
  teamCode: string,
) {
  const thirdPlaceAssignment =
    thirdPlaceGroups.length === 8
      ? getThirdPlaceAssignment(thirdPlaceGroups)
      : null;

  // R32
  const r32 = r32Matches.find((m) => m.matchNumber === startMatch);
  if (!r32) return;

  const r32Home = resolveTeamFromSource(r32.homeSource, standings, thirdPlaceAssignment, r32.matchNumber);
  const r32Away = resolveTeamFromSource(r32.awaySource, standings, thirdPlaceAssignment, r32.matchNumber);
  const r32Opp = r32Home.team?.code === teamCode ? r32Away.label : r32Home.label;
  const venue = venues[r32.venueId];

  route.push({
    matchNumber: startMatch,
    round: "R32",
    venueName: venue?.name ?? r32.venueId,
    venueCity: venue?.city ?? "",
    opponentLabel: r32Opp,
  });

  // Trace through bracket feeds
  let currentMatch = startMatch;
  const roundNames = ["R16", "QF", "SF", "Final"];

  for (const roundName of roundNames) {
    const nextEntry = Object.entries(bracketFeeds).find(
      ([key, feed]) => (feed.homeFrom === currentMatch || feed.awayFrom === currentMatch) && key !== "103",
    );
    if (!nextEntry) break;

    const [matchNumStr, feed] = nextEntry;
    const matchNum = parseInt(matchNumStr);
    const fromOther = feed.homeFrom === currentMatch ? feed.awayFrom : feed.homeFrom;
    const v = venues[feed.venueId];

    route.push({
      matchNumber: matchNum,
      round: roundName,
      venueName: v?.name ?? feed.venueId,
      venueCity: v?.city ?? "",
      opponentLabel: `W${fromOther}`,
    });

    currentMatch = matchNum;
  }
}

export function randomizeStandings(): GroupStandings {
  const standings: GroupStandings = {};
  for (const g of groups) {
    const groupTeams = [...getTeamsByGroup(g)];
    // Fisher-Yates shuffle
    for (let i = groupTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [groupTeams[i], groupTeams[j]] = [groupTeams[j], groupTeams[i]];
    }
    standings[g] = groupTeams;
  }
  return standings;
}

export function getMatchNumbers(teamCode: string, route: RouteMatch[]): Set<number> {
  return new Set(route.map((r) => r.matchNumber));
}

// Check if a match is on the left or right side of the bracket
export function getBracketSide(matchNumber: number): "left" | "right" | "final" {
  if (matchNumber === 104) return "final";
  if (LEFT_ALL.has(matchNumber)) return "left";
  if (RIGHT_ALL.has(matchNumber)) return "right";
  return "left"; // fallback
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useSimulatorState() {
  const [standings, setStandings] = useState<GroupStandings>(initGroupStandings);
  const [thirdPlaceGroups, setThirdPlaceGroups] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const r32Slots = useMemo(
    () => resolveR32Bracket(standings, thirdPlaceGroups),
    [standings, thirdPlaceGroups],
  );

  const fullBracket = useMemo(() => resolveFullBracket(r32Slots), [r32Slots]);

  const bracketSides = useMemo(() => getBracketSides(fullBracket), [fullBracket]);

  const selectedTeamRoute = useMemo(() => {
    if (!selectedTeam) return [];
    return getTeamRoute(selectedTeam, standings, thirdPlaceGroups);
  }, [selectedTeam, standings, thirdPlaceGroups]);

  const highlightedMatches = useMemo(
    () => getMatchNumbers(selectedTeam ?? "", selectedTeamRoute),
    [selectedTeam, selectedTeamRoute],
  );

  const reorderGroup = useCallback((group: string, newOrder: Team[]) => {
    setStandings((prev) => ({ ...prev, [group]: newOrder }));
  }, []);

  const toggleThirdPlaceGroup = useCallback((group: string) => {
    setThirdPlaceGroups((prev) => {
      if (prev.includes(group)) {
        return prev.filter((g) => g !== group);
      }
      if (prev.length >= 8) return prev;
      return [...prev, group];
    });
  }, []);

  const reset = useCallback(() => {
    setStandings(initGroupStandings());
    setThirdPlaceGroups([]);
    setSelectedTeam(null);
  }, []);

  const randomize = useCallback(() => {
    setStandings(randomizeStandings());
    // Auto-select 8 random groups for 3rd place
    const shuffledGroups = [...groups].sort(() => Math.random() - 0.5);
    setThirdPlaceGroups(shuffledGroups.slice(0, 8));
    setSelectedTeam(null);
  }, []);

  const randomizeThirdPlace = useCallback(() => {
    const shuffledGroups = [...groups].sort(() => Math.random() - 0.5);
    setThirdPlaceGroups(shuffledGroups.slice(0, 8));
  }, []);

  return {
    standings,
    thirdPlaceGroups,
    selectedTeam,
    r32Slots,
    fullBracket,
    bracketSides,
    selectedTeamRoute,
    highlightedMatches,
    reorderGroup,
    toggleThirdPlaceGroup,
    setSelectedTeam,
    reset,
    randomize,
    randomizeThirdPlace,
  };
}
