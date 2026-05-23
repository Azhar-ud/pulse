"use client";

import { useMemo } from "react";
import useSWR from "swr";
import {
  forceCollide,
  forceSimulation,
  forceX,
  forceY,
  type SimulationNodeDatum,
} from "d3-force";
import { scaleSqrt } from "d3-scale";
import { extent } from "d3-array";
import { Card, LiveDot } from "@/components/ui/Card";
import { clientFetch } from "@/lib/fetcher";
import { formatCompact } from "@/lib/format";
import type { RepoTrend } from "@/lib/types";

const REFRESH_MS = 5 * 60_000;
const WIDTH = 880;
const HEIGHT = 320;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "oklch(70% 0.16 240)",
  JavaScript: "oklch(82% 0.16 90)",
  Python: "oklch(76% 0.14 160)",
  Rust: "oklch(72% 0.18 35)",
  Go: "oklch(76% 0.14 200)",
  "C++": "oklch(72% 0.16 300)",
  Java: "oklch(72% 0.16 60)",
  Swift: "oklch(78% 0.18 25)",
  Kotlin: "oklch(72% 0.16 280)",
  Ruby: "oklch(70% 0.20 15)",
};

function colorFor(lang: string | null): string {
  if (!lang) return "oklch(60% 0.04 60)";
  return LANGUAGE_COLORS[lang] ?? "oklch(70% 0.10 60)";
}

interface SimNode extends SimulationNodeDatum {
  repo: RepoTrend;
  r: number;
}

interface PositionedRepo {
  repo: RepoTrend;
  cx: number;
  cy: number;
  r: number;
}

export function RepoBubbles() {
  const { data, error, isLoading } = useSWR<RepoTrend[]>(
    "/api/repos",
    (key: string) => clientFetch<RepoTrend[]>(key),
    { refreshInterval: REFRESH_MS, revalidateOnFocus: false }
  );

  const positioned = useMemo<PositionedRepo[]>(() => {
    if (!data || data.length === 0) return [];
    const [min = 1, max = 100] = extent(data, (d) => d.stars);
    const radius = scaleSqrt()
      .domain([min, max === min ? max + 1 : max])
      .range([14, 52]);

    const nodes: SimNode[] = data.map((repo) => ({
      repo,
      r: radius(repo.stars),
      x: WIDTH / 2 + (Math.random() - 0.5) * 200,
      y: HEIGHT / 2 + (Math.random() - 0.5) * 80,
    }));

    const sim = forceSimulation<SimNode>(nodes)
      .force("x", forceX<SimNode>(WIDTH / 2).strength(0.04))
      .force("y", forceY<SimNode>(HEIGHT / 2).strength(0.18))
      .force(
        "collide",
        forceCollide<SimNode>().radius((d) => d.r + 2).iterations(3)
      )
      .stop();

    for (let i = 0; i < 240; i += 1) sim.tick();

    return nodes.map((n) => ({
      repo: n.repo,
      cx: n.x ?? WIDTH / 2,
      cy: n.y ?? HEIGHT / 2,
      r: n.r,
    }));
  }, [data]);

  return (
    <Card
      title="GitHub Pulse"
      caption="Most-starred new repos · 7d"
      accent={<LiveDot />}
      className="col-span-full"
    >
      {error ? (
        <Empty message="GitHub feed unavailable. Maybe rate-limited — try again in a minute." />
      ) : isLoading || !data ? (
        <SkeletonViz />
      ) : (
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Bubble chart of trending GitHub repositories"
          >
            {positioned.map(({ repo, cx, cy, r }) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <g className="group cursor-pointer">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={colorFor(repo.language)}
                    fillOpacity={0.18}
                    stroke={colorFor(repo.language)}
                    strokeWidth={1}
                    className="transition-[fill-opacity,stroke-width] duration-200 group-hover:[fill-opacity:0.32] group-hover:[stroke-width:1.5]"
                  />
                  {r > 24 ? (
                    <text
                      x={cx}
                      y={cy - 2}
                      textAnchor="middle"
                      className="pointer-events-none fill-text font-sans text-[10px]"
                    >
                      {truncate(repo.name, 14)}
                    </text>
                  ) : null}
                  {r > 24 ? (
                    <text
                      x={cx}
                      y={cy + 11}
                      textAnchor="middle"
                      className="pointer-events-none fill-text-dim font-mono text-[9px]"
                    >
                      ★ {formatCompact(repo.stars)}
                    </text>
                  ) : null}
                </g>
              </a>
            ))}
          </svg>
          <Legend repos={data} />
        </div>
      )}
    </Card>
  );
}

function Legend({ repos }: { repos: RepoTrend[] }) {
  const langs = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((r) => r.language && set.add(r.language));
    return Array.from(set).slice(0, 8);
  }, [repos]);

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
      {langs.map((lang) => (
        <li
          key={lang}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: colorFor(lang) }}
          />
          {lang}
        </li>
      ))}
    </ul>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function Empty({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-text-muted">
      {message}
    </div>
  );
}

function SkeletonViz() {
  return (
    <div className="grid h-[280px] place-items-center">
      <span className="font-mono text-xs uppercase tracking-wider text-text-dim">
        Loading…
      </span>
    </div>
  );
}
