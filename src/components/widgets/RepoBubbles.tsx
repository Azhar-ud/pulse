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
import { Card, LiveTag } from "@/components/ui/Card";
import { clientFetch } from "@/lib/fetcher";
import { formatCompact } from "@/lib/format";
import type { RepoTrend } from "@/lib/types";

const REFRESH_MS = 5 * 60_000;
const WIDTH = 880;
const HEIGHT = 300;

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "oklch(72% 0.14 240)",
  JavaScript: "oklch(84% 0.16 90)",
  Python: "oklch(78% 0.12 165)",
  Rust: "oklch(72% 0.18 35)",
  Go: "oklch(76% 0.14 200)",
  "C++": "oklch(72% 0.18 300)",
  Java: "oklch(74% 0.18 60)",
  Swift: "oklch(78% 0.20 25)",
  Kotlin: "oklch(72% 0.18 280)",
  Ruby: "oklch(70% 0.22 15)",
  Shell: "oklch(70% 0.10 60)",
  Vue: "oklch(74% 0.14 145)",
  Svelte: "oklch(72% 0.20 35)",
};

function colorFor(lang: string | null): string {
  if (!lang) return "oklch(58% 0.04 60)";
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
      .range([12, 48]);

    const nodes: SimNode[] = data.map((repo) => ({
      repo,
      r: radius(repo.stars),
      x: WIDTH / 2 + (Math.random() - 0.5) * 200,
      y: HEIGHT / 2 + (Math.random() - 0.5) * 80,
    }));

    const sim = forceSimulation<SimNode>(nodes)
      .force("x", forceX<SimNode>(WIDTH / 2).strength(0.04))
      .force("y", forceY<SimNode>(HEIGHT / 2).strength(0.2))
      .force(
        "collide",
        forceCollide<SimNode>().radius((d) => d.r + 1.5).iterations(3)
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
      symbol="GH"
      title="GITHUB"
      caption="MOST-STARRED · 7D"
      accent={<LiveTag />}
      className="lg:col-span-3"
    >
      {error ? (
        <Empty message="UPSTREAM ERR · api.github.com (may be rate-limited)" />
      ) : isLoading || !data ? (
        <SkeletonViz />
      ) : (
        <div className="relative w-full px-3 pt-3 pb-2">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Bubble chart of trending GitHub repositories"
            shapeRendering="geometricPrecision"
          >
            <defs>
              <pattern
                id="gh-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="var(--border-dim)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width={WIDTH} height={HEIGHT} fill="url(#gh-grid)" />

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
                    fillOpacity={0.16}
                    stroke={colorFor(repo.language)}
                    strokeWidth={1}
                    className="transition-[fill-opacity,stroke-width] duration-200 group-hover:[fill-opacity:0.32] group-hover:[stroke-width:1.5]"
                  />
                  {r > 22 ? (
                    <text
                      x={cx}
                      y={cy - 2}
                      textAnchor="middle"
                      className="pointer-events-none fill-ink-strong font-mono text-[10px]"
                    >
                      {truncate(repo.name, 14)}
                    </text>
                  ) : null}
                  {r > 22 ? (
                    <text
                      x={cx}
                      y={cy + 11}
                      textAnchor="middle"
                      className="pointer-events-none fill-ink-dim font-mono text-[9px]"
                    >
                      ★{formatCompact(repo.stars)}
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
    return Array.from(set).slice(0, 9);
  }, [repos]);

  return (
    <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-dashed border-border-strong/60 pt-2.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        LANG ::
      </span>
      {langs.map((lang) => (
        <li
          key={lang}
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink-dim"
        >
          <span
            className="h-2 w-2"
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
    <div className="flex h-[260px] items-center justify-center font-mono text-[11px] uppercase tracking-wider text-down">
      {message}
    </div>
  );
}

function SkeletonViz() {
  return (
    <div className="grid h-[260px] place-items-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        ━━ LOADING ━━
      </span>
    </div>
  );
}
