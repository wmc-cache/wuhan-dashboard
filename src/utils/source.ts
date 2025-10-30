

function norm(v: any): string {
  if (v == null) return '';
  const s = String(v).trim();
  
  return s;
}


export function unionSourceLabel(v: any): string {
  switch (norm(v)) {
    case '0': return '湖北省总工会';
    case '1': return '全国法人登记';
    case '2': return '全国统计年报';
    case '3': return '劳模';
    case '4': return '医疗互助';
    case '5': return '困难救助';
    default: return v == null || v === '' ? '-' : String(v);
  }
}


export function memberSourceLabel(v: any): string {
  switch (norm(v)) {
    case '0': return '湖北省总工会';
    case '1': return '医疗互助';
    case '2': return '困难救助';
    case '3': return '劳模系统';
    default: return v == null || v === '' ? '-' : String(v);
  }
}

