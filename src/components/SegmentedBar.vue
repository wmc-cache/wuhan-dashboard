<template>
  <!--
    Small horizontal bar used in the medical cards.
    Now supports two modes:
      - segment (default): N discrete blocks
      - smooth: continuous bar with 1% precision (uses scaleX to avoid sub‑pixel rounding)
  -->
  <div class="segmented-bar" :class="mode" role="img" :aria-label="ariaLabel">
    <!-- Segmented mode (10-block look in the design) -->
    <template v-if="mode === 'segment'">
      <span
        v-for="i in segTotal"
        :key="i"
        class="seg"
        :style="segStyle(i)"
      >
        <span class="fill"></span>
      </span>
    </template>
    <!-- Smooth mode: a single continuously filled pill -->
    <template v-else>
      <span class="track">
        <span class="fill" />
        <span v-if="showDot" class="dot" />
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
interface Props {
  // 百分比（0~1）
  percent: number;
  // 开启段数（默认 10 段）
  segTotal?: number;
  // 亮起段的颜色
  color?: string;
  // 无障碍描述，可选
  label?: string;
  // 展示模式：'segment' | 'smooth'
  mode?: 'segment' | 'smooth';
  // 固定宽度（px/百分比/auto）。建议传 px 以保证不同行长度一致
  width?: number | string;
  // 高度（px）
  height?: number;
  // 圆角半径（px）
  radius?: number;
  // 段间距（px，仅 segment 模式）
  gap?: number;
  // 是否使用渐变（从颜色到透明）
  gradient?: boolean;
  // 是否显示末端圆点
  showDot?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  segTotal: 10,
  color: '#2a6ff0',
  label: '',
  mode: 'segment',
  width: 100,
  height: 10,
  radius: 3,
  gap: 2,
  gradient: false,
  showDot: false
});

// 暴露给 <style> 使用的动态颜色变量
const color = computed(() => props.color);

const filled = computed(() => {
  const p = Math.max(0, Math.min(1, props.percent));
  return Math.round(p * props.segTotal);
});

const ariaLabel = computed(() =>
  props.label ? `${props.label}：${Math.round(props.percent * 100)}%` : `${Math.round(props.percent * 100)}%`
);

// 尺寸相关（通过 <style> 的 v-bind 注入为 CSS 变量）
const widthPx = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width);
const heightPx = computed(() => `${props.height}px`);
const radiusPx = computed(() => `${props.radius}px`);
const gapPx = computed(() => `${props.gap}px`);
// 用于 smooth 模式的缩放比例，取 1% 精度，避免浮点误差过多
const p = computed(() => {
  const clamped = Math.max(0, Math.min(1, props.percent || 0));
  // 保留两位小数（1% 粒度），但仍以小数参与 scaleX，浏览器可做亚像素渲染
  return Math.round(clamped * 100) / 100;
});

// 为每个段返回一个 '--f' 变量（0~1），表示该段的填充比例
function segStyle(i: number) {
  if (props.mode !== 'segment') return {};
  const clamped = Math.max(0, Math.min(1, props.percent || 0));
  const t = clamped * props.segTotal; // 总段中的进度
  const full = Math.floor(t);
  const part = Math.round((t - full) * 100) / 100; // 1% 精度
  let f = 0;
  if (i <= full) f = 1;
  else if (i === full + 1) f = part;
  return { '--f': String(f) } as any;
}
</script>

<style scoped lang="scss">
/* Common container */
.segmented-bar { width: v-bind(widthPx); height: v-bind(heightPx); }

/* Segmented mode: fixed width + equal sized cells to guarantee comparable length */
.segmented-bar.segment {
  display: grid;
  grid-template-columns: repeat(v-bind(segTotal), 1fr);
  align-items: center;
  column-gap: v-bind(gapPx);
}

.segmented-bar.segment .seg {
  width: 100%;
  height: 100%;
  border-radius: v-bind(radiusPx);
  background: transparent;
  overflow: hidden; /* 用于裁剪内部的 fill */
}

.segmented-bar.segment .seg .fill {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background: v-bind(color);
  transform-origin: left center;
  transform: scaleX(var(--f)); /* 0~1，支持 1% 精度 */
  border-radius: inherit;
}

/* Smooth mode: a single track with a scaled fill; 1% precision */
.segmented-bar.smooth .track {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: v-bind(radiusPx);
  background: transparent;
  overflow: hidden;
}

.segmented-bar.smooth .fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 100%;
  transform-origin: left center;
  transform: scaleX(v-bind(p));
  background: v-bind(color);
  border-radius: v-bind(radiusPx);
}

/* Gradient variant for smooth mode */
.segmented-bar.smooth .fill:has(~ .dot) {
  background: linear-gradient(to right, transparent, v-bind(color));
  
}

/* Dot at the end of the bar */
.segmented-bar.smooth .dot {
  position: absolute;
  top: 50%;
  left: calc(v-bind(p) * 100%);
  width: calc(v-bind(heightPx) + 4px);
    height: calc(v-bind(heightPx) + 4px);
  border-radius: 50%;
  background: white;
  transform: translate(-50%, -50%);
    z-index: 100000;
      border: 1px solid #fff;
}
</style>
