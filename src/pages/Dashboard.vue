<template>
  <main class="dash__main">
    <section class="col col--left">
      <div class="panel h214">
        <!-- 顶部左侧双 KPI 卡（工会总数/今年新增） -->
        <KpiPair :items="leftKpis" left-bg="top-1" right-bg="top-2" />
      </div>
      <!-- 新增：工会概况（三项）占位，位于左列第 1 与第 2 模块之间 -->
      <div class="panel h180">
        <span class="title-img title-img--dash-1" aria-hidden="true"></span>
        <UnionOverviewMini />
      </div>
      <div class="panel h214">
        <span class="title-img title-img--dash-3" aria-hidden="true"></span>
        <OrgTotal />
      </div>
      <!-- 红框（左下）：劳模补助人数/金额列表，复用 laomo/SubsidyStatsList -->
      <div class="panel h300">
        <span class="title-img title-img--dash-5" aria-hidden="true"></span>
        <LaomoSubsidyStatsList :row-height="35" :width-percent="88" :center="false" />
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
        <KpiPair :items="rightKpis" left-bg="top-3" right-bg="top-4" />
      </div>
      <!-- 工会会员性别统计（按图还原的新组件） -->
      <div class="panel h180">
        <span class="title-img title-img--dash-2" style="margin-left: 60px;" aria-hidden="true"></span>
        <GenderOverview :male-count="532" :female-count="5132" />
      </div>
      <!-- 红框（右中）：经费返还代收金额统计，复用 refund/RankType2 -->
      <div class="panel h360">
        <!-- 组件自带标题切图，替换为 dashboard/title/4 -->
      
        <RefundRankType2 style="margin-left: 60px;"  :width-percent="90" :img-width="293" :rowHeight="40"
          :show-more="false" :items="refundTop" :title-img1x="dashTitle4_1x" :title-img2x="dashTitle4_2x"
          :bar-color="'#4E8FFF'" />
      </div>
      <!-- 右下：新增 6 组互助统计（使用 part3 切图） -->
      <div class="panel h220">
        <span class="title-img title-img--dash-6" style="margin-left: 60px;" aria-hidden="true"></span>
        <!-- 通过属性控制宽度/中心区域/右侧文字左移量 -->
        <AidCircleStats :items="aidCircleSix" :width="520" :center-width="280" :right-shift="-10" />
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
import GenderOverview from '../components/dashboard/GenderOverview.vue';
import AidCircleStats from '../components/dashboard/AidCircleStats.vue';
// 右侧“经费返还代收金额统计”标题切图（与 Refund 页保持一致的样式）
// dashboard/title（从左到右、从上到下：1~6）
import dashTitle4_1x from '../images/dashboard/title/4/编组 22.png';
import dashTitle4_2x from '../images/dashboard/title/4/编组 22@2x.png';
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

// 右下 6 组数据（按图顺序：左上/右上/左中/右中/左下/右下）
const aidCircleSix = [
  { label: '参加综合金额(元)', value: 7801010 },
  { label: '给付综合金额(元)', value: 7801010 },
  { label: '参加重大疾病金额(元)', value: 7801010 },
  { label: '给付重大疾病金额(元)', value: 7801010 },
  { label: '参加住院金额（元）', value: 7801010 },
  { label: '给付住院金额(元)', value: 7801010 },
];
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

.col--left { grid-template-rows: 120px 210px 300px 220px; }

/* 精确控制右列每个模块高度，相加并含 3 处 10px 间距 = 970，刚好不出界 */
.col--right { grid-template-rows: 120px 210px 300px 220px; }
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

.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
/* 首页模块 6 个标题：从左到右，从上到下（统一高度 35）*/
.title-img--dash-1 { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/1/编组 17备份.png') 1x, url('../images/dashboard/title/1/编组 17备份@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/1/编组 17备份.png') 1x, url('../images/dashboard/title/1/编组 17备份@2x.png') 2x); }
.title-img--dash-2 { width: 191px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/2/编组 17备份 2.png') 1x, url('../images/dashboard/title/2/编组 17备份 2@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/2/编组 17备份 2.png') 1x, url('../images/dashboard/title/2/编组 17备份 2@2x.png') 2x); }
.title-img--dash-3 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/3/编组 17.png') 1x, url('../images/dashboard/title/3/编组 17@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/3/编组 17.png') 1x, url('../images/dashboard/title/3/编组 17@2x.png') 2x); }
.title-img--dash-4 { width: 293px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/4/编组 22.png') 1x, url('../images/dashboard/title/4/编组 22@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/4/编组 22.png') 1x, url('../images/dashboard/title/4/编组 22@2x.png') 2x); }
.title-img--dash-5 { width: 171px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/5/编组 18.png') 1x, url('../images/dashboard/title/5/编组 18@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/5/编组 18.png') 1x, url('../images/dashboard/title/5/编组 18@2x.png') 2x); }
.title-img--dash-6 { width: 212px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/6/编组 25.png') 1x, url('../images/dashboard/title/6/编组 25@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/6/编组 25.png') 1x, url('../images/dashboard/title/6/编组 25@2x.png') 2x); }

/* 中央搜索条容器：宽度与 Home 页相似并居中 */
.map-tools { max-width: 760px; margin: 0 auto 10px; width: 100%; }

/* 左下模块标题（与劳模页面保持一致） */
.title-img--laomo-8 { width: 253px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); }
</style>
