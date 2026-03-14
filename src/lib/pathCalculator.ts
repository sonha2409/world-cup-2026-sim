import { venues } from "@/data/venues";
import { teams } from "@/data/groups";
import { matches } from "@/data/matches";
import { r32Matches, bracketFeeds, getThirdPlaceAssignment } from "@/data/bracket";
import { TeamPath, Venue } from "@/data/types";

function getVenue(venueId: string): Venue {
  return venues[venueId];
}

function getGroupMatches(teamCode: string) {
  const team = teams.find((t) => t.code === teamCode);
  if (!team) return [];
  return matches.filter(
    (m) =>
      m.group === team.group &&
      (m.homeTeam === teamCode || m.awayTeam === teamCode)
  );
}

function getOpponent(match: { homeTeam: string; awayTeam: string }, teamCode: string): string {
  const oppCode = match.homeTeam === teamCode ? match.awayTeam : match.homeTeam;
  const oppTeam = teams.find((t) => t.code === oppCode);
  return oppTeam ? oppTeam.name : oppCode;
}

/**
 * For a 1st or 2nd place finish, trace the deterministic knockout path.
 */
function traceKnockoutPath(
  teamCode: string,
  group: string,
  position: "1st" | "2nd"
): TeamPath["rounds"] {
  const source = position === "1st" ? `1${group}` : `2${group}`;

  // Find the R32 match this team enters
  const r32Match = r32Matches.find(
    (m) => m.homeSource === source || m.awaySource === source
  );
  if (!r32Match) return [];

  const rounds: TeamPath["rounds"] = [];

  // Determine opponent description for R32
  const isHome = r32Match.homeSource === source;
  const oppSource = isHome ? r32Match.awaySource : r32Match.homeSource;
  rounds.push({
    round: "R32",
    matchNumber: r32Match.matchNumber,
    venue: getVenue(r32Match.venueId),
    opponent: oppSource,
  });

  // Trace through bracket feeds: R16, QF, SF, Final
  const roundNames: Array<"R16" | "QF" | "SF" | "Final"> = ["R16", "QF", "SF", "Final"];
  let currentMatchNumber = r32Match.matchNumber;

  for (const roundName of roundNames) {
    // Find the next match that feeds from currentMatchNumber
    const nextMatch = Object.entries(bracketFeeds).find(
      ([, feed]) =>
        feed.homeFrom === currentMatchNumber || feed.awayFrom === currentMatchNumber
    );
    if (!nextMatch) break;

    const [matchNumStr, feed] = nextMatch;
    const matchNum = parseInt(matchNumStr);
    const fromOther =
      feed.homeFrom === currentMatchNumber ? feed.awayFrom : feed.homeFrom;

    rounds.push({
      round: roundName,
      matchNumber: matchNum,
      venue: getVenue(feed.venueId),
      opponent: `W${fromOther}`,
    });

    currentMatchNumber = matchNum;
  }

  return rounds;
}

/**
 * For 3rd-place finish, compute all possible knockout paths.
 * Each combination of 8 qualifying groups may assign this team's group
 * to a different R32 match slot, producing different venue sequences.
 */
function traceThirdPlacePaths(
  teamCode: string,
  group: string
): TeamPath[] {
  const allGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

  // Generate all combinations of 8 groups from 12 that include this team's group
  const otherGroups = allGroups.filter((g) => g !== group);
  const combos = combinations(otherGroups, 7).map((combo) =>
    [...combo, group].sort()
  );

  // Track unique paths by venue sequence to deduplicate
  const seenVenueSequences = new Map<string, TeamPath>();

  for (const qualifyingGroups of combos) {
    const assignment = getThirdPlaceAssignment(qualifyingGroups);
    if (!assignment) continue;

    // Find which R32 match this group's 3rd-place team is assigned to
    const assignedMatch = Object.entries(assignment).find(
      ([, assignedGroup]) => assignedGroup === group
    );
    if (!assignedMatch) continue;

    const r32MatchNum = parseInt(assignedMatch[0]);
    const r32Match = r32Matches.find((m) => m.matchNumber === r32MatchNum);
    if (!r32Match) continue;

    // Build the knockout path
    const rounds: TeamPath["rounds"] = [];
    rounds.push({
      round: "R32",
      matchNumber: r32MatchNum,
      venue: getVenue(r32Match.venueId),
      opponent: r32Match.homeSource,
    });

    // Trace through bracket
    const roundNames: Array<"R16" | "QF" | "SF" | "Final"> = ["R16", "QF", "SF", "Final"];
    let currentMatchNumber = r32MatchNum;

    for (const roundName of roundNames) {
      const nextMatch = Object.entries(bracketFeeds).find(
        ([, feed]) =>
          feed.homeFrom === currentMatchNumber || feed.awayFrom === currentMatchNumber
      );
      if (!nextMatch) break;

      const [matchNumStr, feed] = nextMatch;
      const matchNum = parseInt(matchNumStr);
      const fromOther =
        feed.homeFrom === currentMatchNumber ? feed.awayFrom : feed.homeFrom;

      rounds.push({
        round: roundName,
        matchNumber: matchNum,
        venue: getVenue(feed.venueId),
        opponent: `W${fromOther}`,
      });

      currentMatchNumber = matchNum;
    }

    // Deduplicate by venue sequence
    const venueKey = rounds.map((r) => r.venue.id).join(",");
    if (!seenVenueSequences.has(venueKey)) {
      seenVenueSequences.set(venueKey, {
        finishPosition: "3rd",
        scenario: `Scenario ${seenVenueSequences.size + 1}`,
        rounds,
      });
    }
  }

  return Array.from(seenVenueSequences.values()).map((path, i) => ({
    ...path,
    scenario: `Scenario ${i + 1}`,
  }));
}

/**
 * Generate all combinations of k elements from arr.
 */
function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map((combo) => [first, ...combo]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

/**
 * Main entry point: get all possible paths for a team.
 */
export function getTeamPaths(teamCode: string): {
  team: (typeof teams)[number] | undefined;
  groupMatches: ReturnType<typeof getGroupMatches>;
  paths: {
    first: TeamPath;
    second: TeamPath;
    third: TeamPath[];
  };
} {
  const team = teams.find((t) => t.code === teamCode);
  if (!team) {
    return {
      team: undefined,
      groupMatches: [],
      paths: {
        first: { finishPosition: "1st", rounds: [] },
        second: { finishPosition: "2nd", rounds: [] },
        third: [],
      },
    };
  }

  const groupMatches = getGroupMatches(teamCode);

  const firstPlaceRounds = traceKnockoutPath(teamCode, team.group, "1st");
  const secondPlaceRounds = traceKnockoutPath(teamCode, team.group, "2nd");
  const thirdPlacePaths = traceThirdPlacePaths(teamCode, team.group);

  // Prepend group stage matches to each knockout path
  const groupRounds: TeamPath["rounds"] = groupMatches.map((m) => ({
    round: m.round as TeamPath["rounds"][number]["round"],
    matchNumber: m.matchNumber,
    venue: getVenue(m.venueId),
    opponent: getOpponent(m, teamCode),
  }));

  return {
    team,
    groupMatches,
    paths: {
      first: {
        finishPosition: "1st",
        rounds: [...groupRounds, ...firstPlaceRounds],
      },
      second: {
        finishPosition: "2nd",
        rounds: [...groupRounds, ...secondPlaceRounds],
      },
      third: thirdPlacePaths.map((p) => ({
        ...p,
        rounds: [...groupRounds, ...p.rounds],
      })),
    },
  };
}
