import { NextResponse } from "next/server";
import { fail, getErrorMessage, ok } from "@/lib/fetcher";
import type { WeatherSpot } from "@/lib/types";

interface City {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

const CITIES: City[] = [
  { city: "San Francisco", country: "US", lat: 37.7749, lon: -122.4194 },
  { city: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { city: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { city: "Berlin", country: "DE", lat: 52.52, lon: 13.405 },
  { city: "Bengaluru", country: "IN", lat: 12.9716, lon: 77.5946 },
  { city: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
];

interface OmResponse {
  current?: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    temperature_2m: number[];
  };
}

const CODE_LABELS: Record<number, string> = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Showers",
  81: "Showers",
  82: "Heavy showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

async function fetchCity(city: City): Promise<WeatherSpot> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(city.lat));
  url.searchParams.set("longitude", String(city.lon));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m"
  );
  url.searchParams.set("hourly", "temperature_2m");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Open-Meteo ${res.status} for ${city.city}`);
  const body = (await res.json()) as OmResponse;

  const current = body.current ?? {
    temperature_2m: 0,
    apparent_temperature: 0,
    weather_code: 0,
    wind_speed_10m: 0,
  };
  const hourly = body.hourly?.temperature_2m ?? [];

  return {
    city: city.city,
    country: city.country,
    tempC: current.temperature_2m,
    feelsC: current.apparent_temperature,
    code: current.weather_code,
    description: CODE_LABELS[current.weather_code] ?? "Unknown",
    windKmh: current.wind_speed_10m,
    hourly: hourly.slice(0, 24),
  };
}

export const revalidate = 600;

export async function GET(): Promise<NextResponse> {
  try {
    const spots = await Promise.all(CITIES.map(fetchCity));
    return NextResponse.json(ok(spots));
  } catch (error: unknown) {
    return NextResponse.json(fail(getErrorMessage(error)), { status: 502 });
  }
}
