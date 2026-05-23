import { NextResponse } from "next/server";
import { fail, getErrorMessage, ok } from "@/lib/fetcher";
import type { RepoTrend } from "@/lib/types";

interface GhRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  created_at: string;
  pushed_at: string;
}

interface GhSearch {
  items?: GhRepo[];
  message?: string;
}

function sinceDate(days: number): string {
  const d = new Date(Date.now() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}

export const revalidate = 600;

export async function GET(): Promise<NextResponse> {
  try {
    const since = sinceDate(7);
    const url = `https://api.github.com/search/repositories?q=created:>${since}+stars:>50&sort=stars&order=desc&per_page=30`;

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(url, { headers, next: { revalidate: 600 } });
    if (!res.ok) {
      throw new Error(`GitHub ${res.status}`);
    }
    const body = (await res.json()) as GhSearch;
    if (!body.items) throw new Error(body.message ?? "no items");

    const repos: RepoTrend[] = body.items.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
      createdAt: r.created_at,
      pushedAt: r.pushed_at,
    }));

    return NextResponse.json(ok(repos));
  } catch (error: unknown) {
    return NextResponse.json(fail(getErrorMessage(error)), { status: 502 });
  }
}
