"use client";

import useSWR from "swr";
import { Card, LiveDot } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { Delta } from "@/components/ui/Delta";
import { clientFetch } from "@/lib/fetcher";
import { formatPrice } from "@/lib/format";
import type { MarketTick } from "@/lib/types";

const REFRESH_MS = 45_000;

export function MarketDeck() {
  const { data, error, isLoading } = useSWR<MarketTick[]>(
    "/api/market",
    (key: string) => clientFetch<MarketTick[]>(key),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false }
  );

  return (
    <Card
      title="Markets"
      caption="Crypto · 24h"
      accent={<LiveDot />}
      contentClassName="p-0"
    >
      {error ? (
        <Empty message="Market feed unavailable." />
      ) : isLoading || !data ? (
        <SkeletonGrid />
      ) : (
        <ul className="divide-y divide-border">
          {data.map((tick) => (
            <li
              key={tick.symbol}
              className="flex items-center justify-between gap-4 px-5 py-3"
            >
              <div className="flex min-w-0 flex-col">
                <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  {tick.symbol}
                </span>
                <span className="text-sm text-text">{tick.name}</span>
              </div>
              <div className="hidden md:block">
                <Sparkline
                  data={tick.spark}
                  width={80}
                  height={24}
                  stroke={tick.change24h >= 0 ? "var(--up)" : "var(--down)"}
                  fill={tick.change24h >= 0 ? "var(--up)" : "var(--down)"}
                />
              </div>
              <div className="flex flex-col items-end">
                <span className="tabular font-mono text-sm text-text">
                  ${formatPrice(tick.price)}
                </span>
                <Delta value={tick.change24h} />
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
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex items-center justify-between gap-4 px-5 py-3">
          <span className="h-8 w-24 rounded bg-bg-elevated" />
          <span className="h-6 w-16 rounded bg-bg-elevated" />
        </li>
      ))}
    </ul>
  );
}
