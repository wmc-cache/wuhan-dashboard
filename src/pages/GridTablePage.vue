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

    <!-- 表格主体（占满剩余高度） -->
    <section class="table-wrap">
      <GridTable :columns="columns" :rows="pagedRows" :grid-template="gridTemplate" :visible-rows="20" :row-height="40"
        :show-header="false" @cell-click="onCellClick" />

      <!-- Loading -->
      <div v-if="loading" class="loading-overlay" aria-live="polite" aria-busy="true">
        <div class="spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>

      <div class="pager">
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background
          layout="total, prev, pager, next, jumper" @current-change="(p: number) => to(p)" />
      </div>
    </section>
  </main>
  <!-- 详情弹窗 -->
  <UnionDetailDialog v-model="showUnion" :data="unionDetail" title="工会详情" :width="1080" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GridTable, { ColumnDef } from '../components/GridTable.vue';
import UnionDetailDialog, { type UnionDetail } from '../components/UnionDetailDialog.vue';
// Element Plus 组件与样式（按需引入）
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElPagination } from 'element-plus';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';
import { apiGet, apiPostBlob } from '../utils/api';
import { getDict, labelOf, type DictItem as DItem } from '../utils/dict';

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
const gridTemplate = '60px 1.2fr 1fr 1fr 1.2fr 1fr 1fr 1.2fr 1fr';
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
}

const rows = ref<Row[]>([]);
const loading = ref(false);
const showUnion = ref(false);
const unionDetail = ref<UnionDetail | undefined>(undefined);
const exporting = ref(false);
const dictReady = ref(false);

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

async function onCellClick(payload: { row: Row; column?: ColumnDef }) {
  const id = (payload.row as any).id;
  if (!id) return;
  try {
    loading.value = true;
    const resp: any = await apiGet<any>(`/business/union/${encodeURIComponent(String(id))}`).catch(() => null);
    const d = (resp && (resp.data || resp)) || {};
    unionDetail.value = {
      fullname: d.fullname ?? '-',
      unitDistrictSuffix: d.unitDistrictSuffix || labelOf('sys_wuhan_quyu', d.orgDistrict, String(d.orgDistrict ?? '')),
      unitIndustry: labelOf('unitIndustry', d.unitIndustry, String(d.unitIndustry ?? '')),
      establishDate: d.establishDate || fmtDateFromYYYYMMDD(d.createunionDate),
      memberCount: d.memberCount ?? d.membership ?? '-',
      linkMan: d.linkMan ?? '-',
      linkPhone: d.linkPhone ?? d.chairmanMobile ?? d.unitTel ?? '-',
      chair: d.chair ?? d.chairmanName ?? d.chairman ?? '-',
      viceChair: d.viceResident ?? '-',
      parentUnionName: d.pName ?? d.parentUnionName ?? '-',
      legalDuty: d.legalDuty ?? '工会主席',
      isOpenSystem: normalizeBool(d.isConsult),
      isWorkerCongress: normalizeBool(d.workersCongress),
      childOrgCount: d.orgCount ?? '-',
    };
    showUnion.value = true;
  } finally {
    loading.value = false;
  }
}

function normalizeBool(v: any): boolean | string {
  if (v == null || v === '') return '-';
  const s = String(v).toLowerCase();
  if (s === 'true' || s === '1' || s === '是') return true;
  if (s === 'false' || s === '0' || s === '否') return false;
  const n = Number(v);
  if (Number.isFinite(n)) return n > 0;
  return '-';
}

// 拉取字典后再加载列表（避免初次渲染出现 code）
onMounted(async () => {
  regionOpts.value = await getDict('sys_wuhan_quyu');
  industryOpts.value = await getDict('unitIndustry');
  if (!industryOpts.value?.length) industryOpts.value = await getDict('unitlndustry');
  dictReady.value = true;
  syncRouteToForm();
  await fetchList();
});

watch(
  () => [
    route.query.kw,
    route.query.beginTime,
    route.query['params[beginTime]'],
    route.query.endTime,
    route.query['params[endTime]'],
  ],
  () => {
    const prevName = q.name;
    const prevDates = Array.isArray(q.dates) ? [...q.dates] : [];
    syncRouteToForm();
    const nameChanged = q.name !== prevName;
    const dateChanged = !datesEqual(q.dates, prevDates);
    if (!nameChanged && !dateChanged) return;
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

.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
.loading-overlay { position: absolute; inset: 12px; background: rgba(255,255,255,.6); display: grid; place-items: center; z-index: 5; border-radius: 8px; }
.spinner { width: 34px; height: 34px; border: 3px solid rgba(42,111,240,.25); border-top-color: #2a6ff0; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-text { margin-top: 8px; font-weight: 800; color: #2a6ff0; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
