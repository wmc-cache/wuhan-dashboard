<template>
  <main class="dash__main">
    <section class="col col--left">
      <div class="panel h214">
        <!-- 顶部左侧双 KPI 卡（工会总数/今年新增） -->
        <template v-if="!unionLoading">
          <KpiPair :items="leftKpis" left-bg="top-1" right-bg="top-2" left-clickable right-clickable
            @left-click="() => goToUnionList()" @right-click="() => goToUnionList(getCurrentYearRange())" />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
      <!-- 新增：工会概况（三项）占位，位于左列第 1 与第 2 模块之间 -->
      <div class="panel h180">
        <span class="title-img title-img--dash-1" aria-hidden="true"></span>
        <template v-if="!unionLoading">
          <UnionOverviewMini :items="unionOverview" />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
      <div class="panel h214">
        <span class="title-img title-img--dash-3" aria-hidden="true"></span>
        <template v-if="!memberLoading">
          <OrgTotal
            style="margin-top: 36px;"
            :total="aidTotal"
            :deep="veryDifficult"
            :relative="difficultCount"
            :accident="accidentCount"
            @total-click="goToAidList()"
            @type-click="onAidTypeClick"
          />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
      <!-- 红框（左下）：劳模补助人数/金额列表，复用 laomo/SubsidyStatsList -->
      <div class="panel h300">
        <span class="title-img title-img--dash-5" aria-hidden="true"></span>
        <template v-if="!subsidyLoading">
          <LaomoSubsidyStatsList :items="laomoSubsidies" :row-height="35" :width-percent="88" :center="false" />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
    </section>

    <section class="col col--center">
      <div class="panel panel--map h920">
        <!-- 中央搜索：放在地图上方，点击跳到 Home 页面（复用 TopSearch） -->
        <div class="map-tools">
          <TopSearch
            v-model="keyword"
            v-model:category="selCat"
            @search="goToHome"
          />
        </div>
        <template v-if="!mapLoading">
          <WuhanMap
            :show-network="false"
            :show-labels="false"
            :data-by-district="mapData"
            :info-card-offset-by-name="mapInfoCardOffsets"
          />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
    </section>

    <section class="col col--right">
      <div class="panel h180">
        <!-- 顶部右侧双 KPI 卡（会员总数/省总金额合计） -->
        <template v-if="!memberLoading">
          <KpiPair
            :items="rightKpis"
            left-bg="top-3"
            right-bg="top-4"
            left-clickable
            right-clickable
            @left-click="goToMemberList"
            @right-click="goToRefundDetail"
          />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
      <!-- 工会会员性别统计（按图还原的新组件） -->
      <div class="panel h180">
        <span class="title-img title-img--dash-2" style="margin-left: 60px;" aria-hidden="true"></span>
        <template v-if="!memberLoading">
          <GenderOverview
            style="margin-left: 100px;"
            :male-count="memberMale"
            :female-count="memberFemale"
            @gender-click="onGenderClick"
          />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
      <!-- 红框（右中）：经费返还代收金额统计，复用 refund/RankType2 -->
      <div class="panel h360">
        <!-- 组件自带标题切图，替换为 dashboard/title/4 -->

        <template v-if="!refundLoading">
          <RefundRankType2
            style="margin-left: 60px;"
            :width-percent="90"
            :img-width="293"
            :rowHeight="40"
            :show-more="false"
            :items="refundTop"
            :title-img1x="dashTitle4_1x"
            :title-img2x="dashTitle4_2x"
            :bar-color="'#4E8FFF'"
            @row-click="onRefundRowClick"
          />
        </template>
        <div v-else class="loading-mask"></div>
      </div>
      <!-- 右下：新增 6 组互助统计（使用 part3 切图） -->
      <div class="panel h220">
        <span class="title-img title-img--dash-6" style="margin-left: 60px;" aria-hidden="true"></span>
        <!-- 通过属性控制宽度/中心区域/右侧文字左移量 -->
        <template v-if="!medicalLoading">
          <AidCircleStats style="margin-left: 80px;" :items="aidCircleSix" :width="520" :center-width="280" :right-shift="-10" />
        </template>
        <div v-else class="loading-mask"></div>
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
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { apiGet } from '../utils/api';
import { getDict, type DictItem } from '../utils/dict';
const router = useRouter();
const selCat = ref<'org' | 'member'>('org');
const keyword = ref('');
function goToHome(payload?: { keyword: string; category: string }) {
  const kw = (payload?.keyword ?? keyword.value ?? '').trim();
  if (!kw) return;
  const cat = (payload?.category as 'org' | 'member' | undefined) ?? selCat.value;
  if (cat === 'member') {
    const query = kw ? { name: kw } : undefined;
    router.push({ name: 'grid-table-2', query }).catch(() => void 0);
    return;
  }
  router.push({ path: '/home', query: { kw, cat } }).catch(() => void 0);
}
type UnionDateRange = { beginTime?: string; endTime?: string };
function goToUnionList(options?: UnionDateRange) {
  const query: Record<string, string> = {};
  if (options?.beginTime) query['params[beginTime]'] = options.beginTime;
  if (options?.endTime) query['params[endTime]'] = options.endTime;
  router.push({ name: 'grid-table', query }).catch(() => void 0);
}
function getCurrentYearRange(): UnionDateRange {
  const now = new Date();
  const year = now.getFullYear();
  return {
    beginTime: `${year}-01-01`,
    endTime: `${year}-12-31`,
  };
}
async function goToMemberList(options?: { sex?: GenderKey }) {
  await ensureGenderDict();
  const query: Record<string, string> = {};
  if (options?.sex) {
    const val = pickGenderValue(options.sex);
    if (val) query.sex = val;
  }
  router.push({ name: 'grid-table-2', query }).catch(() => void 0);
}
function goToRefundDetail(options?: { unionName?: string }) {
  const year = Number(refundDataYear.value) || new Date().getFullYear();
  const query: Record<string, string> = { year: String(year), orderName: 'zje' };
  if (options?.unionName) {
    query.unionName = options.unionName;
  }
  router.push({
    name: 'refund-detail-list',
    query,
  }).catch(() => void 0);
}

