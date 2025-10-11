<template>
  <main class="laomo__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <span class="title-img title-img--laomo-3" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoHonorDistribution />
      </div>
    </section>

    <section style="grid-area: tc;">
      <div class="mod__body" style="place-items: stretch;margin-top: 50px;">
        <LaomoFourStats />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <!-- 图片标题：劳模人员性别分布统计（2/7） -->
      <span class="title-img title-img--laomo-2" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoGenderDistribution />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <!-- 标题替换为第 8 号切图；内容改为排行列表样式 -->
      <span class="title-img title-img--laomo-8" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoSubsidyStatsList />
      </div>

    </section>

    <section class="mod" style="grid-area: mc;">
      <!-- 图片标题：劳模收入情况统计（4/7） -->
      <span class="title-img title-img--laomo-4" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoIncomeDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">

      <span class="title-img title-img--laomo-5" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoAgeDistribution />
      </div>
    </section>

    <section class="mod " style="grid-area: bl;">
      <span aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoMemberNew />
      </div>
    </section>

    <section class="mod mod--wide" style="grid-area: br;">

      <span class="title-img title-img--laomo-7" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoRegionDistribution />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import LaomoMemberNew from '../components/laomo/MemberNew.vue';
// 民族模块改为排行列表
import LaomoSubsidyStatsList from '../components/laomo/SubsidyStatsList.vue';
import LaomoAgeDistribution from '../components/laomo/AgeDistribution.vue';
import LaomoRegionDistribution from '../components/laomo/RegionDistribution.vue';
import LaomoHonorDistribution from '../components/laomo/HonorClassification.vue';
import LaomoIncomeDistribution from '../components/laomo/IncomeDistribution.vue';
import LaomoFourStats from '../components/laomo/FourStats.vue';
import LaomoGenderDistribution from '../components/laomo/GenderDistribution.vue';
// 中间顶栏不再放搜索（已移至首页地图上方）
</script>

<style scoped lang="scss">
.laomo__grid {
  height: 970px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 320px 320px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl br br';
  gap: 0px;
}

.mod {
  position: relative;
  border: none;
  border-radius: 10px;
  background: none;
  padding: 18px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod::before {
  content: '';
  position: absolute;
  left: -4px;
    right: -4px;
    top: -4px;
    bottom: -4px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  pointer-events: none;
  z-index: -1;
}

.mod--tall::before {
  background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
}

.mod--wide::before {
  content: '';
    position: absolute;
    left: 0px;
    right: -4px;
    top: 0px;
    bottom: 0px;
  background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
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


.mod > .title-img { display: inline-block; margin-bottom: 8px; }
.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }


.title-img--laomo-1 { width: 192px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/1/编组 21.png') 1x, url('../images/laomo/font-title/1/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/1/编组 21.png') 1x, url('../images/laomo/font-title/1/编组 21@2x.png') 2x); }

.title-img--laomo-2 { width: 233px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/2/编组 21.png') 1x, url('../images/laomo/font-title/2/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/2/编组 21.png') 1x, url('../images/laomo/font-title/2/编组 21@2x.png') 2x); }

.title-img--laomo-3 { width: 152px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/3/编组 21.png') 1x, url('../images/laomo/font-title/3/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/3/编组 21.png') 1x, url('../images/laomo/font-title/3/编组 21@2x.png') 2x); }

.title-img--laomo-4 { width: 192px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/4/编组 21.png') 1x, url('../images/laomo/font-title/4/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/4/编组 21.png') 1x, url('../images/laomo/font-title/4/编组 21@2x.png') 2x); }

.title-img--laomo-5 { width: 192px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/5/编组 21.png') 1x, url('../images/laomo/font-title/5/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/5/编组 21.png') 1x, url('../images/laomo/font-title/5/编组 21@2x.png') 2x); }

.title-img--laomo-6 { width: 111px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/6/编组 21.png') 1x, url('../images/laomo/font-title/6/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/6/编组 21.png') 1x, url('../images/laomo/font-title/6/编组 21@2x.png') 2x); }

.title-img--laomo-7 { width: 152px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/7/编组 21.png') 1x, url('../images/laomo/font-title/7/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/7/编组 21.png') 1x, url('../images/laomo/font-title/7/编组 21@2x.png') 2x); }

.title-img--laomo-8 { width: 253px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); }

/* 顶部搜索条容器（跟 Home 页面保持一致宽度与居中视觉） */
.tools { max-width: 760px; margin: 0 auto 10px; width: 100%; }
.kpi-wrap { margin-top: 6px; }
</style>
