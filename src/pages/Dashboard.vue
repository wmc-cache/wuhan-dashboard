<template>
  <main class="dash__main">
    <section class="col col--left">
      <div class="panel h214">
        <!-- 顶部左侧双 KPI 卡（工会总数/今年新增） -->
        <KpiPair :items="leftKpis" />
      </div>
      <!-- 新增：工会概况（三项）占位，位于左列第 1 与第 2 模块之间 -->
      <div class="panel h180">
        <UnionOverviewMini />
      </div>
      <div class="panel h214">
        <span class="title-img title-img--org-total" aria-hidden="true"></span>
        <OrgTotal />
      </div>
      <!-- 红框（左下）：劳模补助人数/金额列表，复用 laomo/SubsidyStatsList -->
      <div class="panel h300">
        <span class="title-img title-img--laomo-8" aria-hidden="true"></span>
        <LaomoSubsidyStatsList />
      </div>
    </section>

    <section class="col col--center">
      <div class="panel panel--map h860">
        <!-- 中央搜索：放在地图上方，点击跳到 Home 页面（复用 TopSearch） -->
        <div class="map-tools">
          <TopSearch v-model="keyword" v-model:category="selCat" @search="goToHome" />
        </div>
        <WuhanMap :show-network="false" />
      </div>
    </section>

    <section class="col col--right">
      <div class="panel h180">
        <!-- 顶部右侧双 KPI 卡（会员总数/省总金额合计） -->
        <KpiPair :items="rightKpis" />
      </div>
      <!-- 新增：工会会员性别统计，占位样式；位于右列第 1 与第 2 模块之间 -->
      <div class="panel h180">
        <GenderDistribution :male-count="532" :female-count="5132" />
      </div>
      <!-- 红框（右中）：经费返还代收金额统计，复用 refund/RankType2 -->
      <div class="panel h360">
        <!-- 该组件自带标题切图与“查看更多”按钮，这里不再额外放标题条 -->
        <RefundRankType2 :items="refundTop" :title-img1x="refundTitle1x" :title-img2x="refundTitle2x" :bar-color="'#4E8FFF'" />
      </div>
      <!-- 右下：高度略减，避免整列超出舞台（1080-头部110=970） -->
      <div class="panel h220">
        <span class="title-img title-img--member-new" aria-hidden="true"></span>
        <!-- TODO: 新增会员趋势占位 -->
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import OrgTotal from '../components/dashboard/OrgTotal.vue';
import WuhanMap from '../components/dashboard/WuhanMap.vue';
import TopSearch from '../components/TopSearch.vue';
import LaomoSubsidyStatsList from '../components/laomo/SubsidyStatsList.vue';
import RefundRankType2 from '../components/refund/RankType2.vue';
import KpiPair from '../components/dashboard/KpiPair.vue';
import UnionOverviewMini from '../components/dashboard/UnionOverviewMini.vue';
import GenderDistribution from '../components/member/GenderDistribution.vue';
// 右侧“经费返还代收金额统计”标题切图（与 Refund 页保持一致的样式）
import refundTitle1x from '../images/refund/title5/编组 21.png';
import refundTitle2x from '../images/refund/title5/编组 21@2x.png';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const selCat = ref<'org' | 'member'>('org');
const keyword = ref('');
function goToHome() { router.push({ path: '/home', query: { kw: keyword.value || '', cat: selCat.value } }); }
// GridTable 的“查看更多”已在组件内部处理跳转

