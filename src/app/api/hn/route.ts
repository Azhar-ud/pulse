import { NextResponse } from "next/server";
import { fail, getErrorMessage, ok } from "@/lib/fetcher";
import { getDomain } from "@/lib/format";
import type { HnStory } from "@/lib/types";

interface HnItem {
  id: number;
  title?: string;
  url?: string;
  score?: number;
  by?: string;
  descendants?: number;
  time?: number;
  type?: string;
}

const TOP_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const ITEM_URL = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

async function fetchJson<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`HN ${res.status} for ${url}`);
  return (await res.json()) as T;
}

export const revalidate = 60;

export async function GET(): Promise<NextResponse> {
  try {
    const ids = await fetchJson<number[]>(TOP_URL, 60);
    const top = ids.slice(0, 18);
    const items = await Promise.all(
      top.map((id) => fetchJson<HnItem>(ITEM_URL(id), 120))
    );

    const stories: HnStory[] = items
      .filter((it) => it && it.title && it.type === "story")
      .map((it) => ({
        id: it.id,
        title: it.title ?? "",
        url: it.url ?? null,
        score: it.score ?? 0,
        by: it.by ?? "unknown",
        descendants: it.descendants ?? 0,
        time: it.time ?? Math.floor(Date.now() / 1000),
        domain: getDomain(it.url ?? null),
      }));

    return NextResponse.json(ok(stories));
  } catch (error: unknown) {
    return NextResponse.json(fail(getErrorMessage(error)), { status: 502 });
  }
}
