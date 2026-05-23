export interface HnStory {
  id: number;
  title: string;
  url: string | null;
  score: number;
  by: string;
  descendants: number;
  time: number;
  domain: string | null;
}

export interface RepoTrend {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  language: string | null;
  url: string;
  createdAt: string;
  pushedAt: string;
}

export interface MarketTick {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  spark: number[];
}

export interface WeatherSpot {
  city: string;
  country: string;
  tempC: number;
  feelsC: number;
  code: number;
  description: string;
  windKmh: number;
  hourly: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  fetchedAt: number;
}
