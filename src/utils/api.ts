export const API_BASE: string =
  (import.meta as any).env?.VITE_API_BASE || "/api";

export interface ApiResponse<T = any> {
  code?: number;
  msg?: string;
  data?: T;
  [k: string]: any;
}

// 从 sessionStorage 优先获取 token，找不到再从 localStorage 获取
// 兼容常见 key：'token'、'Token'、'Authorization'、'authorization'、'authToken'、'access_token'
function resolveToken(): string | undefined {
  try {
    const keys = ['token', 'Token', 'Authorization', 'authorization', 'authToken', 'access_token'];
    const pick = (store: Storage) => {
      for (const k of keys) {
        const v = store.getItem(k);
        if (v && v.trim()) return v.trim();
      }
      return undefined;
    };
    const fromSession = typeof sessionStorage !== 'undefined' ? pick(sessionStorage) : undefined;
    if (fromSession) return fromSession;
    const fromLocal = typeof localStorage !== 'undefined' ? pick(localStorage) : undefined;
    return fromLocal;
  } catch {
    return undefined;
  }
}

function withAuthHeaders(base?: HeadersInit): HeadersInit {
  const token = resolveToken();
  if (!token) return base || {};
  const bearer = /^Bearer\s/i.test(token) ? token : `Bearer ${token}`;
  return {
    // 默认加上 Authorization 与常见自定义 token 头；允许调用处覆盖
    Authorization: bearer,
    token,
    ...(base || {}),
  } as HeadersInit;
}

export async function apiGet<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : API_BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    method: "GET",
    ...init,
    headers: withAuthHeaders({ Accept: "application/json", ...(init?.headers || {}) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json: ApiResponse<T> = await res.json().catch(() => ({} as any));
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as unknown as T;
}

// POST JSON helper
export async function apiPost<T = any>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : API_BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    method: "POST",
    body: body != null ? JSON.stringify(body) : undefined,
    headers: {
      ...withAuthHeaders({
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      }),
    },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json: ApiResponse<T> = await res.json().catch(() => ({} as any));
  if (json && typeof json === "object" && "data" in json) return json.data as T;
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
