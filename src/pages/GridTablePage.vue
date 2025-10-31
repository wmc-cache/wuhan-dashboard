<template>
  <main class="grid-page">
    <!-- 顶部：筛选（Element Plus） -->
    <section class="filters">
      <div class="flt-wrap">
        <!-- 居中表单项 -->
        <el-form inline :model="q" label-position="left" label-width="auto" class="flt flt--center">
          <el-form-item label="工会名称：">
            <el-input v-model="q.name" placeholder="请输入" clearable class="w160" />
          </el-form-item>
          <el-form-item label="所属区域：">
            <el-select v-model="q.regionCode" placeholder="选择" clearable class="w140">
              <el-option v-for="d in regionOpts" :key="String(d.value)" :label="d.label" :value="d.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="行业类别：">
            <el-select v-model="q.industryCode" placeholder="选择" clearable class="w140">
              <el-option v-for="i in industryOpts" :key="String(i.value)" :label="i.label" :value="i.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="成立时间：">
            <el-date-picker
              v-model="q.dates"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              unlink-panels
              class="w260"
            />
          </el-form-item>
        </el-form>
        <!-- 右侧按钮组 -->
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button :loading="exporting" @click="onExport">导出</el-button>
          <el-button type="primary" link @click="goBack">返回</el-button>
        </div>
      </div>
    </section>

    <!-- 主体：左侧树形菜单 + 右侧数据表 -->
    <section class="content-grid">
      <!-- 左侧树形菜单（示意同图） -->
      <aside class="side-tree">
        <div class="tree-header">
          <el-input
            v-model="treeFilter"
            placeholder="请输入工会名称"
            clearable
            class="tree-search"
          >
            <template #suffix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <el-scrollbar class="tree-scroll" height="100%">
          <el-tree
            ref="treeRef"
            class="org-tree"
            :data="treeData"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :indent="20"
            :icon="CaretRight"
            :default-expanded-keys="defaultExpandedKeys"
            @node-click="onTreeSelect"
          >
            <template #default="{ node, data }">
              <span :class="['tree-node-text', `lv-${node.level}`, { 'is-leaf': node.isLeaf }]">
                <el-icon v-if="node.isLeaf" class="leaf-arrow"><ArrowRight /></el-icon>
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </el-scrollbar>
      </aside>

      <!-- 表格主体（占满剩余高度） -->
      <div class="table-wrap table-area">
        <GridTable
          :columns="columns"
          :rows="pagedRows"
          :grid-template="gridTemplate"
          :visible-rows="20"
          :row-height="40"
          :show-header="false"
          :highlight-fields="highlightFields"
          @cell-click="onCellClick"
        />

        <!-- Loading -->
        <div v-if="loading" class="loading-overlay" aria-live="polite" aria-busy="true">
          <div class="spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>

        <div class="pager">
          <el-pagination
            v-model:current-page="page"
            :page-size="pageSize"
            :total="total"
            background
            layout="total, prev, pager, next, jumper"
            @current-change="(p: number) => to(p)"
          />
        </div>
      </div>
    </section>
  </main>
  <!-- 详情弹窗 -->
  <UnionDetailDialog v-model="showUnion" :data="unionDetail" :union-id="unionIdForDlg" :key="unionDlgKey" title="工会详情" :width="1080" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GridTable, { ColumnDef } from '../components/GridTable.vue';
import UnionDetailDialog, { type UnionDetail } from '../components/UnionDetailDialog.vue';
// Element Plus 组件与样式（按需引入）
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElPagination, ElTree, ElScrollbar } from 'element-plus';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';
import 'element-plus/es/components/tree/style/css';
import 'element-plus/es/components/scrollbar/style/css';
import { apiGet, apiPostBlob } from '../utils/api';
import { getDict, labelOf, type DictItem as DItem } from '../utils/dict';
import { unionSourceLabel } from '../utils/source';
import { Search, ArrowRight, CaretRight } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

