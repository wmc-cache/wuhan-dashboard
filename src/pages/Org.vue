<template>
  <main class="org__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <img class="mod__title-img" src="../images/org/font-title/1/编组21.png"
        srcset="../images/org/font-title/1/编组21.png 1x, ../images/org/font-title/1/编组21@2x.png 2x" alt="工会总数" />
      <div class="mod__body">
        <OrgTotal :total="orgTotal" :weekly-increase="weeklyIncrease" :tile-width="60" :tile-height="54"
          :font-size="44" />
      </div>
    </section>

    <section style="grid-area: tc;">

      <div class="mod__body">
        <OrgSearchKpis :items="searchKpiItems" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <img class="mod__title-img" src="../images/org/font-title/4/编组21.png"
        srcset="../images/org/font-title/4/编组21.png 1x, ../images/org/font-title/4/编组21@2x.png 2x" alt="工会会员总数" />
      <div class="mod__body">
        <OrgMemberTotal :region-count="regionUnionCount" :industry-count="industryUnionCount" />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <div class="mod__body">
        <OrgNew :items="orgList" />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <img class="mod__title-img" src="../images/org/font-title/5/编组21.png"
        srcset="../images/org/font-title/5/编组21.png 1x, ../images/org/font-title/5/编组21@2x.png 2x" alt="年度工会创建数" />
      <div class="mod__body">
        <YearCreate :years="ycYears" :data-by-year="ycDataByYear" :initial-year="ycInitialYear" :y-max="ycYMax"
          @year-change="onYearChange" />
      </div>
    </section>

    <section class="mod mod--tall" style="grid-area: mr;">
      <img class="mod__title-img" src="../images/org/font-title/2/编组21.png"
        srcset="../images/org/font-title/2/编组21.png 1x, ../images/org/font-title/2/编组21@2x.png 2x" alt="工会会员数" />
      <div class="mod__body">
        <MemberCount :areas="mcAreas" :left-data="mcLeftData" :right-data="mcRightData" :left-max="mcLeftMax"
          :right-max="mcRightMax" :left-name="'分工会总数（个）'" :right-name="rightAxisName" :centerNudgePx="-100" />
      </div>
    </section>

    <!-- 底部通栏 -->
    <section class="mod mod--wide" style="grid-area: bl;">
      <img class="mod__title-img" src="../images/org/font-title/3/编组21.png"
        srcset="../images/org/font-title/3/编组21.png 1x, ../images/org/font-title/3/编组21@2x.png 2x" alt="工会区域分布" />
      <div class="mod__body">
        <OrgRegionDistribution :categories="rdCategories" :values="rdValues" :y-max="rdYMax" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 引入年度工会创建数图表与工会会员数
import YearCreate from '../components/org/YearCreate.vue';
import MemberCount from '../components/org/MemberCount.vue';
import OrgMemberTotal from '../components/org/MemberTotal.vue';
import OrgSearchKpis from '../components/org/SearchKpis.vue';
import OrgTotal from '../components/org/OrgTotal.vue';
import OrgNew from '../components/org/OrgNew.vue';
import OrgRegionDistribution from '../components/org/RegionDistribution.vue';

import { ref, computed, onMounted } from 'vue';
import { apiGet, niceMax } from '../utils/api';
// Reuse the same icons as SearchKpis, to keep visual consistent
import icon31x from '../images/org/title3/位图.png';
import icon32x from '../images/org/title3/位图@2x.png';
import icon41x from '../images/org/title4/位图.png';
import icon42x from '../images/org/title4/位图@2x.png';
import icon51x from '../images/org/title5/位图.png';
import icon52x from '../images/org/title5/位图@2x.png';

// Base paths
const API = {
  unionMember: '/business/union/unionMember',
  area: '/business/union/area',
  list: '/business/union/list',
  yearCreate: '/business/union/yearCreate',
  allNum: '/business/union/allNum'
};

// 顶部左：工会总数
const orgTotal = ref<number>(0);
const weeklyIncrease = ref<number>(0);

// 顶部右：工会会员总数（右侧两数字）
const regionUnionCount = ref<number>(0);
const industryUnionCount = ref<number>(0);
const cityCount = ref<number>(0);
const districtCount = ref<number>(0);
const streetCount = ref<number>(0);

