import type { ApiResponse } from "./types";

export async function clientFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success || !body.data) {
    throw new Error(body.error ?? "Empty response");
  }
  return body.data;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unexpected error";
}

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, fetchedAt: Date.now() };
}

export function fail(error: string): ApiResponse<never> {
  return { success: false, error, fetchedAt: Date.now() };
}
