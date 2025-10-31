<template>
  <main class="grid-page">
    <!-- 顶部筛选：年份 + 排序字段 + 上级工会ID（可多选以","分隔） -->
    <section class="filters">
      <div class="flt-wrap">
        <el-form inline :model="q" label-position="left" label-width="auto" class="flt flt--center">
          <el-form-item label="年份：">
            <el-select v-model="q.year" class="w120">
              <el-option v-for="y in years" :key="y" :label="y + '年'" :value="y" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序：">
            <el-select v-model="q.orderName" class="w160">
              <el-option v-for="opt in orderOpts" :key="opt.value" :label="opt.label" :value="opt.value as any" />
            </el-select>
          </el-form-item>
          <el-form-item label="上级工会：">
            <el-select v-model="q.ids" placeholder="可多选" clearable multiple collapse-tags filterable class="w360">
              <el-option v-for="opt in unionOpts" :key="String(opt.value)" :label="opt.label" :value="String(opt.value)" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" link @click="goBack">返回</el-button>
        </div>
      </div>
    </section>

    <section class="table-wrap">
      <!-- 表格 Loading 遮罩：请求期间显示 -->
      <div v-if="loading" class="loading-mask">
        <div class="spinner" aria-hidden="true"></div>
        <div class="txt">加载中...</div>
      </div>
      <GridTable
        :columns="columns"
        :rows="rows"
        :grid-template="gridTemplate"
        :visible-rows="20"
        :row-height="40"
        :show-header="false"
        :highlight-fields="highlightFields"
        @cell-click="onCellClick"
      />
      <div class="pager">
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background layout="total, prev, pager, next, jumper" @current-change="(p:number)=>to(p)" />
      </div>
    </section>
  </main>
  <!-- 工会详情弹框：点击“企业名称/工会名称”打开 -->
  <UnionDetailDialog v-model="dlgOpen" :data="unionData" :union-id="unionIdForDlg" title="工会详情" :width="1080" />
  
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import GridTable, { type ColumnDef } from '../components/GridTable.vue';
import UnionDetailDialog, { type UnionDetail } from '../components/UnionDetailDialog.vue';
import { apiGet } from '../utils/api';
import { ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElButton, ElPagination } from 'element-plus';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';

const route = useRoute();
const router = useRouter();
function goBack(){ router.back(); }

// 年份与排序可选项
const years = [2021, 2022, 2023, 2024, 2025];
const orderOpts = [
  { label: '默认排序', value: '' },
  { label: '代收金额', value: 'zje' },
  { label: '省总金额', value: 'szje' },
  { label: '筹备金总额', value: 'choubei' },
  { label: '企业产业金额', value: 'qycyje' },
  { label: '市总金额', value: 'dsje' },
  { label: '区总金额', value: 'xsje' },
  { label: '基层金额', value: 'jcje' },
  { label: '手续费', value: 'sxf' },
];