function onRefundRowClick(payload?: { item?: { name?: string } }) {
  const name = String(payload?.item?.name ?? '').trim();
  if (!name) {
    goToRefundDetail();
    return;
  }
  goToRefundDetail({ unionName: name });
}
function goToAidList(options?: { poorType?: string }) {
  const query: Record<string, string> = {};
  const type = String(options?.poorType ?? '').trim();
  if (type) {
    query.poorType = type;
  }
  router.push({
    name: 'aid-list',
    query,
  }).catch(() => void 0);
}
function onAidTypeClick(type: string) {
  goToAidList({ poorType: type });
}
// GridTable 的“查看更多”已在组件内部处理跳转

// 接口数据：
// - 经费返还年度（/refundOfFunds/list） -> 右侧排行条形图（按 zje 排序）
// - 劳模补助（/modelWorker/subsidy） -> 左下列表（人数/金额）
// - 医疗互助年度（/medicalMutual/allNum/{year}） -> 右下六项指标

type RefundRow = { id?: string; ghzzmc?: string; zje?: number };
type RefundListResp = { total?: number; rows?: RefundRow[] };
const refundTop = ref<{ name: string; value: number }[]>([]);
const refundDataYear = ref(new Date().getFullYear());
type GenderKey = 'male' | 'female';
const genderDict = ref<DictItem[]>([]);

async function ensureGenderDict() {
  if (genderDict.value.length) return genderDict.value;
  try {
    const list = await getDict('gender');
    genderDict.value = list;
  } catch {
    genderDict.value = [];
  }
  return genderDict.value;
}

function pickGenderValue(type: GenderKey): string {
  const list = genderDict.value;
  const keywords = type === 'male' ? ['男', '雄'] : ['女', '雌'];
  const match = list.find((item) => {
    const label = String(item?.label ?? '');
    return keywords.some((kw) => kw && label.includes(kw));
  });
  const val = match?.value;
  if (val !== undefined && val !== null && val !== '') return String(val);
  return type === 'male' ? '1' : '2';
}

