# Not Insider Trading League (NITL)

A satirical fantasy-sports UI prototype where rostered "players" are US
Senators and Representatives, and scoring is driven by publicly disclosed
stock trades, PAC contributions, and committee-jurisdiction multipliers. The
visual language borrows from ESPN Fantasy (dense tables, green primary, clean
white surfaces) with vintage Topps baseball-card flourishes on the player
profile hero. There is no backend — every data point lives in `/src/data` as
typed mock data.

Satirical project. All disclosure data is illustrative and publicly
available. No claims of illegality are made.

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

The build output is a static SPA in `dist/` — drop it on any static host.

## Routes

| Route             | What it is                                       |
| ----------------- | ------------------------------------------------ |
| `/`               | League dashboard with this-week matchup preview  |
| `/matchup`        | Weekly box score                                 |
| `/roster`         | Starters + bench + IR                            |
| `/player/:id`     | ESPN-style player profile with vintage card hero |
| `/standings`      | Two-caucus standings with league $ take banner   |
| `/sportsbook`     | The House Cut · passive pool + active props      |
| `/rankings`       | Draft Big Board with tier breakdown              |
| `/draft`          | Team Builder — pick 12 legislators               |
| `/my-season`      | Simulated 2025 recap of your drafted roster      |

## Stateful flow

Only one part of the prototype is meaningfully stateful: **Team Builder**.
`/draft` lets you assemble a 12-legislator roster, validates positional
requirements, and persists to `localStorage` under `nitl:user-roster:v1`.
`/my-season` then simulates your roster against the 11 other mock teams'
pre-set weekly scores and surfaces W-L record, league rank, MVP/Bust tags,
and a week-by-week table.

## Photos & flags

- Legislator headshots: public-domain images from
  [`unitedstates/images`](https://github.com/unitedstates/images) via
  `https://unitedstates.github.io/images/congress/225x275/{BIOGUIDE_ID}.jpg`.
  The `Avatar` component falls back to a party-colored initials circle on
  image load failure.
- State flags: Wikimedia's `Special:FilePath` redirect, so any state name
  resolves without a hash prefix.

## Deployment

Deployed via Cloudflare Pages. Push to `main` triggers automatic redeploy.
