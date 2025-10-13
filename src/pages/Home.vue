<template>
  <main class="home__grid">
    <!-- 顶部：搜索条（自定义样式） -->
    <section class="tools">
      <TopSearch v-model="keyword" v-model:category="selCat" @search="onSearch" />
    </section>

    <section class="content">
      <!-- 左：分类导航（示意） -->
      <aside class="sidenav">
        <!-- 头部条形标题（还原视觉：左侧高光 + 渐变条） -->

        <!-- 列表（左侧竖线 + 项目） -->
        <ul class="nav-list">
          <li v-for="(n, i) in navItems" :key="i" class="nav-item" :class="{ 'is-active': activeIndex === i }"
            role="button" tabindex="0" @click="setActive(i)" @keyup.enter="setActive(i)"
            @keyup.space.prevent="setActive(i)">
            <span class="item-text">{{ n.title }}</span>
            <span class="item-count">（{{ n.count }}）</span>
          </li>
        </ul>
      </aside>

      <!-- 右：表格与分页 -->
      <section class="table-area">
        <GridTable
          :columns="columns"
          :rows="pagedRows"
          :grid-template="gridTemplate"
          :visible-rows="15"
          :row-height="44"
          :show-header="false"
          :fill-placeholder="true"
          @cell-click="onCellClick"
        />

        <div class="pager">
          <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background
            layout="total, prev, pager, next, jumper" @current-change="(p: number) => to(p)" />
        </div>
      </section>
    </section>
    <!-- Teleport 到 body，不占布局 -->
    <UnionDetailDialog v-model="showUnion" :data="unionData" title="工会详情" :width="1080" />
    <MemberDetailDialog v-model="showMember" :data="memberData" title="会员详情" :width="1080" />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import GridTable, { type ColumnDef } from '../components/GridTable.vue';
import TopSearch from '../components/TopSearch.vue';
import { ElPagination } from 'element-plus';
import 'element-plus/es/components/pagination/style/css';
import { useRouter, useRoute } from 'vue-router';
import UnionDetailDialog, { type UnionDetail } from '../components/UnionDetailDialog.vue';
import MemberDetailDialog, { type MemberDetail } from '../components/MemberDetailDialog.vue';
import { apiGet } from '../utils/api';

const router = useRouter();
const route = useRoute();
function goBack() { router.back(); }

// 搜索与筛选
const selCat = ref<'org' | 'member'>('org');
const keyword = ref('');

// 接口：模糊查询统计 + 列表
// - 统计：根据关键字返回类型分组计数（code/name/count）
// - 列表：/business/union/segmentation?searchCode=&code=&pageNum=&pageSize=
// 统计接口路径不确定，支持通过环境变量覆盖：VITE_SEGMENTATION_STATS_PATH
const API = {
  segList: '/business/union/segmentation',
  // 默认猜测路径；如不同，请在 .env.development 中设置 VITE_SEGMENTATION_STATS_PATH
  segStats:
    ((import.meta as any).env?.VITE_SEGMENTATION_STATS_PATH as string) ||
    '/business/union/segmentationCount'
};

// 列定义：根据后端字段自适应（优先展示“截图风格”的列；缺失时回退到已有字段）
const gridTemplate = computed(() => columns.value.map(() => '1fr').join(' '));
const columns = ref<ColumnDef[]>([]);

// 数据
interface Row {
  index: number;
  fullname: string;
  memberCount?: number;
  unitDistrictSuffix?: string;
  establishDate?: string;
  unitIndustry?: string;
  linkMan?: string;
  linkPhone?: string;
  chair?: string;
  // 可选的“截图风格”字段（若后端提供则自动显示）
  legalCode?: string;     // 法人证代码
  unitName?: string;      // 单位名称
  creditCode?: string;    // 统一社会信用代码
}

interface MemberRow {
  index: number;
  name: string;          // 会员姓名
  unionName?: string;    // 所属工会
  gender?: string;       // 性别
  joinAt?: string;       // 入会时间
}

