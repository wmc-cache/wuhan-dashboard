<template>
  <main class="member__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <h3 class="mod__title">会员性别分布统计</h3>
      <div class="mod__body">
        <GenderDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: tc;">
      <div class="mod__body">
        <SearchTodayTotal />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <h3 class="mod__title">会员民族分布统计</h3>
      <div class="mod__body">
        <EthnicDistribution />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <h3 class="mod__title">会员年龄分布统计</h3>
      <div class="mod__body">
        <AgeDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <h3 class="mod__title">年入会数统计</h3>
      <div class="mod__body">
        <YearJoin :initial-year="2023" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <h3 class="mod__title">会员类型统计</h3>
      <div class="mod__body">
        <MemberType />
      </div>
    </section>

    <!-- 底部：左通栏 + 右表格 -->
    <section class="mod" style="grid-area: bl;">
      <h3 class="mod__title">会员区域分布</h3>
      <div class="mod__body">
        <RegionDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <div class="mod__body">
        <MemberNew />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import YearJoin from '../components/member/YearJoin.vue';
import MemberType from '../components/member/MemberType.vue';
import AgeDistribution from '../components/member/AgeDistribution.vue';
import EthnicDistribution from '../components/member/EthnicDistribution.vue';
import RegionDistribution from '../components/member/RegionDistribution.vue';
import MemberNew from '../components/member/MemberNew.vue';
import GenderDistribution from '../components/member/GenderDistribution.vue';
import SearchTodayTotal from '../components/member/SearchTodayTotal.vue';

</script>

<style scoped lang="scss">
/* 页面 3 列栅格：左右 540，中间自适应；行高对齐原型 */
.member__grid {
  height: 980px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 220px 360px 1fr;
  /* 顶 220，中 360，底自适应 */
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bl br';
  gap: 20px;
}

/* 模块通用外观：去掉虚线框，保留圆角与背景 */
.mod {
  position: relative;
  border: none;
  border-radius: 10px;
  background: rgba(235, 241, 247, 0.74); /* 设计标注：#EBF1F7 74% */
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
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
.mod__body > * { min-width: 0; min-height: 0; }
</style>
