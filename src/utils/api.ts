// Simple API helper for this project. Uses Vite env when available, falls back to the provided backend.
// Keep it tiny and framework-agnostic so components/pages can use it directly.

// Default to '/api' so dev uses Vite proxy; override via VITE_API_BASE for prod or other envs.
export const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || '/api';

export interface ApiResponse<T = any> {
  code?: number;
  msg?: string;
  data?: T;
  [k: string]: any;
}

export async function apiGet<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : API_BASE.replace(/\/$/, '') + path;
  const res = await fetch(url, { method: 'GET', ...init, headers: { 'Accept': 'application/json', ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json: ApiResponse<T> = await res.json().catch(() => ({} as any));
  // Many endpoints wrap payload at { code, msg, data }
  if (json && typeof json === 'object' && 'data' in json) return json.data as T;
  return json as unknown as T;
}

// Helpers
export function niceMax(nums: number[], fallback = 10): number {
  const max = Math.max(0, ...(nums || []));
  if (max <= 0) return fallback;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return Math.ceil(nice * mag);
}
