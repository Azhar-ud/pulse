import { Brand } from "@/components/Brand";
import { HnPulse } from "@/components/widgets/HnPulse";
import { MarketDeck } from "@/components/widgets/MarketDeck";
import { WeatherDeck } from "@/components/widgets/WeatherDeck";
import { RepoBubbles } from "@/components/widgets/RepoBubbles";

export default function Home() {
  return (
    <div className="relative min-h-dvh bg-bg">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div className="relative mx-auto flex max-w-[1400px] flex-col">
        <Brand />

        <header className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-14">
          <p className="text-[11px] uppercase tracking-[0.24em] text-accent">
            Live · No login · No tracking
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            A calm <em className="font-display italic">terminal</em> for the
            signals builders actually watch.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            Hacker News, GitHub&apos;s freshest repos, crypto markets, and weather
            for the cities your team works from — one view, refreshed every
            minute, no signup.
          </p>
        </header>

        <main className="grid gap-4 px-6 pb-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HnPulse />
          </div>
          <div className="flex flex-col gap-4">
            <MarketDeck />
            <WeatherDeck />
          </div>
          <div className="lg:col-span-3">
            <RepoBubbles />
          </div>
        </main>

        <footer className="border-t border-border px-6 py-8 text-xs text-text-dim">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Data: Hacker News, GitHub, CoinGecko, Open-Meteo. Cached 60s–10min
              server-side.
            </p>
            <p>
              Built by{" "}
              <a
                href="https://github.com/Azhar-ud"
                className="text-text-muted hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Azhar Ud Din
              </a>
              {" · "}
              <a
                href="https://github.com/Azhar-ud/pulse"
                className="text-text-muted hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
