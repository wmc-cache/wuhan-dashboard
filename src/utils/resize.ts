export function throttle<T extends (...args: any[]) => void>(fn: T, wait = 100) {
  let t = 0; let last = 0; let ctx: any; let args: any[];
  const later = () => { last = Date.now(); t = 0; fn.apply(ctx, args); };
  return function(this: any, ...a: any[]) {
    ctx = this; args = a;
    const now = Date.now();
    const remain = wait - (now - last);
    if (remain <= 0 || remain > wait) {
      if (t) { clearTimeout(t); t = 0; }
      last = now; fn.apply(ctx, args);
    } else if (!t) { t = window.setTimeout(later, remain); }
  } as T;
}
