import { Match } from "./types";

export const matches: Match[] = [
  // ============================================================
  // GROUP STAGE (Matches 1-72)
  // 12 groups x 6 matches = 72 matches
  // MD1: T1 vs T2, T3 vs T4
  // MD2: T1 vs T3, T2 vs T4
  // MD3: T1 vs T4, T2 vs T3
  // ============================================================

  // --- Group A: MEX, RSA, KOR, UPD ---
  // Mexico plays at home venues (azteca, bbva, akron)
  { matchNumber: 1, group: "A", round: "Group MD1", homeTeam: "MEX", awayTeam: "RSA", venueId: "azteca", date: "2026-06-11" },
  { matchNumber: 2, group: "A", round: "Group MD1", homeTeam: "KOR", awayTeam: "UPD", venueId: "bbva", date: "2026-06-11" },
  { matchNumber: 3, group: "A", round: "Group MD2", homeTeam: "MEX", awayTeam: "KOR", venueId: "akron", date: "2026-06-15" },
  { matchNumber: 4, group: "A", round: "Group MD2", homeTeam: "RSA", awayTeam: "UPD", venueId: "azteca", date: "2026-06-15" },
  { matchNumber: 5, group: "A", round: "Group MD3", homeTeam: "MEX", awayTeam: "UPD", venueId: "bbva", date: "2026-06-19" },
  { matchNumber: 6, group: "A", round: "Group MD3", homeTeam: "RSA", awayTeam: "KOR", venueId: "akron", date: "2026-06-19" },

  // --- Group B: CAN, UPA, QAT, SUI ---
  // Canada plays at home venues (bc_place, bmo)
  { matchNumber: 7, group: "B", round: "Group MD1", homeTeam: "CAN", awayTeam: "UPA", venueId: "bc_place", date: "2026-06-11" },
  { matchNumber: 8, group: "B", round: "Group MD1", homeTeam: "QAT", awayTeam: "SUI", venueId: "bmo", date: "2026-06-11" },
  { matchNumber: 9, group: "B", round: "Group MD2", homeTeam: "CAN", awayTeam: "QAT", venueId: "bmo", date: "2026-06-15" },
  { matchNumber: 10, group: "B", round: "Group MD2", homeTeam: "UPA", awayTeam: "SUI", venueId: "bc_place", date: "2026-06-15" },
  { matchNumber: 11, group: "B", round: "Group MD3", homeTeam: "CAN", awayTeam: "SUI", venueId: "bc_place", date: "2026-06-19" },
  { matchNumber: 12, group: "B", round: "Group MD3", homeTeam: "UPA", awayTeam: "QAT", venueId: "bmo", date: "2026-06-19" },

  // --- Group C: BRA, MAR, HAI, SCO ---
  { matchNumber: 13, group: "C", round: "Group MD1", homeTeam: "BRA", awayTeam: "MAR", venueId: "hard_rock", date: "2026-06-12" },
  { matchNumber: 14, group: "C", round: "Group MD1", homeTeam: "HAI", awayTeam: "SCO", venueId: "nrg", date: "2026-06-12" },
  { matchNumber: 15, group: "C", round: "Group MD2", homeTeam: "BRA", awayTeam: "HAI", venueId: "nrg", date: "2026-06-16" },
  { matchNumber: 16, group: "C", round: "Group MD2", homeTeam: "MAR", awayTeam: "SCO", venueId: "hard_rock", date: "2026-06-16" },
  { matchNumber: 17, group: "C", round: "Group MD3", homeTeam: "BRA", awayTeam: "SCO", venueId: "hard_rock", date: "2026-06-20" },
  { matchNumber: 18, group: "C", round: "Group MD3", homeTeam: "MAR", awayTeam: "HAI", venueId: "nrg", date: "2026-06-20" },

  // --- Group D: USA, PAR, AUS, UPC ---
  // USA plays at home venues (metlife, att, sofi)
  { matchNumber: 19, group: "D", round: "Group MD1", homeTeam: "USA", awayTeam: "PAR", venueId: "metlife", date: "2026-06-12" },
  { matchNumber: 20, group: "D", round: "Group MD1", homeTeam: "AUS", awayTeam: "UPC", venueId: "att", date: "2026-06-12" },
  { matchNumber: 21, group: "D", round: "Group MD2", homeTeam: "USA", awayTeam: "AUS", venueId: "sofi", date: "2026-06-16" },
  { matchNumber: 22, group: "D", round: "Group MD2", homeTeam: "PAR", awayTeam: "UPC", venueId: "metlife", date: "2026-06-16" },
  { matchNumber: 23, group: "D", round: "Group MD3", homeTeam: "USA", awayTeam: "UPC", venueId: "att", date: "2026-06-20" },
  { matchNumber: 24, group: "D", round: "Group MD3", homeTeam: "PAR", awayTeam: "AUS", venueId: "sofi", date: "2026-06-20" },

  // --- Group E: GER, CUW, CIV, ECU ---
  { matchNumber: 25, group: "E", round: "Group MD1", homeTeam: "GER", awayTeam: "CUW", venueId: "gillette", date: "2026-06-13" },
  { matchNumber: 26, group: "E", round: "Group MD1", homeTeam: "CIV", awayTeam: "ECU", venueId: "lincoln", date: "2026-06-13" },
  { matchNumber: 27, group: "E", round: "Group MD2", homeTeam: "GER", awayTeam: "CIV", venueId: "lincoln", date: "2026-06-17" },
  { matchNumber: 28, group: "E", round: "Group MD2", homeTeam: "CUW", awayTeam: "ECU", venueId: "gillette", date: "2026-06-17" },
  { matchNumber: 29, group: "E", round: "Group MD3", homeTeam: "GER", awayTeam: "ECU", venueId: "gillette", date: "2026-06-21" },
  { matchNumber: 30, group: "E", round: "Group MD3", homeTeam: "CUW", awayTeam: "CIV", venueId: "lincoln", date: "2026-06-21" },

  // --- Group F: NED, JPN, UPB, TUN ---
  { matchNumber: 31, group: "F", round: "Group MD1", homeTeam: "NED", awayTeam: "JPN", venueId: "mercedes", date: "2026-06-13" },
  { matchNumber: 32, group: "F", round: "Group MD1", homeTeam: "UPB", awayTeam: "TUN", venueId: "lumen", date: "2026-06-13" },
  { matchNumber: 33, group: "F", round: "Group MD2", homeTeam: "NED", awayTeam: "UPB", venueId: "lumen", date: "2026-06-17" },
  { matchNumber: 34, group: "F", round: "Group MD2", homeTeam: "JPN", awayTeam: "TUN", venueId: "mercedes", date: "2026-06-17" },
  { matchNumber: 35, group: "F", round: "Group MD3", homeTeam: "NED", awayTeam: "TUN", venueId: "mercedes", date: "2026-06-21" },
  { matchNumber: 36, group: "F", round: "Group MD3", homeTeam: "JPN", awayTeam: "UPB", venueId: "lumen", date: "2026-06-21" },

  // --- Group G: BEL, EGY, IRN, NZL ---
  { matchNumber: 37, group: "G", round: "Group MD1", homeTeam: "BEL", awayTeam: "EGY", venueId: "levis", date: "2026-06-14" },
  { matchNumber: 38, group: "G", round: "Group MD1", homeTeam: "IRN", awayTeam: "NZL", venueId: "arrowhead", date: "2026-06-14" },
  { matchNumber: 39, group: "G", round: "Group MD2", homeTeam: "BEL", awayTeam: "IRN", venueId: "arrowhead", date: "2026-06-18" },
  { matchNumber: 40, group: "G", round: "Group MD2", homeTeam: "EGY", awayTeam: "NZL", venueId: "levis", date: "2026-06-18" },
  { matchNumber: 41, group: "G", round: "Group MD3", homeTeam: "BEL", awayTeam: "NZL", venueId: "levis", date: "2026-06-22" },
  { matchNumber: 42, group: "G", round: "Group MD3", homeTeam: "EGY", awayTeam: "IRN", venueId: "arrowhead", date: "2026-06-22" },

  // --- Group H: ESP, CPV, KSA, URU ---
  { matchNumber: 43, group: "H", round: "Group MD1", homeTeam: "ESP", awayTeam: "CPV", venueId: "sofi", date: "2026-06-14" },
  { matchNumber: 44, group: "H", round: "Group MD1", homeTeam: "KSA", awayTeam: "URU", venueId: "hard_rock", date: "2026-06-14" },
  { matchNumber: 45, group: "H", round: "Group MD2", homeTeam: "ESP", awayTeam: "KSA", venueId: "hard_rock", date: "2026-06-18" },
  { matchNumber: 46, group: "H", round: "Group MD2", homeTeam: "CPV", awayTeam: "URU", venueId: "sofi", date: "2026-06-18" },
  { matchNumber: 47, group: "H", round: "Group MD3", homeTeam: "ESP", awayTeam: "URU", venueId: "sofi", date: "2026-06-22" },
  { matchNumber: 48, group: "H", round: "Group MD3", homeTeam: "CPV", awayTeam: "KSA", venueId: "hard_rock", date: "2026-06-22" },

  // --- Group I: FRA, SEN, IP2, NOR ---
  { matchNumber: 49, group: "I", round: "Group MD1", homeTeam: "FRA", awayTeam: "SEN", venueId: "metlife", date: "2026-06-15" },
  { matchNumber: 50, group: "I", round: "Group MD1", homeTeam: "IP2", awayTeam: "NOR", venueId: "att", date: "2026-06-15" },
  { matchNumber: 51, group: "I", round: "Group MD2", homeTeam: "FRA", awayTeam: "IP2", venueId: "att", date: "2026-06-19" },
  { matchNumber: 52, group: "I", round: "Group MD2", homeTeam: "SEN", awayTeam: "NOR", venueId: "metlife", date: "2026-06-19" },
  { matchNumber: 53, group: "I", round: "Group MD3", homeTeam: "FRA", awayTeam: "NOR", venueId: "metlife", date: "2026-06-23" },
  { matchNumber: 54, group: "I", round: "Group MD3", homeTeam: "SEN", awayTeam: "IP2", venueId: "att", date: "2026-06-23" },

  // --- Group J: ARG, ALG, AUT, JOR ---
  { matchNumber: 55, group: "J", round: "Group MD1", homeTeam: "ARG", awayTeam: "ALG", venueId: "nrg", date: "2026-06-16" },
  { matchNumber: 56, group: "J", round: "Group MD1", homeTeam: "AUT", awayTeam: "JOR", venueId: "lincoln", date: "2026-06-16" },
  { matchNumber: 57, group: "J", round: "Group MD2", homeTeam: "ARG", awayTeam: "AUT", venueId: "lincoln", date: "2026-06-20" },
  { matchNumber: 58, group: "J", round: "Group MD2", homeTeam: "ALG", awayTeam: "JOR", venueId: "nrg", date: "2026-06-20" },
  { matchNumber: 59, group: "J", round: "Group MD3", homeTeam: "ARG", awayTeam: "JOR", venueId: "nrg", date: "2026-06-24" },
  { matchNumber: 60, group: "J", round: "Group MD3", homeTeam: "ALG", awayTeam: "AUT", venueId: "lincoln", date: "2026-06-24" },

  // --- Group K: POR, IP1, UZB, COL ---
  { matchNumber: 61, group: "K", round: "Group MD1", homeTeam: "POR", awayTeam: "IP1", venueId: "gillette", date: "2026-06-17" },
  { matchNumber: 62, group: "K", round: "Group MD1", homeTeam: "UZB", awayTeam: "COL", venueId: "mercedes", date: "2026-06-17" },
  { matchNumber: 63, group: "K", round: "Group MD2", homeTeam: "POR", awayTeam: "UZB", venueId: "mercedes", date: "2026-06-21" },
  { matchNumber: 64, group: "K", round: "Group MD2", homeTeam: "IP1", awayTeam: "COL", venueId: "gillette", date: "2026-06-21" },
  { matchNumber: 65, group: "K", round: "Group MD3", homeTeam: "POR", awayTeam: "COL", venueId: "gillette", date: "2026-06-25" },
  { matchNumber: 66, group: "K", round: "Group MD3", homeTeam: "IP1", awayTeam: "UZB", venueId: "mercedes", date: "2026-06-25" },

  // --- Group L: ENG, CRO, GHA, PAN ---
  { matchNumber: 67, group: "L", round: "Group MD1", homeTeam: "ENG", awayTeam: "CRO", venueId: "lumen", date: "2026-06-18" },
  { matchNumber: 68, group: "L", round: "Group MD1", homeTeam: "GHA", awayTeam: "PAN", venueId: "levis", date: "2026-06-18" },
  { matchNumber: 69, group: "L", round: "Group MD2", homeTeam: "ENG", awayTeam: "GHA", venueId: "levis", date: "2026-06-22" },
  { matchNumber: 70, group: "L", round: "Group MD2", homeTeam: "CRO", awayTeam: "PAN", venueId: "lumen", date: "2026-06-22" },
  { matchNumber: 71, group: "L", round: "Group MD3", homeTeam: "ENG", awayTeam: "PAN", venueId: "lumen", date: "2026-06-26" },
  { matchNumber: 72, group: "L", round: "Group MD3", homeTeam: "CRO", awayTeam: "GHA", venueId: "levis", date: "2026-06-26" },

  // ============================================================
  // KNOCKOUT STAGE (Matches 73-104)
  // ============================================================

  // --- Round of 32 (Matches 73-88) ---
  { matchNumber: 73, round: "R32", homeTeam: "2A", awayTeam: "2B", venueId: "sofi", date: "2026-06-29" },
  { matchNumber: 74, round: "R32", homeTeam: "1E", awayTeam: "3rd(A/B/C/D/F)", venueId: "gillette", date: "2026-06-29" },
  { matchNumber: 75, round: "R32", homeTeam: "1F", awayTeam: "2C", venueId: "bbva", date: "2026-06-29" },
  { matchNumber: 76, round: "R32", homeTeam: "1C", awayTeam: "2F", venueId: "nrg", date: "2026-06-29" },
  { matchNumber: 77, round: "R32", homeTeam: "1I", awayTeam: "3rd(C/D/F/G/H)", venueId: "metlife", date: "2026-06-30" },
  { matchNumber: 78, round: "R32", homeTeam: "2E", awayTeam: "2I", venueId: "att", date: "2026-06-30" },
  { matchNumber: 79, round: "R32", homeTeam: "1A", awayTeam: "3rd(C/E/F/H/I)", venueId: "azteca", date: "2026-06-30" },
  { matchNumber: 80, round: "R32", homeTeam: "1L", awayTeam: "3rd(E/H/I/J/K)", venueId: "mercedes", date: "2026-06-30" },
  { matchNumber: 81, round: "R32", homeTeam: "1D", awayTeam: "3rd(B/E/F/I/J)", venueId: "levis", date: "2026-07-01" },
  { matchNumber: 82, round: "R32", homeTeam: "1G", awayTeam: "3rd(A/E/H/I/J)", venueId: "lumen", date: "2026-07-01" },
  { matchNumber: 83, round: "R32", homeTeam: "2K", awayTeam: "2L", venueId: "bmo", date: "2026-07-01" },
  { matchNumber: 84, round: "R32", homeTeam: "1H", awayTeam: "2J", venueId: "sofi", date: "2026-07-01" },
  { matchNumber: 85, round: "R32", homeTeam: "1B", awayTeam: "3rd(E/F/G/I/J)", venueId: "bc_place", date: "2026-07-02" },
  { matchNumber: 86, round: "R32", homeTeam: "1J", awayTeam: "2H", venueId: "hard_rock", date: "2026-07-02" },
  { matchNumber: 87, round: "R32", homeTeam: "1K", awayTeam: "3rd(D/E/I/J/L)", venueId: "arrowhead", date: "2026-07-02" },
  { matchNumber: 88, round: "R32", homeTeam: "2D", awayTeam: "2G", venueId: "att", date: "2026-07-02" },

  // --- Round of 16 (Matches 89-96) ---
  { matchNumber: 89, round: "R16", homeTeam: "W74", awayTeam: "W77", venueId: "lincoln", date: "2026-07-04" },
  { matchNumber: 90, round: "R16", homeTeam: "W73", awayTeam: "W75", venueId: "nrg", date: "2026-07-04" },
  { matchNumber: 91, round: "R16", homeTeam: "W76", awayTeam: "W78", venueId: "metlife", date: "2026-07-05" },
  { matchNumber: 92, round: "R16", homeTeam: "W79", awayTeam: "W80", venueId: "azteca", date: "2026-07-05" },
  { matchNumber: 93, round: "R16", homeTeam: "W83", awayTeam: "W84", venueId: "att", date: "2026-07-05" },
  { matchNumber: 94, round: "R16", homeTeam: "W81", awayTeam: "W82", venueId: "lumen", date: "2026-07-06" },
  { matchNumber: 95, round: "R16", homeTeam: "W86", awayTeam: "W88", venueId: "mercedes", date: "2026-07-06" },
  { matchNumber: 96, round: "R16", homeTeam: "W85", awayTeam: "W87", venueId: "bc_place", date: "2026-07-06" },

  // --- Quarterfinals (Matches 97-100) ---
  { matchNumber: 97, round: "QF", homeTeam: "W89", awayTeam: "W90", venueId: "gillette", date: "2026-07-09" },
  { matchNumber: 98, round: "QF", homeTeam: "W93", awayTeam: "W94", venueId: "sofi", date: "2026-07-09" },
  { matchNumber: 99, round: "QF", homeTeam: "W91", awayTeam: "W92", venueId: "hard_rock", date: "2026-07-10" },
  { matchNumber: 100, round: "QF", homeTeam: "W95", awayTeam: "W96", venueId: "arrowhead", date: "2026-07-10" },

  // --- Semifinals (Matches 101-102) ---
  { matchNumber: 101, round: "SF", homeTeam: "W97", awayTeam: "W98", venueId: "att", date: "2026-07-13" },
  { matchNumber: 102, round: "SF", homeTeam: "W99", awayTeam: "W100", venueId: "mercedes", date: "2026-07-14" },

  // --- 3rd Place (Match 103) ---
  { matchNumber: 103, round: "3rd Place", homeTeam: "L101", awayTeam: "L102", venueId: "hard_rock", date: "2026-07-17" },

  // --- Final (Match 104) ---
  { matchNumber: 104, round: "Final", homeTeam: "W101", awayTeam: "W102", venueId: "metlife", date: "2026-07-19" },
];