// 简易筛选条件
// 查询条件：区域/行业使用字典 code 作为值
const q = reactive<{ name: string; regionCode: string | number | ''; industryCode: string | number | ''; dates: string[] }>(
  { name: '', regionCode: '', industryCode: '', dates: [] }
);
// 字典选项（来自 /business/dict/list?dictType=...）
type DictItem = DItem;
const regionOpts = ref<DictItem[]>([]);
const industryOpts = ref<DictItem[]>([]);

// 列定义（与视觉示意一致）
const gridTemplate = '60px 1.2fr 1fr 1fr 1.2fr 1fr 1fr 1.2fr 1fr 0.9fr';
const columns: ColumnDef[] = [
  { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
  { key: 'name', title: '工会名称', clickable: true, align: 'left' },
  { key: 'region', title: '所属区域' },
  { key: 'industry', title: '行业类别' },
  { key: 'createdAt', title: '成立时间' },
  { key: 'memberCount', title: '会员人数' },
  { key: 'contact', title: '联系人' },
  { key: 'phone', title: '联系电话' },
  { key: 'chairman', title: '工会主席' },
  { key: 'source', title: '来源' },
];

// 行定义与服务端数据
interface Row {
  id?: number | string;
  index: number; // 序号（当前页内序号）
  name: string;  // 工会名称
  region: string; // 所属区域（字典转义后）
  industry: string; // 行业类别（字典转义后）
  createdAt: string; // 成立时间（YYYY-MM-DD）
  memberCount: number; // 会员人数
  contact: string; // 联系人
  phone: string; // 联系电话
  chairman: string; // 工会主席
  source?: string; // 来源（映射后标签）
}

const rows = ref<Row[]>([]);
const loading = ref(false);
const showUnion = ref(false);
const unionDetail = ref<UnionDetail | undefined>(undefined);
const unionIdForDlg = ref<string | number | undefined>(undefined);
const unionDlgKey = ref(0); // 每次打开强制销毁重建
const exporting = ref(false);
const dictReady = ref(false);

// 左侧树形菜单：使用后端组织树接口 /business/union/deptTree/{id}
// 默认 root id：1613444429402624001
type TreeNode = { id: string | number; label: string; children?: TreeNode[] };
const treeFilter = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();
const DEFAULT_TREE_ID = '1613444429402624001';
const treeLoading = ref(false);
const treeRaw = ref<any[]>([]);
const treeData = computed<TreeNode[]>(() => normalizeTree(treeRaw.value));
const defaultExpandedKeys = ref<any[]>([]);

function normalizeTree(list: any): TreeNode[] {
  const arr = Array.isArray(list) ? list : list ? [list] : [];
  const mapNode = (n: any): TreeNode => {
    const id = n?.id ?? n?.deptId ?? n?.key ?? n?.value ?? n?.code ?? n?.uuid ?? n?.unionId ?? n?.orgId;
    const label = n?.label ?? n?.name ?? n?.title ?? n?.text ?? n?.fullname ?? n?.unionName ?? String(id ?? '');
    const children: any[] = n?.children || n?.childList || n?.nodes || n?.list || [];
    return { id: id ?? label, label: String(label || id || '-'), children: Array.isArray(children) ? children.map(mapNode) : undefined };
  };
  return arr.map(mapNode);
}

async function fetchTree(rootId?: string | number) {
  const id = rootId ?? DEFAULT_TREE_ID;
  try {
    treeLoading.value = true;
    const res: any = await apiGet(`/business/union/deptTree/${id}`).catch(() => null);
    // 常见返回：数组或对象，容错处理
    if (Array.isArray(res)) treeRaw.value = res;
    else if (res && typeof res === 'object') treeRaw.value = [res];
    else treeRaw.value = [];
    defaultExpandedKeys.value = [id];
  } catch {
    treeRaw.value = [];
  } finally { treeLoading.value = false; }
}

function filterNode(value: string, data: TreeNode) {
  if (!value) return true;
  return String(data.label).toLowerCase().includes(String(value).toLowerCase());
}
watch(treeFilter, (val) => { treeRef.value?.filter(val); });

function onTreeSelect(data: TreeNode) {
  // 只有叶子节点（没有 children）作为名称筛选
  const isLeaf = !data.children || data.children.length === 0;
  if (isLeaf) {
    q.name = data.label;
    onSearch();
  }
}

function resolveQueryValue(val: unknown): string {
  if (Array.isArray(val)) return String(val[0] ?? '');
  if (val == null) return '';
  return String(val);
}
function pickRouteQuery(...keys: string[]): string {
  const query = route.query as Record<string, unknown>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(query, key) && query[key] != null) {
      return resolveQueryValue(query[key]);
    }
  }
  return '';
}
function datesEqual(a?: string[] | null, b?: string[] | null): boolean {
  const arrA = Array.isArray(a) ? a : [];
  const arrB = Array.isArray(b) ? b : [];
  if (arrA.length !== arrB.length) return false;
  for (let i = 0; i < arrA.length; i += 1) {
    if (arrA[i] !== arrB[i]) return false;
  }
  return true;
}

