<template>
  <main class="laomo__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <span class="title-img title-img--laomo-3" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoHonorDistribution :items="honorItems" />
      </div>
    </section>

    <section style="grid-area: tc;">
      <div class="mod__body" style="place-items: stretch;margin-top: 50px;">
        <LaomoFourStats :values="fourVals" />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <!-- 图片标题：劳模人员性别分布统计（2/7） -->
      <span class="title-img title-img--laomo-2" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoGenderDistribution :male-pct="malePct" :female-pct="femalePct" :male-count="maleCount" :female-count="femaleCount" />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <!-- 标题替换为第 8 号切图；内容改为排行列表样式 -->
      <span class="title-img title-img--laomo-8" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoSubsidyStatsList :items="subsidyItems" />
      </div>

    </section>

    <section class="mod" style="grid-area: mc;">
      <!-- 图片标题：劳模收入情况统计（4/7） -->
      <span class="title-img title-img--laomo-4" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoIncomeDistribution :categories="incomeCats" :values="incomeVals" :yMax="incomeMax" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">

      <span class="title-img title-img--laomo-5" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoAgeDistribution :items="ageItems" />
      </div>
    </section>

    <section class="mod " style="grid-area: bl;">
      <span aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoMemberNew :items="listItems" />
      </div>
    </section>

    <section class="mod mod--wide" style="grid-area: br;">

      <span class="title-img title-img--laomo-7" aria-hidden="true"></span>
      <div class="mod__body" style="place-items: stretch;">
        <LaomoRegionDistribution :categories="areaCats" :values="areaVals" :yMax="areaMax" />
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
import { ref, onMounted } from 'vue';
import { apiGet, niceMax } from '../utils/api';

// ---------------- 数据状态 ----------------
// 荣誉分类
const honorItems = ref<{ name: string; value: number }[]>([]);
// 补助排行
const subsidyItems = ref<{ name: string; people: number; amount: number }[]>([]);
// 收入折线
const incomeCats = ref<string[]>([]);
const incomeVals = ref<number[]>([]);
const incomeMax = ref<number>(1200);
// 年龄分布
const ageItems = ref<{ name: string; value: number }[]>([]);
// 区域分布
const areaCats = ref<string[]>([]);
const areaVals = ref<number[]>([]);
const areaMax = ref<number>(1200);
// 列表
const listItems = ref<{ id: string | number; name: string; union: string; joinedAt: string }[]>([]);
// 中部四数值 + 性别分布
const fourVals = ref<number[]>([]);
const maleCount = ref<number>(0);
const femaleCount = ref<number>(0);
const malePct = ref<number | string>(0);
const femalePct = ref<number | string>(0);

// ---------------- 挂载加载 ----------------
onMounted(async () => {
  await Promise.allSettled([
    fetchHonor(),
    fetchSubsidy(),
    fetchIncome(),
    fetchAge(),
    fetchArea(),
    fetchList(),
    fetchAllNum()
  ]);
});

// ---------------- API 拉取与映射 ----------------
async function fetchHonor() {
  const res = await apiGet<any>('/modelWorker/modelLevel').catch(() => null);
  const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const mapped = rows.map((r) => ({ name: String(r?.name ?? ''), value: Number(r?.value ?? 0) || 0 }))
    .filter((it) => it.name);
  if (mapped.length) honorItems.value = mapped;
}

async function fetchSubsidy() {
  const res = await apiGet<any>('/modelWorker/subsidy').catch(() => null);
  const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
  const mapped = rows.map((r) => ({
    name: String(r?.name ?? ''),
    people: Number(r?.value ?? 0) || 0,
    amount: parseAmount(r?.region)
  })).filter((it) => it.name);
  if (mapped.length) subsidyItems.value = mapped;
}

function parseAmount(v: any): number {
  if (v == null) return 0;
  const s = String(v);
  const m = s.match(/[0-9]+(?:\.[0-9]+)?/);
  return m ? Number(m[0]) : 0;
}

