# World Cup 2026 Path Tracker

> A Next.js web app that lets fans pick any team and see every possible venue-by-venue journey to the final.

## Decisions

- All possible paths shown for 3rd-place teams (table with scenario columns)
- Hardcoded JSON data (no external API)
- Next.js (App Router) + TypeScript + Tailwind CSS
- CDN-level rate limiting only (Vercel built-in)
- Venue names + cities only (no map/distances)

---

## Session Log

> Update this section at the **start** and **end** of each session.

| # | Date | What was done | Stopped at |
|---|------|---------------|------------|
| 1 | 2026-03-14 | Planning & spec | Ready to start Step 1 |
| 2 | 2026-03-14 | Steps 1–5: setup, data layer, path calculator, UI components, pages | Ready for Step 6 (Polish) |

---

## Feature Checklist

### Step 1: Project Setup
- [x] Scaffold Next.js app (App Router, TypeScript, Tailwind, ESLint)
- [x] Configure tailwind.config.ts
- [x] Clean up boilerplate
- [x] Set up Inter font via next/font/google

### Step 2: Data Layer
- [x] `src/data/venues.ts` — 16 venues (id, name, city, country)
- [x] `src/data/groups.ts` — 12 groups, 48 teams (name, code, flag emoji, group)
- [x] `src/data/matches.ts` — 72 group stage + 32 knockout matches
- [x] `src/data/bracket.ts` — R32 matchups, R16/QF/SF/Final feed, 3rd-place matrix (495 combos)

### Step 3: Path Calculator
- [x] `src/lib/pathCalculator.ts` — `getTeamPaths(teamCode)` function
- [x] Handles 1st-place finish (single deterministic path)
- [x] Handles 2nd-place finish (single deterministic path)
- [x] Handles 3rd-place finish (multiple scenarios, deduped by venue sequence)

### Step 4: UI Components
- [x] `GroupCard.tsx` — group letter + 4 clickable teams
- [x] `TeamBadge.tsx` — flag emoji + team name
- [x] `PathTable.tsx` — knockout path table (rows=rounds, cols=scenarios)
- [x] `SearchBar.tsx` — filter teams by name
- [x] `PositionTabs.tsx` — tab selector: "1st" | "2nd" | "3rd"

### Step 5: Pages
- [x] Home page (`/`) — header, search bar, 12 group cards in responsive grid
- [x] Team page (`/team/[code]`) — group stage matches + knockout path with tabs
- [x] Back navigation from team page to home

### Step 6: Polish
- [ ] Open Graph meta tags for social sharing
- [ ] Favicon
- [ ] Custom 404 page
- [ ] Loading states
- [ ] Subtle hover/transition animations

### Step 7: Deploy
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Verify production URL

### Verification
- [ ] `npm run dev` starts without errors
- [ ] Home page shows all 12 groups with correct teams
- [ ] Clicking a team loads `/team/[code]` with correct group stage matches
- [ ] "If 1st" tab → single path R32→Final with correct venues
- [ ] "If 2nd" tab → single path with different venues
- [ ] "If 3rd" tab → multiple scenario columns or "does not qualify" note
- [ ] Responsive at 375px / 768px / 1024px
- [ ] `npm run build` succeeds
- [ ] Production deploy works

---

## Reference Data

<details>
<summary>Venues (16)</summary>

| ID | Stadium | City |
|----|---------|------|
| sofi | SoFi Stadium | Inglewood, CA |
| metlife | MetLife Stadium | East Rutherford, NJ |
| att | AT&T Stadium | Arlington, TX |
| hard_rock | Hard Rock Stadium | Miami Gardens, FL |
| gillette | Gillette Stadium | Foxborough, MA |
| nrg | NRG Stadium | Houston, TX |
| mercedes | Mercedes-Benz Stadium | Atlanta, GA |
| lincoln | Lincoln Financial Field | Philadelphia, PA |
| lumen | Lumen Field | Seattle, WA |
| levis | Levi's Stadium | Santa Clara, CA |
| arrowhead | GEHA Field at Arrowhead Stadium | Kansas City, MO |
| bc_place | BC Place | Vancouver, Canada |
| bmo | BMO Field | Toronto, Canada |
| azteca | Estadio Azteca | Mexico City, Mexico |
| bbva | Estadio BBVA | Monterrey, Mexico |
| akron | Estadio Akron | Guadalajara, Mexico |

</details>

<details>
<summary>Groups (12)</summary>

