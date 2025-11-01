<template>
  <main class="member2__grid">
    <!-- 顶部：左 占位 | 中 搜索+KPI | 右 轮播（性别/学历/民族） -->
    <section class="mod" style="grid-area: tl;">
      <span class="title-img title-img--member-1" aria-hidden="true"></span>
      <div class="mod__body">
        <div class="placeholder">该模块内容已纳入右上角轮播</div>
      </div>
    </section>
    <section style="grid-area: tc;">
      <div class="mod__body">
        <!-- 顶部中间搜索：跳转至会员列表页 -->
        <TopSearchKpis v-model="keyword" :items="kpiItems" clickable @search="goToList" @kpi-click="onKpiClick" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <span class="title-img" :class="currentTitleClass" aria-hidden="true"></span>
      <div class="mod__body">
        <AutoCarousel
          v-model="carouselIndex"
          :slides="carouselSlides"
          :interval="6500"
          :pause-on-hover="true"
        />
      </div>
    </section>

    <!-- 中部：左 占位（学历已并入轮播） | 中 月度趋势 | 右 政治面貌  -->
    <section class="mod" style="grid-area: ml;">
      <span class="title-img title-img--member-3" aria-hidden="true"></span>
      <div class="mod__body">
        <div class="placeholder">该模块内容已纳入右上角轮播</div>
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <span class="title-img title-img--member-5" aria-hidden="true"></span>
      <div class="mod__body">
        <MonthTrend :values="monthVals" :yMax="monthMax" />
      </div>
    </section>

    <section class="mod mod--tall" style="grid-area: mr;">
      <span class="title-img title-img--member-b1" aria-hidden="true"></span>
      <div class="mod__body">
        <div class="split-vert">
          <PoliticsList :items="politicsItems" />

        </div>
      </div>
    </section>

    <!-- 底部：左数字 | 右行业分布 -->
    <section class="mod mod--wide" style="grid-area: bl;">
      <div class="mod__body">
        <div class="bottom-row">
          <div class="bottom-col">
            <span class="title-img title-img--member-b2" aria-hidden="true"></span>
            <SearchTodayTotal :today-total="todayTotal" :weekly-increase="weeklyIncrease" :progress="progress" />
          </div>
          <StripedBarChart :categories="industryCats" :values="industryVals" y-unit="人" :y-max="industryMax" :grid-left="64"
            :grid-right="20" :grid-bottom="66" :x-label-rotate="25" />

        </div>
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
import TopSearchKpis from '../components/member/TopSearchKpis.vue';
import AutoCarousel from '../components/AutoCarousel.vue';

import icon31x from '../images/org/title3/位图.png';
import icon32x from '../images/org/title3/位图@2x.png';
import icon41x from '../images/org/title4/位图.png';
import icon42x from '../images/org/title4/位图@2x.png';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { apiGet, niceMax } from '../utils/api';
import { getDict, type DictItem as DItem } from '../utils/dict';

// 顶部 KPI（来自 /business/member/allNum）
const kpiItems = ref([
  { title: '会员总数（人）', value: 0, icon1x: icon31x, icon2x: icon32x },
  { title: '新就业形态劳动者（人）', value: 0, icon1x: icon41x, icon2x: icon42x },
]);

// 顶左：性别分布（来自 /business/member/allNum）
const maleCount = ref<number>(0);
const femaleCount = ref<number>(0);

// ---------------- API ----------------
const API = {
  nation: '/business/member/nation',
  education: '/business/member/education',
  newMember: (year: number | string) => `/business/member/newMember/${year}`,
  position: '/business/member/position',
  threeDept: '/business/member/threeDept'
};

// 公共配色（环图/图例）
const palette = ['#6F85FF','#5EE0D2','#8D63FF','#4E8FFF','#6FD9C9','#8FB9FF','#A8C4FF','#7EC8FF','#5AA0FF','#9AA0AD','#C9D2FF','#D8D6D2'];

// 右上：会员民族分布（RingPie 使用次要民族，majorName 作为主民族）
type PieItem = { name: string; value: number; region?: string; color?: string };
const ethnicItems = ref<PieItem[]>([]);

// 中左：会员学历分布
const eduCats = ref<string[]>([]);
const eduVals = ref<number[]>([]);
const eduMax = ref<number>(1200);

