"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

function pad(n: number, w = 2): string {
  return String(n).padStart(w, "0");
}

function formatUtcClock(d: Date): string {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
}

function formatUtcDate(d: Date): string {
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${d.getUTCFullYear()} ${MONTHS[d.getUTCMonth()]} ${pad(d.getUTCDate())}`;
}

export function CommandBar() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="border-b border-border bg-bg-card">
      <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-2.5">
        {/* Brand */}
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className="font-mono text-[15px] font-bold text-ink-strong tracking-tight">
            PULSE
          </span>
          <span className="font-mono text-[15px] font-bold text-amber blink">
            //
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint sm:inline">
            BUILDER&apos;S TERMINAL
          </span>
        </div>

        <div className="h-4 w-px bg-border-strong hidden sm:block" />

        {/* Status indicators */}
        <nav className="hidden flex-1 items-center gap-5 md:flex">
          <Stat label="STATUS" value="● LIVE" valueClass="text-up" />
          <Stat label="FEEDS" value="04/04" />
          <Stat label="MODE" value="READ" />
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <a
            href="https://github.com/Azhar-ud/pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-mono text-[11px] uppercase tracking-wider text-ink-dim hover:text-amber sm:inline-flex sm:items-center sm:gap-1"
          >
            SOURCE <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
          <div
            className="flex items-baseline gap-2 font-mono"
            suppressHydrationWarning
          >
            <span className="tabular text-[10px] uppercase text-ink-faint">
              {formatUtcDate(now)}
            </span>
            <span className="tabular text-[13px] font-medium text-amber">
              {formatUtcClock(now)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  valueClass = "text-ink-strong",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </span>
      <span className={`font-mono text-[11px] font-medium ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
