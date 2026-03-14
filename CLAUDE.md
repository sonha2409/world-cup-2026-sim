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

Every feature follows this pipeline in order. Do not skip or reorder steps.

### 1. Implement
Write the code for the feature or step.

### 2. Test & Build
- Write tests where applicable (unit tests for logic like `pathCalculator`, snapshot/render tests for components).
- Run `npm run build` and `npm run lint` to catch errors.
- Run tests (`npm test`) and fix any failures before proceeding.

### 3. User Verification (when applicable)
Pause and let the user verify manually/visually before moving on:
- **UI changes**: Run `npm run dev`, tell the user what to look at (URL, page, component), and wait for confirmation.
- **Data accuracy**: Show a sample of the data (e.g., a few teams, a bracket path) and ask the user to spot-check.
- **Path calculator logic**: Print example outputs for a known team and let the user verify the venues match the bracket.
- **Responsive layout**: Ask the user to resize the browser or check on mobile and confirm it looks right.
- Skip this step only for changes with no visible or user-facing effect (e.g., config-only changes).

### 4. Document & Commit
- Check off completed items in `SPEC.md` and update the session log.
- Commit with a clear message, then push to GitHub.

Do not chain multiple features without completing the full pipeline for each. Check off items in `SPEC.md` only after tests pass and the user confirms (when applicable).
