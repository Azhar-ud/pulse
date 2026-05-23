"use client";

import useSWR from "swr";
import { motion, AnimatePresence } from "motion/react";
import { Card, LiveTag } from "@/components/ui/Card";
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
      symbol="MKT"
      title="MARKETS"
      caption="USD · 24H"
      accent={<LiveTag />}
    >
      {error ? (
        <Empty message="UPSTREAM ERR · api.coingecko.com" />
      ) : isLoading || !data ? (
        <SkeletonGrid />
      ) : (
        <ul className="divide-y divide-border-dim">
          {data.map((tick) => {
            const up = tick.change24h >= 0;
            return (
              <li
                key={tick.symbol}
                className="grid grid-cols-[64px_1fr_84px] items-center gap-3 px-3 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="font-mono text-[12px] font-medium text-ink-strong">
                    {tick.symbol}
                  </span>
                  <span className="font-mono text-[10px] text-ink-faint truncate">
                    {tick.name.toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <Sparkline
                    data={tick.spark}
                    width={80}
                    height={22}
                    stroke={up ? "var(--up)" : "var(--down)"}
                    fill={up ? "var(--up)" : "var(--down)"}
                  />
                </div>
                <div className="flex flex-col items-end">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={tick.price}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.18 }}
                      className="tabular font-mono text-[13px] font-medium text-ink-strong"
                    >
                      ${formatPrice(tick.price)}
                    </motion.span>
                  </AnimatePresence>
                  <Delta value={tick.change24h} />
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
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="grid grid-cols-[64px_1fr_84px] items-center gap-3 px-3 py-3"
        >
          <span className="sk h-6" />
          <span className="sk h-4" />
          <span className="sk h-6" />
        </li>
      ))}
    </ul>
  );
}
