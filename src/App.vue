<template>
  <!-- 等比缩放容器，基于 1920x1080 设计稿 -->
  <ScaleBox :base-width="1920" :base-height="1080">
    <Dashboard />
  </ScaleBox>
</template>

<script setup lang="ts">
import ScaleBox from './components/ScaleBox.vue';
import Dashboard from './pages/Dashboard.vue';
</script>

<style>
html, body, #app { height: 100%; }
/* 去除浏览器默认 8px 外边距，避免左右留白 */
body { margin: 0; background: #eaf2ff; }
</style>
