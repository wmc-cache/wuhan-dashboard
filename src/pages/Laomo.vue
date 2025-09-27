<template>
  <main class="laomo__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <!-- 图片标题：劳模民族分布统计（1/7） -->
      <span class="title-img title-img--laomo-1" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoEthnicDistribution />
      </div>
    </section>

    <section style="grid-area: tc;">

      <div class="mod__body" style="place-items: stretch;">
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
      <!-- 图片标题：荣誉分类统计（3/7） -->
      <span class="title-img title-img--laomo-3" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoHonorDistribution />
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
      <!-- 图片标题：劳模年龄分布统计（5/7） -->
      <span class="title-img title-img--laomo-5" aria-hidden="true"></span>
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
      <!-- 图片标题：劳模区域分布（6/7） -->
      <span class="title-img title-img--laomo-7" aria-hidden="true"></span>
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
import LaomoIncomeDistribution from '../components/laomo/IncomeDistribution.vue';
import LaomoFourStats from '../components/laomo/FourStats.vue';
import LaomoGenderDistribution from '../components/laomo/GenderDistribution.vue';
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


.mod > .title-img { display: inline-block; margin-bottom: 8px; }
.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }


.title-img--laomo-1 { width: 192px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/1/编组 21.png') 1x, url('../images/laomo/font-title/1/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/1/编组 21.png') 1x, url('../images/laomo/font-title/1/编组 21@2x.png') 2x); }

.title-img--laomo-2 { width: 233px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/2/编组 21.png') 1x, url('../images/laomo/font-title/2/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/2/编组 21.png') 1x, url('../images/laomo/font-title/2/编组 21@2x.png') 2x); }

.title-img--laomo-3 { width: 152px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/3/编组 21.png') 1x, url('../images/laomo/font-title/3/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/3/编组 21.png') 1x, url('../images/laomo/font-title/3/编组 21@2x.png') 2x); }

.title-img--laomo-4 { width: 192px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/4/编组 21.png') 1x, url('../images/laomo/font-title/4/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/4/编组 21.png') 1x, url('../images/laomo/font-title/4/编组 21@2x.png') 2x); }

.title-img--laomo-5 { width: 192px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/5/编组 21.png') 1x, url('../images/laomo/font-title/5/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/5/编组 21.png') 1x, url('../images/laomo/font-title/5/编组 21@2x.png') 2x); }

.title-img--laomo-6 { width: 111px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/6/编组 21.png') 1x, url('../images/laomo/font-title/6/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/6/编组 21.png') 1x, url('../images/laomo/font-title/6/编组 21@2x.png') 2x); }

.title-img--laomo-7 { width: 152px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/7/编组 21.png') 1x, url('../images/laomo/font-title/7/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/7/编组 21.png') 1x, url('../images/laomo/font-title/7/编组 21@2x.png') 2x); }
</style>
