<template>
  <main class="laomo__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <h3 class="mod__title">劳模民族分布统计</h3>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoEthnicDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: tc;">
      <h3 class="mod__title">四项总数指标</h3>
      <div class="mod__body">占位：劳模总数/退休劳模总数/特困劳模数/低收入人群总数</div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <h3 class="mod__title">劳模人员性别分布统计</h3>
      <div class="mod__body">占位：男女占比图卡</div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <h3 class="mod__title">荣誉分类统计</h3>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoHonorDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <h3 class="mod__title">劳模收入情况统计</h3>
      <div class="mod__body">占位：面积/折线图（收入区间）</div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <h3 class="mod__title">劳模年龄分布统计</h3>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoAgeDistribution />
      </div>
    </section>

    <!-- 底部：左表格 + 右通栏图 -->
    <section class="mod" style="grid-area: bl;">
      <div class="mod__body" style="place-items: stretch;">
        <LaomoMemberNew />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <h3 class="mod__title">劳模区域分布</h3>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoRegionDistribution />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import LaomoMemberNew from '../components/laomo/MemberNew.vue';
import LaomoEthnicDistribution from '../components/laomo/EthnicDistribution.vue';
import LaomoAgeDistribution from '../components/laomo/AgeDistribution.vue';
import LaomoRegionDistribution from '../components/laomo/RegionDistribution.vue';
import LaomoHonorDistribution from '../components/laomo/HonorClassification.vue';
</script>

<style scoped lang="scss">
.laomo__grid {
  height: 980px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 220px 360px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl br br';
  gap: 20px;
}

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
  place-items: center;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
</style>
