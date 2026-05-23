// Brand.tsx is intentionally minimal — the new design uses CommandBar
// (see ./CommandBar.tsx) as the top-of-page status line. This file remains
// only so any future code paths needing a simple inline brand mark have
// a place to import from.

export function Brand() {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-[15px] font-bold text-ink-strong tracking-tight">
        PULSE
      </span>
      <span className="font-mono text-[15px] font-bold text-amber blink">
        //
      </span>
    </span>
  );
}