function syncRouteToForm() {
  const kw = pickRouteQuery('kw').trim();
  if (q.name !== kw) q.name = kw;
  // 来自路由的所属区域（优先接受 orgDistrict，其次 regionCode/region）
  const regionFromRoute = pickRouteQuery('orgDistrict', 'regionCode', 'region');
  if (q.regionCode !== regionFromRoute) q.regionCode = regionFromRoute;
  const begin = pickRouteQuery('beginTime', 'params[beginTime]');
  const end = pickRouteQuery('endTime', 'params[endTime]');
  const routeDates = begin && end ? [begin, end] : [];
  const prevDates = Array.isArray(q.dates) ? [...q.dates] : [];
  if (!datesEqual(routeDates, prevDates)) {
    q.dates = routeDates.length ? routeDates : [];
  }
}

// 将 UI 查询条件转换为 API 参数
const API_PATH = '/business/union/list';
const pageSize = 20; // 每页条数
const page = ref(1);
const total = ref(0);

function toYYYYMMDD(s: string): string {
  // 输入 YYYY-MM-DD 或 YYYY/MM/DD 或 YYYYMMDD -> 统一为 YYYYMMDD
  if (!s) return s;
  const digits = s.replace(/[^0-9]/g, '');
  return digits.length === 8 ? digits : s;
}
function fmtDateFromYYYYMMDD(v?: string): string {
  if (!v) return '';
  const d = v.replace(/[^0-9]/g, '');
  if (d.length !== 8) return v;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

// 字典工具：把 code 翻译成 label；若未命中则回退原值
const dictLabel = (list: DictItem[], code: any, type?: string): string => {
  const found = list.find(d => String(d.value) === String(code));
  if (found) return found.label;
  return type ? labelOf(type, code) : (code == null || code === '' ? '' : String(code));
};

async function fetchList() {
  try {
    loading.value = true;
    const qs = new URLSearchParams();
    if (q.name?.trim()) qs.set('fullname', q.name.trim());
    // 字典值：仅当已拿到 code 时才传参；否则后端可能校验失败
    if (q.regionCode != null && q.regionCode !== '') qs.set('orgDistrict', String(q.regionCode));
    if (q.industryCode != null && q.industryCode !== '') qs.set('unitIndustry', String(q.industryCode));
    if (Array.isArray(q.dates) && q.dates.length === 2) {
      const [b, e] = q.dates;
      if (b) {
        qs.set('beginTime', String(b)); // 传 YYYY-MM-DD
        qs.set('params[beginTime]', String(b));
      }
      if (e) {
        qs.set('endTime', String(e));   // 传 YYYY-MM-DD
        qs.set('params[endTime]', String(e));
      }
    }
    qs.set('pageNum', String(page.value));
    qs.set('pageSize', String(pageSize));

    // 清理无效参数，避免传 "undefined"/"null"/空串
    ['orgDistrict', 'unitIndustry', 'beginTime', 'endTime', 'params[beginTime]', 'params[endTime]'].forEach((k) => {
      const v = qs.get(k);
      if (v == null || v === '' || v === 'undefined' || v === 'null') qs.delete(k);
    });
    const url = `${API_PATH}?${qs.toString()}`;
    const resp: any = await apiGet<any>(url).catch(() => ({}));
    const totalVal = Number(resp?.total ?? resp?.count ?? 0) || 0;
    const arr = Array.isArray(resp?.rows) ? resp.rows : Array.isArray(resp?.data) ? resp.data : [];

    total.value = totalVal;
    const startIdx = (page.value - 1) * pageSize;
    rows.value = (arr as any[]).map((r: any, i: number) => {
      // 所属区域：后端有时把 code 放在 unitDistrictSuffix，这里做一次兜底转换
      const rawRegion = r.unitDistrictSuffix ?? r.orgDistrict ?? r.unitDistrict ?? r.district ?? r.area ?? '';
      const rawStr = String(rawRegion ?? '').trim();
      const regionIsCode = /^\d{6}$/.test(rawStr);
      const regionName = regionIsCode
        ? dictLabel(regionOpts.value, rawStr, 'sys_wuhan_quyu')
        : (rawStr || dictLabel(regionOpts.value, r.orgDistrict ?? r.unitDistrict, 'sys_wuhan_quyu'));

      return {
        id: r.id ?? r.unionId ?? startIdx + i + 1,
        index: startIdx + i + 1,
        name: r.fullname ?? r.unitName ?? '-',
        region: regionName || '-',
        industry: dictLabel(industryOpts.value, r.unitIndustry, 'unitIndustry'),
        createdAt: fmtDateFromYYYYMMDD(r.establishDate ?? r.createunionDate ?? ''),
        memberCount: Number(r.memberCount ?? r.membership ?? 0) || 0,
        contact: r.linkMan ?? '-',
        phone: r.linkPhone ?? r.chairmanMobile ?? r.unitTel ?? '-',
        chairman: r.chair ?? r.chairmanName ?? r.chairman ?? '-',
        source: unionSourceLabel((r as any).source),
      } as Row;
    });
  } catch (e) {
    total.value = 0;
    rows.value = [];
  } finally { loading.value = false; }
}

function onSearch() { page.value = 1; fetchList(); }
function onReset() { q.name = ''; q.regionCode = ''; q.industryCode = ''; q.dates = []; page.value = 1; fetchList(); }
function goBack() { router.back(); }

// 导出：POST /business/union/export
const EXPORT_FIELDS = ['fullname', 'orgDistrict', 'unitIndustry', 'establishDate', 'memberCount', 'linkMan', 'linkPhone', 'chair'];
async function onExport() {
  try {
    exporting.value = true;
    const body: Record<string, any> = {
      fullname: q.name?.trim() || undefined,
      orgDistrict: q.regionCode !== '' ? q.regionCode : undefined,
      unitIndustry: q.industryCode !== '' ? q.industryCode : undefined,
      beginTime: Array.isArray(q.dates) && q.dates[0] ? q.dates[0] : undefined,
      endTime: Array.isArray(q.dates) && q.dates[1] ? q.dates[1] : undefined,
      exportFields: EXPORT_FIELDS.join(','),
    };
    // 清理 undefined/null/空串
    Object.keys(body).forEach(k => {
      const v = (body as any)[k];
      if (v == null || v === '' || v === 'undefined' || v === 'null') delete (body as any)[k];
    });
    const res = await apiPostBlob('/business/union/export', body);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fname = `工会列表_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.xlsx`;
    const a = document.createElement('a');
    a.href = url;
    // 从响应头取文件名（若后端提供）
    const cd = res.headers.get('Content-Disposition') || res.headers.get('content-disposition');
    const m = cd && /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
    const srv = m ? decodeURIComponent(m[1] || m[2]) : '';
    a.download = srv || fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    // 静默失败，避免打断流程（可按需加入 message）
  } finally {
    exporting.value = false;
  }
}

// 服务端分页：直接展示 rows
const pageCount = computed(() => Math.max(1, Math.ceil((total.value || 0) / pageSize)));
const pagedRows = computed(() => rows.value);
function to(p: number) { page.value = Math.min(pageCount.value, Math.max(1, p)); fetchList(); }

const highlightFields = computed<Record<string, string | string[]>>(() => {
  const map: Record<string, string | string[]> = {};
  const name = q.name.trim();
  if (name) map.name = name;
  if (q.regionCode !== '' && q.regionCode != null) {
    const label = dictLabel(regionOpts.value, q.regionCode, 'sys_wuhan_quyu').trim();
    if (label && label !== '-') map.region = label;
  }
  if (q.industryCode !== '' && q.industryCode != null) {
    const label = dictLabel(industryOpts.value, q.industryCode, 'unitIndustry').trim();
    if (label && label !== '-') map.industry = label;
  }
  return map;
});

async function onCellClick(payload: { row: Row; column?: ColumnDef }) {
  // 需求：不要等到接口返回数据后才打开弹框。先打开弹框，
  // 详情组件会在打开后自行请求 /business/union/detail 并显示 loading。
  const row: any = payload.row as any;
  const id = row.id ?? row.unionId ?? row.sourceId;
  if (!id && !row.name) return;
  unionIdForDlg.value = id;
  // 先给到最小信息，其他字段由弹框内部加载
  unionDetail.value = {
    fullname: String(row.name || row.fullname || '-'),
    unitDistrictSuffix: row.region || row.unitDistrictSuffix,
    unitIndustry: row.industry || row.unitIndustry,
    establishDate: row.establishDate || fmtDateFromYYYYMMDD(row.createunionDate),
    memberCount: row.memberCount,
    linkMan: row.linkMan,
    linkPhone: row.linkPhone,
    chair: row.chair,
    sourceLabel: row.source,
  } as UnionDetail;
  unionDlgKey.value += 1;
  showUnion.value = true;
}

// 布尔规范化：按“1 是，其余 否”，缺失也按 否
function normalizeBool(v: any): boolean {
  if (v == null || v === '') return false;
  const s = String(v).trim().toLowerCase();
  if (s === '1' || s === 'true' || s === '是' || s === 'y' || s === 'yes') return true;
  if (s === '0' || s === 'false' || s === '否' || s === 'n' || s === 'no') return false;
  const n = Number(v);
  if (Number.isFinite(n)) return n === 1;
  return false;
}

// 拉取字典后再加载列表（避免初次渲染出现 code）
onMounted(async () => {
  regionOpts.value = await getDict('sys_wuhan_quyu');
  industryOpts.value = await getDict('unitIndustry');
  if (!industryOpts.value?.length) industryOpts.value = await getDict('unitlndustry');
  dictReady.value = true;
  syncRouteToForm();
  // 组织树：默认 root id
  fetchTree();
  await fetchList();
});

watch(
  () => [
    route.query.kw,
    route.query.orgDistrict,
    route.query.regionCode,
    route.query.region,
    route.query.beginTime,
    route.query['params[beginTime]'],
    route.query.endTime,
    route.query['params[endTime]'],
  ],
  () => {
    const prevName = q.name;
    const prevRegion = q.regionCode;
    const prevDates = Array.isArray(q.dates) ? [...q.dates] : [];
    syncRouteToForm();
    const nameChanged = q.name !== prevName;
    const regionChanged = q.regionCode !== prevRegion;
    const dateChanged = !datesEqual(q.dates, prevDates);
    if (!nameChanged && !dateChanged && !regionChanged) return;
    page.value = 1;
    if (dictReady.value) fetchList();
  }
);
</script>

<style scoped lang="scss">
.grid-page {
  height: 970px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
}

.filters {
  border-radius: 10px;
  background: rgba(235, 241, 247, .74);
  box-shadow: inset 0 0 40px rgba(120, 170, 255, .08);
  padding: 6px 12px;
  position: relative;
}

.flt-wrap {
  position: relative;
}

.flt {
  display: flex;
  gap: 8px 12px;
}

.flt--center {
  align-items: center;
}

.flt :deep(.el-form-item__label) {
  //color: #2a6ff0;
  font-weight: 700;
}

.actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  gap: 8px;
}
.w160 { width: 160px; }
.w140 { width: 140px; }
.w260 { width: 260px; }