async function fetchIncome() {
  const res = await apiGet<any>('/modelWorker/income').catch(() => null);
  const cats: string[] = Array.isArray(res?.categories) ? res.categories : Array.isArray(res?.data?.categories) ? res.data.categories : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values : Array.isArray(res?.data?.values) ? res.data.values : [];
  const ymax = Number(res?.ymax ?? res?.data?.ymax);
  if (cats.length && vals.length) {
    incomeCats.value = cats.map((s: any) => String(s ?? ''));
    incomeVals.value = vals.map((n: any) => Number(n) || 0);
    incomeMax.value = Number.isFinite(ymax) && ymax > 0 ? ymax : niceMax(incomeVals.value, 10);
  }
}

async function fetchAge() {
  const res = await apiGet<any>('/modelWorker/age').catch(() => null);
  const rows: any[] = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
  const mapped = rows.map((r) => ({ name: String(r?.name ?? ''), value: Number(r?.value ?? 0) || 0 }))
    .filter((it) => it.name);
  if (mapped.length) ageItems.value = mapped;
}

async function fetchArea() {
  const res = await apiGet<any>('/modelWorker/area').catch(() => null);
  const cats: string[] = Array.isArray(res?.categories) ? res.categories : Array.isArray(res?.data?.categories) ? res.data.categories : [];
  const vals: number[] = Array.isArray(res?.values) ? res.values : Array.isArray(res?.data?.values) ? res.data.values : [];
  const ymax = Number(res?.ymax ?? res?.data?.ymax);
  if (cats.length && vals.length) {
    areaCats.value = cats.map((s: any) => String(s ?? ''));
    areaVals.value = vals.map((n: any) => Number(n) || 0);
    areaMax.value = Number.isFinite(ymax) && ymax > 0 ? ymax : niceMax(areaVals.value, 10);
  }
}

async function fetchList() {
  const res = await apiGet<any>('/modelWorker/list').catch(() => null);
  const rows: any[] = Array.isArray(res?.rows) ? res.rows : Array.isArray(res?.data?.rows) ? res.data.rows : [];
  const mapped = rows.map((r: any, i: number) => {
    const id = r?.id ?? i;
    const name = r?.name ?? r?.fullname ?? `劳模${i+1}`;
    const union = r?.union ?? r?.tjdw ?? r?.streetUnion ?? '';
    const joinedAt = formatDate(r?.createdTime ?? r?.sbsj ?? r?.provinceTime ?? r?.cityTime);
    return { id, name, union, joinedAt };
  });
  if (mapped.length) {
    const base = mapped.slice(0, 12);
    if (base.length < 12) {
      for (let i = base.length; i < 12; i++) {
        const ref = base[i % mapped.length] || mapped[0];
        base.push({
          id: `mw-auto-${i}`,
          name: `劳模${i + 1}`,
          union: ref?.union || '—',
          joinedAt: ref?.joinedAt || '2023-07-28'
        });
      }
    }
    listItems.value = base;
  }
}

function formatDate(v: any): string {
  if (!v) return '';
  const s = String(v);
  // 支持 ISO 字符串或 yyyy-MM-dd 等
  const d = new Date(s);
  if (Number.isFinite(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  // 纯数字年份：直接返回
  if (/^\d{4}(-\d{2}-\d{2})?$/.test(s)) return s.substring(0, 10);
  return String(s).slice(0, 10);
}

// 中部数据：四项统计 + 性别分布
async function fetchAllNum() {
  const d = await apiGet<any>('/modelWorker/allNum').catch(() => null);
  if (!d) return;
  const all = Number(d?.allModelWorker || 0);
  const retire = Number(d?.retireModelWorker || 0);
  const special = Number(d?.reimbursementModelWorker || 0);
  const low = Number(d?.subsidyModelWorker || 0);
  fourVals.value = [all, retire, special, low];
  maleCount.value = Number(d?.maleCount || 0);
  femaleCount.value = Number(d?.femaleCount || 0);
  malePct.value = d?.malePct ?? 0;
  femalePct.value = d?.femalePct ?? 0;
}
</script>

<style scoped lang="scss">
.laomo__grid {
  height: 940px;
  padding: 0 14px 16px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 300px 300px 1fr;
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
  padding: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod::before {
  content: '';
  position: absolute;
  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
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
  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
}

.mod--wide::before {
  content: '';
  position: absolute;
  left: 0;
  right: -2px;
  top: 0;
  bottom: 0;
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
