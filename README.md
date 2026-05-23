# Pulse

A live signal feed for builders. Hacker News, GitHub trending, crypto markets,
and weather — one calm terminal, refreshed every minute, no signup.

Built as a portfolio demo to show real-time data fetching, D3 visualization, and
editorial dark-luxury UI in Next.js 16.

## Live demo

→ https://pulse-demo.vercel.app *(deployed via Vercel)*

## What it does

- **Hacker News Pulse** — live top 12 stories with score sparklines, hot tags
- **GitHub Pulse** — bubble chart of new repos that gained the most stars in the
  last 7 days, colored by language
- **Markets** — BTC / ETH / SOL / RNDR / FET with 7d sparkline and 24h delta
- **Weather** — six builder hub cities (SF, NYC, London, Berlin, Bengaluru,
  Tokyo) with hourly trend

Every widget auto-refreshes on its own cadence. Server-side fetch is cached
60s–10min so we are kind to upstream APIs.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript** end-to-end, no `any`
- **Tailwind v4** with custom `@theme` tokens in OKLCH
- **D3** (`d3-force`, `d3-scale`, `d3-shape`) for the bubble chart and
  sparklines
- **SWR** for client-side refresh
- **Motion** for micro-interactions
- **Lucide** for icons
- All upstream APIs are free, no keys required

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── hn/route.ts          ── Hacker News (Firebase API)
│   │   ├── repos/route.ts       ── GitHub Search
│   │   ├── market/route.ts      ── CoinGecko
│   │   └── weather/route.ts     ── Open-Meteo
│   ├── globals.css              ── design tokens, OKLCH palette
│   ├── layout.tsx               ── Geist + Instrument Serif
│   └── page.tsx                 ── dashboard composition
├── components/
│   ├── Brand.tsx
│   ├── ui/                      ── Card, Sparkline, Delta
│   └── widgets/                 ── HnPulse, MarketDeck, WeatherDeck, RepoBubbles
└── lib/
    ├── fetcher.ts
    ├── format.ts
    └── types.ts
```

Server route handlers proxy each upstream API, normalize the payload to a
typed shape, and use Next.js fetch revalidation for caching. Widgets are client
components driven by SWR with per-widget refresh intervals.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

Just push to `main` — Vercel auto-deploys. No environment variables are
required for the public APIs. Optionally set `GITHUB_TOKEN` to lift the
unauthenticated GitHub rate limit from 60/hr to 5000/hr.

## License

MIT
