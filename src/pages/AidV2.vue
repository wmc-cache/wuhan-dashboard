<template>
  <main class="aidv2__grid">
    <!-- 左上：类型分布 -->
    <section class="mod" style="grid-area: lt;">
      <div class="mod__head"><h3 class="mod__title">类型分布（占位）</h3></div>
      <div class="mod__body"><div class="ph ph--bars" /></div>
    </section>

    <!-- 中部：总数 + 中心插画（占位），跨两行 -->
    <section class="mod mod--tall" style="grid-area: cm;">
      <div class="mod__head"><h3 class="mod__title">帮扶职工总数（占位）</h3></div>
      <div class="mod__body mod__body--full">
        <div class="ph ph--counter">1 1 1 2 1 1</div>
        <div class="ph ph--center-illust" />
      </div>
    </section>

    <!-- 右上：性别/年龄分布 -->
    <section class="mod" style="grid-area: rt;">
      <div class="mod__head"><h3 class="mod__title">性别 / 年龄分布（占位）</h3></div>
      <div class="mod__body"><div class="ph ph--hbars" /></div>
    </section>

    <!-- 左下：档案类别（使用 HonorRingsChart 实现环图） -->
    <section class="mod" style="grid-area: lb;">
      <div class="mod__head"><h3 class="mod__title">帮扶职工档案类别</h3></div>
      <div class="mod__body mod__body--full">
        <HonorRingsChart :items="archiveItems" center-text="档案分类" :center="['50%','56%']" :gap-deg="10" :base-start="20" :sweep-angle="260" />
      </div>
    </section>

    <!-- 中下：致困原因柱状图（使用 StripedBarChart） -->
    <section class="mod" style="grid-area: cb;">
      <div class="mod__head"><h3 class="mod__title">帮扶职工致困原因</h3></div>
      <div class="mod__body mod__body--full">
        <StripedBarChart
          :categories="causeCats"
          :values="causeVals"
          y-unit="人次"
          :yMax="1200"
          :gridLeft="64" :gridRight="20" :gridTop="25" :gridBottom="40"
          :barWidth="40" :stripeWidth="28" :stripeHeight="14"
          :stripeGap="2" :showLabels="false" :enableTooltip="true"
          stripeColor="#6EA8FF" axisColor="rgba(67,127,255,0.35)"
          textColor="rgba(25, 90, 200, 0.95)" gridLineColor="rgba(67,127,255,0.22)"
        />
      </div>
    </section>

    <!-- 右下：覆盖类别指标占位（竖排 3 个） -->
    <section class="mod" style="grid-area: rb;">
      <div class="mod__head"><h3 class="mod__title">覆盖情况（占位）</h3></div>
      <div class="mod__body">
        <div class="ph-list">
          <div class="ph ph--ring"></div>
          <div class="ph ph--ring"></div>
          <div class="ph ph--ring"></div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import HonorRingsChart from '../components/HonorRingsChart.vue';
import StripedBarChart from '../components/StripedBarChart.vue';

// 档案类别环图数据（示例）
const archiveItems = [
  { name: '存量档案', value: 234546, color: '#FDB94E' },
  { name: '增量档案', value: 47885, color: '#4E8FFF' },
  { name: '返回档案', value: 47885, color: '#6FD9C9' }
];

// 致困原因柱状图
const causeCats = ['本人失业', '供养直系亲属负担', '本人疾病', '家属疾病'];
const causeVals = [1080, 720, 860, 1180];
</script>

<style scoped lang="scss">
.aidv2__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 320px 1fr 1fr;
  grid-template-areas:
    'lt cm rt'
    'lb cm rb'
    'lb cb rb';
  gap: 10px;
}

/* 模块外框与 Refund 一致 */
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod--tall::before { background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); }

.mod__title { margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #2a6ff0; letter-spacing: 1px; }
.mod__body { overflow: hidden; display: grid; }

/* 占位图形：用中性颜色 + 虚线边框表达结构 */
.ph { border: 2px dashed rgba(0, 120, 255, .35); border-radius: 10px; background: rgba(80, 150, 255, .06); }
.ph--bars { height: 100%; }
.ph--hbars { height: 100%; }
.ph--columns { height: 100%; }
.ph--donut { height: 100%; border-radius: 50%; }
.ph--counter { align-self: start; justify-self: center; margin-top: 4px; padding: 8px 12px; border-radius: 8px; font-weight: 900; color: #2a6ff0; border: 2px dashed rgba(0, 120, 255, .35); }
.ph--center-illust { align-self: center; justify-self: center; width: 72%; aspect-ratio: 1 / .62; }
.ph--ring { height: 96px; border-radius: 50%; }

.ph-list { height: 100%; display: grid; align-content: space-evenly; justify-items: center; row-gap: 10px; }
</style>
