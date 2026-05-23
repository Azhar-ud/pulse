"use client";

import useSWR from "swr";
import { Card, LiveDot } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { clientFetch } from "@/lib/fetcher";
import type { WeatherSpot } from "@/lib/types";

const REFRESH_MS = 5 * 60_000;

export function WeatherDeck() {
  const { data, error, isLoading } = useSWR<WeatherSpot[]>(
    "/api/weather",
    (key: string) => clientFetch<WeatherSpot[]>(key),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false }
  );

  return (
    <Card
      title="Weather"
      caption="Builder cities"
      accent={<LiveDot />}
      contentClassName="p-0"
    >
      {error ? (
        <Empty message="Weather feed unavailable." />
      ) : isLoading || !data ? (
        <SkeletonGrid />
      ) : (
        <ul className="divide-y divide-border">
          {data.map((spot) => (
            <li
              key={spot.city}
              className="flex items-center justify-between gap-3 px-5 py-3"
            >
              <div className="flex min-w-0 flex-col">
                <span className="text-sm text-text">{spot.city}</span>
                <span className="text-[11px] text-text-dim">
                  {spot.description} · {Math.round(spot.windKmh)} km/h
                </span>
              </div>
              <Sparkline
                data={spot.hourly}
                width={64}
                height={22}
                stroke="var(--accent-dim)"
                fill="var(--accent-dim)"
              />
              <div className="flex flex-col items-end">
                <span className="tabular font-mono text-base text-text">
                  {Math.round(spot.tempC)}°
                </span>
                <span className="tabular font-mono text-[10px] text-text-dim">
                  feels {Math.round(spot.feelsC)}°
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center px-5 py-10 text-sm text-text-muted">
      {message}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <ul className="divide-y divide-border">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="flex items-center justify-between gap-3 px-5 py-3">
          <span className="h-8 w-24 rounded bg-bg-elevated" />
          <span className="h-6 w-12 rounded bg-bg-elevated" />
        </li>
      ))}
    </ul>
  );
}
