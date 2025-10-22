<template>
  <main class="home__grid">
    <!-- 顶部：搜索条（自定义样式） -->
    <section class="tools">
      <TopSearch v-model="keyword" v-model:category="selCat" @search="onSearch" />
      <div @click="goBack">
        <img class="btn-back__icon" :src="back1x" :srcset="back2x + ' 2x'" alt="返回" draggable="false" />
      </div>
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
        <div v-if="loadingStats" class="loading-overlay" aria-live="polite" aria-busy="true">
          <div class="spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>
      </aside>

      <!-- 右：表格与分页 -->
      <section class="table-area">
        <GridTable :columns="columns" :rows="pagedRows" :grid-template="gridTemplate" :visible-rows="15"
          :row-height="44" :show-header="false" :fill-placeholder="true" :highlight-fields="highlightFields" @cell-click="onCellClick" />

        <!-- 底部：左侧“列表详情”，右侧分页（还原截图位置） -->
        <div class="bottom-bar">
          <button class="detail-link" type="button" @click="onListDetail">列表详情》</button>
          <div class="pager">
            <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background
              layout="total, prev, pager, next, jumper" @current-change="(p: number) => to(p)" />
          </div>
        </div>
        <div v-if="loadingTable" class="loading-overlay" aria-live="polite" aria-busy="true">
          <div class="spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>
      </section>
    </section>
    <!-- Teleport 到 body，不占布局 -->
    <UnionDetailDialog v-model="showUnion" :data="unionData" title="工会详情" :width="1080" />
    <MemberDetailDialog v-model="showMember" :data="memberData" :search-code="memberSearchCode" title="会员详情" :width="1080" :default-tab="memberDefaultTab" />
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
import MemberDetailDialog, { type MemberDetail, type MemberDetailTab } from '../components/MemberDetailDialog.vue';
import { apiGet } from '../utils/api';
import { getDict, labelOf } from '../utils/dict';
import back1x from '../images/back/编组 4.png';
import back2x from '../images/back/编组 4@2x.png';

const router = useRouter();
const route = useRoute();
function goBack() { router.back(); }

// 搜索与筛选
const selCat = ref<'org' | 'member'>('org');
const keyword = ref('');
const API = {
  segList: '/business/union/segmentation',
  segStats:
    ((import.meta as any).env?.VITE_SEGMENTATION_STATS_PATH as string) ||
    '/business/union/segmentationCount',
  memStats:
    ((import.meta as any).env?.VITE_MEMBER_SEG_STATS_PATH as string) ||
    '/business/member/segmentationCount',
  memList:
    ((import.meta as any).env?.VITE_MEMBER_SEG_LIST_PATH as string) ||
    '/business/member/segmentation'
};

// 列定义：根据后端字段自适应（优先展示“截图风格”的列；缺失时回退到已有字段）
const gridTemplate = computed(() => columns.value.map(() => '1fr').join(' '));
const columns = ref<ColumnDef[]>([]);

// 数据
interface Row {
  id?: number | string;
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
  segments?: string[];
}

interface MemberRow {
  index: number;
  name: string;          // 会员姓名
  unionName?: string;    // 所属工会
  gender?: string;       // 性别
  joinAt?: string;       // 入会时间
  idNumber?: string;     // 身份证（用于详情接口）
  segments?: string[];
}

const allRows = ref<any[]>([]); // 根据 selCat 切换 Row/MemberRow
const total = ref(0);
const pageSize = 15;
const page = ref(1);
// Loading states
const loadingStats = ref(false);
const loadingTable = ref(false);

// 左侧统计分类
type SegStat = { code: number; name: string; count: number };
const segStats = ref<SegStat[]>([]);
const activeCode = ref<number | undefined>(undefined); // 当前选中的结果类型 code

// 服务端分页（组织 + 会员）。
const filtered = computed(() => {
  return allRows.value as Row[];
});

const pagedRows = computed(() => {
  return filtered.value; // 统一服务端分页
});
function to(p: number) { page.value = p; fetchListFromApi(); }

const segmentKeywords = computed(() => {
  const set = new Set<string>();
  allRows.value.forEach((row: any) => {
    const segs: unknown = row?.segments ?? row?.segment;
    if (Array.isArray(segs)) {
      segs.forEach((item) => {
        const s = typeof item === 'string' ? item.trim() : String(item ?? '').trim();
        if (s) set.add(s);
      });
    }
  });
  return Array.from(set).sort((a, b) => b.length - a.length);
});

