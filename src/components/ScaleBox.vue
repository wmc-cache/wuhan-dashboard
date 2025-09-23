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
  /* 仅保留全屏大背景，顶部横幅放回 Header 随舞台缩放，保证左右菜单对齐 */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  /* 1x 回退 */
  background-image: url('../images/bg/bg.png');
  /* 视网膜屏/高分屏 */
  background-image: -webkit-image-set(
    url('../images/bg/bg.png') 1x,
    url('../images/bg/bg@2x.png') 2x
  );
  background-image: image-set(
    url('../images/bg/bg.png') 1x,
    url('../images/bg/bg@2x.png') 2x
  );
}
.sb-stage {
  transform-origin: 50% 50%;
  box-sizing: border-box;
  overflow: hidden;
  will-change: transform;
}
</style>
