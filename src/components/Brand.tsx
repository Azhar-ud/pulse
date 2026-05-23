"use client";

import { useEffect, useState } from "react";

function ClockDisplay() {
  const [now, setNow] = useState<string>(() =>
    formatTime(new Date())
  );

  useEffect(() => {
    const id = setInterval(() => setNow(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="tabular font-mono text-xs text-text-dim" suppressHydrationWarning>
      {now}
    </span>
  );
}

function formatTime(d: Date): string {
  const utc = d.toISOString().slice(11, 19);
  return `${utc} UTC`;
}

export function Brand() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl italic leading-none">Pulse</span>
        <span className="hidden text-[11px] uppercase tracking-[0.22em] text-text-dim sm:inline">
          A signal feed for builders
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ClockDisplay />
        <a
          href="https://github.com/Azhar-ud/pulse"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted underline-offset-4 hover:text-accent hover:underline"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
