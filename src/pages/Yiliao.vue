<template>
  <main class="yiliao__grid">
    <!-- 顶部三块：参助性别 / 总指标概览 / 给付性别 -->
    <section class="mod" style="grid-area: tl;">
      <button @click="goToMore" class="mod__show-all" type="button" aria-label="查看更多">
        <img :src="showAll1x" :srcset="showAll2x + ' 2x'" alt="查看更多" />
      </button>
      <div class="mod__body mod__body--full">
        <GenderStat :male-count="joinMale" :female-count="joinFemale" />
      </div>
    </section>

    <!-- 中央大卡：合并原“总指标概览 + （预留）”两块，纵向跨两行 -->
    <section class="mod mod--tall metrics" style="grid-column: 2; grid-row: 1 / span 2;">
      <div></div>

      <div class="mod__body mod__body--full">
        <OverallOverview :years="years" :initial-year="year" :left-metrics="leftMetrics" :right-metrics="rightMetrics"
          @year-change="onYearChange" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <button @click="goToMore" class="mod__show-all" type="button" aria-label="查看更多">
        <img :src="showAll1x" :srcset="showAll2x + ' 2x'" alt="查看更多" />
      </button>
      <div class="mod__body mod__body--full">
        <PayoutGenderStat :male-count="payMale" :female-count="payFemale" />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <div></div>
      <div class="mod__body mod__body--full">
        <JoinAgeStat :data="joinAgeRows" />
      </div>
    </section>



    <section class="mod" style="grid-area: mr;">
      <div></div>
      <div class="mod__body mod__body--full">
        <PayoutAgeDist :data="payAgeRows" />
      </div>
    </section>

    <!-- 底部三块：参助类型 / 给付疾病前类 / 给付类型 -->
    <section class="mod" style="grid-area: bl;">
      <div class="mod__body mod__body--full">
        <JoinTypeStat :data="joinTypeRows" />
      </div>
    </section>

    <section class="mod" style="grid-area: bc;">
      <div></div>
      <div class="mod__body mod__body--full">
        <DiseaseCategoryDist :categories="illCats" :values="illVals" :y-max="illMax" />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <div class="mod__body mod__body--full">
        <PayoutTypeStat :data="payTypeRows" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 对接医疗互助接口，集中在页面拉取并将数据下发到各子组件
import GenderStat from '../components/yiliao/GenderStat.vue';
import PayoutGenderStat from '../components/yiliao/PayoutGenderStat.vue';
import JoinTypeStat from '../components/yiliao/JoinTypeStat.vue';
import JoinAgeStat from '../components/yiliao/JoinAgeStat.vue';
import PayoutTypeStat from '../components/yiliao/PayoutTypeStat.vue';
import PayoutAgeDist from '../components/yiliao/PayoutAgeDist.vue';
import DiseaseCategoryDist from '../components/yiliao/DiseaseCategoryDist.vue';
import OverallOverview from '../components/yiliao/OverallOverview.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiGet, niceMax } from '../utils/api';
import showAll1x from '../images/show-all/查看更多.png';
import showAll2x from '../images/show-all/查看更多@2x.png';

// ---------------- 年份 ----------------
const now = new Date().getFullYear();
const fallbackYears = [now, now - 1, now - 2];
const years = ref<number[]>([...fallbackYears]);
const year = ref<number>(fallbackYears[0]);

// ---------------- 总体概览（左/右三项） ----------------
type Metric = { label: string; value: number };
const leftMetrics = ref<Metric[]>([
  { label: '参加综合金额(元)', value: 0 },
  { label: '参加重大疾病金额(元)', value: 0 },
  { label: '参加住院金额(元)', value: 0 },
]);
const rightMetrics = ref<Metric[]>([
  { label: '给付综合金额(元)', value: 0 },
  { label: '给付重大疾病金额(元)', value: 0 },
  { label: '给付住院金额(元)', value: 0 },
]);

