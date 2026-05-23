const RTF = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const COMPACT = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatRelative(unixSeconds: number): string {
  const diff = unixSeconds - Math.floor(Date.now() / 1000);
  const abs = Math.abs(diff);
  if (abs < 60) return RTF.format(Math.round(diff), "seconds");
  if (abs < 3600) return RTF.format(Math.round(diff / 60), "minutes");
  if (abs < 86400) return RTF.format(Math.round(diff / 3600), "hours");
  return RTF.format(Math.round(diff / 86400), "days");
}

export function formatCompact(n: number): string {
  return COMPACT.format(n);
}

export function formatPrice(n: number): string {
  if (n >= 1000)
    return n.toLocaleString("en", {
      maximumFractionDigits: 0,
    });
  if (n >= 1)
    return n.toLocaleString("en", {
      maximumFractionDigits: 2,
    });
  return n.toLocaleString("en", {
    maximumFractionDigits: 4,
  });
}

export function formatPercent(n: number, signed = true): string {
  const sign = signed && n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function getDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
