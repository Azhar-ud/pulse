"use client";

import useSWR from "swr";
import { ExternalLink, Flame } from "lucide-react";
import { Card, LiveDot } from "@/components/ui/Card";
import { Sparkline } from "@/components/ui/Sparkline";
import { clientFetch } from "@/lib/fetcher";
import { formatCompact, formatRelative, getDomain } from "@/lib/format";
import type { HnStory } from "@/lib/types";

const REFRESH_MS = 60_000;

function buildSpark(score: number, seed: number): number[] {
  const n = 12;
  const out: number[] = [];
  let v = Math.max(1, score * 0.35);
  for (let i = 0; i < n; i += 1) {
    const noise = Math.sin((seed + i) * 1.7) * 0.18 + Math.cos((seed - i) * 0.9) * 0.12;
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
      title="Hacker News"
      caption="Top stories, live"
      accent={<LiveDot />}
      className="min-h-[28rem]"
      contentClassName="p-0"
    >
      {error ? (
        <ErrorState message="Couldn't reach Hacker News." />
      ) : isLoading || !data ? (
        <SkeletonRows />
      ) : (
        <ol className="divide-y divide-border">
          {data.slice(0, 12).map((story, idx) => {
            const domain = getDomain(story.url) ?? "news.ycombinator.com";
            const spark = buildSpark(story.score, story.id);
            const hot = story.score >= 250;
            return (
              <li key={story.id} className="px-5 py-3">
                <a
                  href={
                    story.url ?? `https://news.ycombinator.com/item?id=${story.id}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/row flex items-start gap-4"
                >
                  <span className="tabular w-6 shrink-0 pt-0.5 font-mono text-xs text-text-dim">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="line-clamp-2 text-sm leading-snug text-text group-hover/row:text-accent">
                        {story.title}
                      </p>
                      {hot ? (
                        <Flame
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                          aria-label="hot story"
                        />
                      ) : null}
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-text-dim">
                      <span className="tabular text-text-muted">
                        {formatCompact(story.score)} pts
                      </span>
                      <span>·</span>
                      <span>{story.descendants} comments</span>
                      <span>·</span>
                      <span className="truncate">{domain}</span>
                      <span>·</span>
                      <span>{formatRelative(story.time)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                    <Sparkline
                      data={spark}
                      width={64}
                      height={20}
                      stroke="var(--accent)"
                      fill="var(--accent)"
                      className="text-accent"
                    />
                    <ExternalLink
                      className="h-3 w-3 text-text-dim group-hover/row:text-accent"
                      aria-hidden
                    />
                  </div>
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
    <ol className="divide-y divide-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="flex items-center gap-4 px-5 py-4">
          <span className="h-3 w-6 rounded bg-bg-elevated" />
          <span className="h-3 flex-1 rounded bg-bg-elevated" />
          <span className="h-5 w-16 rounded bg-bg-elevated" />
        </li>
      ))}
    </ol>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center px-5 py-12 text-center text-sm text-text-muted">
      {message}
    </div>
  );
}
