<template>
  <main class="org2__grid">
    <!-- 顶部：左-行业占比环图 | 中-搜索+KPI | 右-工会概况三项 -->
    <section class="mod" style="grid-area: tl;">
      <img class="mod__title-img" :src="titleImg1x" :srcset="titleImg2x + ' 2x'" alt="单位所属行业占比" />
      <div class="mod__body">
        <RingPie :data="industryPieItems" :center="['42%', '54%']" :radius="['48%', '72%']" enable-pagination
          :page-size="6" v-model:activeIndex="activeIndustryIndex">
          <template #center>
            <div class="pie-center">
              <b class="pie-center__num">{{ fmt(activeIndustry.value) }}</b>
              <div class="pie-center__label">{{ activeIndustry.name }}</div>
            </div>
          </template>
        </RingPie>
      </div>
    </section>

    <section style="grid-area: tc;">
      <div class="mod__body" style="margin-top: 10px;">
        <OrgSearchKpis style="margin-top: 10px;" :items="searchKpiItems" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <img class="mod__title-img" :src="titleImgOverview1x" :srcset="titleImgOverview2x + ' 2x'" alt="工会概况" />
      <div class="mod__body">
        <div class="overview3">
          <div class="k">
            <div class="k__num">{{ fmt(kpiOverview.downUnion) }}</div>
            <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
            <div class="k__label">下辖工会</div>
          </div>
          <div class="k">
            <div class="k__num">{{ fmt(kpiOverview.openGov) }}</div>
            <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
            <div class="k__label">执行厂务公开制度</div>
          </div>
          <div class="k">
            <div class="k__num">{{ fmt(kpiOverview.staffRep) }}</div>
            <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
            <div class="k__label">执行职代会制度</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 中部：左-排行 | 中-工会类型统计 | 右-企业性质占比 -->
    <section class="mod" style="grid-area: ml;">
      <img class="mod__title-img" :src="titleImgRank1x" :srcset="titleImgRank2x + ' 2x'" alt="下辖工会组织排行统计" />
      <div class="mod__body">
        <OrgAreaRank :items="rankList" />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <img class="mod__title-img" :src="titleImgType1x" :srcset="titleImgType2x + ' 2x'" alt="工会类型统计" />
      <div class="mod__body">
        <StripedBarChart :categories="unionTypeCategories" :values="unionTypeValues" :yMax="typeYMax" y-unit="个"
          :gridTop="25" :gridBottom="32" :xLabelInterval="0" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <img class="mod__title-img" :src="titleImgBiz1x" :srcset="titleImgBiz2x + ' 2x'" alt="企业性质占比" />
      <div class="mod__body">
        <RingPie :data="bizPieItems" :center="['42%', '54%']" :radius="['48%', '72%']" enable-pagination
          :page-size="6" v-model:activeIndex="activeBizIndex">
          <template #center>
            <div class="pie-center">
              <b class="pie-center__num">{{ fmt(activeBiz.value) }}</b>
              <div class="pie-center__label">{{ activeBiz.name }}</div>
            </div>
          </template>
        </RingPie>
      </div>
    </section>

    <!-- 底部：左-区域分布 | 中-小三级工会组织统计 | 右-条形排行 -->
    <!-- 底部：整行容器，内部分成两个 50% 宽度模块 -->
    <section class="bottom-pair" style="grid-area: bottom;">
      <!-- 左半：各行政区组织分布统计（堆叠柱） -->
      <section class="mod mod--wide">
        <img class="mod__title-img" :src="titleImgRegion1x" :srcset="titleImgRegion2x + ' 2x'" alt="各行政区组织分布统计" />
        <div class="mod__body">
          <StackedColumnChart :categories="rdCategories" :series="districtStackSeries" :yMax="rdYMax"
            :xLabelInterval="0" :ySplitNumber="4" />
        </div>
      </section>

      <!-- 右半：小三级 + 行业条形 合并模块 -->
      <section class="mod mod--wide">
        <img class="mod__title-img" :src="titleImgSmall1x" :srcset="titleImgSmall2x + ' 2x'" alt="小三级工会组织统计" />
        <div class="mod__body">
          <div class="split2">
            <SmallTripleGauge :total="small3Total" />
            <StripedBarChart :categories="rightBarCats" :values="rightBarVals" :yMax="rightBarMax" y-unit="个"
              :gridTop="25" :gridBottom="52" :xLabelInterval="0" :xLabelRotate="30" :showLabels="false" />
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
// 复用现有的组件：RingPie、OrgRegionDistribution、StripedBarChart、OrgSearchKpis、Refund/RankList
import RingPie from '../components/RingPie.vue';
import OrgSearchKpis from '../components/org/SearchKpis.vue';
import StackedColumnChart from '../components/StackedColumnChart.vue';
import SmallTripleGauge from '../components/org/SmallTripleGauge.vue';
import StripedBarChart from '../components/StripedBarChart.vue';
import OrgAreaRank from '../components/org/AreaRank.vue';

