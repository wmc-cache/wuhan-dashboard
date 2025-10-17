<template>
  <div ref="wrap" class="sb-wrap" :style="wrapStyle">
    <div class="sb-stage" :style="stageStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, withDefaults } from 'vue';

const props = withDefaults(defineProps<{
  baseWidth: number;
  baseHeight: number;
  /**
   * fit="contain"（默认）保持舞台完整可见；
   * fit="width" 在超宽屏下横向拉伸舞台，减少两侧留白。
   */
  fit?: 'contain' | 'width';
  /**
   * 限制横向拉伸的最大倍数（1 表示不拉伸，1.2 表示最多额外拉宽 20%）。
   */
  maxStretchX?: number;
}>(), {
  fit: 'contain',
  maxStretchX: 1.2,
});
const wrap = ref<HTMLDivElement | null>(null);
const scale = ref(1);
const stageTop = ref(0); // 顶部与视口的间距，便于让顶部横幅与舞台对齐
const viewportWidth = ref(Number.POSITIVE_INFINITY);
const calc = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  viewportWidth.value = w;
  const sx = w / props.baseWidth;
  const sy = h / props.baseHeight;
  scale.value = Math.min(sx, sy);
  // 由于舞台是 translate(-50%, -50%) 居中，这里计算实际可见的顶部偏移，
  // 让 .sb-wrap 的顶部装饰条能够与舞台顶部完全对齐。
  stageTop.value = Math.max(0, (h - props.baseHeight * scale.value) / 2);
};

const stretchX = computed(() => {
  if (props.fit !== 'width') return 1;
  const sx = viewportWidth.value / props.baseWidth;
  const base = scale.value;
  if (!Number.isFinite(sx) || sx <= 0 || sx <= base) return 1;
  const ratio = sx / base;
  return Math.min(ratio, props.maxStretchX);
});

const stageStyle = computed(() => ({
  width: props.baseWidth + 'px',
  height: props.baseHeight + 'px',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transformOrigin: '50% 50%',
  // fit="width" 时额外进行横向 scaleX 拉伸以减少留白
  transform: stretchX.value > 1
    ? `translate(-50%, -50%) scale(${scale.value}) scaleX(${stretchX.value})`
    : `translate(-50%, -50%) scale(${scale.value})`,
}));

// 把缩放比例与舞台顶部偏移暴露给 CSS，用于绘制“贯穿全屏”的顶部横幅
const wrapStyle = computed(() => ({
  // 注意：CSS 变量需要字符串
  ['--sb-scale' as any]: String(scale.value),
  ['--sb-stage-top' as any]: stageTop.value + 'px',
}));

onMounted(() => {
  calc();
  window.addEventListener('resize', calc);
});

onUnmounted(() => {
  window.removeEventListener('resize', calc);
});
</script>

<style scoped>
.sb-wrap {
  position: fixed;
  inset: 0;
  /* 仅保留全屏大背景，顶部横幅放回 Header 随舞台缩放，保证左右菜单对齐 */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  /* 1x 回退 */
  background-image: url('../images/home/home-bg/背景.png');
  /* 视网膜屏/高分屏 */
  background-image: -webkit-image-set(
    url('../images/home/home-bg/背景.png') 1x,
      url('../images/home/home-bg/背景@2x.png') 2x);
      background-image: image-set(url('../images/home/home-bg/背景.png') 1x,
          url('../images/home/home-bg/背景@2x.png') 2x);
}

/* 顶部“标题横幅”需要横向撑满整个视口，否则宽屏下两侧会露底。
   这里在全屏容器上增加一个伪元素来绘制横幅，将其高度按缩放比例计算，
   与舞台顶部对齐。 */
/*  */   
.sb-wrap::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
 
  top: var(--sb-stage-top, 0px);
  height: calc(110px * var(--sb-scale, 1));
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
  
  background-image: url('../images/top/top.png');
  
  background-image: -webkit-image-set(
    url('../images/top/top.png') 1x,
    url('../images/top/top@2x.png') 2x
  );
  background-image: image-set(
    url('../images/top/top.png') 1x,
    url('../images/top/top@2x.png') 2x
  );
  pointer-events: none;
  z-index: 0;
}
.sb-stage {
  transform-origin: 50% 50%;
  box-sizing: border-box;
  overflow: hidden;
  position: absolute;
  z-index: 1; /* 高于 ::before 的横幅背景 */
  will-change: transform;
}
</style>
