<template>
  <div class="wuhan-map">
    <!-- 占位：武汉地图图层 -->
    <div class="placeholder">待接入：武汉地图</div>
  </div>
</template>

<script setup lang="ts">
// TODO: 接入地图（ECharts geoJSON 或第三方底图）
</script>

<style scoped lang="scss">
.wuhan-map { position: relative; height: 100%; }
.placeholder { height: 100%; display: grid; place-items: center; color: #3a6ee8; font-size: 20px; opacity: 0.7; }
</style>