const highlightFields = computed<Record<string, string | string[]>>(() => {
  const terms = new Set<string>();
  const kw = keyword.value.trim();
  if (kw) terms.add(kw);
  segmentKeywords.value.forEach((word) => terms.add(word));
  if (terms.size === 0) return {};
  const arr = Array.from(terms).sort((a, b) => b.length - a.length);
  if (selCat.value === 'member') {
    return { name: arr, unionName: arr };
  }
  return { fullname: arr, unitName: arr, legalCode: arr, creditCode: arr };
});

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
  // 同步选中 code 并重新加载（组织/会员均使用服务端分页）
  const it = navItems.value[i] as any;
  activeCode.value = it?.code;
  if (selCat.value === 'member') memberDefaultTab.value = tabFromCodeToMember(activeCode.value);
  fetchListFromApi();
}

async function onSearch() {
  page.value = 1;
  // 先拉取左侧菜单（获取 code），再用选中的 code 拉取右侧表格
  await fetchStats().catch(() => void 0);
  await fetchListFromApi().catch(() => void 0);
}

// 弹框：工会详情/会员详情
const showUnion = ref(false);
const unionData = ref<UnionDetail | undefined>(undefined);
const showMember = ref(false);
const memberData = ref<MemberDetail | undefined>(undefined);
const memberSearchCode = ref<string | undefined>(undefined);
const memberDefaultTab = ref<MemberDetailTab>('med');
function tabFromCodeToMember(code?: number): MemberDetailTab {
  switch (Number(code)) {
    case 3: return 'org';
    case 4: return 'med';
    case 5: return 'rescue';
    case 6: return 'help';
    case 7: return 'laomo';
    default: return 'med';
  }
}
async function onCellClick(payload: { row: any; column: ColumnDef }) {
  const r = payload.row as any;
  if (selCat.value === 'org' && payload.column.key === 'fullname') {
    // 优先使用行内 id；缺失则按名称检索一次拿到 id
    let id = r.id ?? r.unionId ?? r.sourceId;
    if (id == null && r.fullname) {
      const search = await apiGet<any>(`/business/union/list?fullname=${encodeURIComponent(String(r.fullname))}&pageNum=1&pageSize=1`).catch(() => null);
      const one = (search && (Array.isArray(search.rows) ? search.rows[0] : (Array.isArray(search.data) ? search.data[0] : undefined))) || undefined;
      id = one?.id ?? one?.unionId ?? one?.sourceId;
    }
    if (id == null) return;
    try {
      const resp = await apiGet<any>(`/business/union/${encodeURIComponent(String(id))}`).catch(() => null);
      const d = (resp && (resp.data || resp)) || {};
      unionData.value = {
        fullname: d.fullname ?? r.fullname ?? '-',
        unitDistrictSuffix: d.unitDistrictSuffix || labelOf('sys_wuhan_quyu', d.orgDistrict, String(d.orgDistrict ?? '')),
        unitIndustry: labelOf('unitIndustry', d.unitIndustry, String(d.unitIndustry ?? '')),
        establishDate: normalizeDate(d.establishDate ?? d.createunionDate ?? r.establishDate),
        memberCount: d.memberCount ?? d.membership ?? r.memberCount ?? '-',
        linkMan: d.linkMan ?? r.linkMan ?? '-',
        linkPhone: d.linkPhone ?? d.chairmanMobile ?? d.unitTel ?? r.linkPhone ?? '-',
        chair: d.chair ?? d.chairmanName ?? d.chairman ?? r.chair ?? '-',
        viceChair: d.viceResident ?? r.viceChair ?? '-',
        parentUnionName: d.pName ?? d.parentUnionName ?? r.parentUnionName ?? '-',
        legalDuty: d.legalDuty ?? '工会主席',
        isOpenSystem: d.isConsult ?? r.isOpenSystem ?? '-',
        isWorkerCongress: d.workersCongress ?? r.isWorkerCongress ?? '-',
        childOrgCount: d.orgCount ?? r.childOrgCount ?? '-',
      } as UnionDetail;
      showUnion.value = true;
    } catch {}
  } else if (selCat.value === 'member' && payload.column.key === 'name') {
    memberDefaultTab.value = tabFromCodeToMember(activeCode.value);
    memberData.value = {
      name: r.name,
      gender: r.gender,
      joinAt: r.joinAt,
      duty: r.duty,
      politics: r.politics,
      union: r.unionName,
      age: r.age,
      company: r.company,
      phone: r.phone,
      education: r.education,
    } as MemberDetail;
    memberSearchCode.value = r.idNumberBright || r.certificateNumBright || r.idNumber || r.certificateNum || r.certificateNo;
    showMember.value = true;
  }
}

