<template>
  <main class="member2__grid">
    <!-- 顶部：左 性别 | 中 搜索+KPI | 右 民族 -->
    <section class="mod" style="grid-area: tl;">
      <span class="title-img title-img--member-1" aria-hidden="true"></span>
      <div class="mod__body">
        <GenderDistribution />
      </div>
    </section>

    <section style="grid-area: tc;">
      <div class="mod__body">
        <!-- <OrgSearchKpis :items="kpis" /> -->
        <TopSearchKpis :items="kpis" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <span class="title-img title-img--member-2" aria-hidden="true"></span>
      <div class="mod__body">
        <EthnicDistribution />
      </div>
    </section>

    <!-- 中部：学历 | 月度趋势 | 政治面貌 -->
    <section class="mod" style="grid-area: ml;">
      <span class="title-img title-img--member-3" aria-hidden="true"></span>
      <div class="mod__body">
        <EducationBar />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <span class="title-img title-img--member-5" aria-hidden="true"></span>
      <div class="mod__body">
        <MonthTrend />
      </div>
    </section>

    <section class="mod mod--tall" style="grid-area: mr;">
      <span class="title-img title-img--member-6" aria-hidden="true"></span>
      <div class="mod__body">
        <div class="split-vert">
          <PoliticsList />

        </div>
      </div>
    </section>

    <!-- 底部：左数字 | 右行业分布 -->
    <section class="mod mod--wide" style="grid-area: bl;">
      <div class="mod__body">
        <SearchTodayTotal :today-total="111121" :weekly-increase="10" :progress="64" />
      </div>
    </section>


  </main>
</template>

<script setup lang="ts">
import GenderDistribution from '../components/member/GenderDistribution.vue';
import EthnicDistribution from '../components/member/EthnicDistribution.vue';
import EducationBar from '../components/member/EducationBar.vue';
import MonthTrend from '../components/member/MonthTrend.vue';
import PoliticsList from '../components/member/PoliticsList.vue';
import SearchTodayTotal from '../components/member/SearchTodayTotal.vue';
import StripedBarChart from '../components/StripedBarChart.vue';
import OrgSearchKpis from '../components/org/SearchKpis.vue';
import TopSearchKpis from '../components/member/TopSearchKpis.vue';

import icon31x from '../images/org/title3/位图.png';
import icon32x from '../images/org/title3/位图@2x.png';
import icon41x from '../images/org/title4/位图.png';
import icon42x from '../images/org/title4/位图@2x.png';

const kpis = [
  { title: '会员总数', value: 18897, icon1x: icon31x, icon2x: icon32x },
  { title: '新就业形态劳动者', value: 48897, icon1x: icon41x, icon2x: icon42x },
];

const industryCats = ['市州区委(行业工会)', '市州圈委', '乡镇工会', '街道工会', '社区工会', '开发园区工会', '小三级企业工会'];
const industryVals = [420, 360, 280, 340, 300, 360, 320];
</script>

<style scoped lang="scss">
.member2__grid {
  height: 970px;
  /* 1080 - header */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 360px 360px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bl mr';
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
  left: -8px;
  right: -8px;
  top: -8px;
  bottom: -8px;
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
  background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
}

.mod__body {
  display: grid;
  place-items: stretch;
}

.title-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-bottom: 8px;
}

.title-img--member-1 {
  width: 191px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/member/font-title/1/编组 21.png') 1x, url('../images/member/font-title/1/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/member/font-title/1/编组 21.png') 1x, url('../images/member/font-title/1/编组 21@2x.png') 2x);
}

.title-img--member-2 {
  width: 191px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/member/font-title/2/编组 21.png') 1x, url('../images/member/font-title/2/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/member/font-title/2/编组 21.png') 1x, url('../images/member/font-title/2/编组 21@2x.png') 2x);
}

.title-img--member-3 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/member/font-title/4/编组 21.png') 1x, url('../images/member/font-title/4/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/member/font-title/4/编组 21.png') 1x, url('../images/member/font-title/4/编组 21@2x.png') 2x);
}

.title-img--member-5 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/member/font-title/5/编组 21.png') 1x, url('../images/member/font-title/5/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/member/font-title/5/编组 21.png') 1x, url('../images/member/font-title/5/编组 21@2x.png') 2x);
}

.title-img--member-6 {
  width: 110px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/member/font-title/6/编组 21.png') 1x, url('../images/member/font-title/6/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/member/font-title/6/编组 21.png') 1x, url('../images/member/font-title/6/编组 21@2x.png') 2x);
}

/* 竖向合并模块：上列表 下条形 */
/* 之前为上下拆分（1fr 42%），当前仅显示上半区块，导致下半空白。
   改为单列占满，使上部图表“拉长”填充可用空间。 */
.split-vert {
  display: grid;
  grid-template-rows: 1fr;
  gap: 12px;
}
</style>
