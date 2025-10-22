<template>
  <main class="aid__grid">
    <!-- 顶部概览（接口：/difficultRelief/profileBoard/{year}） -->
    <AidKpiRow :items="kpiItems" style="grid-column: 1 / -1;" />

    <!-- 左中：性别 + 年龄分布（接口：/difficultRelief/gender、/difficultRelief/age） -->
    <AidGenderAgePanel
      :gender="genderItems"
      :age-labels="ageLabels"
      :male="ageMale"
      :female="ageFemale"
      style="grid-column: 1 / span 2; grid-row: 2;"
    />

    <!-- 右中：单位排名（接口：/difficultRelief/unit/{year}） -->
    <AidUnitRanking :rows="unitRows" style="grid-area: mr;" />

    <!-- 底部：救助种类 人次/金额（接口：/difficultRelief/type/{year}） -->
    <AidTypePeople :categories="typeCats" :values="typePeopleVals" :y-max="typePeopleMax" style="grid-area: bl;" />
    <AidTypeAmount :categories="typeCats" :values="typeAmountVals" :y-max="typeAmountMax" style="grid-area: bc;" />

    <!-- 近期列表（/difficultRelief/maxAmout/{year}） -->
    <AidRecentList :rows="recentRows" style="grid-area: br;" @cell-click="onRecentCellClick" />
  </main>
  <!-- 详情弹窗：点击近期名单中的姓名 -->
  <MemberDetailDialog v-model="showMemberDlg" :data="memberDetail" :search-code="memberSearchCode" :default-tab="'rescue'" :width="1080" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiGet, niceMax } from '../utils/api';
import AidKpiRow from '../components/aid/KpiRow.vue';
import AidGenderAgePanel from '../components/aid/GenderAgePanel.vue';
import AidUnitRanking from '../components/aid/UnitRanking.vue';
import AidTypePeople from '../components/aid/TypePeople.vue';
import AidTypeAmount from '../components/aid/TypeAmount.vue';
import AidRecentList from '../components/aid/RecentList.vue';
import MemberDetailDialog, { type MemberDetail } from '../components/MemberDetailDialog.vue';

// 年份：默认取当年
const year = new Date().getFullYear();

// 顶部 KPI
type KpiItem = { label: string; value: number };
const kpiItems = ref<KpiItem[]>([
  { label: '申请总人次(人)', value: 0 },
  { label: '总金额(元)', value: 0 },
  { label: '四类金额(元)', value: 0 },
  { label: '临时救助金额(元)', value: 0 }
]);

// 性别 + 年龄分布
type Gender = { name: string; value: number; color?: string };
const genderItems = ref<Gender[]>([]);
const ageLabels = ref<string[]>([]);
const ageMale = ref<number[]>([]);
const ageFemale = ref<number[]>([]);

// 单位排名
interface UnitRow { name: string; count: number; amount: number; union: string }
const unitRows = ref<UnitRow[]>([]);

// 种类统计
const typeCats = ref<string[]>([]);
const typePeopleVals = ref<number[]>([]);
const typeAmountVals = ref<number[]>([]);
const typePeopleMax = ref<number>(0);
const typeAmountMax = ref<number>(0);

// 近期列表
interface RecentRow { name: string; type: string; date: string; idNumber?: string }
const recentRows = ref<RecentRow[]>([]);

onMounted(() => loadAll(year));

async function loadAll(y: number) {
  await Promise.allSettled([
    loadKpi(y),
    loadGender(y),
    loadAge(y),
    loadUnit(y),
    loadType(y),
    loadRecent(y)
  ]);
}

// /difficultRelief/profileBoard/{year}
async function loadKpi(y: number) {
  const d = await apiGet<any>(`/difficultRelief/profileBoard/${y}`).catch(() => null);
  if (!d) return;
  kpiItems.value = [
    { label: '申请总人次(人)', value: Number(d?.people || 0) },
    { label: '总金额(元)', value: Number(d?.amount || 0) },
    { label: '四类金额(元)', value: Number(d?.fourAmount || 0) },
    { label: '临时救助金额(元)', value: Number(d?.otherAmount || 0) }
  ];
}

// /difficultRelief/gender/{year}
async function loadGender(y: number) {
  const arr = await apiGet<any[]>(`/difficultRelief/gender/${y}`).catch(() => null);
  const male = Number(arr?.find((x) => (x?.name ?? '').includes('男'))?.value || 0);
  const female = Number(arr?.find((x) => (x?.name ?? '').includes('女'))?.value || 0);
  genderItems.value = [
    { name: '男性', value: male, color: '#2a6ff0' },
    { name: '女性', value: female, color: '#ff6b97' }
  ];
}

