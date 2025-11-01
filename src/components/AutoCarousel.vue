<template>
  <div
    class="auto-carousel"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <transition name="fade" mode="out-in">
      <component
        :is="current.component"
        v-bind="current.props || {}"
        :key="current.key"
        class="slide"
      />
    </transition>
    <div v-if="showDots && slides.length > 1" class="dots">
      <button
        v-for="(s, i) in slides"
        :key="s.key || i"
        class="dot"
        :class="{ active: i === stateIndex }"
        @click="go(i)"
        aria-label="切换轮播"
      />
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Slide = {
  key?: string;
  component: any; // Vue component
  props?: Record<string, any> | undefined;
};

interface Props {
  slides: Slide[];
  interval?: number; // ms
  autoplay?: boolean;
  pauseOnHover?: boolean;
  modelValue?: number; // current index (v-model)
  showDots?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  slides: () => [],
  interval: 6000,
  autoplay: true,
  pauseOnHover: true,
  modelValue: 0,
  showDots: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void;
  (e: 'change', v: number): void;
}>();

const stateIndex = ref<number>(Math.max(0, Math.min(props.modelValue, Math.max(0, props.slides.length - 1))));
let timer: number | undefined;

const total = computed(() => props.slides.length);
const current = computed(() => props.slides[stateIndex.value] || { component: null, props: {}, key: 'empty' });

function start() {
  stop();
  if (!props.autoplay || total.value <= 1) return;
  timer = window.setInterval(next, Math.max(1500, props.interval));
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

function next() { go((stateIndex.value + 1) % Math.max(1, total.value)); }
function go(i: number) {
  const idx = (Number(i) || 0) % Math.max(1, total.value);
  stateIndex.value = idx;
  emit('update:modelValue', idx);
  emit('change', idx);
}

function onHover(enter: boolean) {
  if (!props.pauseOnHover) return;
  enter ? stop() : start();
}

watch(() => props.modelValue, (v) => {
  const idx = Math.max(0, Math.min(Number(v) || 0, Math.max(0, total.value - 1)));
  if (idx !== stateIndex.value) stateIndex.value = idx;
});

watch(() => props.slides, () => {
  // 重启以适配新的 slides
  start();
});

onMounted(start);
onBeforeUnmount(stop);
</script>

<style scoped lang="scss">
.auto-carousel { position: relative; height: 100%; display: grid; }
.slide { min-height: 0; min-width: 0; }

/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active { transition: opacity .4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.dots { position: absolute; right: 10px; bottom: 8px; display: inline-flex; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(120,160,255,.35); border: 0; padding: 0; cursor: pointer; }
.dot.active { background: rgba(42,111,240,0.95); box-shadow: 0 0 8px rgba(42,111,240,0.45); }
</style>

