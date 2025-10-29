<template>
  <!--
    Global motion effects layer.
    - Renders decorative Lottie animations behind the app content.
    - Currently targets the Dashboard route only (1首页/* JSONs).
    - Pointer-events are disabled; z-index sits behind HeaderBar and pages.
  -->
  <div class="effects" aria-hidden="true">
    <!-- Dashboard 背景光束（底部中间矩形区域） -->
    <!-- <LottiePlayer
      v-if="isDashboard"
      class="effects__bg"
      src="1首页/背景.json"
      renderer="svg"
      :loop="true"
      :autoplay="true"
      :speed="1"
      :x="bgX"
      :y="bgY"
      :width="bgW"
      :height="bgH"
    /> -->
    <!-- Dashboard 顶部装饰，与 Header 高度一致 -->
    <!-- <LottiePlayer class="effects__top" src="1首页/top.json" renderer="svg" :loop="true" :autoplay="true" :speed="1" :height="110" /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LottiePlayer from './LottiePlayer.vue';

const route = useRoute();
const isDashboard = computed(() => (route.name as string) === 'dashboard');

// 舞台 1920x1080；Header 高 110，内容区 970。
// 将“背景.json”定位在底部中间的大矩形区域（近似红框）。
const bgW = 820; // 宽度
const bgH = 240;  // 高度
const bgX = Math.round((1920 - bgW) / 2-12); // 居中
const bgY = 1080 - bgH + 40;               // 底部留 40px 边距
</script>

<style scoped>
.effects { 
  position: absolute; inset: 0; z-index: 0; pointer-events: none;

}
.effects__bg { position: absolute; /* left/top/size 由组件 props 控制 */ }
.effects__top { position: absolute; left: 0; top: 0; width: 100%; }
</style>