// 底部“列表详情”点击，跳到表格详情页
function onListDetail() {
  // 需求：当顶部选择为“工会会员”时跳 GridTablePage2；否则跳工会组织列表
  if (selCat.value === 'member') {
    const kw = keyword.value.trim();
    const query = kw ? { name: kw } : undefined;
    router.push({ name: 'grid-table-2', query });
  } else {
    router.push({ name: 'grid-table' });
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
    id: raw.id ?? raw.unionId ?? raw.sourceId,
    index: i + 1,
    fullname: raw.fullname ?? raw.name ?? raw.unionName ?? raw.orgName ?? '',
    memberCount: toNum(raw.memberCount ?? raw.members),
    unitDistrictSuffix: (() => {
      const val = raw.unitDistrictSuffix ?? raw.orgDistrict ?? raw.district ?? raw.area ?? raw.region;
      return labelOf('sys_wuhan_quyu', val, String(val ?? ''));
    })(),
    establishDate: normalizeDate(raw.establishDate ?? raw.createdAt ?? raw.foundedAt ?? raw.createTime),
    unitIndustry: (() => {
      const code = raw.unitIndustry;
      return labelOf('unitIndustry', code, String(code ?? '-'));
    })(),
    linkMan: raw.linkMan ?? raw.contact,
    linkPhone: raw.linkPhone ?? raw.phone,
    chair: raw.chair ?? raw.chairman,
    // 兼容列表接口字段：orgCode -> 法人证代码；orgName -> 单位名称；othersOrgCode -> 统一社会信用代码
    legalCode: raw.legalCode ?? raw.licenseCode ?? raw.corporateCode ?? raw.orgCode,
    unitName: raw.unitName ?? raw.orgName,
    creditCode: raw.creditCode ?? raw.uscc ?? raw.socialCreditCode ?? raw.othersOrgCode,
    segments: normalizeSegments(raw.segment)
  };
  return r;
}