// 中右：工会会员数（左右对称横条图）
const mcAreas = ref<string[]>([]);
const mcLeftData = ref<number[]>([]);  // 分工会总数
const mcRightData = ref<number[]>([]); // 会员总数
const mcLeftMax = ref<number>(0);
const mcRightMax = ref<number>(0);
const rightAxisName = computed(() => '会员总数（人）');

// 中中：年度工会创建数
type Year = number | string;
interface YearData { total: number[]; added: number[] }
const ycYears = ref<Year[]>([]);
const ycDataByYear = ref<Record<string, YearData>>({});
const ycInitialYear = ref<Year | undefined>(undefined);
const ycYMax = ref<number>(500);

// 中左：新增工会列表
interface OrgItem { id: string | number; name: string; members: number; district: string; foundedAt: string }
const orgList = ref<OrgItem[]>([]);

// 底部：工会区域分布
const rdCategories = ref<string[]>([]);
const rdValues = ref<number[]>([]);
const rdYMax = ref<number>(1200);

// 顶部中：KPI 卡片三项（市、区/产业合计、街道）
const searchKpiItems = computed(() => [
  { title: '市总工会', value: cityCount.value, icon1x: icon31x, icon2x: icon32x },
  { title: '各区总工会、产业和大型企业单位工会', value: districtCount.value, icon1x: icon41x, icon2x: icon42x },
  { title: '街道工会', value: streetCount.value, icon1x: icon51x, icon2x: icon52x }
]);

onMounted(async () => {
  await Promise.all([
    fetchAllNum(),
    fetchUnionMember(),
    fetchYearCreate(),
    fetchArea(),
    fetchOrgList()
  ]).catch((err) => {
    // 在控制台打印错误，不打断渲染（组件有默认占位数据）
    console.warn('[Org] 数据加载失败：', err);
  });
});

async function fetchAllNum() {
  // 预期：{ total?: number; regionCount?: number; industryCount?: number; ... }
  const data: any = await apiGet<any>(API.allNum).catch(() => ({}));
  // 映射常见字段名
  const total = pickNum(data, ['total', 'totalNum', 'totalCount', 'all', 'allNum', 'unionTotal']);
  const region = pickNum(data, ['regionCount', 'region', 'districtCount', 'regionUnionCount']);
  const industry = pickNum(data, ['industryCount', 'industry', 'industryUnionCount']);
  const addLastWeek = pickNum(data, ['addThenLastWeek', 'addLastWeek', 'weeklyIncrease']);
  const city = pickNum(data, ['city']);
  const district = pickNum(data, ['district']);
  const street = pickNum(data, ['street']);
  if (Number.isFinite(total)) orgTotal.value = total as number;
  if (Number.isFinite(region)) regionUnionCount.value = region as number;
  if (Number.isFinite(industry)) industryUnionCount.value = industry as number;
  if (Number.isFinite(addLastWeek)) weeklyIncrease.value = addLastWeek as number;
  if (Number.isFinite(city)) cityCount.value = city as number;
  if (Number.isFinite(district)) districtCount.value = district as number;
  if (Number.isFinite(street)) streetCount.value = street as number;
}

