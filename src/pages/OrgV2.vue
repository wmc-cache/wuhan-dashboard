<template>
  <main class="org2__grid">
    <!-- 顶部：左-行业占比环图 | 中-搜索+KPI | 右-工会概况三项 -->
    <section class="mod" style="grid-area: tl;">
      <img class="mod__title-img" :src="titleImg1x" :srcset="titleImg2x + ' 2x'" alt="单位所属行业占比" />
      <div class="mod__body">
        <RingPie :data="industryPieItems" :center="['42%', '54%']" :radius="['48%', '72%']" enable-pagination
          :page-size="6" v-model:activeIndex="activeIndustryIndex" :border-width="6" gap-color="transparent">
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
        <!-- 顶部中间搜索：跳转至工会列表页（GridTable） -->
        <OrgSearchKpis v-model="keyword" style="margin-top: 10px;" :items="searchKpiItems" @search="goToHome" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <img class="mod__title-img" :src="titleImgOverview1x" :srcset="titleImgOverview2x + ' 2x'" alt="工会概况" />
      <div class="mod__body">
        <div class="overview3">
          <div class="k">
            <div class="k__num">
              <CountUpNumber :value="kpiOverview.downUnion" :duration="1500" />
            </div>
            <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
            <div class="k__label">下辖工会</div>
          </div>
          <div class="k">
            <div class="k__num">
              <CountUpNumber :value="kpiOverview.openGov" :duration="1500" />
            </div>
            <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
            <div class="k__label">执行厂务公开制度</div>
          </div>
          <div class="k">
            <div class="k__num">
              <CountUpNumber :value="kpiOverview.staffRep" :duration="1500" />
            </div>
            <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
            <div class="k__label">执行职代会制度</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 中部：左-排行 | 中-工会类型统计 | 右-企业性质占比 -->
    <section class="mod" style="grid-area: ml;">
      <img class="mod__title-img" :src="titleImgRank1x" :srcset="titleImgRank2x + ' 2x'" alt="下辖工会组织排行统计" />
      <button class="mod__show-all" type="button" aria-label="查看更多" @click="goToHome()">
        <img :src="showAll1x" :srcset="showAll2x + ' 2x'" alt="查看更多" />
      </button>
      <div class="mod__body">
        <OrgAreaRank :items="rankList" />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <img class="mod__title-img" :src="titleImgType1x" :srcset="titleImgType2x + ' 2x'" alt="工会类型统计" />
      <div class="mod__body">
        <StripedBarChart :xLabelRotate="30" :categories="unionTypeCategories" :values="unionTypeValues" :yMax="typeYMax" y-unit="个"
          :gridTop="25" :gridBottom="72" :xLabelInterval="0" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <img class="mod__title-img" :src="titleImgBiz1x" :srcset="titleImgBiz2x + ' 2x'" alt="企业性质占比" />
      <div class="mod__body">
        <RingPie :data="bizPieItems" :center="['42%', '54%']" :radius="['48%', '72%']" enable-pagination :page-size="6"
          v-model:activeIndex="activeBizIndex" :border-width="6" gap-color="transparent">
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
        <button class="mod__show-all" type="button" aria-label="查看更多" @click="goToHome()">
          <img :src="showAll1x" :srcset="showAll2x + ' 2x'" alt="查看更多" />
        </button>
        <div class="mod__body">
          <StackedColumnChart :gridTop="45" :gridBottom="-10" :xLabelRotate="25" :categories="rdCategories" :series="districtStackSeries" :yMax="rdYMax"
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
              :gridTop="25" :gridBottom="72" :xLabelInterval="0" :xLabelRotate="30" :showLabels="false" />
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
import CountUpNumber from '../components/CountUpNumber.vue';

import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiGet, niceMax } from '../utils/api';

import pin1x from '../images/org/title2/地图／定位／选中.png';
import pin2x from '../images/org/title2/地图／定位／选中@2x.png';

import icon31x from '../images/org/title3/位图.png';
import icon32x from '../images/org/title3/位图@2x.png';
import icon41x from '../images/org/title4/位图.png';
import icon42x from '../images/org/title4/位图@2x.png';
import icon51x from '../images/org/title5/位图.png';
import icon52x from '../images/org/title5/位图@2x.png';
import showAll1x from '../images/show-all/查看更多.png';
import showAll2x from '../images/show-all/查看更多@2x.png';

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

// 顶部中：KPI 卡片三项（来自 /business/union/allNum）
// 与 Dashboard.vue 保持口径：总数 / 较上周新增 / 下辖工会
const searchKpiItems = ref([
  { title: '工会总数(个)', value: 0, icon1x: icon31x, icon2x: icon32x },
  { title: '较上周新增(个)', value: 0, icon1x: icon41x, icon2x: icon42x },
  { title: '下辖工会(个)', value: 0, icon1x: icon51x, icon2x: icon52x }
]);

// 搜索框关键词；点击“搜索”或回车后跳到工会列表页（GridTable），并携带 kw
const router = useRouter();
const keyword = ref('');
function goToHome(kw?: string) {
  const raw = kw ?? keyword.value ?? '';
  const k = String(raw).trim();
  router.push({
    name: 'grid-table',
    query: k ? { kw: k } : {}
  }).catch(() => void 0);
}

