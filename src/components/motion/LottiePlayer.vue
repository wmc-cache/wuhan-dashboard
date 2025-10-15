<template>
  <!--
    Lightweight Lottie wrapper.
    - Renders an animation JSON from src/motioneffects/*
    - Non-interactive decoration: pointer-events disabled by default
  -->
  <div
    ref="box"
    class="lottie-box"
    :style="{
      width: typeof width === 'number' ? width + 'px' : (width || '100%'),
      height: typeof height === 'number' ? height + 'px' : (height || '100%'),
      pointerEvents: 'none'
    }"
  ></div>
  
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Renderer = 'svg' | 'canvas';
interface Props {
  // Relative path under src/motioneffects, e.g. '1首页/背景.json'
  src: string;
  renderer?: Renderer;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number; // 1.0 by default
  width?: number | string; // optional explicit size; default 100%
  height?: number | string; // optional explicit size; default 100%
  // Optional absolute positioning (px) relative to parent
  x?: number;
  y?: number;
  // When true, set box size to JSON's intrinsic w/h (optionally scaled)
  lockToJsonSize?: boolean;
  scale?: number; // only used when lockToJsonSize
}

const props = withDefaults(defineProps<Props>(), {
  renderer: 'svg',
  loop: true,
  autoplay: true,
  speed: 1,
  scale: 1,
});

const box = ref<HTMLDivElement | null>(null);
let anim: any | null = null;

// Resolve asset URL inside Vite pipeline
// Resolve to real file URL; lottie will fetch JSON directly
const jsonUrl = computed(() => new URL(`../../motioneffects/${props.src}`, import.meta.url).href);
// Use the UMD build directly via <script src="..."> (no ?url)
const vendorUrl = new URL('../../motioneffects/vendor/lottie.min.js', import.meta.url).href;

let vendorPromise: Promise<void> | null = null;
function ensureVendor(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any)?.lottie) return Promise.resolve();
  if (vendorPromise) return vendorPromise;
  vendorPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-lottie-vendor="1"]') as HTMLScriptElement | null;
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const s = document.createElement('script');
    s.src = vendorUrl;
    s.async = true;
    s.dataset.lottieVendor = '1';
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
  return vendorPromise;
}

async function mount() {
  await ensureVendor().catch(() => void 0);
  const lottie = (globalThis as any)?.lottie || (window as any)?.lottie;
  if (!lottie || !box.value) return;
  // Clean existing
  if (anim && anim.destroy) anim.destroy();
  anim = lottie.loadAnimation({
    container: box.value,
    renderer: props.renderer,
    loop: props.loop,
    autoplay: props.autoplay,
    path: jsonUrl.value,
  });
  if (props.speed && anim?.setSpeed) anim.setSpeed(props.speed);

  // Adjust size to JSON's intrinsic w/h if requested
  if (props.lockToJsonSize) {
    const onLoaded = () => {
      try {
        const d = anim?.animationData || {};
        const w = (d.w || 0) * (props.scale || 1);
        const h = (d.h || 0) * (props.scale || 1);
        if (w && h && box.value) {
          box.value.style.width = w + 'px';
          box.value.style.height = h + 'px';
        }
      } catch {}
    };
    anim.addEventListener?.('DOMLoaded', onLoaded);
  }
}

onMounted(mount);
onBeforeUnmount(() => { if (anim && anim.destroy) anim.destroy(); anim = null; });

watch(() => props.src, () => mount());
watch(() => props.renderer, () => mount());
watch(() => props.speed, (v) => { if (anim && anim.setSpeed) anim.setSpeed(v || 1); });

// Expose minimal control if needed in the future
defineExpose({ play: () => anim?.play?.(), pause: () => anim?.pause?.(), setSpeed: (v: number) => anim?.setSpeed?.(v) });

// Re-expose width/height for template binding
const width = computed(() => props.width);
const height = computed(() => props.height);
const leftPx = computed(() => (typeof props.x === 'number' ? props.x + 'px' : undefined));
const topPx = computed(() => (typeof props.y === 'number' ? props.y + 'px' : undefined));
</script>

<style scoped>
.lottie-box { display: block; position: absolute; left: v-bind(leftPx); top: v-bind(topPx); }
</style>