// ---------------- 顶部两侧性别统计 ----------------
const joinMale = ref<number>(0);   // 参加 男性
const joinFemale = ref<number>(0); // 参加 女性
const payMale = ref<number>(0);    // 给付 男性
const payFemale = ref<number>(0);  // 给付 女性
const router = useRouter();
function goToMore() {
  router.push({ name: 'grid-table-2' });
}

// ---------------- 年龄分布 ----------------
interface AgeRow { label: string; male: number; female: number }
const joinAgeRows = ref<AgeRow[]>([]);
const payAgeRows = ref<AgeRow[]>([]);

// ---------------- 类型统计（参加/给付） ----------------
interface SexStat { count: number; percent: number } // 0~1
interface TypeRow { name: string; male: SexStat; female: SexStat }
const joinTypeRows = ref<TypeRow[]>([]);
const payTypeRows = ref<TypeRow[]>([]);

// ---------------- 给付疾病分布 ----------------
const illCats = ref<string[]>([]);
const illVals = ref<number[]>([]);
const illMax = ref<number>(0);

onMounted(async () => {
  await loadYears();
  await loadAll(year.value);
});

function onYearChange(y: number) { year.value = y; loadAll(y); }

async function loadAll(y: number) {
  await Promise.allSettled([
    loadAllNum(y),
    loadJoinAge(y),
    loadPayAge(y),
    loadJoinType(y),
    loadPayType(y),
    loadPayIll(y)
  ]);
}

async function loadYears() {
  // 后端规范：/medicalMutual/getYear?type=1（1=医疗互助 2=困难救助 3=经费返还）
  const raw = await apiGet<any>('/medicalMutual/getYear?type=1').catch(() => null);
  const parsed = normalizeYearList(raw);
  if (parsed.length) {
    years.value = parsed;
    if (!parsed.includes(year.value)) {
      year.value = parsed[0];
    }
  } else {
    years.value = [...fallbackYears];
    if (!years.value.includes(year.value)) {
      year.value = years.value[0];
    }
  }
}

function normalizeYearList(raw: any): number[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.years)
      ? raw.years
      : Array.isArray(raw?.yearList)
        ? raw.yearList
        : Array.isArray(raw?.year)
          ? raw.year
          : Array.isArray(raw?.list)
            ? raw.list
            : typeof raw === 'string'
              ? raw.split(/[,;\s]+/)
              : [];
  const normalized = list
    .map((v) => {
      const num = Number(v);
      return Number.isFinite(num) ? Math.floor(num) : undefined;
    })
    .filter((v): v is number => typeof v === 'number' && v > 1900 && v < 3000);
  return Array.from(new Set(normalized)).sort((a, b) => b - a);
}

// 中部总体概览 + 顶部左右性别
async function loadAllNum(y: number) {
  const d = await apiGet<any>(`/medicalMutual/allNum/${y}`).catch(() => null);
  if (!d) return;
  leftMetrics.value = [
    { label: '参加综合金额(元)', value: Number(d?.zhJoin || 0) },
    { label: '参加重大疾病金额(元)', value: Number(d?.zdJoin || 0) },
    { label: '参加住院金额(元)', value: Number(d?.zyJoin || 0) }
  ];
  rightMetrics.value = [
    { label: '给付综合金额(元)', value: Number(d?.zhPay || 0) },
    { label: '给付重大疾病金额(元)', value: Number(d?.zdPay || 0) },
    { label: '给付住院金额(元)', value: Number(d?.zyPay || 0) }
  ];
  joinMale.value = Number(d?.joinMan || 0);
  joinFemale.value = Number(d?.joinWoman || 0);
  payMale.value = Number(d?.payMan || 0);
  payFemale.value = Number(d?.payWoman || 0);
}