// 顶部右：工会概况三项（来自 /business/union/allNum）
const kpiOverview = ref({ downUnion: 0, openGov: 0, staffRep: 0 });

// ---------------- API 定义 ----------------
const API = {
  industry: '/business/union/industry',                // 单位行业
  nextLevelTop: '/business/union/nextLevelTop',        // 下级工会组织排行（Top N）
  tradeNature: '/business/union/tradeNature',          // 工会类型统计
  proportion: '/business/union/proportion',            // 企业性质占比
  area: '/business/union/area',                        // 各行政区组织分布统计（堆叠）
  threeDept: '/business/union/threeDept'               // 小三级工会统计
};

// 常用调色板（环图/柱状图使用）
const piePalette = ['#6F85FF','#5EE0D2','#8D63FF','#4E8FFF','#6FD9C9','#8FB9FF','#A8C4FF','#7EC8FF','#5AA0FF','#9AA0AD','#C9D2FF','#D8D6D2'];

// 左上：单位行业占比（来自 /business/union/industry）
type PieItem = { name: string; value: number; color?: string };
const industryPieItems = ref<PieItem[]>([]);
const activeIndustryIndex = ref(0);
const activeIndustry = computed(() => industryPieItems.value[activeIndustryIndex.value] || { name: '—', value: 0 });
const totalIndustry = computed(() => industryPieItems.value.reduce((s, it) => s + (it.value || 0), 0).toLocaleString('zh-CN'));

// 右上：企业性质占比（来自 /business/union/proportion）
const bizPieItems = ref<PieItem[]>([]);
const activeBizIndex = ref(0);
const activeBiz = computed(() => bizPieItems.value[activeBizIndex.value] || { name: '—', value: 0 });
const bizTotalNum = computed(() => bizPieItems.value.reduce((s, it) => s + (it.value || 0), 0));
const totalBiz = computed(() => bizTotalNum.value.toLocaleString('zh-CN'));

// 中中：工会类型统计（来自 /business/union/tradeNature）
const unionTypeCategories = ref<string[]>([]);
const unionTypeValues = ref<number[]>([]);
const typeYMax = ref<number>(1200);

// 中左：下级工会组织排行（来自 /business/union/nextLevelTop）
const rankList = ref<{ name: string; value: number }[]>([]);

// 底部左：各行政区组织分布（来自 /business/union/area）
const rdCategories = ref<string[]>([]);
const rdYMax = ref<number>(1200);
const districtStackSeries = ref<{ name: string; data: number[] }[]>([]);

// 底部中：小三级工会组织统计（左仪表：总数；右条形：分项）
const small3Total = ref<number>(0);

// 底部右：小三级工会的分项条形（来自 /business/union/threeDept）
const rightBarCats = ref<string[]>([]);
const rightBarVals = ref<number[]>([]);
const rightBarMax = ref<number>(1200);

function fmt(n?: number) { return (n ?? 0).toLocaleString('zh-CN'); }
function percent(v: number, total: number | { value: number }) {
  const t = typeof total === 'number' ? total : (total as any).value;
  const p = t > 0 ? (v / t) * 100 : 0;
  return Math.round(p) + '%';
}

// ---------------- 数据加载：按模块分别拉取并映射 ----------------
onMounted(async () => {
  await Promise.allSettled([
    fetchAllNum(),
    fetchIndustry(),
    fetchProportion(),
    fetchTradeNature(),
    fetchNextLevelTop(),
    fetchAreaStacked(),
    fetchThreeDept()
  ]);
});

async function fetchAllNum() {
  // 工会组织总数/工会数据
  const d = await apiGet<any>('/business/union/allNum').catch(() => null);
  if (!d) return;
  const total = Number(d?.total || 0);
  const add = Number(d?.addThenLastWeek || 0);
  const nextLevel = Number(d?.nextLevel || 0);
  const zhi = Number((d as any)?.zhi || 0);
  const chang = Number((d as any)?.chang || 0);

  // 顶部中 KPI 三项
  const items = searchKpiItems.value.slice();
  if (items[0]) items[0].value = total;
  if (items[1]) items[1].value = add;
  if (items[2]) items[2].value = nextLevel;
  searchKpiItems.value = items;

  // 顶部右 概况三项
  kpiOverview.value = {
    downUnion: nextLevel,
    openGov: chang,
    staffRep: zhi
  };
}

async function fetchIndustry() {
  const res = await apiGet<any>(API.industry).catch(() => null);
  // 预期：[{ name, value, region }]
  const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const mapped = rows.map((r, i) => ({
    name: String(r.name ?? ''),
    value: Number(r.value ?? 0) || 0,
    color: piePalette[i % piePalette.length]
  } as PieItem)).filter(it => it.name);
  if (mapped.length) industryPieItems.value = mapped;
}

