import { NextResponse } from "next/server";
import { fail, getErrorMessage, ok } from "@/lib/fetcher";
import type { MarketTick } from "@/lib/types";

interface CgCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  sparkline_in_7d?: { price: number[] };
}

const COINS = ["bitcoin", "ethereum", "solana", "render-token", "fetch-ai"];

export const revalidate = 60;

export async function GET(): Promise<NextResponse> {
  try {
    const params = new URLSearchParams({
      vs_currency: "usd",
      ids: COINS.join(","),
      order: "market_cap_desc",
      per_page: String(COINS.length),
      page: "1",
      sparkline: "true",
      price_change_percentage: "24h",
    });
    const url = `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const body = (await res.json()) as CgCoin[];

    const ticks: MarketTick[] = body.map((c) => ({
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      price: c.current_price,
      change24h: c.price_change_percentage_24h ?? 0,
      spark: thin(c.sparkline_in_7d?.price ?? [], 32),
    }));

    return NextResponse.json(ok(ticks));
  } catch (error: unknown) {
    return NextResponse.json(fail(getErrorMessage(error)), { status: 502 });
  }
}

function thin(arr: number[], target: number): number[] {
  if (arr.length <= target) return arr;
  const step = arr.length / target;
  const out: number[] = [];
  for (let i = 0; i < target; i += 1) {
    out.push(arr[Math.floor(i * step)]);
  }
  return out;
}