// 顶部筛选模型：从路由 query 初始化
const q = reactive<{ year: number; orderName: string; ids: string[] }>({
  year: Number(route.query.year || new Date().getFullYear()),
  orderName: route.query.orderName !== undefined ? String(route.query.orderName) : '',
  ids: String(route.query.id || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
});

// 列定义与布局：序号 | 企业名称 | 八项金额（新增：筹备金总额）
const gridTemplate = '60px 2fr repeat(8, 1fr)';
// 固定保留两位小数，单位：万元
const moneyFmt = (n: any) => `${Number(n || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false })}万元`;
const columns: ColumnDef[] = [
  { key: 'index', title: '序号' },
  // 点击名称打开工会详情弹窗
  { key: 'qymc', title: '企业名称', align: 'left', clickable: true },
  { key: 'zje', title: '代收金额', formatter: (v)=>moneyFmt(v) },
  { key: 'szje', title: '省总金额', formatter: (v)=>moneyFmt(v) },
  { key: 'choubei', title: '筹备金总额', formatter: (v)=>moneyFmt(v) },
  { key: 'qycyje', title: '企业产业金额', formatter: (v)=>moneyFmt(v) },
  { key: 'dsje', title: '市总金额', formatter: (v)=>moneyFmt(v) },
  { key: 'xsje', title: '区总金额', formatter: (v)=>moneyFmt(v) },
  { key: 'jcje', title: '基层金额', formatter: (v)=>moneyFmt(v) },
  { key: 'sxf', title: '手续费', formatter: (v)=>moneyFmt(v) },
];

// 列表数据、分页
interface Row { index:number; qymc:string; zje:number; szje:number; choubei:number; qycyje:number; dsje:number; xsje:number; jcje:number; sxf:number }
const rows = ref<Row[]>([]);
const total = ref(0);
const pageSize = 20;
const page = ref(1);
const loading = ref(false);

const pageCount = computed(()=>Math.max(1, Math.ceil(total.value / pageSize)));
function to(p:number){ page.value = Math.min(pageCount.value, Math.max(1,p)); fetchList(); }

function onSearch(){ page.value = 1; fetchList(); persistQueryToUrl(); }
function onReset(){
  q.orderName = '';
  q.ids = [];
  q.year = new Date().getFullYear();
  page.value = 1;
  fetchList();
  persistQueryToUrl();
}

function persistQueryToUrl(){
  try{
    const query: Record<string, string> = {
      year: String(q.year),
      orderName: String(q.orderName ?? ''),
    };
    if (q.ids?.length) query.id = q.ids.join(',');
    router.replace({ query });
  }catch{}
}

async function fetchList(){
  loading.value = true;
  try{
    const params = new URLSearchParams();
    params.set('year', String(q.year));
    params.set('pageNum', String(page.value));
    params.set('pageSize', String(pageSize));
    params.set('orderName', String(q.orderName ?? ''));
    if(q.ids && q.ids.length) params.set('id', q.ids.join(','));
    const resp: any = await apiGet(`/refundOfFunds/detailList?${params.toString()}`).catch(()=>null);
    const list: any[] = Array.isArray(resp?.rows) ? resp.rows : [];
    total.value = Number(resp?.total || list.length || 0) || 0;
    rows.value = list.map((r:any, i:number)=>({
      index: (page.value-1)*pageSize + i + 1,
      qymc: String(r?.qymc || r?.ghzzmc || '-'),
      zje: Number(r?.zje || 0),
      szje: Number(r?.szje || 0),
      choubei: Number(r?.choubei || 0),
      qycyje: Number(r?.qycyje || 0),
      dsje: Number(r?.dsje || 0),
      xsje: Number(r?.xsje || 0),
      jcje: Number(r?.jcje || 0),
      sxf: Number(r?.sxf || 0),
    }));
  }catch(e){ rows.value = []; total.value = 0; }
  finally{ loading.value = false; }
}

// 初始化
// 工会下拉
interface Opt { label: string; value: string }
const unionOpts = ref<Opt[]>([]);

const highlightFields = computed<Record<string, string | string[]>>(() => {
  const map: Record<string, string | string[]> = {};
  if (q.ids.length) {
    const labels = q.ids
      .map((id) => {
        const found = unionOpts.value.find((opt) => String(opt.value) === String(id));
        return found?.label?.trim() ?? '';
      })
      .filter((label) => label.length > 0);
    if (labels.length) map.qymc = labels;
  }
  return map;
});

async function loadUnions(){
  try{
    const arr: any[] = await apiGet('/refundOfFunds/union').catch(()=>[]);
    unionOpts.value = (Array.isArray(arr)?arr:[]).map((it:any)=>({ label: String(it?.name ?? it?.label ?? it?.value ?? ''), value: String(it?.value ?? it?.id ?? '') })).filter(o=>o.value);
  }catch{ unionOpts.value = []; }
}

onMounted(async () => {
  await loadUnions();
  // 若路由带了 unionName（逗号分隔），将其映射为 ids 并预选
  if (!q.ids.length) {
    const unionNameStr = String(route.query.unionName || route.query.unions || route.query.union || '').trim();
    if (unionNameStr) {
      const toIds = (name: string) => {
        const n = name.trim();
        const found = unionOpts.value.find(o => String(o.label).trim() === n);
        return found?.value;
      };
      const ids = unionNameStr.split(',').map(s => s.trim()).filter(Boolean).map(toIds).filter(Boolean) as string[];
      if (ids.length) q.ids = ids;
    }
  }
  persistQueryToUrl();
  await fetchList();
});

// 点击名称打开“工会详情”
const dlgOpen = ref(false);
const unionData = ref<Partial<UnionDetail> | undefined>(undefined);
const unionIdForDlg = ref<string | number | undefined>(undefined);
function onCellClick(payload: { row: any; column: ColumnDef }) {
  if (payload.column.key !== 'qymc') return;
  const r = payload.row as any;
  const name = r?.qymc || r?.ghzzmc || r?.fullname || r?.name;
  if (!name) return;
  unionData.value = { fullname: String(name) };
  // 若接口有 id 则一并传入（兼容性更好）
  unionIdForDlg.value = r?.id ?? r?.unionId ?? r?.sourceId ?? undefined;
  dlgOpen.value = true;
}
</script>

<style scoped lang="scss">
.grid-page { height: 970px; padding: 0 20px 20px; display: grid; grid-template-rows: auto 1fr; gap: 12px; }
.filters { border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 6px 12px; position: relative; }
.flt-wrap { position: relative; }
.flt { display: flex; gap: 8px 12px; }
.flt--center { align-items: center; }
.flt :deep(.el-form-item__label){ font-weight: 700; }
.actions { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 8px; }
.w360{ width:360px; } .w240{ width:240px; } .w160{ width:160px; } .w140{ width:140px; } .w120{ width:120px; }
.table-wrap{ position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager{ display:flex; align-items:center; justify-content:flex-end; padding-top:8px; color:#2a6ff0; }

/* 表格加载遮罩与简易 Spinner */
.loading-mask{ position:absolute; inset:0; display:grid; place-items:center; background:rgba(255,255,255,.55); z-index:2; backdrop-filter:saturate(120%) blur(1px); }
.loading-mask .txt{ margin-top:8px; color:#2a6ff0; font-weight:800; letter-spacing:1px; }
.spinner{ width:34px; height:34px; border:3px solid rgba(42,111,240,.25); border-top-color:#2a6ff0; border-radius:50%; animation:spin 1s linear infinite; }
@keyframes spin{ to{ transform:rotate(360deg); } }
</style>