async function fetchUnionMember() {
  // 预期：{ data: Array<{ area, orgCount, memberCount }>, leftMax, rightMax }
  const res = await apiGet<any>(API.unionMember).catch(() => null);
  if (!res) return;
  const rows: any[] = Array.isArray(res.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
  const areas: string[] = [];
  const left: number[] = [];
  const right: number[] = [];
  for (const it of rows) {
    const area = String(it.area ?? it.district ?? it.name ?? '');
    const orgCount = Number(it.orgCount ?? it.org ?? it.left ?? 0) || 0;
    const memberCount = Number(it.memberCount ?? it.members ?? it.right ?? 0) || 0;
    if (area) { areas.push(area); left.push(orgCount); right.push(memberCount); }
  }
  if (areas.length) {
    mcAreas.value = areas;
    mcLeftData.value = left;
    mcRightData.value = right;
    mcLeftMax.value = Number(res.leftMax ?? res.leftmax ?? niceMax(left, 10));
    mcRightMax.value = Number(res.rightMax ?? res.rightmax ?? niceMax(right, 10));
  }
}

async function fetchYearCreate() {
  const res = await apiGet<any>(API.yearCreate).catch(() => null);
  if (!res) return;
  // 接口示例：{ year: [ ... ], dataByYear: { '2016': { total, added }, ... } }
  const years: Year[] = Array.isArray(res.year) ? res.year : Array.isArray(res.years) ? res.years : [];
  const dataByYear = (res.dataByYear && typeof res.dataByYear === 'object') ? res.dataByYear : {};
  ycYears.value = years;
  ycDataByYear.value = dataByYear;
  ycInitialYear.value = years[years.length - 1];
  // 取所有年份 total 最大值作为统一 yMax，避免切换抖动
  const allTotals: number[] = [];
  Object.values(dataByYear).forEach((v: any) => {
    if (Array.isArray(v?.total)) allTotals.push(...v.total.map((n: any) => Number(n) || 0));
  });
  ycYMax.value = Number(res.yMax ?? res.ymax) || niceMax(allTotals, 10);
}

async function fetchArea() {
  const res = await apiGet<any>(API.area).catch(() => null);
  if (!res) return;
  const cats = Array.isArray(res.districts) ? res.districts : Array.isArray(res.categories) ? res.categories : [];
  const vals = Array.isArray(res.values) ? res.values.map((n: any) => Number(n) || 0) : [];
  rdCategories.value = cats;
  rdValues.value = vals;
  rdYMax.value = Number(res.ymax ?? res.yMax) || niceMax(vals, 10);
}

async function fetchOrgList() {
  const res = await apiGet<any>(API.list).catch(() => null);
  if (!res) return;
  const rows: any[] = Array.isArray(res)
    ? res
    : Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.rows)
    ? res.rows
    : Array.isArray(res.row)
    ? res.row
    : [];
  const mapped: OrgItem[] = rows.map((r: any, i: number) => {
    const id = r.id ?? r.unionId ?? r.orgId ?? i;
    const name = r.fullname ?? r.name ?? r.unionName ?? r.orgName ?? r.title ?? `工会${i + 1}`;
    const members = Number(r.memberCount ?? r.members ?? r.count ?? 0) || 0;
    const district = r.unitDistrictSuffix ?? r.district ?? r.area ?? r.region ?? '';
    const foundedAt = r.establishDate ?? r.foundedAt ?? r.createTime ?? r.foundTime ?? r.createdAt ?? '';
    return { id, name, members, district, foundedAt } as OrgItem;
  });
  if (mapped.length) orgList.value = mapped;
}

function onYearChange(_y: Year) {
  // 如果希望 yMax 随年份联动，可在此重算；当前已用“全局最大值”避免抖动，无需处理
}

function pickNum(obj: any, keys: string[]): number | undefined {
  if (!obj) return undefined;
  for (const k of keys) {
    if (obj[k] != null) {
      const n = Number(obj[k]);
      if (Number.isFinite(n)) return n;
    }
  }
  return undefined;
}
</script>

<style scoped lang="scss">
/* 页面 3 列栅格，参照原型占比：左右固定，中间自适应 */
.org__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px; /* 左右 540，中间自适应 */
  grid-template-rows: 220px 360px 1fr; /* 顶 220、中 360、下自适应 */
  /* 让右侧“工会会员数”跨两行，底部“工会区域分布”占据两列 */
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bl mr';
  /* 模块间距统一为 10px */
  gap: 15px;
  /* 标题图片统一大小，便于快速整体调节 */
  --title-img-h: 32px; /* 字体（标题）稍大一点 */
}

/* 模块通用卡片：去掉虚线边框，保留圆角与浅背景 */
.mod {
  position: relative;
  /* 使用切图作为模块边框+背景（替换原半透明背景） */
  border: none;
  border-radius: 10px;
  background: none;
  /* 让边框贴图向外“溢出”一点，避免内框占据过宽，造成视觉变窄 */
  padding: 18px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod::before {
  content: '';
  position: absolute;
  left: -12px; right: -12px; top: -10px; bottom: -10px; /* overscan，向外扩 10~12px */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  pointer-events: none;
  z-index: -1; /* 放在内容下方 */
}

/* 高模块：使用高比例边框贴图 */
.mod--tall::before {
  background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
}

/* 宽模块：使用宽比例边框贴图 */
.mod--wide::before {
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

.mod__title-img {
  /* Title image to replace text headings; keeps same spacing as .mod__title */
  display: block;
  height: var(--title-img-h);
  margin: 0 0 10px;
  object-fit: contain;
  /* Prevent blurriness on HiDPI; srcset provides 1x/2x */
}

.mod__body {
  display: grid;
  /* 让图表/组件横向拉伸，避免被居中挤窄 */
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
.mod__body > * { min-width: 0; min-height: 0; }
</style>
