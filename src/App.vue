<template>
  <!-- 等比缩放容器，基于 1920x1080 设计稿 -->
  <ScaleBox :base-width="1920" :base-height="1080">
    <!-- 全局 Element Plus 语言：中文 -->
    <el-config-provider :locale="zhCn">
      <div class="dash">
        <!-- 背景/顶部动效层（置于所有内容之下） -->
        <HeaderBar />
        <MotionLayer />
        <router-view />
      </div>
    </el-config-provider>
  </ScaleBox>
</template>

<script setup lang="ts">
import ScaleBox from './components/ScaleBox.vue';
import HeaderBar from './components/HeaderBar.vue';
import MotionLayer from './components/motion/MotionLayer.vue';
// Element Plus 中文
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/es/components/config-provider/style/css';
</script>

<style>
html, body, #app { height: 100%; }
/* 去除浏览器默认 8px 外边距，避免左右留白 */
body { margin: 0; background: #eaf2ff; }
</style>

<style scoped lang="scss">
/* 舞台根容器（匹配设计稿 1920x1080） */
.dash {
  width: 1920px;
  height: 1080px;
  color: #0b4aa2;
  font-family: "DIN", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  position: relative;
}
</style>