// 顶右轮播：包含 性别/学历/民族 三个模块
const carouselIndex = ref(0);
const carouselSlides = computed(() => [
  {
    key: 'gender',
    titleClass: 'title-img--member-1',
    component: GenderDistribution,
    props: { maleCount: maleCount.value, femaleCount: femaleCount.value }
  },
  {
    key: 'education',
    titleClass: 'title-img--member-3',
    component: EducationBar,
    props: { categories: eduCats.value, values: eduVals.value, yMax: eduMax.value }
  },
  {
    key: 'ethnic',
    titleClass: 'title-img--member-2',
    component: EthnicDistribution,
    props: { items: ethnicItems.value, majorName: '汉族' }
  }
]);

const currentTitleClass = computed(() => {
  const s: any = carouselSlides.value[carouselIndex.value];
  return s ? s.titleClass : 'title-img--member-2';
});

// 中中：会员就业新业态（月度）
const monthVals = ref<number[]>(new Array(12).fill(0));
const monthMax = ref<number>(500);
const yearNow = new Date().getFullYear();

// 中右：会员政治面貌横向条形
const politicsItems = ref<{ name: string; value: number }[]>([]);

// 底部：小三级工会组织统计（左大数 + 右条形）
const todayTotal = ref<number>(0); // ysum
const weeklyIncrease = ref<number>(0); // lastWeek
const progress = ref<number>(64); // 进度：缺少明确口径，暂沿用示例值
const industryCats = ref<string[]>([]);
const industryVals = ref<number[]>([]);
const industryMax = ref<number>(1200);

onMounted(async () => {
  await Promise.allSettled([
    fetchMemberAllNum(),
    fetchNation(),
    fetchEducation(),
    fetchNewMember(yearNow),
    fetchPolitics(),
    fetchThreeDept()
  ]);
});

// 搜索跳转：带上分类 cat=member，关键词从 v-model 读取
const router = useRouter();
const keyword = ref('');
function goToList(kw?: string) {
  const k = (((kw ?? keyword.value) || '') as string).trim();
  router.push({
    name: 'grid-table-2',
    query: k ? { kw: k } : {}
  }).catch(() => void 0);
}

// KPI 点击：0=会员总数，1=新就业形态劳动者
const memberTypeDict = ref<DItem[] | null>(null);
async function ensureMemberTypeDict(): Promise<DItem[]> {
  if (memberTypeDict.value) return memberTypeDict.value;
  try { memberTypeDict.value = await getDict('memberType'); } catch { memberTypeDict.value = []; }
  return memberTypeDict.value || [];
}
function findNonNewValue(list: DItem[]): string {
  // 找到“非新业态”的值；找不到则按需求默认 '1'
  const hit = list.find((d) => String(d.label || '').includes('非新'));
  return String(hit?.value ?? '1');
}
function pickAnyNewValue(list: DItem[], fallback = '2'): string {
  // 从字典里挑一个“新业态”相关的值（排除“非新业态=1”）；兜底返回 '2'
  const nonNew = findNonNewValue(list);
  const hit = list.find((d) => String(d.value) !== nonNew);
  return String(hit?.value ?? fallback);
}
async function onKpiClick(i: number) {
  const query: Record<string, string> = {};
  if (i === 1) {
    // 新就业形态劳动者：跳到列表并预选“是否新业态=是”（不强制具体类型）
    query.isNew = '1';
  }
  router.push({ name: 'grid-table-2', query }).catch(() => void 0);
}

// 会员总览与性别分布
async function fetchMemberAllNum() {
  const d = await apiGet<any>('/business/member/allNum').catch(() => null);
  if (!d) return;
  const total = Number(d?.total || 0);
  const newMember = Number(d?.newMember || 0);
  maleCount.value = Number(d?.manNum || 0);
  femaleCount.value = Number(d?.womanNum || 0);
  const items = kpiItems.value.slice();
  if (items[0]) items[0].value = total;
  if (items[1]) items[1].value = newMember;
  kpiItems.value = items;
}

async function fetchNation() {
  const res = await apiGet<any>(API.nation).catch(() => null);
  const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const mapped = rows.map((r: any, i: number) => ({
    name: String((r?.name ?? '')).trim(),
    value: Number(r?.value ?? 0) || 0,
    region: typeof r?.region === 'string' ? String(r.region).trim() : undefined,
    color: palette[i % palette.length]
  })).filter((it: any) => it.name);
  if (mapped.length) ethnicItems.value = mapped;
}