import { computed, ref } from 'vue';

import pin1x from '../images/org/title2/地图／定位／选中.png';
import pin2x from '../images/org/title2/地图／定位／选中@2x.png';

import icon31x from '../images/org/title3/位图.png';
import icon32x from '../images/org/title3/位图@2x.png';
import icon41x from '../images/org/title4/位图.png';
import icon42x from '../images/org/title4/位图@2x.png';
import icon51x from '../images/org/title5/位图.png';
import icon52x from '../images/org/title5/位图@2x.png';

// 标题切图（新提供）：src/images/org-v2/1..7/编组 21[ @2x].png
// 顺序：按页面模块从左到右、从上到下（跳过顶部中间无标题的搜索区）
import v2t1x from '../images/org-v2/1/编组 21.png';
import v2t1x2 from '../images/org-v2/1/编组 21@2x.png';
import v2t2x from '../images/org-v2/2/编组 21.png';
import v2t2x2 from '../images/org-v2/2/编组 21@2x.png';
import v2t3x from '../images/org-v2/3/编组 21.png';
import v2t3x2 from '../images/org-v2/3/编组 21@2x.png';
import v2t4x from '../images/org-v2/4/编组 21.png';
import v2t4x2 from '../images/org-v2/4/编组 21@2x.png';
import v2t5x from '../images/org-v2/5/编组 21.png';
import v2t5x2 from '../images/org-v2/5/编组 21@2x.png';
import v2t6x from '../images/org-v2/6/编组 21.png';
import v2t6x2 from '../images/org-v2/6/编组 21@2x.png';
import v2t7x from '../images/org-v2/7/编组 21.png';
import v2t7x2 from '../images/org-v2/7/编组 21@2x.png';

// 模块与标题图映射：
// 1: 左上（行业占比环图）
const titleImg1x = v2t1x; const titleImg2x = v2t1x2;
// 2: 右上（工会概况）
const titleImgOverview1x = v2t2x; const titleImgOverview2x = v2t2x2;
// 3: 中左（排行）
const titleImgRank1x = v2t3x; const titleImgRank2x = v2t3x2;
// 4: 中中（工会类型统计）
const titleImgType1x = v2t4x; const titleImgType2x = v2t4x2;
// 5: 中右（企业性质占比）
const titleImgBiz1x = v2t5x; const titleImgBiz2x = v2t5x2;
// 6: 底部左（各行政区组织分布统计）
const titleImgRegion1x = v2t6x; const titleImgRegion2x = v2t6x2;
// 7: 底部右（合并模块：小三级+行业条形）
const titleImgSmall1x = v2t7x; const titleImgSmall2x = v2t7x2;

// 顶部中：KPI 卡片三项（市、区/产业合计、街道）沿用 Org 页面实现
const searchKpiItems = [
  { title: '基层工会总数', value: 23421, icon1x: icon31x, icon2x: icon32x },
  { title: '涵盖单位数', value: 82321, icon1x: icon41x, icon2x: icon42x },
  { title: '会员总数', value: 7321318, icon1x: icon51x, icon2x: icon52x }
];

// 顶部右：工会概况三项（占位数据）
const kpiOverview = { downUnion: 12329, openGov: 1239, staffRep: 5518 };

// 左上：行业占比环图（占位数据 + 可滚动图例）
const industryPieItems = [
  { name: '公共管理、社会保障和社会组织', value: 7433, color: '#506EFF' },
  { name: '其他', value: 5451, color: '#C9D2FF' },
  { name: '制造业', value: 7878, color: '#5EE0D2' },
  { name: '居民服务、修理和其他服务业', value: 5436, color: '#6F85FF' },
  { name: '批发零售业', value: 4324, color: '#8D63FF' },
  { name: '农林牧渔业', value: 3421, color: '#D8D6D2' },
  { name: '农林牧渔业', value: 3421, color: '#D8D6D2' }
];
const activeIndustryIndex = ref(0);
const activeIndustry = computed(() => industryPieItems[activeIndustryIndex.value] || { name: '—', value: 0 });
const totalIndustry = computed(() => industryPieItems.reduce((s, it) => s + (it.value || 0), 0).toLocaleString('zh-CN'));

// 右上：企业性质占比（占位）
const bizPieItems = [
  { name: '社会组织', value: 7439, color: '#6F85FF' },
  { name: '其他', value: 5451, color: '#C9D2FF' },
  { name: '机关', value: 7878, color: '#5EE0D2' },
  { name: '居民服务', value: 5436, color: '#6FD9C9' },
  { name: '制造业', value: 4324, color: '#8D63FF' },
  { name: '外商投资企业', value: 427, color: '#D8D6D2' }
];
const activeBizIndex = ref(0);
const activeBiz = computed(() => bizPieItems[activeBizIndex.value] || { name: '—', value: 0 });
const bizTotalNum = computed(() => bizPieItems.reduce((s, it) => s + (it.value || 0), 0));
const totalBiz = computed(() => bizTotalNum.value.toLocaleString('zh-CN'));