const allRows = ref<any[]>([]); // 根据 selCat 切换 Row/MemberRow
const total = ref(0);
const pageSize = 15;
const page = ref(1);

// 左侧统计分类
type SegStat = { code: number; name: string; count: number };
const segStats = ref<SegStat[]>([]);
const activeCode = ref<number | undefined>(undefined); // 当前选中的结果类型 code

// 本地过滤/分页仅用于演示（会员 tab）。工会组织使用服务端分页。
const filtered = computed(() => {
  const kw = keyword.value.trim();
  if (selCat.value === 'member') {
    if (!kw) return allRows.value as MemberRow[];
    return (allRows.value as MemberRow[]).filter(r => r.name?.includes(kw));
  }
  // 组织：直接返回服务端数据
  return allRows.value as Row[];
});

const pagedRows = computed(() => {
  if (selCat.value === 'org') return filtered.value; // 服务端分页
  const start = (page.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});
function to(p: number) { page.value = p; if (selCat.value === 'org') fetchListFromApi(); }

const navItems = computed(() => {
  // 来自统计接口；若暂无数据则退回到单一分类
  if (segStats.value.length > 0) {
    return segStats.value.map((s) => ({ title: s.name || '—', count: s.count ?? 0, code: s.code }));
  }
  return [{ title: '全总法人系统', count: total.value || 0, code: undefined as any }];
});

// 左侧菜单激活项（默认选中第一个）
const activeIndex = ref(0);
function setActive(i: number) {
  activeIndex.value = i;
  // 同步选中 code 并重新加载（仅工会组织分类）
  const it = navItems.value[i] as any;
  activeCode.value = it?.code;
  if (selCat.value === 'org') fetchListFromApi();
}

async function onSearch() {
  page.value = 1;
  if (selCat.value === 'org') {
    await Promise.all([fetchStats(), fetchListFromApi()]).catch(() => void 0);
  }
}

// 弹框：工会详情/会员详情
const showUnion = ref(false);
const unionData = ref<UnionDetail | undefined>(undefined);
const showMember = ref(false);
const memberData = ref<MemberDetail | undefined>(undefined);
function onCellClick(payload: { row: any; column: ColumnDef }) {
  const r = payload.row as any;
  if (selCat.value === 'org' && payload.column.key === 'fullname') {
    unionData.value = {
      fullname: r.fullname,
      unitDistrictSuffix: r.unitDistrictSuffix,
      unitIndustry: r.unitIndustry || '-',
      establishDate: r.establishDate,
      memberCount: r.memberCount ?? Math.floor(100 + Math.random() * 500),
      linkMan: r.linkMan || (Math.random() > 0.5 ? '刘丽' : '王勇'),
      linkPhone: r.linkPhone || `18${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`,
      chair: r.chair || '李厉程',
      viceChair: r.viceChair || '王刚',
      parentUnionName: r.parentUnionName || '湖北省总工会',
      legalDuty: r.legalDuty || '工会主席',
      isOpenSystem: typeof r.isOpenSystem === 'boolean' ? r.isOpenSystem : true,
      isWorkerCongress: typeof r.isWorkerCongress === 'boolean' ? r.isWorkerCongress : false,
      childOrgCount: r.childOrgCount ?? 3210,
    } as UnionDetail;
    showUnion.value = true;
  } else if (selCat.value === 'member' && payload.column.key === 'name') {
    memberData.value = {
      name: r.name,
      gender: r.gender || (Math.random() > 0.5 ? '女' : '男'),
      joinAt: r.joinAt || '2024-02-02',
      duty: r.duty || '职务名称',
      politics: r.politics || '群众',
      union: r.unionName || '武汉市某某工会',
      age: r.age || 32,
      company: r.company || '单位名称',
      phone: r.phone || `18${Math.floor(1000 + Math.random() * 9000)}${Math.floor(1000 + Math.random() * 9000)}`,
      education: r.education || '本科',
      medInfo: { agency: '武钢集团有限公司工会', company: '武汉钢铁集团物流有限公司', startAt: '2024/01/01', endAt: '2024/12/31' },
      medPlans: [
        { type: '住院', count: '1份', money: '2,000元' },
        { type: '综合', count: '1份', money: '2,000元' },
        { type: '重疾', count: '1份', money: '2,000元' },
      ],
      medClaims: [
        { payType: '综合', disease: '佔位', startAt: '2024/01/02', endAt: '2024/01/02', fee: '2,000元' },
        { payType: '综合', disease: '佔位', startAt: '2024/01/02', endAt: '2024/01/02', fee: '2,000元' },
        { payType: '重疾', disease: '佔位', startAt: '2024/01/02', endAt: '2024/01/02', fee: '2,000元' },
      ],
      years: [2024, 2023, 2022, 2021]
    } as MemberDetail;
    showMember.value = true;
  }
}

function buildColumnsByData(sample?: Row | MemberRow) {
  if (selCat.value === 'member') {
    columns.value = [
      { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
      { key: 'name', title: '会员姓名', align: 'left', clickable: true },
      { key: 'unionName', title: '所属工会' },
      { key: 'gender', title: '性别' },
      { key: 'joinAt', title: '入会时间' },
    ];
    return;
  }
  if (!sample) return;
  // 如果存在截图风格的三个字段，则采用该列集合
  const hasLegal = !!(sample as any).legalCode;
  const hasUnitName = !!(sample as any).unitName;
  const hasCredit = !!(sample as any).creditCode;
  if (hasLegal || hasUnitName || hasCredit) {
    columns.value = [
      { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
      { key: 'fullname', title: '工会名称', clickable: true, align: 'left' },
      { key: 'legalCode', title: '法人证代码' },
      { key: 'unitName', title: '单位名称' },
      { key: 'creditCode', title: '单位统一信用代码' },
      { key: 'unitDistrictSuffix', title: '行政区划' },
      { key: 'establishDate', title: '成立时间' },
    ];
    return;
  }
  // 回退列：当后端只给出 unionName/orgCode/othersOrgCode/region/establishDate 等时
  columns.value = [
    { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
    { key: 'fullname', title: '工会名称', clickable: true, align: 'left' },
    { key: 'unitDistrictSuffix', title: '行政区划' },
    { key: 'establishDate', title: '成立时间' },
  ];
}

function mapRow(raw: any, i: number): Row {
  const r: Row = {
    index: i + 1,
    fullname: raw.fullname ?? raw.name ?? raw.unionName ?? raw.orgName ?? '',
    memberCount: toNum(raw.memberCount ?? raw.members),
    unitDistrictSuffix: raw.unitDistrictSuffix ?? raw.district ?? raw.area ?? raw.region,
    establishDate: normalizeDate(raw.establishDate ?? raw.createdAt ?? raw.foundedAt ?? raw.createTime),
    unitIndustry: raw.unitIndustry,
    linkMan: raw.linkMan ?? raw.contact,
    linkPhone: raw.linkPhone ?? raw.phone,
    chair: raw.chair ?? raw.chairman,
    // 兼容列表接口字段：orgCode -> 法人证代码；orgName -> 单位名称；othersOrgCode -> 统一社会信用代码
    legalCode: raw.legalCode ?? raw.licenseCode ?? raw.corporateCode ?? raw.orgCode,
    unitName: raw.unitName ?? raw.orgName,
    creditCode: raw.creditCode ?? raw.uscc ?? raw.socialCreditCode ?? raw.othersOrgCode,
  };
  return r;
}

function mapMemberRow(raw: any, i: number): MemberRow {
  return {
    index: i + 1,
    name: raw.name ?? raw.memberName ?? raw.username ?? `名称${i + 1}`,
    unionName: raw.unionName ?? raw.orgName ?? raw.fullname,
    gender: raw.gender ?? raw.sex ?? (i % 2 ? '女' : '男'),
    joinAt: raw.joinAt ?? raw.joinTime ?? raw.createdAt ?? '2024-03-02',
  } as MemberRow;
}

function toNum(v: any): number | undefined { const n = Number(v); return Number.isFinite(n) ? n : undefined; }

function normalizeDate(v: any): string | undefined {
  if (!v) return v;
  const s = String(v);
  // 兼容 2025-08-20T00:00:00.000+08:00
  if (s.includes('T')) return s.slice(0, 10);
  return s;
}

// ---------------- API: 统计 + 列表 ----------------
async function fetchStats() {
  // 若未提供统计接口路径，直接清空统计，由列表总数代替
  if (!API.segStats) { segStats.value = []; return; }
  try {
    const qs = new URLSearchParams();
    if (keyword.value?.trim()) qs.set('searchCode', keyword.value.trim());
    const url = `${API.segStats}?${qs.toString()}`;
    const resp = await apiGet<any>(url).catch(() => null);
    const arr = Array.isArray((resp as any)?.data) ? (resp as any).data : Array.isArray(resp) ? resp : [];
    const mapped: SegStat[] = arr.map((it: any) => ({
      code: Number(it.code ?? it.type ?? 0) || 0,
      name: String(it.name ?? it.title ?? ''),
      count: Number(it.count ?? it.total ?? 0) || 0
    }));
    if (mapped.length) {
      segStats.value = mapped;
      activeIndex.value = 0;
      activeCode.value = mapped[0].code;
    } else {
      segStats.value = [];
      activeCode.value = undefined;
    }
  } catch {
    segStats.value = [];
  }
}

async function fetchListFromApi() {
  page.value = Math.max(1, page.value);
  if (selCat.value === 'member') {
    // 暂无会员接口：保留本地演示数据
    const rows = Array.from({ length: 800 }, (_, i) => ({
      name: `名称${i + 1}`,
      unionName: `工会${(i % 20) + 1}`,
      gender: i % 2 ? '女' : '男',
      joinAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
    }));
    allRows.value = rows.map((r, i) => mapMemberRow(r, i));
    total.value = allRows.value.length;
    buildColumnsByData(allRows.value[0]);
    return;
  }

  try {
    const qs = new URLSearchParams();
    if (keyword.value?.trim()) qs.set('searchCode', keyword.value.trim());
    if (activeCode.value != null) qs.set('code', String(activeCode.value));
    qs.set('pageNum', String(page.value));
    qs.set('pageSize', String(pageSize));
    const url = `${API.segList}?${qs.toString()}`;
    const resp = await apiGet<any>(url).catch(() => null);
    const totalVal = Number((resp as any)?.total ?? (resp as any)?.count ?? 0) || 0;
    const rows = Array.isArray((resp as any)?.rows)
      ? (resp as any).rows
      : Array.isArray((resp as any)?.data)
      ? (resp as any).data
      : Array.isArray(resp)
      ? resp
      : [];
    total.value = totalVal;
    allRows.value = rows.map((r: any, i: number) => mapRow(r, i + (page.value - 1) * pageSize));
    buildColumnsByData(allRows.value[0]);
  } catch (e) {
    // 失败时不抛出，保留当前视图
  }
}

watch(selCat, async () => {
  // 切换分类：工会组织 -> 调接口；会员 -> 本地演示
  page.value = 1;
  if (selCat.value === 'org') {
    await Promise.all([fetchStats(), fetchListFromApi()]).catch(() => void 0);
  } else {
    segStats.value = [];
    await fetchListFromApi();
  }
  buildColumnsByData(allRows.value[0]);
});
onMounted(async () => {
  // 读取来自其他页面的查询参数：kw/cat
  const qKw = String(route.query.kw ?? '').trim();
  const qCat = String(route.query.cat ?? '');
  if (qKw) keyword.value = qKw;
  if (qCat === 'org' || qCat === 'member') selCat.value = qCat as any;
  // 初次加载
  if (selCat.value === 'org') {
    await Promise.all([fetchStats(), fetchListFromApi()]).catch(() => void 0);
  } else {
    await fetchListFromApi();
  }
  buildColumnsByData(allRows.value[0]);
});
</script>

<style scoped lang="scss">
.home__grid {
  height: 970px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  position: relative;
}

/* 背景替换：使用 src/images/home/home-bg/背景(1x/2x) */
.home__grid::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('../images/home/home-bg/背景.png');
  background-image: -webkit-image-set(url('../images/home/home-bg/背景.png') 1x, url('../images/home/home-bg/背景@2x.png') 2x);
  background-image: image-set(url('../images/home/home-bg/背景.png') 1x, url('../images/home/home-bg/背景@2x.png') 2x);
}

.tools { display: grid; grid-template-columns: 1fr; align-items: center; }

.content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}

.sidenav {
  border-radius: 10px;
  /* 左侧菜单背景替换：src/images/home/left-menu-bg/位图(1x/2x) */
  background-image: url('../images/home/left-menu-bg/位图.png');
  background-image: -webkit-image-set(url('../images/home/left-menu-bg/位图.png') 1x, url('../images/home/left-menu-bg/位图@2x.png') 2x);
  background-image: image-set(url('../images/home/left-menu-bg/位图.png') 1x, url('../images/home/left-menu-bg/位图@2x.png') 2x);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 40px rgba(120, 170, 255, .08);
  padding: 14px 12px;
}

/* 顶部标题条（还原设计） */
.menu-head {
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 14px 0 24px;
  margin: 2px 6px 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(255, 255, 255, .95) 0%, rgba(255, 255, 255, .75) 60%, rgba(255, 255, 255, .35) 100%);
  color: #2a6ff0;
  font-weight: 800;
}

.menu-head::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 20px;
  border-radius: 2px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 0 8px rgba(255, 255, 255, .65);
}

