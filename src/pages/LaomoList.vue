<template>
  <main class="grid-page">
    <!-- 顶部：筛选与操作 -->
    <section class="filters">
      <div class="flt-wrap">
        <el-form inline :model="q" label-position="left" label-width="auto" class="flt flt--center">
          <el-form-item label="姓名：">
            <el-input v-model="q.kw" placeholder="请输入" clearable class="w180" />
          </el-form-item>
          <el-form-item label="主管单位：">
            <el-select
              v-model="q.dept"
              placeholder="请选择"
              clearable
              filterable
              class="w180"
              :loading="deptLoading"
            >
              <el-option
                v-for="opt in deptOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申报年份：">
            <el-date-picker
              v-model="q.cityTime"
              type="year"
              value-format="YYYY"
              format="YYYY"
              placeholder="请选择"
              clearable
              class="w140"
            />
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button @click="exportCsv">导出</el-button>
          <el-button type="primary" link @click="goBack">返回</el-button>
        </div>
      </div>
    </section>

    <!-- 表格主体 -->
    <section class="table-wrap">
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
      <div class="pager">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          background
          layout="total, prev, pager, next, jumper"
          @current-change="(p:number) => to(p)"
        />
      </div>
    </section>
  </main>
  <MemberDetailDialog
    v-model="detailVisible"
    :data="detailData"
    :search-code="detailSearchCode"
    :default-tab="detailDefaultTab"
    title="会员详情"
    :width="1080"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import GridTable, { type ColumnDef } from '../components/GridTable.vue';
import { apiGet, apiPostBlob } from '../utils/api';
import { ElForm, ElFormItem, ElInput, ElButton, ElPagination, ElDatePicker, ElSelect, ElOption } from 'element-plus';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';
import 'element-plus/es/components/date-picker/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';
import MemberDetailDialog, { type MemberDetail, type MemberDetailTab } from '../components/MemberDetailDialog.vue';

const router = useRouter();
function goBack() { router.back(); }

// 查询条件
const q = reactive<{ kw: string; dept: string | number; cityTime: string }>({ kw: '', dept: '', cityTime: '' });

interface DictOption { label: string; value: string | number }
const deptOptions = ref<DictOption[]>([]);
const deptLoading = ref(false);
const selectedDeptLabel = computed(() => {
  const found = deptOptions.value.find(opt => opt.value === q.dept);
  return found ? found.label : typeof q.dept === 'string' ? q.dept : '';
});

