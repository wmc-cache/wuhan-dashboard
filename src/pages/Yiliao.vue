<template>
  <main class="yiliao__grid">
    <!-- 顶部三块：参助性别 / 总指标概览 / 给付性别 -->
    <section class="mod" style="grid-area: tl;">
      <div class="mod__body mod__body--full">
        <GenderStat />
      </div>
    </section>

    <!-- 中央大卡：合并原“总指标概览 + （预留）”两块，纵向跨两行 -->
    <section class="mod mod--tall metrics" style="grid-column: 2; grid-row: 1 / span 2;">
      <div></div>
      <div class="mod__body mod__body--full">
        <OverallOverview />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <div class="mod__body mod__body--full">
        <PayoutGenderStat />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <div></div>
      <div class="mod__body mod__body--full">
        <JoinAgeStat />
      </div>
    </section>



    <section class="mod" style="grid-area: mr;">
      <div></div>
      <div class="mod__body mod__body--full">
        <PayoutAgeDist />
      </div>
    </section>

    <!-- 底部三块：参助类型 / 给付疾病前类 / 给付类型 -->
    <section class="mod" style="grid-area: bl;">
      <div class="mod__body mod__body--full">
        <JoinTypeStat />
      </div>
    </section>

    <section class="mod" style="grid-area: bc;">
      <div></div>
      <div class="mod__body mod__body--full">
        <DiseaseCategoryDist />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <div class="mod__body mod__body--full">
        <PayoutTypeStat />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 仅布局分区与占位，无具体数据逻辑
import GenderStat from '../components/yiliao/GenderStat.vue';
import PayoutGenderStat from '../components/yiliao/PayoutGenderStat.vue';
import JoinTypeStat from '../components/yiliao/JoinTypeStat.vue';
import JoinAgeStat from '../components/yiliao/JoinAgeStat.vue';
import PayoutTypeStat from '../components/yiliao/PayoutTypeStat.vue';
import PayoutAgeDist from '../components/yiliao/PayoutAgeDist.vue';
import DiseaseCategoryDist from '../components/yiliao/DiseaseCategoryDist.vue';
import OverallOverview from '../components/yiliao/OverallOverview.vue';
</script>

<style scoped lang="scss">
.yiliao__grid {
  /* 所有模块平均减高：每行各减少 20px（顶/中/底），整体高度 -60px */
  height: 930px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 210px 330px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bc br';
  /* 模块间距统一为 10px */
  gap: 10px;
}

.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod--tall::before { background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); }
.mod--wide::before { background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x); }

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

/* 去除左上模块默认居中与文案颜色影响，让子组件占满 */
.mod__body--full { place-items: stretch; color: inherit; }
</style>
