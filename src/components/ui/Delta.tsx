import clsx from "clsx";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatPercent } from "@/lib/format";

interface DeltaProps {
  value: number;
  showIcon?: boolean;
  className?: string;
}

export function Delta({ value, showIcon = true, className }: DeltaProps) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={clsx(
        "tabular inline-flex items-center gap-0.5 font-mono text-xs",
        up ? "text-up" : "text-down",
        className
      )}
    >
      {showIcon ? <Icon className="h-3 w-3" aria-hidden /> : null}
      {formatPercent(value)}
    </span>
  );
}
