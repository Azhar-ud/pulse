import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  title: string;
  caption?: string;
  accent?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Card({
  title,
  caption,
  accent,
  children,
  className,
  contentClassName,
}: CardProps) {
  return (
    <section
      className={clsx(
        "group relative flex flex-col rounded-2xl border border-border bg-bg-card",
        "transition-colors duration-300 hover:border-border-strong",
        className
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-5 pb-3 pt-4">
        <div className="flex flex-col">
          <h2 className="font-display text-xl leading-none tracking-tight text-text">
            {title}
          </h2>
          {caption ? (
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-text-dim">
              {caption}
            </p>
          ) : null}
        </div>
        {accent ? <div className="shrink-0">{accent}</div> : null}
      </header>
      <div className={clsx("flex-1 px-5 py-4", contentClassName)}>{children}</div>
    </section>
  );
}

export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
      <span className="pulse-dot" aria-hidden />
      {label}
    </span>
  );
}