// 列定义：序号、姓名、年龄、主管单位、成为劳模时间、是否历史
const gridTemplate = '64px 1.6fr 0.8fr 1.8fr 1.4fr 1.2fr';
const columns: ColumnDef[] = [
  { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
  { key: 'name', title: '姓名', align: 'left', clickable: true },
  { key: 'age', title: '年龄', align: 'center' },
  { key: 'workUnit', title: '主管单位', align: 'left' },
  { key: 'cityTime', title: '成为市劳模时间' },
  { key: 'isHistoryLabel', title: '是否历史数据', align: 'center' }
];

interface Row {
  index: number;
  id: string | number;
  name: string;
  age: string;
  workUnit: string;
  cityTime: string;
  isHistoryLabel: string;
  gender?: string;
  union?: string;
  duty?: string;
  phone?: string;
  education?: string;
  politics?: string;
  searchCode?: string;
  joinAt?: string;
}
const rows = ref<Row[]>([]);         // 当前页数据
const total = ref<number>(0);        // 后端总数

onMounted(async () => {
  await Promise.all([loadDeptDict(), loadPage()]);
});

function onSearch() { page.value = 1; loadPage(); }
function onReset() { q.kw = ''; q.dept = ''; q.cityTime = ''; page.value = 1; loadPage(); }

// 分页
const pageSize = 30;
const page = ref(1);
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
const pagedRows = computed(() => rows.value);
async function to(p: number) { page.value = Math.min(pageCount.value, Math.max(1, p)); await loadPage(); }

const highlightFields = computed<Record<string, string | string[]>>(() => {
  const map: Record<string, string | string[]> = {};
  const kwName = q.kw.trim();
  if (kwName) map.name = kwName;
  const kwDept = selectedDeptLabel.value.trim();
  if (kwDept) map.workUnit = kwDept;
  const kwCity = q.cityTime.trim();
  if (kwCity) map.cityTime = kwCity;
  return map;
});

// 导出：后端返回文件（xlsx），以 blob 下载
async function exportCsv() {
  const payload: any = {};
  if (q.kw) payload.name = q.kw;
  try {
    const res = await apiPostBlob('/modelWorker/export', payload);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    // 文件名从 Content-Disposition 解析
    let filename = '劳模列表.xlsx';
    const cd = res.headers.get('content-disposition') || '';
    const m = cd.match(/filename\*?=([^;]+)/i);
    if (m) {
      const raw = decodeURIComponent(m[1].replace(/^UTF-8''/i, '').replace(/\"/g, '').trim());
      if (raw) filename = raw;
    }
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl; a.download = filename; a.click();
    URL.revokeObjectURL(objUrl);
    return;
  } catch (err) {
    // 回退：导出当前页 CSV
    const header = ['序号', '姓名', '年龄', '主管单位', '成为市劳模时间', '是否历史数据'];
    const lines = rows.value.map(r => [
      String(r.index).padStart(2, '0'),
      r.name,
      r.age,
      r.workUnit,
      r.cityTime,
      r.isHistoryLabel
    ]);
    const csv = [header, ...lines].map(row => row.map(toCsvCell).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '劳模列表.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
function toCsvCell(v: any): string {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

async function loadDeptDict() {
  deptLoading.value = true;
  try {
    const res = await apiGet<any>('/modelWorker/dict?pid=1000').catch(() => null);
    const list: Array<{ name?: string; value?: string | number }> = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : Array.isArray(res?.rows)
          ? res.rows
          : [];
    deptOptions.value = list
      .filter(item => item && item.name)
      .map(item => ({ label: String(item.name), value: item.value ?? item.name }))
      .sort((a, b) => a.label.localeCompare(b.label, 'zh-Hans-CN'));
  } finally {
    deptLoading.value = false;
  }
}

// 加载数据（服务端分页）
async function loadPage() {
  const params = new URLSearchParams();
  params.set('pageNum', String(page.value));
  params.set('pageSize', String(pageSize));
  if (q.kw) params.set('name', q.kw);
  if (q.dept !== '' && q.dept !== undefined && q.dept !== null) params.set('tjdw', String(q.dept));
  if (q.cityTime) params.set('cityTime', q.cityTime);
  const url = `/modelWorker/list?${params.toString()}`;
  const res = await apiGet<any>(url).catch(() => null);
  const list: any[] = Array.isArray(res?.rows) ? res.rows : Array.isArray(res?.data?.rows) ? res.data.rows : [];
  total.value = Number(res?.total ?? res?.data?.total ?? list.length);
  const mapped: Row[] = list.map((r: any, i: number) => {
    const rawHistory = r?.isHistory ?? r?.ishistory;
    const isHistoryLabel = rawHistory === '1' || rawHistory === 1 ? '是' : '否';
    const cityTime = r?.cityTime ?? r?.approveTime ?? r?.approvalTime ?? r?.approveTimeStr;
    const phone = r?.phone ?? r?.mobile ?? r?.linkPhone ?? '';
    const education = r?.education ?? r?.educationName ?? '';
    const duty = r?.post ?? r?.job ?? r?.position ?? '';
    const politics = r?.politicsStatus ?? r?.politics ?? '';
    const joinAt = r?.joinAt ?? r?.joinDate ?? r?.joinTime ?? '';
    const unionName = r?.union ?? r?.streetUnion ?? r?.recommend ?? r?.unionName ?? '';
    const gender = r?.gender ?? r?.sex;
    return {
      index: (page.value - 1) * pageSize + i + 1,
      id: r?.id ?? i,
      name: String(r?.name ?? r?.fullname ?? `劳模${i + 1}`),
      age: r?.age != null ? String(r.age) : '',
      workUnit: String(r?.workUnit ?? r?.streetUnion ?? r?.union ?? ''),
      cityTime: cityTime != null ? String(cityTime) : '',
      isHistoryLabel,
      gender: gender != null ? String(gender) : undefined,
      union: unionName ? String(unionName) : '',
      duty: duty ? String(duty) : '',
      phone: phone ? String(phone) : '',
      education: education ? String(education) : '',
      politics: politics ? String(politics) : '',
      searchCode: r?.idNumberBright ?? r?.certificateNo ?? r?.certificateNum ?? r?.idCard,
      joinAt: joinAt ? String(joinAt) : ''
    };
  });
  rows.value = mapped;
}

// 详情弹框状态
const detailVisible = ref(false);
const detailData = ref<MemberDetail>({});
const detailSearchCode = ref<string | undefined>();
const detailDefaultTab = ref<MemberDetailTab>('laomo');

function onCellClick(payload: { row: Row; column: ColumnDef }) {
  if (payload.column.key !== 'name') return;
  const r = payload.row;
  detailData.value = {
    name: r.name,
    union: r.union || r.workUnit,
    joinAt: r.joinAt,
    gender: r.gender,
    age: r.age,
    company: r.workUnit,
    phone: r.phone,
    education: r.education,
    politics: r.politics,
    duty: r.duty
  };
  detailSearchCode.value = r.searchCode ? String(r.searchCode) : undefined;
  detailDefaultTab.value = 'laomo';
  detailVisible.value = true;
}
</script>

<style scoped lang="scss">
.grid-page { height: 970px; padding: 0 20px 20px; display: grid; grid-template-rows: auto 1fr; gap: 12px; }
.filters { border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 6px 12px; position: relative; }
.flt-wrap { position: relative; }
.flt { display: flex; gap: 8px 12px; }
.flt--center { align-items: center; }
.flt :deep(.el-form-item__label) { color: #2a6ff0; font-weight: 700; }
.actions { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 8px; }
.w180 { width: 180px; }
.w120 { width: 120px; }
.w140 { width: 140px; }

.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
</style>
