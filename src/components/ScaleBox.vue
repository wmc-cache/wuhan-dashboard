<template>
  <div ref="wrap" class="sb-wrap">
    <div class="sb-stage" :style="stageStyle">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{ baseWidth: number; baseHeight: number }>();
const wrap = ref<HTMLDivElement | null>(null);
const scale = ref(1);

const calc = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const sx = w / props.baseWidth;
  const sy = h / props.baseHeight;
  scale.value = Math.min(sx, sy);
};

const stageStyle = computed(() => ({
  width: props.baseWidth + 'px',
  height: props.baseHeight + 'px',
  position: 'absolute',
  left: '50%',
  top: '50%',
  // 绝对居中 + 等比缩放，任何情况下都几何中心对齐
  transform: `translate(-50%, -50%) scale(${scale.value})`,
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
  /* 使用绝对居中，不依赖 grid 居中，避免不同浏览器对 transform 尺寸计算差异 */
  background: radial-gradient(80% 80% at 50% 30%, #f6fbff 0%, #e7f0ff 60%, #e4ecff 100%);
}
.sb-stage {
  transform-origin: 50% 50%;
  box-sizing: border-box;
  overflow: hidden;
  will-change: transform;
}
</style>