.content-grid { display: grid; grid-template-columns: 360px 1fr; gap: 12px; align-items: stretch; min-height: 0; }
.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; min-height: 0; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
.loading-overlay { position: absolute; inset: 12px; background: rgba(255,255,255,.6); display: grid; place-items: center; z-index: 5; border-radius: 8px; }
.spinner { width: 34px; height: 34px; border: 3px solid rgba(42,111,240,.25); border-top-color: #2a6ff0; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-text { margin-top: 8px; font-weight: 800; color: #2a6ff0; }
@keyframes spin { to { transform: rotate(360deg); } }

// 树面板样式
.side-tree { border-radius: 10px; background: rgba(42, 111, 240, .08); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 10px; display: grid; grid-template-rows: auto 1fr; min-width: 340px; height: 100%; min-height: 0; overflow: hidden; }
.tree-header { padding-bottom: 8px; }
.tree-search :deep(.el-input__wrapper) { border: 1px solid rgba(42, 111, 240, .08); box-shadow: inset 0 0 12px rgba(120,170,255,.15); }
.tree-search :deep(.el-input__inner::placeholder) { color: #9bb4cf; }
.tree-search :deep(.el-input__suffix) { color: #2a6ff0; }
.tree-scroll { flex: 1 1 auto; min-height: 0; height: 100%; }
.tree-scroll :deep(.el-scrollbar) { height: 100%; }
.tree-scroll :deep(.el-scrollbar__wrap) { max-height: 100%; background: transparent; }
.tree-scroll :deep(.el-scrollbar__view) { background: transparent; }
.org-tree { --el-tree-node-hover-bg-color: rgba(42,111,240,.08); --el-color-primary: #2a6ff0; background: transparent; }
.org-tree :deep(.el-tree-node),
.org-tree :deep(.el-tree-node__children),
.org-tree :deep(.el-tree-node__content) { background: transparent; }
.tree-node-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333; display: inline-flex; align-items: center; gap: 6px; }
.tree-node-text.lv-1 { font-size: 18px; font-weight: 800; }
.tree-node-text.lv-2 { font-size: 14px; font-weight: 700; }
.tree-node-text.lv-3, .tree-node-text.is-leaf { font-size: 14px; font-weight: 500; }
.leaf-arrow { color: #9db3cf; transform: translateY(-1px); }
// 也给节点容器一个默认色，包含箭头/图标
.org-tree :deep(.el-tree-node__content) { color: #333; height: 36px; 
 background: rgba(42, 111, 240, .08);
}
.org-tree :deep(.el-tree-node__content:hover) { background: rgba(42, 111, 240, .08); }
.org-tree :deep(.el-tree-node__expand-icon) { color: #333; font-size: 16px; margin-right: 4px; }
.org-tree :deep(.el-tree-node.is-expanded>.el-tree-node__children) { border-bottom: 1px solid rgba(120,170,255,.3); margin-right: 6px; }
.org-tree :deep(.el-tree-node) { padding-left: 2px; }
// 顶层节点之间的分隔线
.org-tree :deep(> .el-tree-node + .el-tree-node > .el-tree-node__content) { border-top: 1px solid rgba(120,170,255,.3); }
</style>