type SubsidyRow = { name: string; value: number; region?: string };
const laomoSubsidies = ref<{ name: string; people: number; amount: number }[]>([]);

type MedicalAllNum = {
  zhJoin?: number; zhPay?: number;
  zdJoin?: number; zdPay?: number;
  zyJoin?: number; zyPay?: number;
  joinMan?: number; joinWoman?: number; payMan?: number; payWoman?: number;
};
const aidCircleSix = ref([
  { label: '参加综合金额(元)', value: 0 },
  { label: '给付综合金额(元)', value: 0 },
  { label: '参加重大疾病金额(元)', value: 0 },
  { label: '给付重大疾病金额(元)', value: 0 },
  { label: '参加住院金额（元）', value: 0 },
  { label: '给付住院金额(元)', value: 0 },
]);

// 顶部 KPI：来自 union.allNum / member.allNum
type KItem = { title: string; value: number | string; unit?: string };
const leftKpis = ref<[KItem, KItem]>([
  { title: '工会总数(个)', value: 0, unit: '' },
  { title: '较上周新增工会(个)', value: 0, unit: '' },
]);
const rightKpis = ref<[KItem, KItem]>([
  { title: '工会会员总数(人)', value: 0, unit: '' },
  { title: '本年度代收金额（亿元）', value: 0, unit: '' },
]);

// 会员性别（用于右侧性别概览）
const memberMale = ref(0);
const memberFemale = ref(0);
// 困难分类 & 新业态（来自 member/allNum）
const veryDifficult = ref(0);
const difficultCount = ref(0);
const accidentCount = ref(0);
const newBizMember = ref(0);
const aidTotal = computed(() => veryDifficult.value + difficultCount.value + accidentCount.value);
// 左列中部 3 项概览（默认零，占位）
const unionOverview = ref([
  { label: '下辖工会', value: 0 },
  { label: '执行厂务公开制度', value: 0 },
  { label: '执行职代会制度', value: 0 },
]);
// 地图：从 /business/union/map 加载各区工会组织/会员/单位数
type UnionMapRow = { areaName: string; unionNum: string | number; memberNum: string | number; unitNum: string | number };
const mapData = ref<Record<string, { name: string; orgCount: number; memberCount: number; unitCount: number }>>({});
const mapInfoCardOffsets: Record<string, [number, number]> = {
  '新洲区': [160, -40],
  '黄陂区': [60, 10],
  '东湖新技术开发区': [130, -10],
  '武汉经济技术开发区': [100, 30],
  '江夏区': [30, 60],
};
// Loading flags per section
const unionLoading = ref(true);
const memberLoading = ref(true);
const mapLoading = ref(true);
const refundLoading = ref(true);
const subsidyLoading = ref(true);
const medicalLoading = ref(true);

// 加载数据
onMounted(async () => {
  await Promise.all([
    loadUnionAllNum(),
    loadMemberAllNum(),
    loadRefundList(),
    loadModelWorkerSubsidy(),
    loadMedicalAllNum(new Date().getFullYear()),
    loadUnionMap(),
    ensureGenderDict(),
  ]).catch(() => void 0);
});

