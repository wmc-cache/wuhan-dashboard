<template>
  <div class="overview" @click="onClick">
    <div class="center-pic" aria-label="经费返还概览插图" />
  </div>
  
</template>

<script setup lang="ts">
// 仅保留年份 prop，以后接数据时可用
interface Props { year: number }
defineProps<Props>();
const emit = defineEmits<{ (e: 'open-detail', payload: { x: number; y: number }): void }>();

function onClick(e: MouseEvent) {
  emit('open-detail', { x: e.clientX, y: e.clientY });
}
</script>

<style scoped lang="scss">
.overview { position: relative; height: 100%; display: grid; place-items: center; }

/* 中心大图：使用 image-set 适配 1x/2x，避免 <img srcset> 与空格文件名的打包问题 */
.center-pic {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: -webkit-image-set(
    url('../../images/refund/center-pie/编组 3.png') 1x,
    url('../../images/refund/center-pie/编组 3@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/refund/center-pie/编组 3.png') 1x,
    url('../../images/refund/center-pie/编组 3@2x.png') 2x
  );
}
</style>