async function fetchEducation() {
  const res = await apiGet<any>(API.education).catch(() => null);
  const cats: string[] = Array.isArray(res?.districts) ? res.districts.map((s: any) => String(s ?? '')) : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values.map((n: any) => Number(n) || 0) : [];
  if (cats.length && cats.length === vals.length) {
    eduCats.value = cats;
    eduVals.value = vals;
    eduMax.value = Number(res?.ymax ?? res?.yMax) || niceMax(vals, 10);
  }
}

async function fetchNewMember(year: number | string) {
  const res = await apiGet<any>(API.newMember(year)).catch(() => null);
  const cats: string[] = Array.isArray(res?.districts) ? res.districts.map((s: any) => String(s ?? '')) : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values.map((n: any) => Number(n) || 0) : [];
  // 将接口月份对齐到 1~12 月
  const target = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0') + '月');
  const map = new Map<string, number>();
  cats.forEach((m, i) => map.set(m, vals[i] ?? 0));
  monthVals.value = target.map((m) => Number(map.get(m) || 0));
  monthMax.value = Math.max(Number(res?.ymax ?? res?.yMax) || 0, niceMax(monthVals.value, 10));
}

async function fetchPolitics() {
  const res = await apiGet<any>(API.position).catch(() => null);
  const cats: string[] = Array.isArray(res?.districts) ? res.districts.map((s: any) => String(s ?? '')) : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values.map((n: any) => Number(n) || 0) : [];
  if (cats.length && cats.length === vals.length) {
    politicsItems.value = cats.map((name, i) => ({ name, value: vals[i] || 0 }));
  }
}

async function fetchThreeDept() {
  const res = await apiGet<any>(API.threeDept).catch(() => null);
  const cats: string[] = Array.isArray(res?.districts) ? res.districts.map((s: any) => String(s ?? '')) : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values.map((n: any) => Number(n) || 0) : [];
  if (cats.length && cats.length === vals.length) {
    industryCats.value = cats;
    industryVals.value = vals;
    industryMax.value = Number(res?.ymax ?? res?.yMax) || niceMax(vals, 10);
  }
  const total = Number(res?.ysum);
  if (Number.isFinite(total)) todayTotal.value = total as number;
  const lastWeek = Number(res?.lastWeek);
  if (Number.isFinite(lastWeek)) weeklyIncrease.value = lastWeek as number;
}
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

.placeholder { display: grid; place-items: center; color: rgba(42,111,240,0.65); font-weight: 700; font-size: 16px; }

/* 底部宽模块：左数字 + 右条形图 */
.bottom-row {
  display: grid;
  grid-template-columns: 520px 1fr;
  column-gap: 24px;
  align-items: start;
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
  /* 中行左模块：使用 member-v2/title/1 */
    background-image: -webkit-image-set(url('../images/member-v2/title/1/编组 21.png') 1x, url('../images/member-v2/title/1/编组 21@2x.png') 2x);
    background-image: image-set(url('../images/member-v2/title/1/编组 21.png') 1x, url('../images/member-v2/title/1/编组 21@2x.png') 2x);
  }
  
  .title-img--member-5 {
    width: 272px;
      /* 新图宽度 212 */
      height: 35px;
      /* 中行中模块：使用 member-v2/title/2 */
      background-image: -webkit-image-set(url('../images/member-v2/title/2/编组 21.png') 1x, url('../images/member-v2/title/2/编组 21@2x.png') 2x);
      background-image: image-set(url('../images/member-v2/title/2/编组 21.png') 1x, url('../images/member-v2/title/2/编组 21@2x.png') 2x);
    }
    
    /* 底部两个子模块的标题（左→右） */
    .bottom-col {
      display: grid;
      grid-template-rows: auto 1fr;
    }
    
    .title-img--member-b1 {
      width: 191px;
      height: 35px;
      background-image: -webkit-image-set(url('../images/member-v2/title/3/编组 21.png') 1x, url('../images/member-v2/title/3/编组 21@2x.png') 2x);
      background-image: image-set(url('../images/member-v2/title/3/编组 21.png') 1x, url('../images/member-v2/title/3/编组 21@2x.png') 2x);
    }
    
    .title-img--member-b2 {
      width: 212px;
      height: 35px;
      background-image: -webkit-image-set(url('../images/member-v2/title/4/编组 21.png') 1x, url('../images/member-v2/title/4/编组 21@2x.png') 2x);
      background-image: image-set(url('../images/member-v2/title/4/编组 21.png') 1x, url('../images/member-v2/title/4/编组 21@2x.png') 2x);
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
