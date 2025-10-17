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
            <el-input v-model="q.dept" placeholder="请输入" clearable class="w180" />
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
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import GridTable, { type ColumnDef } from '../components/GridTable.vue';
import { apiGet, apiPostBlob } from '../utils/api';
import { ElForm, ElFormItem, ElInput, ElButton, ElPagination } from 'element-plus';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';

const router = useRouter();
function goBack() { router.back(); }

// 查询条件
const q = reactive<{ kw: string; dept: string }>({ kw: '', dept: '' });

// 列定义：序号、劳模姓名、主管单位、推荐单位
const gridTemplate = '64px 1.6fr 1.8fr 1.6fr';
const columns: ColumnDef[] = [
  { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
  { key: 'name', title: '劳模姓名', align: 'left', clickable: true },
  { key: 'dept', title: '主管单位' },
  { key: 'unit', title: '推荐单位', align: 'right' }
];

interface Row { index: number; id: string | number; name: string; dept: string; unit: string }
const rows = ref<Row[]>([]);         // 当前页数据
const total = ref<number>(0);        // 后端总数

onMounted(async () => {
  await loadPage();
});

function onSearch() { page.value = 1; loadPage(); }
function onReset() { q.kw = ''; q.dept = ''; page.value = 1; loadPage(); }

// 分页
const pageSize = 30;
const page = ref(1);
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
const pagedRows = computed(() => rows.value);
async function to(p: number) { page.value = Math.min(pageCount.value, Math.max(1, p)); await loadPage(); }

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
    const header = ['序号', '劳模姓名', '主管单位', '推荐单位'];
    const lines = rows.value.map(r => [r.index, r.name, r.dept, r.unit]);
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

// 加载数据（服务端分页）
async function loadPage() {
  const params = new URLSearchParams();
  params.set('pageNum', String(page.value));
  params.set('pageSize', String(pageSize));
  if (q.kw) params.set('name', q.kw);
  if (q.dept) params.set('dept', q.dept);
  const url = `/modelWorker/list?${params.toString()}`;
  const res = await apiGet<any>(url).catch(() => null);
  const list: any[] = Array.isArray(res?.rows) ? res.rows : Array.isArray(res?.data?.rows) ? res.data.rows : [];
  total.value = Number(res?.total ?? res?.data?.total ?? list.length);
  const mapped: Row[] = list.map((r: any, i: number) => ({
    index: (page.value - 1) * pageSize + i + 1,
    id: r?.id ?? i,
    name: String(r?.name ?? r?.fullname ?? `劳模${i+1}`),
    dept: String(r?.streetUnion ?? r?.workUnit ?? r?.union ?? ''),
    unit: String(r?.tjdw ?? r?.union ?? r?.streetUnion ?? '')
  }));
  rows.value = mapped;
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

.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
</style>
