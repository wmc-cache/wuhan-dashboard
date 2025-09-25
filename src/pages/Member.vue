<template>
  <main class="member__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <h3 class="mod__title">会员性别分布统计</h3>
      <div class="mod__body">占位：男女总数与图卡</div>
    </section>

    <section class="mod" style="grid-area: tc;">
      <h3 class="mod__title">搜索 + 今日会员总数</h3>
      <div class="mod__body">占位：搜索框 + 当日会员总数</div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <h3 class="mod__title">会员民族分布统计</h3>
      <div class="mod__body">占位：环形图 + 图例</div>
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
      <div class="mod__body">占位：分区柱状</div>
    </section>

    <section class="mod" style="grid-area: br;">
      <h3 class="mod__title">新增会员</h3>
      <div class="mod__body">占位：列表/表格</div>
    </section>
  </main>
</template>

<script setup lang="ts">
import YearJoin from '../components/member/YearJoin.vue';
import MemberType from '../components/member/MemberType.vue';
import AgeDistribution from '../components/member/AgeDistribution.vue';

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

/* 模块通用外观：虚线框划分区域，与组织页保持一致 */
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
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
.mod__body > * { min-width: 0; min-height: 0; }
</style>
