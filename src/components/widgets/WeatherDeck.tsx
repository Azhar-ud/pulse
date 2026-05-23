"use client";

import useSWR from "swr";
import { Card, LiveTag } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { clientFetch } from "@/lib/fetcher";
import type { WeatherSpot } from "@/lib/types";

const REFRESH_MS = 5 * 60_000;

const CITY_CODES: Record<string, string> = {
  "San Francisco": "SFO",
  "New York": "NYC",
  London: "LHR",
  Berlin: "BER",
  Bengaluru: "BLR",
  Tokyo: "TYO",
};

export function WeatherDeck() {
  const { data, error, isLoading } = useSWR<WeatherSpot[]>(
    "/api/weather",
    (key: string) => clientFetch<WeatherSpot[]>(key),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false }
  );

  return (
    <Card
      symbol="WX"
      title="WEATHER"
      caption="BUILDER CITIES · 5M"
      accent={<LiveTag />}
    >
      {error ? (
        <Empty message="UPSTREAM ERR · api.open-meteo.com" />
      ) : isLoading || !data ? (
        <SkeletonGrid />
      ) : (
        <ul className="divide-y divide-border-dim">
          {data.map((spot) => {
            const code =
              CITY_CODES[spot.city] ?? spot.city.slice(0, 3).toUpperCase();
            return (
              <li
                key={spot.city}
                className="grid grid-cols-[44px_1fr_72px_60px] items-center gap-3 px-3 py-2.5"
              >
                <span className="font-mono text-[12px] font-medium text-amber">
                  {code}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[12px] text-ink-strong truncate">
                    {spot.city}
                  </p>
                  <p className="font-mono text-[10px] text-ink-faint">
                    {spot.description.toUpperCase()}
                  </p>
                </div>
                <Sparkline
                  data={spot.hourly}
                  width={70}
                  height={18}
                  stroke="var(--info)"
                  fill="var(--info)"
                />
                <div className="flex flex-col items-end">
                  <span className="tabular font-mono text-[16px] font-medium text-ink-strong leading-none">
                    {Math.round(spot.tempC)}°
                  </span>
                  <span className="tabular font-mono text-[9px] text-ink-faint">
                    F{Math.round(spot.feelsC)}°
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center font-mono text-[11px] uppercase tracking-wider text-down">
      {message}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <ul className="divide-y divide-border-dim">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="grid grid-cols-[44px_1fr_72px_60px] items-center gap-3 px-3 py-3"
        >
          <span className="sk h-4" />
          <span className="sk h-4" />
          <span className="sk h-5" />
          <span className="sk h-6" />
        </li>
      ))}
    </ul>
  );
}