// 参加年龄分布
async function loadJoinAge(y: number) {
  const r = await apiGet<any>(`/medicalMutual/joinAge/${y}`).catch(() => null);
  const ages: string[] = Array.isArray(r?.age) ? r.age : [];
  const maleArr: number[] = Array.isArray(r?.nums) ? r.nums.map((n: any) => Number(n) || 0) : [];
  const femaleArr: number[] = Array.isArray(r?.womanNums) ? r.womanNums.map((n: any) => Number(n) || 0) : [];
  const mapped: AgeRow[] = ages.map((label, i) => ({ label, male: maleArr[i] || 0, female: femaleArr[i] || 0 }));
  joinAgeRows.value = mapped.reverse(); // 与设计一致：从高龄到低龄
}

// 给付年龄分布
async function loadPayAge(y: number) {
  const r = await apiGet<any>(`/medicalMutual/payAge/${y}`).catch(() => null);
  const ages: string[] = Array.isArray(r?.age) ? r.age : [];
  const maleArr: number[] = Array.isArray(r?.nums) ? r.nums.map((n: any) => Number(n) || 0) : [];
  const femaleArr: number[] = Array.isArray(r?.womanNums) ? r.womanNums.map((n: any) => Number(n) || 0) : [];
  const mapped: AgeRow[] = ages.map((label, i) => ({ label, male: maleArr[i] || 0, female: femaleArr[i] || 0 }));
  payAgeRows.value = mapped.reverse();
}

// 参加类型统计（综合/住院/重疾）
async function loadJoinType(y: number) {
  const d = await apiGet<any>(`/medicalMutual/joinType/${y}`).catch(() => null);
  if (!d) return;
  joinTypeRows.value = buildTypeRows(d, '参加');
}

// 给付类型统计（综合/住院/重疾）
async function loadPayType(y: number) {
  const d = await apiGet<any>(`/medicalMutual/payType/${y}`).catch(() => null);
  if (!d) return;
  payTypeRows.value = buildTypeRows(d, '给付');
}

function buildTypeRows(d: any, kind: '参加' | '给付'): TypeRow[] {
  const map: Record<string, string> = { zh: '综合', zy: '住院', zj: '重疾' };
  const rows: TypeRow[] = [];
  for (const key of ['zy', 'zh', 'zj'] as const) {
    if (Array.isArray(d?.[key])) {
      const arr = d[key] as any[];
      const male = arr.find((x) => (x?.name || '').includes('男'));
      const female = arr.find((x) => (x?.name || '').includes('女'));
      const maleCount = Number(male?.value || 0);
      const femaleCount = Number(female?.value || 0);
      const total = maleCount + femaleCount || 1;
      const malePct = pctFromText(male?.region) ?? maleCount / total;
      const femalePct = pctFromText(female?.region) ?? femaleCount / total;
      rows.push({
        name: map[key] + kind,
        male: { count: maleCount, percent: malePct },
        female: { count: femaleCount, percent: femalePct }
      });
    }
  }
  return rows;
}

function pctFromText(s: any): number | undefined {
  if (typeof s !== 'string') return undefined;
  const m = s.match(/([0-9]+(?:\.[0-9]+)?)%/);
  if (m) return Math.max(0, Math.min(1, Number(m[1]) / 100));
  return undefined;
}

// 给付疾病分布（Top10）
async function loadPayIll(y: number) {
  const r = await apiGet<any>(`/medicalMutual/payIllType/${y}`).catch(() => null);
  const cats: string[] = Array.isArray(r?.districts) ? r.districts : [];
  const vals: number[] = Array.isArray(r?.values) ? r.values.map((n: any) => Number(n) || 0) : [];
  illCats.value = cats;
  illVals.value = vals;
  illMax.value = Number(r?.ymax) || niceMax(vals, 10);
}
</script>

<style scoped lang="scss">
.yiliao__grid {
  /* 所有模块平均减高：每行各减少 20px（顶/中/底），整体高度 -60px */
  height: 920px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 300px 300px 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bc br';
  /* 模块间距统一为 10px */
  gap: 0px;
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

.mod__show-all {
  position: absolute;
  top: 30px;
  right: 22px;
  padding: 10px;
  border: none;
  background: none;
  cursor: pointer;
  line-height: 0;
}

.mod__show-all img {
  display: block;
  width: 59px;
  height: 13px;
}
</style>
