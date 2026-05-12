# NITL · Not Insider Trading League

A satirical fantasy-sports UI prototype where rostered "players" are US Senators
and Representatives. Scoring is based on publicly disclosed stock trades, PAC
contributions, and committee-jurisdiction multipliers. None of the data is real.
None of the activity depicted is illegal — that's sort of the point.

This is a clickable demo. There is no backend, no authentication, no real-time
data, and no live league management. Everything you see is hardcoded mock data
in `/src/data`.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

The build output is a static SPA in `dist/` — drop it on any static host.

## Project structure

```
src/
  components/     Shared NavBar, Footer, Avatar, Badge, LegislatorRow, StatCard
  pages/          One file per route — Dashboard, Matchup, Roster, etc.
  data/           Mock data: legislators, teams, trades, propLines, weeklyScores
  context/        RosterContext — localStorage-backed Team Builder state
  styles/         Tailwind + a handful of bespoke classes (.vintage-card etc.)
  App.tsx         BrowserRouter + RosterProvider shell
  main.tsx        React entry
```

## What's stateful

Only one flow is meaningfully stateful: **Team Builder**.

- `/draft` lets you assemble a 12-legislator mock roster from the pool of 24.
- The selection persists in `localStorage` under `nitl:user-roster:v1`.
- Once saved, `/my-season` becomes available — it simulates the user's roster
  against the pre-defined weekly scores of the other 11 mock teams, computes
  a W-L record, ranks against the league, and surfaces MVP / Bust callouts.
- Resetting from the My Season page clears localStorage and returns you to
  `/draft`.

Everything else (Matchup, Roster, Standings, Sportsbook, Rankings, Player
Profile) is read-only mock data.

## Photos & flags

- Legislator headshots come from the public domain
  [`unitedstates/images`](https://github.com/unitedstates/images) repo via:
  `https://unitedstates.github.io/images/congress/225x275/{BIOGUIDE_ID}.jpg`.
  Each `Legislator` carries a `bioguideId` field. The `Avatar` component
  attempts to load the photo, and on `onerror` falls back to a party-colored
  initials circle.
- State flags use Wikimedia's `Special:FilePath` redirect so any state name
  resolves without needing a hash prefix.

## Disclaimer

All disclosure data is illustrative. Not affiliated with the SEC, FEC, or any
federal agency. None of this activity is illegal — that's sort of the point.