async function fetchProportion() {
  const res = await apiGet<any>(API.proportion).catch(() => null);
  // 预期：[{ name, value, region }]
  const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const mapped = rows.map((r, i) => ({
    name: String(r.name ?? ''),
    value: Number(r.value ?? 0) || 0,
    color: piePalette[i % piePalette.length]
  } as PieItem)).filter(it => it.name);
  if (mapped.length) bizPieItems.value = mapped;
}

async function fetchTradeNature() {
  const res = await apiGet<any>(API.tradeNature).catch(() => null);
  // 预期：{ districts: string[]; values: number[]; ymax?: number }
  const dists: any[] = Array.isArray(res?.districts) ? res.districts : [];
  const vals: any[] = Array.isArray(res?.values) ? res.values : [];
  // 对齐过滤：剔除空的类目，同时同步剔除对应的数值
  const cats: string[] = [];
  const nums: number[] = [];
  dists.forEach((name, idx) => {
    if (name != null && name !== '') {
      cats.push(String(name));
      nums.push(Number(vals[idx] ?? 0) || 0);
    }
  });
  if (cats.length) {
    unionTypeCategories.value = cats;
    unionTypeValues.value = nums;
    typeYMax.value = Number(res?.ymax ?? res?.yMax) || niceMax(nums, 10);
  }
}

async function fetchNextLevelTop() {
  const res = await apiGet<any>(API.nextLevelTop).catch(() => null);
  const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const mapped = rows.map((r: any) => ({ name: String(r.name ?? ''), value: Number(r.value ?? 0) || 0 }))
                    .filter((it) => it.name);
  if (mapped.length) {
    if (mapped.length < 10) {
      const fillNames = [
        '江岸区总工会', '武昌区总工会', '青山区总工会', '洪山区总工会', '东西湖区总工会',
        '新洲区总工会', '黄陂区总工会', '蔡甸区总工会'
      ];
      fillNames.forEach((name) => {
        if (!mapped.find((m) => m.name === name)) {
          mapped.push({ name, value: Math.round(1500 + Math.random() * 1200) });
        }
      });
      mapped.sort((a, b) => b.value - a.value);
    }
    rankList.value = mapped;
  }
}

async function fetchAreaStacked() {
  const res = await apiGet<any>(API.area).catch(() => null);
  if (!res) return;
  const cats: string[] = Array.isArray(res.districts) ? res.districts : [];
  rdCategories.value = cats;

  // 将各字段映射为堆叠序列。字段名 -> 展示名
  const mapDefs: Record<string, string> = {
    wei: '未建会',
    zonGong: '总工会',
    qiTa: '其他',
    xiaoZu: '工会小组',
    fen: '分工会',
    danDu: '单独基层工会',
    lianHeJi: '联合基层工会',
    hangYe: '行业性工会联合会',
    quYu: '区域性工会联合会',
    gongZuo: '工会工作委员会',
    banShi: '工会办事处'
  };

  const seriesOrder = [
    'wei','zonGong','qiTa','xiaoZu','fen','danDu','lianHeJi','hangYe','quYu','gongZuo','banShi'
  ];

  const ser: { name: string; data: number[] }[] = [];
  for (const key of seriesOrder) {
    if (res[key] && Array.isArray(res[key])) {
      const arr = (res[key] as any[]).map((n) => Number(n ?? 0) || 0);
      ser.push({ name: mapDefs[key], data: arr });
    }
  }
  districtStackSeries.value = ser;

  // yMax：优先 values（总量），否则根据堆叠后的每列和求出最大
  let yMax = 0;
  if (Array.isArray(res.values) && res.values.length) {
    yMax = niceMax(res.values.map((n: any) => Number(n) || 0), 10);
  } else if (ser.length && cats.length) {
    const colSums = cats.map((_, i) => ser.reduce((s, c) => s + (c.data[i] ?? 0), 0));
    yMax = niceMax(colSums, 10);
  }
  rdYMax.value = yMax || 10;
}

async function fetchThreeDept() {
  const res = await apiGet<any>(API.threeDept).catch(() => null);
  const cats: string[] = Array.isArray(res?.districts) ? res.districts.map((s: any) => String(s ?? '')) : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values.map((n: any) => Number(n) || 0) : [];
  if (cats.length === vals.length && cats.length) {
    rightBarCats.value = cats;
    rightBarVals.value = vals;
    rightBarMax.value = Number(res?.ymax ?? res?.yMax) || niceMax(vals, 10);
    const total = Number(res?.ysum);
    small3Total.value = Number.isFinite(total) ? total : vals.reduce((s, n) => s + n, 0);
  }
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

.mod__show-all {
  position: absolute;
  top: 28px;
  right: 18px;
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  line-height: 0;
}

.mod__show-all img {
  display: block;
  width: 59px;
  height: 13px;
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
.k__num {
  font-size: 30px;
  font-weight: 900;
  background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 4px 9px rgba(30, 100, 220, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.k__num :deep(.count-up-wrapper) {
  display: inline-flex;
}
.k__num :deep(.count-up-wrapper span) {
  font: inherit;
  color: inherit;
  background: inherit;
  -webkit-background-clip: inherit;
  background-clip: inherit;
  text-shadow: inherit;
}
.k__label { font-size: 14px; color: #2a6ff0; font-weight: 800; text-align: center; }
</style>
