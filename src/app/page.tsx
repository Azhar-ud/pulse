import { CommandBar } from "@/components/CommandBar";
import { StatusRow } from "@/components/StatusRow";
import { Marquee } from "@/components/Marquee";
import { HnPulse } from "@/components/widgets/HnPulse";
import { MarketDeck } from "@/components/widgets/MarketDeck";
import { WeatherDeck } from "@/components/widgets/WeatherDeck";
import { RepoBubbles } from "@/components/widgets/RepoBubbles";

const FEEDS = [
  { name: "HACKER-NEWS", cadence: "60s" },
  { name: "GITHUB-API", cadence: "10m" },
  { name: "COINGECKO", cadence: "45s" },
  { name: "OPEN-METEO", cadence: "5m" },
];

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <CommandBar />
      <StatusRow feeds={FEEDS} />

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 pt-4 pb-2">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
              [01]
            </span>
            <h1 className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-strong">
              SIGNAL FEED
            </h1>
            <span
              aria-hidden
              className="ascii-rule hidden flex-1 font-mono text-[12px] sm:inline"
            >
              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            REFRESHING
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HnPulse />
          </div>
          <div className="flex flex-col gap-3">
            <MarketDeck />
            <WeatherDeck />
          </div>
        </div>

        <div className="mt-3 mb-3 flex items-baseline gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber">
            [02]
          </span>
          <h2 className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-strong">
            REPO ACTIVITY
          </h2>
          <span
            aria-hidden
            className="ascii-rule hidden flex-1 font-mono text-[12px] sm:inline"
          >
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </span>
        </div>

        <RepoBubbles />
      </main>

      <Marquee />

      <footer className="border-t border-border bg-bg-card">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            DATA :: hacker-news · github · coingecko · open-meteo
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            BUILT BY{" "}
            <a
              href="https://github.com/Azhar-ud"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-dim hover:text-amber"
            >
              AZHAR UD DIN
            </a>
            {" · "}
            <a
              href="https://github.com/Azhar-ud/pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-dim hover:text-amber"
            >
              SOURCE
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