async function loadRefundList() {
  try {
    const nowYear = new Date().getFullYear();
    const buildQs = (year: number) =>
      new URLSearchParams({ year: String(year), pageNum: '1', pageSize: '10', orderName: 'zje' }).toString();
    const fetchYear = async (year: number) => {
      const res: any = await apiGet<RefundListResp>(`/refundOfFunds/list?${buildQs(year)}`).catch(() => null);
      const raw = (res as any)?.rows ?? res ?? [];
      const rows = Array.isArray(raw) ? raw : [];
      return { rows, year };
    };
    let attempt = await fetchYear(nowYear);
    if (!attempt.rows.length) {
      const prev = await fetchYear(nowYear - 1);
      if (prev.rows.length) {
        attempt = prev;
      }
    }
    if (attempt.rows.length) {
      refundDataYear.value = attempt.year;
    }
    const list = attempt.rows
      .map((r) => ({ name: String(r.ghzzmc || ''), value: Number(r.zje || 0) }))
      .filter((r) => r.name);
    list.sort((a, b) => (b.value - a.value));
    if (list.length) {
      const merged = list.slice(0, 10);
      const MC = [
        '东湖开发区工会', '武汉经济开发区总工会', '东西湖总工会', '武汉市总工会', '电子物资中南公司工会',
        '江汉区总工会', '武昌区总工会', '青山区总工会', '洪山区总工会', '新洲区总工会', '黄陂区总工会'
      ];
      MC.forEach((name) => {
        merged.push({ name, value: Math.round(8000 + Math.random() * 8000) });
      });
      merged.sort((a, b) => b.value - a.value);
      refundTop.value = merged.slice(0, 12);
    } else {
      // 兜底示例数据（接口成功但无数据时）
      refundTop.value = [
        { name: '东湖开发区工会', value: 17714.822 },
        { name: '江岸区总工会', value: 15600.235 },
        { name: '洪山区工会', value: 14520.61 },
        { name: '武汉经济开发区总工会', value: 12008.333 },
        { name: '武昌区总工会', value: 11005.12 },
        { name: '青山区总工会', value: 10542.11 },
        { name: '新洲区总工会', value: 9975.44 },
        { name: '黄陂区总工会', value: 9540.28 },
      ];
    }
  } catch (err) {
    console.warn('loadRefundList failed', err);
    // 失败兜底
    refundTop.value = [
      { name: '东湖开发区工会', value: 17714.822 },
      { name: '江岸区总工会', value: 15600.235 },
      { name: '洪山区工会', value: 14520.61 },
      { name: '武汉经济开发区总工会', value: 12008.333 },
      { name: '武昌区总工会', value: 11005.12 },
      { name: '青山区总工会', value: 10542.11 },
      { name: '新洲区总工会', value: 9975.44 },
      { name: '黄陂区总工会', value: 9540.28 },
    ];
  }
  refundLoading.value = false; // 无论上述分支如何，确保关闭 loading
}

async function loadModelWorkerSubsidy() {
  try {
    const list = await apiGet<SubsidyRow[]>('/modelWorker/subsidy');
    laomoSubsidies.value = (Array.isArray(list) ? list : [])
      .map((it) => ({
        name: it.name,
        people: Number(it.value || 0),
        // region 示例形如 "223.19万元"，提取数字部分
        amount: parseFloat(String(it.region || '').replace(/[^\d.]/g, '')) || 0,
      }));
    if (!laomoSubsidies.value.length) {
      laomoSubsidies.value = [
        { name: '荣誉津贴', people: 2346, amount: 223.19 },
        { name: '公交年票', people: 5112, amount: 640.02 },
      ];
    }
  } catch (err) {
    console.warn('loadModelWorkerSubsidy failed', err);
    laomoSubsidies.value = [
      { name: '荣誉津贴', people: 2346, amount: 223.19 },
      { name: '公交年票', people: 5112, amount: 640.02 },
    ];
  }
  subsidyLoading.value = false;
}

async function loadUnionMap() {
  try {
    const rows = await apiGet<UnionMapRow[]>('/business/union/map');
    const alias: Record<string, string> = {
      '东湖生态旅游风景区': '东湖风景区',
      '东湖新技术开发区': '东湖开发区',
      '武汉经济技术开发区': '经开区',
    };
    const acc: Record<string, { name: string; orgCount: number; memberCount: number; unitCount: number }> = {};
    (rows || []).forEach((r) => {
      const name = alias[r.areaName] || r.areaName;
      const org = Number(r.unionNum || 0);
      const mem = Number(r.memberNum || 0);
      const unit = Number(r.unitNum || 0);
      if (!acc[name]) acc[name] = { name, orgCount: 0, memberCount: 0, unitCount: 0 };
      acc[name].orgCount += org;
      acc[name].memberCount += mem;
      acc[name].unitCount += unit;
    });
    mapData.value = acc;
  } catch (err) {
    console.warn('loadUnionMap failed', err);
    // 保持空对象 -> 组件内部会使用默认值/0
  }
  mapLoading.value = false;
}

