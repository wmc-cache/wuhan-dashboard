export const API_BASE: string =
  (import.meta as any).env?.VITE_API_BASE || "/api";

// When backend says the session/token is invalid, redirect user to login.
// Use env override if provided; otherwise fall back to the IP given by the user.
const LOGIN_URL: string =
  (import.meta as any).env?.VITE_LOGIN_URL || 'http://172.16.188.42/login';

export interface ApiResponse<T = any> {
  code?: number;
  msg?: string;
  data?: T;
  [k: string]: any;
}

// 优先从 Cookie 中读取 Admin-Token；若无，再从 sessionStorage/localStorage 兜底。
// 兼容常见 key：'token'、'Token'、'Authorization'、'authorization'、'authToken'、'access_token'
function readCookie(name: string): string | undefined {
  try {
    if (typeof document === 'undefined' || !document.cookie) return undefined;
    const pairs = document.cookie.split(';');
    for (const p of pairs) {
      const [k, ...rest] = p.split('=');
      if (!k) continue;
      if (k.trim() === name) return decodeURIComponent(rest.join('=') || '').trim() || undefined;
    }
  } catch {
    // ignore
  }
  return undefined;
}

// 统一解析 token：Cookie(Admin-Token) -> sessionStorage -> localStorage
function resolveToken(): string | undefined {
  try {
    // 1) Cookie: Admin-Token
    const fromCookie = readCookie('Admin-Token');
    if (fromCookie) return fromCookie;

    // 2) Web Storage fallbacks
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

// Best‑effort cleanup + hard redirect to login (replace current page).
function redirectToLogin(): void {
  try {
    if (typeof window === 'undefined') return;
    const href = String(window.location?.href || '');
    if (href.startsWith(LOGIN_URL)) return; // avoid loops if already there

    // Clear common token storages so subsequent requests don't retry with bad creds
    const keys = ['token', 'Token', 'Authorization', 'authorization', 'authToken', 'access_token', 'Admin-Token'];
    try { keys.forEach(k => { try { localStorage.removeItem(k); } catch {} try { sessionStorage.removeItem(k); } catch {}; }); } catch {}
    try { keys.forEach(k => { document.cookie = `${k}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`; }); } catch {}

    // Replace current page so Back does not return to the protected view
    window.location.replace(LOGIN_URL);
  } catch {
    // ignore
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
    'Admin-Token': token,
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
  if (res.status === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json: ApiResponse<T> = await res.json().catch(() => ({} as any));
  if ((json as any)?.code === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
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
  if (res.status === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json: ApiResponse<T> = await res.json().catch(() => ({} as any));
  if ((json as any)?.code === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as unknown as T;
}

// POST application/x-www-form-urlencoded helper
export async function apiPostForm<T = any>(
  path: string,
  body?: Record<string, any>,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("http") ? path : API_BASE.replace(/\/$/, "") + path;
  const params = new URLSearchParams();
  if (body && typeof body === 'object') {
    Object.entries(body).forEach(([k, v]) => {
      if (v == null) return;
      params.set(k, String(v));
    });
  }
  const res = await fetch(url, {
    method: "POST",
    body: params,
    headers: withAuthHeaders({
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      ...(init?.headers || {}),
    }),
    ...init,
  });
  if (res.status === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const json: ApiResponse<T> = await res.json().catch(() => ({} as any));
  if ((json as any)?.code === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
  if (json && typeof json === "object" && "data" in json) return json.data as T;
  return json as unknown as T;
}

// POST and expect binary (blob/stream). Return the raw Response so callers
// can read headers like Content-Disposition to infer filename.
export async function apiPostBlob(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<Response> {
  const url = path.startsWith("http") ? path : API_BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    method: "POST",
    body: body != null ? JSON.stringify(body) : undefined,
    headers: withAuthHeaders({
      Accept: "*/*",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    }),
    ...init,
  });
  if (res.status === 401) { redirectToLogin(); throw new Error(`HTTP 401 Unauthorized`); }
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res;
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
