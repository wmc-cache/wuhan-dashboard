// Simple dict helper: fetch and cache dicts by type
// API: GET /business/dict/list?dictType=xxx
import { apiGet } from './api';

export type DictItem = { label: string; value: string | number };

const memCache: Record<string, DictItem[]> = {};

function normalize(arr: any[]): DictItem[] {
  return (arr || []).map((it: any) => ({
    // 支持后端多种字段：dictName/dictLabel/label/name
    label: it?.dictName ?? it?.dictLabel ?? it?.label ?? it?.name ?? String(it?.value ?? it?.dictValue ?? ''),
    // value 以 dictValue 优先
    value: (it?.dictValue ?? it?.value ?? it?.code ?? it?.key ?? '') as any,
  }));
}

export async function getDict(dictType: string): Promise<DictItem[]> {
  if (memCache[dictType]) return memCache[dictType];
  try {
    const url = `/business/dict/list?dictType=${encodeURIComponent(dictType)}`;
    const resp: any = await apiGet<any>(url).catch(() => null);
    const arr = Array.isArray(resp?.rows)
      ? resp.rows
      : Array.isArray(resp?.data)
      ? resp.data
      : Array.isArray(resp)
      ? resp
      : [];
    memCache[dictType] = normalize(arr);
  } catch {
    memCache[dictType] = [];
  }
  return memCache[dictType];
}

export function labelOf(dictType: string, value: any, fallback?: string): string {
  const list = memCache[dictType] || [];
  const found = list.find((d) => String(d.value) === String(value));
  const f = fallback ?? (value == null || value === '' ? '' : String(value));
  return found?.label ?? f;
}
