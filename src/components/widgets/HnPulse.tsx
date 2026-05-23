"use client";

import useSWR from "swr";
import { ExternalLink, Flame } from "lucide-react";
import { Card, LiveTag } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { clientFetch } from "@/lib/fetcher";
import { formatCompact, formatRelative, getDomain } from "@/lib/format";
import type { HnStory } from "@/lib/types";

const REFRESH_MS = 60_000;

function buildSpark(score: number, seed: number): number[] {
  const n = 12;
  const out: number[] = [];
  let v = Math.max(1, score * 0.4);
  for (let i = 0; i < n; i += 1) {
    const noise =
      Math.sin((seed + i) * 1.7) * 0.18 +
      Math.cos((seed - i) * 0.9) * 0.12;
    v = v + (score - v) * (i / n) + noise * (score * 0.05);
    out.push(Math.max(0, v));
  }
  out.push(score);
  return out;
}

export function HnPulse() {
  const { data, error, isLoading } = useSWR<HnStory[]>(
    "/api/hn",
    (key: string) => clientFetch<HnStory[]>(key),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false }
  );

  return (
    <Card
      symbol="HN"
      title="HACKER NEWS"
      caption={`TOP ${data?.length ?? "—"} · 60s`}
      accent={<LiveTag />}
      className="min-h-[28rem]"
    >
      {error ? (
        <ErrorState message="UPSTREAM ERR · hacker-news.firebaseio.com" />
      ) : isLoading || !data ? (
        <SkeletonRows />
      ) : (
        <ol className="divide-y divide-border-dim">
          {data.slice(0, 14).map((story, idx) => {
            const domain = getDomain(story.url) ?? "news.ycombinator.com";
            const spark = buildSpark(story.score, story.id);
            const hot = story.score >= 250;
            return (
              <li key={story.id}>
                <a
                  href={
                    story.url ??
                    `https://news.ycombinator.com/item?id=${story.id}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/row grid grid-cols-[28px_1fr_60px_18px] items-start gap-3 px-3 py-2 hover:bg-bg-row-hover"
                >
                  <span className="tabular pt-0.5 font-mono text-[11px] text-ink-faint">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-start gap-1.5">
                      <p className="line-clamp-2 font-mono text-[12.5px] leading-snug text-ink-strong group-hover/row:text-amber">
                        {story.title}
                      </p>
                      {hot ? (
                        <Flame
                          className="mt-0.5 h-3 w-3 shrink-0 text-amber"
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 font-mono text-[10px] text-ink-faint">
                      <span className="tabular text-up">
                        +{formatCompact(story.score)}
                      </span>
                      <span aria-hidden>·</span>
                      <span className="tabular text-ink-dim">
                        {story.descendants}c
                      </span>
                      <span aria-hidden>·</span>
                      <span className="truncate max-w-[140px]">{domain}</span>
                      <span aria-hidden>·</span>
                      <span className="tabular">
                        {formatRelative(story.time)}
                      </span>
                    </div>
                  </div>
                  <Sparkline
                    data={spark}
                    width={60}
                    height={18}
                    stroke="var(--amber)"
                    fill="var(--amber)"
                    className="self-center text-amber"
                  />
                  <ExternalLink
                    className="mt-0.5 h-3 w-3 shrink-0 text-ink-ghost group-hover/row:text-amber"
                    aria-hidden
                  />
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}

function SkeletonRows() {
  return (
    <ol className="divide-y divide-border-dim">
      {Array.from({ length: 10 }).map((_, i) => (
        <li
          key={i}
          className="grid grid-cols-[28px_1fr_60px] items-center gap-3 px-3 py-2.5"
        >
          <span className="font-mono text-[11px] text-ink-faint">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="sk h-3" />
          <span className="sk h-3" />
        </li>
      ))}
    </ol>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center font-mono text-[11px] uppercase tracking-wider text-down">
      {message}
    </div>
  );
}