// 中中：工会类型统计（占位）
const unionTypeCategories = ['总工会', '工会小组', '分工会', '独立建制工会', '联合基层工会', '行业工会联合会', '镇街工会'];
const unionTypeValues = [1100, 680, 760, 820, 540, 460, 600];
const typeYMax = 1200;

// 中左：下辖工会组织排行（占位）
const rankList = [
  { name: '武昌区', value: 61898 },
  { name: '东湖新技术开发区', value: 61897 },
  { name: '汉阳区', value: 3092 },
  { name: '江汉区', value: 6189 },
  { name: '江夏区', value: 5230 }
];

// 底部左：各行政区组织分布（复用 OrgRegionDistribution 默认占位）
const rdCategories = ['武昌区', '硚口区', '江岸区', '东湖开发区', '新洲区', '洪山区', '青山区', '蔡甸区', '江夏区', '汉阳区', '东西湖区', '东湖风景区', '黄陂区', '经开区', '江汉区'];
const rdYMax = 1200;
const districtStackSeries = [
  { name: '未建会', data: [60, 40, 50, 30, 45, 55, 48, 36, 44, 50, 42, 38, 47, 35, 46] },
  { name: '总工会', data: [180, 120, 150, 110, 130, 140, 145, 120, 150, 160, 148, 135, 142, 150, 155] },
  { name: '其他', data: [40, 35, 38, 28, 30, 32, 30, 28, 29, 30, 30, 28, 30, 28, 29] },
  { name: '工会小组', data: [120, 80, 90, 70, 72, 75, 68, 66, 74, 78, 70, 72, 76, 74, 79] },
  { name: '分工会', data: [240, 160, 180, 130, 128, 140, 132, 120, 150, 170, 150, 145, 155, 165, 168] },
  { name: '单独基层工会', data: [200, 130, 150, 100, 96, 120, 110, 108, 126, 136, 120, 118, 124, 130, 132] },
  { name: '联合基层工会', data: [110, 90, 100, 86, 70, 82, 80, 78, 84, 90, 86, 80, 88, 92, 94] },
  { name: '行业性工会联合会', data: [40, 35, 36, 30, 26, 28, 26, 24, 30, 32, 28, 26, 28, 30, 32] }
];

// 底部中：小三级工会组织统计（用环图表现一个总量）
const small3Total = 6329;

// 底部右：示例条形图
const rightBarCats = ['冶金工会', '教育工会', '建筑工会', '纺织工会', '轻工工会', '化工工会', '煤炭工会'];
const rightBarVals = [520, 680, 860, 740, 600, 560, 620];
const rightBarMax = 1200;

function fmt(n?: number) { return (n ?? 0).toLocaleString('zh-CN'); }
function percent(v: number, total: number | { value: number }) {
  const t = typeof total === 'number' ? total : (total as any).value;
  const p = t > 0 ? (v / t) * 100 : 0;
  return Math.round(p) + '%';
}
</script>

<style scoped lang="scss">
/* 三列布局，与现有 Org 页一致，便于快速替换 */
.org2__grid {
  height: 950px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 350px 340px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bottom bottom bottom';
  gap: 5px;
  --title-img-h: 32px;
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
  left: -12px;
  right: -12px;
  top: -10px;
  bottom: -10px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  pointer-events: none;
  z-index: -1;
}

.mod--wide::before {
  background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
}

.mod__title-img {
  display: block;
  height: var(--title-img-h);
  margin: 0 0 10px;
  object-fit: contain;
}

.mod__body {
  display: grid;
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}

.mod__body>* {
  min-width: 0;
  min-height: 0;
}

/* 合并的半宽容器：左侧仪表（占30%），右侧条形（占70%） */
.split2 {
  display: grid;
  grid-template-columns: 30% 1fr;
  align-items: center;
  column-gap: 16px;
}

/* 底部 2 列等分容器 */
.bottom-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.pie-center {
  display: grid;
  place-items: center;
  text-align: center;
}

.pie-center__num {
  font-size: 28px;
  font-weight: 900;
  color: #3e74ff;
  line-height: 1;
}

.pie-center__label {
  font-size: 14px;
  color: #2a6ff0;
  font-weight: 700;
}

/* 右上企业性质占比 - 自定义图例 */
.biz-legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 10px;
}

.biz-legend__item {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  column-gap: 8px;
  color: #2a6ff0;
  font-weight: 700;
}

.biz-legend__item .label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.biz-legend__item .count {
  margin-left: 6px;
  opacity: .9;
}

.biz-legend__item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .6) inset;
}
.overview3 { height: 100%; display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; justify-items: center; }
.k { display: grid; row-gap: 6px; justify-items: center; }
.k__num { font-size: 30px; font-weight: 900; background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 4px 9px rgba(30, 100, 220, 0.18); }
.k__label { font-size: 14px; color: #2a6ff0; font-weight: 800; text-align: center; }
</style>
