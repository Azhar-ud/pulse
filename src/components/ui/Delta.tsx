import clsx from "clsx";
import { formatPercent } from "@/lib/format";

interface DeltaProps {
  value: number;
  arrow?: boolean;
  className?: string;
}

export function Delta({ value, arrow = true, className }: DeltaProps) {
  const up = value >= 0;
  return (
    <span
      className={clsx(
        "tabular inline-flex items-center gap-1 font-mono text-[11px] font-medium",
        up ? "text-up" : "text-down",
        className
      )}
    >
      {arrow ? <span aria-hidden>{up ? "▲" : "▼"}</span> : null}
      {formatPercent(value, /* signed */ false)}
    </span>
  );
}

export function DeltaAbs({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={clsx(
        "tabular inline-flex items-center gap-1 font-mono text-[11px]",
        up ? "text-up" : "text-down",
        className
      )}
    >
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {Math.abs(value).toLocaleString("en", { maximumFractionDigits: 2 })}
    </span>
  );
}