function mapMemberRow(raw: any, i: number): MemberRow {
  return {
    index: i + 1,
    name: raw.name ?? raw.memberName ?? raw.username ?? `名称${i + 1}`,
    unionName: raw.unionName ?? raw.orgName ?? raw.fullname,
    gender: raw.gender ?? raw.sex ?? (i % 2 ? '女' : '男'),
    joinAt: raw.joinAt ?? raw.joinDate ?? raw.joinTime ?? raw.createdAt ?? '2024-03-02',
    idNumber: raw.idNumberBright ?? raw.certificateNumBright ?? raw.idNumber ?? raw.certificateNum ?? raw.certificateNo,
    segments: normalizeSegments(raw.segment)
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

function normalizeSegments(seg: unknown): string[] {
  if (!Array.isArray(seg)) return [];
  const set = new Set<string>();
  seg.forEach((item) => {
    const s = typeof item === 'string' ? item.trim() : String(item ?? '').trim();
    if (s) set.add(s);
  });
  return Array.from(set).sort((a, b) => b.length - a.length);
}

// ---------------- API: 统计 + 列表 ----------------
async function fetchStats() {
  // 组织与会员分支：若无路径，直接清空统计
  const statPath = selCat.value === 'member' ? API.memStats : API.segStats;
  if (!statPath) { segStats.value = []; return; }
  try {
    loadingStats.value = true;
    const qs = new URLSearchParams();
    const searchCode = keyword.value?.trim() ?? '';
    qs.set('searchCode', searchCode);
    const query = qs.toString();
    const url = query ? `${statPath}?${query}` : statPath;
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
      if (selCat.value === 'member') memberDefaultTab.value = tabFromCodeToMember(activeCode.value);
    } else {
      segStats.value = [];
      activeCode.value = undefined;
      if (selCat.value === 'member') memberDefaultTab.value = 'med';
    }
  } catch {
    segStats.value = [];
    if (selCat.value === 'member') memberDefaultTab.value = 'med';
  } finally {
    loadingStats.value = false;
  }
}

async function fetchListFromApi() {
  page.value = Math.max(1, page.value);
  try {
    loadingTable.value = true;
    const qs = new URLSearchParams();
    const searchCode = keyword.value?.trim() ?? '';
    qs.set('searchCode', searchCode);
    if (activeCode.value != null) qs.set('code', String(activeCode.value));
    qs.set('pageNum', String(page.value));
    qs.set('pageSize', String(pageSize));
    const url = selCat.value === 'member' ? `${API.memList}?${qs.toString()}` : `${API.segList}?${qs.toString()}`;
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
    if (selCat.value === 'member') {
      allRows.value = rows.map((r: any, i: number) => mapMemberRow(r, i + (page.value - 1) * pageSize));
    } else {
      allRows.value = rows.map((r: any, i: number) => mapRow(r, i + (page.value - 1) * pageSize));
    }
    buildColumnsByData(allRows.value[0]);
  } catch (e) {
    // 失败时不抛出，保留当前视图
  } finally {
    loadingTable.value = false;
  }
}

watch(selCat, async () => {
  // 切换分类：先拉左侧菜单（拿到 code），再拉右侧表格
  page.value = 1;
  memberDefaultTab.value = selCat.value === 'member' ? tabFromCodeToMember(activeCode.value) : 'med';
  await fetchStats().catch(() => void 0);
  await fetchListFromApi().catch(() => void 0);
  buildColumnsByData(allRows.value[0]);
});
onMounted(async () => {
  // 预加载常用字典（区域/行业），供 mapRow 转义
  await getDict('sys_wuhan_quyu').catch(() => void 0);
  await getDict('unitIndustry').catch(() => void 0);
  // 容错：有些环境字典类型拼写为 unitlndustry
  const inds = await getDict('unitIndustry').catch(() => [] as any);
  if (!inds || inds.length === 0) await getDict('unitlndustry').catch(() => void 0);
  // 读取来自其他页面的查询参数：kw/cat
  const qKw = String(route.query.kw ?? '').trim();
  const qCat = String(route.query.cat ?? '');
  if (qKw) keyword.value = qKw;
  if (qCat === 'org' || qCat === 'member') selCat.value = qCat as any;
  // 初次加载：先拉左侧菜单，再拉右侧表格
  await fetchStats().catch(() => void 0);
  await fetchListFromApi().catch(() => void 0);
  if (selCat.value === 'member') memberDefaultTab.value = tabFromCodeToMember(activeCode.value);
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

.tools { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; }
/* 顶部 右侧返回按钮（与搜索按钮风格一致） */
.btn-back { height: 48px; padding: 0 16px 0 12px; border-radius: 12px; border: 2px solid rgba(90,160,255,.9); background: rgba(255,255,255,.96); color: #2a6ff0; font-weight: 900; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 18px rgba(30,100,220,.12), inset 0 0 20px rgba(120,170,255,.06); }
.btn-back__icon { width: 68px; height: 25px;cursor: pointer; }
.btn-back__text { line-height: 1; }

.content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}

.sidenav {
  position: relative;
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

.bottom-bar { display: flex; align-items: center; justify-content: space-between; color: #2a6ff0; padding-top: 8px; }
.pager { display: flex; align-items: center; }
.detail-link { cursor: pointer; color: #2a6ff0; font-weight: 700; background: rgba(255,255,255,.6); border: 1px solid rgba(42,111,240,.25); border-radius: 4px; padding: 4px 10px; }
.detail-link:hover { background: rgba(255,255,255,.8); }

/* loading overlays for sidenav and table-area */
.loading-overlay { position: absolute; inset: 12px; background: rgba(255,255,255,.6); display: grid; place-items: center; z-index: 5; border-radius: 8px; }
.spinner { width: 34px; height: 34px; border: 3px solid rgba(42,111,240,.25); border-top-color: #2a6ff0; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-text { margin-top: 8px; font-weight: 800; color: #2a6ff0; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Teleport 弹框挂在 body；组件在模板中挂载，这里无需额外处理 */
</style>
