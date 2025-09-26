<template>
  <main class="org__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <h3 class="mod__title">工会总数</h3>
      <div class="mod__body">
        <OrgTotal :tile-width="60" :tile-height="54" :font-size="44" />
      </div>
    </section>

    <section class="mod" style="grid-area: tc;">
      <h3 class="mod__title">搜索 + 指标卡</h3>
      <div class="mod__body">占位：搜索框与三张指标卡</div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <h3 class="mod__title">工会会员总数</h3>
      <div class="mod__body">占位：会员总数图卡</div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <div class="mod__body">
        <OrgNew />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <h3 class="mod__title">年度工会创建数</h3>
      <div class="mod__body">
        <YearCreate :initial-year="2023" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <h3 class="mod__title">工会会员数</h3>
      <div class="mod__body">
        <MemberCount :centerNudgePx="-100" />
      </div>
    </section>

    <!-- 底部通栏 -->
    <section class="mod" style="grid-area: bl;">
      <h3 class="mod__title">工会区域分布</h3>
      <div class="mod__body">
        <OrgRegionDistribution />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 引入年度工会创建数图表与工会会员数
import YearCreate from '../components/org/YearCreate.vue';
import MemberCount from '../components/org/MemberCount.vue';
import OrgTotal from '../components/org/OrgTotal.vue';
import OrgNew from '../components/org/OrgNew.vue';
import OrgRegionDistribution from '../components/org/RegionDistribution.vue';
</script>

<style scoped lang="scss">
/* 页面 3 列栅格，参照原型占比：左右固定，中间自适应 */
.org__grid {
  height: 980px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px; /* 左右 540，中间自适应 */
  grid-template-rows: 220px 360px 1fr; /* 顶 220、中 360、下自适应 */
  /* 让右侧“工会会员数”跨两行，底部“工会区域分布”占据两列 */
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bl mr';
  gap: 20px;
}

/* 模块通用卡片，用虚线边框划分区域 */
.mod {
  position: relative;
  border: 2px dashed rgba(88, 151, 255, 0.8);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.45);
  box-shadow: inset 0 0 40px rgba(120, 170, 255, 0.08);
  padding: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod__title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2a6ff0;
}

.mod__body {
  display: grid;
  /* 让图表/组件横向拉伸，避免被居中挤窄 */
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
.mod__body > * { min-width: 0; min-height: 0; }
</style>
