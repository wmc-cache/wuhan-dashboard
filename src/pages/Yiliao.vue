<template>
  <main class="yiliao__grid">
    <!-- 顶部三块：参助性别 / 总指标概览 / 给付性别 -->
    <section class="mod" style="grid-area: tl;">
      <h3 class="mod__title">参助性别统计</h3>
      <div class="mod__body">占位：参助男女统计卡</div>
    </section>

    <section class="mod" style="grid-area: tc;">
      <h3 class="mod__title">总指标概览</h3>
      <div class="mod__body">占位：参与/给付金额、重大/住院、补助/结余 等指标</div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <h3 class="mod__title">给付性别统计</h3>
      <div class="mod__body">占位：给付男女统计卡</div>
    </section>

    <!-- 中部三块：参助年龄 / 中部预留 / 给付年龄 -->
    <section class="mod" style="grid-area: ml;">
      <h3 class="mod__title">参助年龄分布统计</h3>
      <div class="mod__body">占位：横向条形图（男女分组）</div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <h3 class="mod__title">（预留）</h3>
      <div class="mod__body">占位：可放趋势/占比图</div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <h3 class="mod__title">给付年龄分布统计</h3>
      <div class="mod__body">占位：横向条形图（男女分组）</div>
    </section>

    <!-- 底部三块：参助类型 / 给付疾病前类 / 给付类型 -->
    <section class="mod" style="grid-area: bl;">
      <h3 class="mod__title">参助类型统计</h3>
      <div class="mod__body">占位：住院/综合/重大 参与类型</div>
    </section>

    <section class="mod" style="grid-area: bc;">
      <h3 class="mod__title">给付疾病前类分布</h3>
      <div class="mod__body">占位：按疾病分类的柱状图</div>
    </section>

    <section class="mod" style="grid-area: br;">
      <h3 class="mod__title">给付类型统计</h3>
      <div class="mod__body">占位：住院/综合/重大 给付类型</div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 仅布局分区与占位，无具体数据逻辑
</script>

<style scoped lang="scss">
.yiliao__grid {
  height: 980px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 220px 360px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bc br';
  gap: 20px;
}

.mod {
  position: relative;
  border: none; /* 去掉虚线框 */
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
  place-items: center;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
</style>
