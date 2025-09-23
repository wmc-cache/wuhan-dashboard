<template>
  <div class="dash">
    <HeaderBar />

    <main class="dash__main">
      <section class="col col--left">
        <div class="panel h180">工会组织总数</div>
        <div class="panel h360">工会行业分布</div>
        <div class="panel h300">新增工会</div>
      </section>

      <section class="col col--center">
        <div class="panel panel--map h860">武汉地图</div>
      </section>

      <section class="col col--right">
        <div class="panel h180">工会会员总数</div>
        <div class="panel h360">工会会员新增</div>
        <div class="panel h300">新增会员</div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '../components/HeaderBar.vue';
</script>

<style scoped lang="scss">
/* 设计稿参考尺寸：1920x1080 */
.dash {
  width: 1920px;
  height: 1080px;
  color: #0b4aa2;
  font-family: "DIN", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  position: relative;
}
.dash__main {
  display: grid;
  grid-template-columns: 540px 1fr 540px; /* 左右固定，中间地图自适应 */
  gap: 20px;
  padding: 0 20px 20px;
  height: 980px;
}
.col {
  display: grid;
  grid-template-rows: 180px 360px 1fr;
  gap: 20px;
}
.col--center { grid-template-rows: 860px; }
.panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(236,245,255,0.85));
  border: 1px solid rgba(67,127,255,0.25);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(45,110,255,0.12), inset 0 1px 0 rgba(255,255,255,0.7);
  padding: 16px;
}
.panel--map { background: radial-gradient(70% 70% at 50% 40%, #f2f7ff 0%, #e8f0ff 100%); }
.h180 { height: 180px; }
.h300 { height: 300px; }
.h360 { height: 360px; }
.h860 { height: 860px; }
</style>
