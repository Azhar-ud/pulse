"use client";

import useSWR from "swr";
import { clientFetch } from "@/lib/fetcher";
import { formatPrice } from "@/lib/format";
import type { HnStory, MarketTick, RepoTrend } from "@/lib/types";

interface Item {
  kind: "hn" | "mkt" | "repo";
  text: string;
  tone?: "up" | "down" | "amber" | "default";
}

function build(
  hn: HnStory[] | undefined,
  market: MarketTick[] | undefined,
  repos: RepoTrend[] | undefined
): Item[] {
  const items: Item[] = [];
  market?.slice(0, 5).forEach((m) =>
    items.push({
      kind: "mkt",
      text: `${m.symbol}  $${formatPrice(m.price)}  ${m.change24h >= 0 ? "▲" : "▼"}${Math.abs(m.change24h).toFixed(2)}%`,
      tone: m.change24h >= 0 ? "up" : "down",
    })
  );
  hn?.slice(0, 6).forEach((s) =>
    items.push({
      kind: "hn",
      text: `HN  ${truncate(s.title, 60)}  · ${s.score}`,
      tone: "default",
    })
  );
  repos?.slice(0, 4).forEach((r) =>
    items.push({
      kind: "repo",
      text: `GH  ${r.fullName}  · ${r.language ?? "—"}  · ★${formatCompact(r.stars)}`,
      tone: "amber",
    })
  );
  return items;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function Marquee() {
  const { data: hn } = useSWR<HnStory[]>("/api/hn", (k: string) =>
    clientFetch<HnStory[]>(k)
  );
  const { data: market } = useSWR<MarketTick[]>("/api/market", (k: string) =>
    clientFetch<MarketTick[]>(k)
  );
  const { data: repos } = useSWR<RepoTrend[]>("/api/repos", (k: string) =>
    clientFetch<RepoTrend[]>(k)
  );

  const items = build(hn, market, repos);
  if (items.length === 0) return null;

  // Duplicate the items so the keyframe loop hides the wrap-around seam
  const looped = [...items, ...items];

  return (
    <div
      className="border-t border-border bg-bg-card overflow-hidden"
      role="marquee"
      aria-label="Live activity ticker"
    >
      <div className="marquee py-2 will-change-transform">
        {looped.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 px-5 font-mono text-[11.5px] whitespace-nowrap"
          >
            <span
              aria-hidden
              className={
                item.tone === "up"
                  ? "text-up"
                  : item.tone === "down"
                    ? "text-down"
                    : item.tone === "amber"
                      ? "text-amber"
                      : "text-ink-strong"
              }
            >
              {item.text}
            </span>
            <span aria-hidden className="text-ink-ghost">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