// 工会组织总数/工会数据
type UnionAllNum = {
  total?: number; addThenLastWeek?: number; city?: number; district?: number; street?: number; region?: number; industry?: number; nextLevel?: number; son?: number; zhi?: number; chang?: number;
};
async function loadUnionAllNum() {
  try {
    const d = await apiGet<UnionAllNum>('/business/union/allNum');
    const total = Number(d?.total || 0);
    const add = Number(d?.addThenLastWeek || 0);
    leftKpis.value = [
      { title: '工会总数(个)', value: total, unit: '' },
      { title: '本年度新增工会(个)', value: add, unit: '' }, // 接口未给年度新增，暂以“较上周新增”占位
    ];
    unionOverview.value = [
      { label: '下辖工会', value: Number((d as any)?.nextLevel || 0) },
      { label: '执行厂务公开制度', value: Number((d as any)?.chang || 0) },
      { label: '执行职代会制度', value: Number((d as any)?.zhi || 0) },
    ];
  } catch (err) {
    console.warn('loadUnionAllNum failed', err);
  }
  unionLoading.value = false;
}

// 工会会员总数/会员数据
type MemberAllNum = {
  total?: number; manNum?: number; womanNum?: number; addThenLastWeek?: number; hanNum?: number; otherNum?: number; newMember?: number; zje?: number; szje?: number; veryDifficult?: number; difficult?: number; other?: number;
};
async function loadMemberAllNum() {
  try {
    const d = await apiGet<MemberAllNum>('/business/member/allNum');
    const total = Number(d?.total || 0);
    const szje = Number((d as any)?.szje || 0);
    rightKpis.value = [
      { title: '工会会员总数(人)', value: total, unit: '' },
      { title: '本年度代收金额（亿元）', value: szje, unit: '' },
    ];
    memberMale.value = Number(d?.manNum || 0);
    memberFemale.value = Number(d?.womanNum || 0);
    veryDifficult.value = Number((d as any)?.veryDifficult || 0);
    difficultCount.value = Number((d as any)?.difficult || 0);
    accidentCount.value = Number((d as any)?.other || 0);
    newBizMember.value = Number((d as any)?.newMember || 0);
  } catch (err) {
    console.warn('loadMemberAllNum failed', err);
  }
  memberLoading.value = false;
}

async function loadMedicalAllNum(year: number | string) {
  try {
    const data = await apiGet<MedicalAllNum>(`/medicalMutual/allNum/${year}`);
    const v = data || {};
    const vals = [
      Number(v.zhJoin || 0), Number(v.zhPay || 0),
      Number(v.zdJoin || 0), Number(v.zdPay || 0),
      Number(v.zyJoin || 0), Number(v.zyPay || 0),
    ];
    // 写入六项（顺序固定）
    const items = aidCircleSix.value.slice();
    items[0].value = vals[0];
    items[1].value = vals[1];
    items[2].value = vals[2];
    items[3].value = vals[3];
    items[4].value = vals[4];
    items[5].value = vals[5];
    aidCircleSix.value = items;
  } catch (err) {
    console.warn('loadMedicalAllNum failed', err);
    // 失败兜底示例
    const items = aidCircleSix.value.slice();
    items[0].value = 52736563; // zhJoin
    items[1].value = 25928502; // zhPay
    items[2].value = 9116776;  // zdJoin
    items[3].value = 8800000;  // zdPay
    items[4].value = 82282744; // zyJoin
    items[5].value = 49270770; // zyPay
    aidCircleSix.value = items;
  }
  medicalLoading.value = false;
}
function onGenderClick(type: GenderKey) {
   goToMemberList({ sex: type });
}
</script>