// 示例数据：经费返还代收金额 Top5（金额单位：万元）
const refundTop = [
  { name: '武汉市新鑫工会', value: 6189873.092 },
  { name: '江岸区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 },
  { name: '武汉经济开发区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 }
];

// 顶部左右 KPI 对（按参考图数值，可替换为真实接口）
const leftKpis = [
  { title: '工会总数(个)', value: 18897, unit: '' },
  { title: '本年度新增工会(个)', value: 12597, unit: '' }
] as const;
const rightKpis = [
  { title: '工会会员总数(人)', value: 48897, unit: '' },
  { title: '省总金额合计(亿)', value: 12597, unit: '' }
] as const;
</script>

<style scoped lang="scss">
.dash__main {
  display: grid;
  grid-template-columns: 620px 1fr 620px; /* 左右固定，中间地图自适应 */
  /* 模块间距统一为 10px */
  gap: 10px;
  padding: 0 20px 20px;
  /* 页面总高 = 1080 - 头部 110 = 970 */
  height: 970px;
  /* 把 padding 纳入总高，确保不被算作额外高度导致出界 */
  box-sizing: border-box;
}
.col {
  display: grid;
  /* 与主栅格一致 */
  gap: 10px;
}

.col--left { grid-template-rows: 214px 180px 214px 300px; }

/* 精确控制右列每个模块高度，相加并含 3 处 10px 间距 = 970，刚好不出界 */
.col--right { grid-template-rows: 180px 180px 360px 220px; }
.col--center { grid-template-rows: 860px; }
.panel {
  /* 去掉模块背景面板，仅保留内边距与布局 */
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    /* 固定高度时把内边距计入总高，便于和 grid 行高精确匹配 */
    box-sizing: border-box;
    /* 内边距统一为 18px */
    padding: 18px;
  }
  
  .panel--map {
    background: none;
    display: grid;
    grid-template-rows: auto 1fr;
    align-items: start;
  }
.panel > .title-img { display: inline-block; margin-bottom: 8px; }
.h180 { height: 180px; }
.h300 { height: 300px; }
.h360 { height: 360px; }
.h220 { height: 220px; }
.h860 { height: 860px; }
.h214 { height: 214px; }

/* 首页模块标题使用切图（1x/2x 自适配） */
.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
/* 左列：工会组织总数（公会组织总数） 151x35 */
.title-img--org-total { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会组织总数/编组 21备份.png') 1x, url('../images/home-title/公会组织总数/编组 21备份@2x.png') 2x); background-image: image-set(url('../images/home-title/公会组织总数/编组 21备份.png') 1x, url('../images/home-title/公会组织总数/编组 21备份@2x.png') 2x); }
/* 左列：工会行业分布（公会行页分布） 151x35 */
.title-img--industry {
  width: 110px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/org-v2/2/编组 21.png') 1x, url('../images/org-v2/2/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/org-v2/2/编组 21.png') 1x, url('../images/org-v2/2/编组 21@2x.png') 2x);
}
/* 左列：新增工会（新增公会） 110x35 */
.title-img--org-new { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x); background-image: image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x); }
/* 右列：工会会员总数（公会会员总数） 151x35 */
.title-img--member-total { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会会员总数/编组 21.png') 1x, url('../images/home-title/公会会员总数/编组 21@2x.png') 2x); background-image: image-set(url('../images/home-title/公会会员总数/编组 21.png') 1x, url('../images/home-title/公会会员总数/编组 21@2x.png') 2x); }
/* 右列：工会会员新增 → 使用“公会会员新业态分布”切图 212x35 */
.title-img--member-xinyetai { width: 212px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会会员新业态分布/编组 22.png') 1x, url('../images/home-title/公会会员新业态分布/编组 22@2x.png') 2x); background-image: image-set(url('../images/home-title/公会会员新业态分布/编组 22.png') 1x, url('../images/home-title/公会会员新业态分布/编组 22@2x.png') 2x); }
/* 右列：新增会员 110x35 */
.title-img--member-new { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/新增会员/编组 25.png') 1x, url('../images/home-title/新增会员/编组 25@2x.png') 2x); background-image: image-set(url('../images/home-title/新增会员/编组 25.png') 1x, url('../images/home-title/新增会员/编组 25@2x.png') 2x); }

/* 中央搜索条容器：宽度与 Home 页相似并居中 */
.map-tools { max-width: 760px; margin: 0 auto 10px; width: 100%; }

/* 左下模块标题（与劳模页面保持一致） */
.title-img--laomo-8 { width: 253px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); }
</style>