// /difficultRelief/age/{year}
async function loadAge(y: number) {
  const r = await apiGet<any>(`/difficultRelief/age/${y}`).catch(() => null);
  const ages: string[] = Array.isArray(r?.age) ? r.age : [];
  const maleArr: number[] = Array.isArray(r?.nums) ? r.nums.map((n: any) => Number(n) || 0) : [];
  const femaleArr: number[] = Array.isArray(r?.womanNums) ? r.womanNums.map((n: any) => Number(n) || 0) : [];
  const mapped = ages.map((label, i) => ({ label, male: maleArr[i] || 0, female: femaleArr[i] || 0 }));
  const rev = mapped.slice().reverse(); // 设计从高龄到低龄
  ageLabels.value = rev.map((x) => x.label);
  ageMale.value = rev.map((x) => x.male);
  ageFemale.value = rev.map((x) => x.female);
}

// /difficultRelief/unit/{year}
async function loadUnit(y: number) {
  const arr = await apiGet<any[]>(`/difficultRelief/unit/${y}`).catch(() => null);
  if (!Array.isArray(arr)) { unitRows.value = []; return; }
  unitRows.value = arr.map((it) => ({
    name: String(it?.name || ''),
    count: Number(it?.people || 0),
    amount: Number(it?.amount || 0),
    union: String(it?.areaName || '')
  }));
}

// /difficultRelief/type/{year}
async function loadType(y: number) {
  const d = await apiGet<any>(`/difficultRelief/type/${y}`).catch(() => null);
  const cats: string[] = Array.isArray(d?.type) ? d.type : [];
  const people: number[] = Array.isArray(d?.people) ? d.people.map((n: any) => Number(n) || 0) : [];
  const amount: number[] = Array.isArray(d?.amount) ? d.amount.map((n: any) => Number(n) || 0) : [];
  typeCats.value = cats;
  typePeopleVals.value = people;
  typeAmountVals.value = amount;
  typePeopleMax.value = niceMax(people, 10);
  typeAmountMax.value = niceMax(amount, 10);
}

// 近期列表（接口路径未提供，这里尝试 /difficultRelief/recent/{year}；若失败则保持空）
async function loadRecent(y: number) {
  const arr = await apiGet<any[]>(`/difficultRelief/maxAmout/${y}`).catch(() => null);
  if (!Array.isArray(arr)) { recentRows.value = []; return; }
  recentRows.value = arr.map((it) => ({
    name: String(it?.appName || it?.name || ''),
    type: String(it?.diseaseType || it?.type || ''),
    date: String(it?.reportDate || it?.date || ''),
    // 身份证字段用于详情检索：优先取明文；后备取脱敏（若后端支持）
    idNumber: it?.idNumberBright || it?.certificateNumBright || it?.idNumber || it?.certificateNum || it?.certificateNo
  }));
}

// 点击近期名单的“会员姓名”查看详情（默认展示“困难救助”tab）
const showMemberDlg = ref(false);
const memberDetail = ref<MemberDetail>({});
const memberSearchCode = ref<string | undefined>(undefined);
async function onRecentCellClick(payload: { row: RecentRow; column: any }) {
  if (!payload || payload.column?.key !== 'name') return;
  memberDetail.value = { name: payload.row.name };
  // 若接口未返回身份证，尝试按姓名查询一次以获取 searchCode
  let code = payload.row.idNumber;
  if (!code && payload.row.name) {
    const r: any = await apiGet<any>(`/business/member/list?name=${encodeURIComponent(payload.row.name)}&pageNum=1&pageSize=1`).catch(() => null);
    const one = (r && (Array.isArray(r?.rows) ? r.rows[0] : (Array.isArray(r?.data) ? r.data[0] : undefined))) || undefined;
    code = one?.idNumberBright || one?.certificateNumBright || one?.idNumber || one?.certificateNum || one?.certificateNo;
  }
  memberSearchCode.value = code;
  showMemberDlg.value = true;
}
</script>

<style scoped lang="scss">
.aid__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  /* 让左、中两列等宽，右列保持 540px（与右侧榜单一致） */
  grid-template-columns: 1fr 1fr 540px;
  grid-template-rows: 120px 1fr 1fr;
  grid-template-areas:
    'kpi kpi kpi'
    'ml mc mr'
    'bl bc br';
  /* 模块间距统一为 10px */
  gap: 0px;
}
</style>