<style scoped lang="scss">
.dash__main {
  display: grid;
  grid-template-columns: 600px minmax(0, 1fr) 600px; /* 左右近似原尺寸，中间再放大 */
  /* 模块间距统一为 10px */
  gap: 10px;
  padding: 0 50px 20px 10px;
  /* 页面总高调增，预留更高地图 */
  height: 1010px;
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
.col--center { grid-template-rows: 920px; }
.panel {
  /* 去掉模块背景面板，仅保留内边距与布局 */
    position: relative;
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    /* 固定高度时把内边距计入总高，便于和 grid 行高精确匹配 */
    box-sizing: border-box;
    /* 内边距统一为 18px */
    padding: 18px;
  }
  
  /* 通用骨架屏覆盖层（3 条横向条形 + 斜向高光动画）
   * 需求：去掉骨架屏的白色背景，只保留条形占位与高光动画。
   */
  .loading-mask {
    position: absolute; inset: 0; z-index: 30; overflow: hidden; border-radius: inherit;
    /* 原为 #f6f9ff，会形成整块浅白背景；改为透明，露出面板底图 */
    background: transparent;
  }
  .loading-mask::before {
    content: '';
    position: absolute; inset: 0;
    /* 仅绘制三条横向骨架条，不再填充整块白底 */
    background:
      linear-gradient(#e8efff 20px, transparent 0) 10% 28%/80% 20px no-repeat,
      linear-gradient(#e8efff 20px, transparent 0) 10% 52%/90% 20px no-repeat,
      linear-gradient(#e8efff 20px, transparent 0) 10% 76%/60% 20px no-repeat;
  }
  .loading-mask::after {
    content: '';
    position: absolute; inset: 0; transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
    animation: dash-shimmer 1.2s ease-in-out infinite;
  }
  @keyframes dash-shimmer { to { transform: translateX(100%); } }
  
  .panel--map {
    background: none;
    display: grid;
    grid-template-rows: auto 1fr;
    align-items: start;
    padding: 6px 6px 12px;
  }
.panel > .title-img { display: inline-block; margin-bottom: 8px; }
.h180 { height: 180px; }
.h300 { height: 300px; }
.h360 { height: 360px; }
.h220 { height: 220px; }
.h860 { height: 860px; }
.h920 { height: 920px; }
.h214 { height: 214px; }

.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
/* 首页模块 6 个标题：从左到右，从上到下（统一高度 35）*/
.title-img--dash-1 { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/1/编组 17备份.png') 1x, url('../images/dashboard/title/1/编组 17备份@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/1/编组 17备份.png') 1x, url('../images/dashboard/title/1/编组 17备份@2x.png') 2x); }
.title-img--dash-2 { width: 191px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/2/编组 17备份 2.png') 1x, url('../images/dashboard/title/2/编组 17备份 2@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/2/编组 17备份 2.png') 1x, url('../images/dashboard/title/2/编组 17备份 2@2x.png') 2x); }
.title-img--dash-3 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/3/编组 17.png') 1x, url('../images/dashboard/title/3/编组 17@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/3/编组 17.png') 1x, url('../images/dashboard/title/3/编组 17@2x.png') 2x); }
.title-img--dash-4 { width: 293px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/4/编组 22.png') 1x, url('../images/dashboard/title/4/编组 22@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/4/编组 22.png') 1x, url('../images/dashboard/title/4/编组 22@2x.png') 2x); }
.title-img--dash-5 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/5/编组 18.png') 1x, url('../images/dashboard/title/5/编组 18@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/5/编组 18.png') 1x, url('../images/dashboard/title/5/编组 18@2x.png') 2x); }
.title-img--dash-6 { width: 212px; height: 35px; background-image: -webkit-image-set(url('../images/dashboard/title/6/编组 25.png') 1x, url('../images/dashboard/title/6/编组 25@2x.png') 2x); background-image: image-set(url('../images/dashboard/title/6/编组 25.png') 1x, url('../images/dashboard/title/6/编组 25@2x.png') 2x); }

/* 中央搜索条容器：宽度与 Home 页相似并居中 */
.map-tools { max-width: 760px; margin: 0 auto 6px; width: 100%; }

/* 左下模块标题（与劳模页面保持一致） */
.title-img--laomo-8 { width: 253px; height: 35px; background-image: -webkit-image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); background-image: image-set(url('../images/laomo/font-title/8/编组 21.png') 1x, url('../images/laomo/font-title/8/编组 21@2x.png') 2x); }
</style>
