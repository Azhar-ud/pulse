interface StatusRowProps {
  feeds: ReadonlyArray<{ name: string; cadence: string }>;
}

export function StatusRow({ feeds }: StatusRowProps) {
  return (
    <div className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1500px] items-center gap-6 overflow-x-auto px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint whitespace-nowrap">
          ━━ ACTIVE FEEDS
        </span>
        {feeds.map((f) => (
          <div
            key={f.name}
            className="flex items-baseline gap-1.5 whitespace-nowrap"
          >
            <span aria-hidden className="text-up text-[8px]">
              ●
            </span>
            <span className="font-mono text-[11px] font-medium text-ink">
              {f.name}
            </span>
            <span className="font-mono text-[10px] text-ink-faint">
              · {f.cadence}
            </span>
          </div>
        ))}
        <span
          aria-hidden
          className="ascii-rule font-mono text-[10px] hidden md:inline"
        >
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        </span>
      </div>
    </div>
  );
}
