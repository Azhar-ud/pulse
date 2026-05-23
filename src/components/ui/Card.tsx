import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  title: string;
  caption?: string;
  symbol?: string;
  accent?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Terminal-style card: zero border-radius, hairline border, mono header
 * with [symbol] tag, optional dashed divider beneath header.
 */
export function Card({
  title,
  caption,
  symbol,
  accent,
  children,
  className,
  contentClassName,
}: CardProps) {
  return (
    <section
      className={clsx(
        "flex flex-col border border-border bg-bg-card",
        className
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-3 pt-2.5 pb-2">
        <div className="flex items-baseline gap-2 min-w-0">
          {symbol ? (
            <span className="tag text-amber whitespace-nowrap">
              {symbol}
            </span>
          ) : null}
          <h2 className="font-mono text-[13px] font-medium text-ink-strong tracking-tight truncate">
            {title}
          </h2>
          {caption ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint truncate">
              {caption}
            </span>
          ) : null}
        </div>
        {accent ? <div className="shrink-0">{accent}</div> : null}
      </header>
      <div className={clsx("flex-1 min-h-0", contentClassName)}>{children}</div>
    </section>
  );
}

export function LiveTag({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-up">
      <span className="dot-pulse" aria-hidden />
      {label}
    </span>
  );
}

export function FrozenTag({ label = "STATIC" }: { label?: string }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
      ● {label}
    </span>
  );
}