.menu-head__text {
  letter-spacing: .5px;
}

.menu-head__count {
  margin-left: 4px;
  color: #6a8dff;
  font-weight: 800;
}

/* 列表：左侧竖线 + 条目样式（还原设计） */
.nav-list {
  position: relative;
  list-style: none;
  margin: 8px 0 0;
  padding: 4px 0 0 28px;
  display: grid;
  gap: 18px;
}

.nav-list::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  border-radius: 1px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .9), rgba(255, 255, 255, .2));
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 800;
  color: #333333;
  min-height: 34px;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.nav-item .item-text {
  font-size: 16px;
}

.nav-item .item-count {
  color: #333333;
}

/* 激活样式：与顶部“省总数据源”条形样式一致，并放在左侧白线的右侧 */
.nav-item.is-active {
  position: relative;
  background: linear-gradient(90deg, rgba(255, 255, 255, .95) 0%, rgba(255, 255, 255, .75) 60%, rgba(255, 255, 255, .35) 100%);
  color: #2a6ff0;
  padding-left: 18px;
  /* 给左侧发光条留出空间 */
}

.nav-item.is-active .item-count {
  color: #6a8dff;
}

.nav-item.is-active::before {
  content: '';
  position: absolute;
  left: 6px;
  /* 位于左侧白线的右边，不会压住白线 */
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 20px;
  border-radius: 2px;
  background: rgba(255, 255, 255, .95);
  box-shadow: 0 0 8px rgba(255, 255, 255, .65);
}
.table-area {
  border-radius: 10px;
  background: rgba(235,241,247,.74);
  box-shadow: inset 0 0 40px rgba(120,170,255,.08);
  padding: 12px;
  display: grid;
  grid-template-rows: 1fr auto;
}

.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }

/* Teleport 弹框挂在 body；组件在模板中挂载，这里无需额外处理 */
</style>