| Group | Teams |
|-------|-------|
| A | Mexico, South Africa, South Korea, UEFA Playoff D |
| B | Canada, UEFA Playoff A, Qatar, Switzerland |
| C | Brazil, Morocco, Haiti, Scotland |
| D | United States, Paraguay, Australia, UEFA Playoff C |
| E | Germany, Curaçao, Ivory Coast, Ecuador |
| F | Netherlands, Japan, UEFA Playoff B, Tunisia |
| G | Belgium, Egypt, Iran, New Zealand |
| H | Spain, Cape Verde, Saudi Arabia, Uruguay |
| I | France, Senegal, Intercontinental Playoff 2, Norway |
| J | Argentina, Algeria, Austria, Jordan |
| K | Portugal, Intercontinental Playoff 1, Uzbekistan, Colombia |
| L | England, Croatia, Ghana, Panama |

</details>

<details>
<summary>R32 Bracket (16 matches)</summary>

| Match | Matchup | Venue |
|-------|---------|-------|
| 73 | 2A vs 2B | SoFi, LA |
| 74 | 1E vs 3rd(A/B/C/D/F) | Gillette, Boston |
| 75 | 1F vs 2C | BBVA, Monterrey |
| 76 | 1C vs 2F | NRG, Houston |
| 77 | 1I vs 3rd(C/D/F/G/H) | MetLife, NJ |
| 78 | 2E vs 2I | AT&T, Dallas |
| 79 | 1A vs 3rd(C/E/F/H/I) | Azteca, Mexico City |
| 80 | 1L vs 3rd(E/H/I/J/K) | Mercedes-Benz, Atlanta |
| 81 | 1D vs 3rd(B/E/F/I/J) | Levi's, SF |
| 82 | 1G vs 3rd(A/E/H/I/J) | Lumen, Seattle |
| 83 | 2K vs 2L | BMO, Toronto |
| 84 | 1H vs 2J | SoFi, LA |
| 85 | 1B vs 3rd(E/F/G/I/J) | BC Place, Vancouver |
| 86 | 1J vs 2H | Hard Rock, Miami |
| 87 | 1K vs 3rd(D/E/I/J/L) | Arrowhead, KC |
| 88 | 2D vs 2G | AT&T, Dallas |

</details>

<details>
<summary>R16 → Final (16 matches)</summary>

**R16:**
| Match | Matchup | Venue |
|-------|---------|-------|
| 89 | W74 vs W77 | Lincoln, Philadelphia |
| 90 | W73 vs W75 | NRG, Houston |
| 91 | W76 vs W78 | MetLife, NJ |
| 92 | W79 vs W80 | Azteca, Mexico City |
| 93 | W83 vs W84 | AT&T, Dallas |
| 94 | W81 vs W82 | Lumen, Seattle |
| 95 | W86 vs W88 | Mercedes-Benz, Atlanta |
| 96 | W85 vs W87 | BC Place, Vancouver |

**QF:**
| Match | Matchup | Venue |
|-------|---------|-------|
| 97 | W89 vs W90 | Gillette, Boston |
| 98 | W93 vs W94 | SoFi, LA |
| 99 | W91 vs W92 | Hard Rock, Miami |
| 100 | W95 vs W96 | Arrowhead, KC |

**SF / Final:**
| Match | Matchup | Venue |
|-------|---------|-------|
| 101 | W97 vs W98 | AT&T, Dallas |
| 102 | W99 vs W100 | Mercedes-Benz, Atlanta |
| 103 | L101 vs L102 (3rd place) | Hard Rock, Miami |
| 104 | W101 vs W102 (Final) | MetLife, NJ |

</details>

<details>
<summary>Third-Place Matrix</summary>

8 R32 matches involve 3rd-place teams: M74, M77, M79, M80, M81, M82, M85, M87. Each has a fixed set of possible source groups (listed in R32 table above). The full FIFA matrix (C(12,8) = 495 combinations) determines which group's 3rd-place team fills each slot. Encode as: `Record<string, Record<number, string>>` mapping sorted-eliminated-groups → match-number → assigned-group.

FIFA constraint: a 3rd-place team cannot face the winner of their own group.

</details>

<details>
<summary>Types</summary>

```ts
type Venue = {
  id: string;
  name: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
};

type Team = {
  name: string;
  code: string;       // FIFA 3-letter code
  flag: string;       // emoji
  group: string;
};

type TeamPath = {
  finishPosition: "1st" | "2nd" | "3rd";
  scenario?: string;
  rounds: {
    round: "Group MD1" | "Group MD2" | "Group MD3" | "R32" | "R16" | "QF" | "SF" | "Final";
    matchNumber: number;
    date: string;
    venue: Venue;
    opponent: string;
  }[];
};
```

</details>

<details>
<summary>Design System</summary>

- Tailwind CSS, mobile-first
- Font: Inter (next/font/google)
- Colors: dark navy (#0f172a) cards, white text, gold (#f59e0b) accents
- Rounded corners, subtle shadows, smooth hover transitions
- Responsive grid: 3×4 desktop, 2×6 tablet, 1×12 mobile

</details>
