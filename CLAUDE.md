# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

World Cup 2026 Path Tracker — a Next.js app that shows every possible venue-by-venue journey for any team to the final. See `SPEC.md` for the full implementation spec and progress log.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Deployed on Vercel (CDN-level rate limiting)

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
```

## Architecture

- `src/data/` — Hardcoded tournament data (groups, matches, venues, bracket logic)
- `src/lib/pathCalculator.ts` — Core logic: computes all possible venue paths for a team
- `src/components/` — Reusable UI components (GroupCard, PathTable, etc.)
- `src/app/` — Next.js App Router pages (home + team detail)

## Key Complexity

The 3rd-place bracket assignment uses a 495-combination matrix (C(12,8)) from FIFA rules. This is encoded in `src/data/bracket.ts`. The path calculator deduplicates scenarios by venue sequence to keep the UI manageable.

## Workflow

After completing a feature or step, **pause and let the user verify it manually/visually** before moving on:

- **UI changes**: Run `npm run dev`, tell the user what to look at (URL, page, component), and wait for confirmation.
- **Data accuracy**: Show a sample of the data (e.g., a few teams, a bracket path) and ask the user to spot-check.
- **Path calculator logic**: Print example outputs for a known team and let the user verify the venues match the bracket.
- **Responsive layout**: Ask the user to resize the browser or check on mobile and confirm it looks right.

Do not chain multiple steps without a verification pause. Check off items in `SPEC.md` only after the user confirms.
