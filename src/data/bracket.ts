export type R32Match = {
  matchNumber: number;
  homeSource: string;
  awaySource: string;
  venueId: string;
  possibleThirdPlaceGroups?: string[];
};

// --------------------------------------------------------------------------
// R32 bracket structure
// --------------------------------------------------------------------------

export const r32Matches: R32Match[] = [
  { matchNumber: 73, homeSource: "2A", awaySource: "2B", venueId: "sofi" },
  {
    matchNumber: 74,
    homeSource: "1E",
    awaySource: "3rd",
    venueId: "gillette",
    possibleThirdPlaceGroups: ["A", "B", "C", "D", "F"],
  },
  { matchNumber: 75, homeSource: "1F", awaySource: "2C", venueId: "bbva" },
  { matchNumber: 76, homeSource: "1C", awaySource: "2F", venueId: "nrg" },
  {
    matchNumber: 77,
    homeSource: "1I",
    awaySource: "3rd",
    venueId: "metlife",
    possibleThirdPlaceGroups: ["C", "D", "F", "G", "H"],
  },
  { matchNumber: 78, homeSource: "2E", awaySource: "2I", venueId: "att" },
  {
    matchNumber: 79,
    homeSource: "1A",
    awaySource: "3rd",
    venueId: "azteca",
    possibleThirdPlaceGroups: ["C", "E", "F", "H", "I"],
  },
  {
    matchNumber: 80,
    homeSource: "1L",
    awaySource: "3rd",
    venueId: "mercedes",
    possibleThirdPlaceGroups: ["E", "H", "I", "J", "K"],
  },
  {
    matchNumber: 81,
    homeSource: "1D",
    awaySource: "3rd",
    venueId: "levis",
    possibleThirdPlaceGroups: ["B", "E", "F", "I", "J"],
  },
  {
    matchNumber: 82,
    homeSource: "1G",
    awaySource: "3rd",
    venueId: "lumen",
    possibleThirdPlaceGroups: ["A", "E", "H", "I", "J"],
  },
  { matchNumber: 83, homeSource: "2K", awaySource: "2L", venueId: "bmo" },
  { matchNumber: 84, homeSource: "1H", awaySource: "2J", venueId: "sofi" },
  {
    matchNumber: 85,
    homeSource: "1B",
    awaySource: "3rd",
    venueId: "bc_place",
    possibleThirdPlaceGroups: ["E", "F", "G", "I", "J"],
  },
  { matchNumber: 86, homeSource: "1J", awaySource: "2H", venueId: "hard_rock" },
  {
    matchNumber: 87,
    homeSource: "1K",
    awaySource: "3rd",
    venueId: "arrowhead",
    possibleThirdPlaceGroups: ["D", "E", "I", "J", "L"],
  },
  { matchNumber: 88, homeSource: "2D", awaySource: "2G", venueId: "att" },
];

// --------------------------------------------------------------------------
// Knockout bracket feeds — how winners advance through R16, QF, SF, Final
// --------------------------------------------------------------------------

export const bracketFeeds: Record<
  number,
  { homeFrom: number; awayFrom: number; venueId: string }
> = {
  // R16
  89: { homeFrom: 74, awayFrom: 77, venueId: "lincoln" },
  90: { homeFrom: 73, awayFrom: 75, venueId: "nrg" },
  91: { homeFrom: 76, awayFrom: 78, venueId: "metlife" },
  92: { homeFrom: 79, awayFrom: 80, venueId: "azteca" },
  93: { homeFrom: 83, awayFrom: 84, venueId: "att" },
  94: { homeFrom: 81, awayFrom: 82, venueId: "lumen" },
  95: { homeFrom: 86, awayFrom: 88, venueId: "mercedes" },
  96: { homeFrom: 85, awayFrom: 87, venueId: "bc_place" },
  // QF
  97: { homeFrom: 89, awayFrom: 90, venueId: "gillette" },
  98: { homeFrom: 93, awayFrom: 94, venueId: "sofi" },
  99: { homeFrom: 91, awayFrom: 92, venueId: "hard_rock" },
  100: { homeFrom: 95, awayFrom: 96, venueId: "arrowhead" },
  // SF
  101: { homeFrom: 97, awayFrom: 98, venueId: "att" },
  102: { homeFrom: 99, awayFrom: 100, venueId: "mercedes" },
  // 3rd-place match
  103: { homeFrom: 101, awayFrom: 102, venueId: "hard_rock" },
  // Final
  104: { homeFrom: 101, awayFrom: 102, venueId: "metlife" },
};

// --------------------------------------------------------------------------
// Third-place assignment logic
// --------------------------------------------------------------------------

// The 8 R32 match slots that involve a 3rd-place team.
const thirdPlaceSlots = [74, 77, 79, 80, 81, 82, 85, 87] as const;

// For each slot, the group whose winner the 3rd-place team would face.
// A 3rd-place team from that group CANNOT be assigned to that slot.
const slotFacesGroupWinner: Record<number, string> = {
  74: "E",
  77: "I",
  79: "A",
  80: "L",
  81: "D",
  82: "G",
  85: "B",
  87: "K",
};

// Allowed source groups per slot (from the R32 match definitions).
const slotAllowedGroups: Record<number, string[]> = {
  74: ["A", "B", "C", "D", "F"],
  77: ["C", "D", "F", "G", "H"],
  79: ["C", "E", "F", "H", "I"],
  80: ["E", "H", "I", "J", "K"],
  81: ["B", "E", "F", "I", "J"],
  82: ["A", "E", "H", "I", "J"],
  85: ["E", "F", "G", "I", "J"],
  87: ["D", "E", "I", "J", "L"],
};

/**
 * Given the 8 groups whose 3rd-place teams qualify for the R32,
 * compute the valid assignment of groups to R32 match slots using
 * backtracking with constraint satisfaction.
 *
 * Constraints per slot:
 *   1. The group must be in the slot's `possibleThirdPlaceGroups`.
 *   2. The group must NOT equal the group whose 1st-place winner
 *      the 3rd-place team would face in that slot.
 *
 * Returns a mapping { matchNumber -> group } or null if no valid
 * assignment exists (should not happen for valid FIFA combinations).
 */
export function getThirdPlaceAssignment(
  qualifyingGroups: string[],
): Record<number, string> | null {
  if (qualifyingGroups.length !== 8) {
    return null;
  }

  const sorted = [...qualifyingGroups].sort();
  const assigned = new Set<string>();
  const result: Record<number, string> = {};

  function backtrack(slotIndex: number): boolean {
    if (slotIndex === thirdPlaceSlots.length) {
      return true;
    }

    const slot = thirdPlaceSlots[slotIndex];
    const allowed = slotAllowedGroups[slot];
    const facesWinnerOf = slotFacesGroupWinner[slot];

    for (const group of sorted) {
      if (assigned.has(group)) continue;
      if (!allowed.includes(group)) continue;
      if (group === facesWinnerOf) continue;

      assigned.add(group);
      result[slot] = group;

      if (backtrack(slotIndex + 1)) {
        return true;
      }

      assigned.delete(group);
      delete result[slot];
    }

    return false;
  }

  if (backtrack(0)) {
    return result;
  }

  return null;
}
