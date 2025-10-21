<template>
  <main class="grid-page">
    <section class="filters">
      <div class="flt-wrap">
        <el-form inline :model="q" label-position="left" label-width="auto" class="flt flt--center">
          <el-form-item label="姓名：">
            <el-input v-model="q.name" placeholder="请输入" clearable class="w160" />
          </el-form-item>
          <el-form-item label="档案类型：">
            <el-select v-model="q.poorType" placeholder="选择" clearable multiple collapse-tags class="w160">
              <el-option v-for="opt in poorTypeOpts" :key="String(opt.label)" :label="opt.label" :value="opt.label as any" />
            </el-select>
          </el-form-item>
          <el-form-item label="档案类别：">
            <el-select v-model="q.helpOutType" placeholder="选择" clearable multiple collapse-tags class="w160">
              <el-option v-for="opt in helpOutTypeOpts" :key="String(opt.label)" :label="opt.label" :value="opt.label as any" />
            </el-select>
          </el-form-item>
          <el-form-item label="困难类别：">
            <el-select v-model="q.familyType" placeholder="选择" clearable multiple collapse-tags class="w160">
              <el-option v-for="opt in familyTypeOpts" :key="String(opt.label)" :label="opt.label" :value="opt.label as any" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button @click="onExport">导出</el-button>
          <el-button type="primary" link @click="goBack">返回</el-button>
        </div>
      </div>
    </section>

    <section class="table-wrap">
      <GridTable :columns="columns" :rows="pagedRows" :grid-template="gridTemplate" :visible-rows="20" :row-height="40"
        :show-header="false" :highlight-fields="highlightFields" />
      <div class="pager">
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background
          layout="total, prev, pager, next, jumper" @current-change="(p:number)=>to(p)" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getDict, type DictItem as DItem } from '../utils/dict';
import GridTable, { ColumnDef } from '../components/GridTable.vue';
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton, ElPagination } from 'element-plus';
import 'element-plus/es/components/form/style/css';
import 'element-plus/es/components/form-item/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';

const router = useRouter();
const route = useRoute();
function goBack(){ router.back(); }

// 顶部筛选
const q = reactive<{ name: string; poorType: string[]; helpOutType: string[]; familyType: string[] }>({ name: '', poorType: [], helpOutType: [], familyType: [] });
const poorTypeOpts = ref<DItem[]>([]);        // 字典：poorTypeNewList（深度困难/相对困难/意外致困）
const helpOutTypeOpts = ref<DItem[]>([]);     // 字典：helpOutType（增量/存量/返困）
const familyTypeOpts = ref<DItem[]>([]);      // 字典：fileTypeNameList（城镇困难职工/困难农民工）

const gridTemplate = '60px 1.8fr 1.2fr 1fr 1fr .8fr 1.6fr .8fr .8fr 1fr 1.2fr 1.8fr';
const columns: ColumnDef[] = [
  { key: 'index', title: '序号', formatter: (v)=>String(v).padStart(2,'0') },
  { key: 'reportUnit', title: '填报单位', align: 'left' },
  { key: 'archiveType', title: '档案类别' },
  { key: 'workerNo', title: '职工编号' },
  { key: 'name', title: '姓名', clickable: true, align: 'left' },
  { key: 'gender', title: '性别' },
  { key: 'idCard', title: '身份证号', align: 'left' },
  { key: 'householdType', title: '户口类型' },
  { key: 'qualified', title: '是否合格' },
  { key: 'archiveCategory', title: '档案类别' },
  { key: 'difficultyType', title: '困难类别' },
  { key: 'cause', title: '致困原因', align: 'left' },
];

interface Row {
  index:number; reportUnit:string; archiveType:string; workerNo:string; name:string; gender:string; idCard:string; householdType:string; qualified:string; archiveCategory:string; difficultyType:string; cause:string;
}
const allRows = ref<Row[]>([]);

// 服务端分页：列表数据直接来自接口
const filtered = computed(()=> allRows.value);

function onSearch(){ page.value = 1; fetchList(); }
function onReset(){ q.name=''; q.poorType=[]; q.helpOutType=[]; q.familyType=[]; page.value=1; fetchList(); }

// 分页
const pageSize = 20; const page = ref(1);
const total = ref(0);
const pageCount = computed(()=>Math.max(1, Math.ceil(total.value/pageSize)));
const pagedRows = computed(()=> filtered.value );
function to(p:number){ page.value=Math.min(pageCount.value, Math.max(1,p)); fetchList(); }

const highlightFields = computed<Record<string, string | string[]>>(()=> {
  const map: Record<string, string | string[]> = {};
  const name = q.name.trim();
  if (name) map.name = name;
  if (q.poorType.length) map.archiveType = [...q.poorType];
  if (q.helpOutType.length) map.archiveCategory = [...q.helpOutType];
  if (q.familyType.length) map.difficultyType = [...q.familyType];
  return map;
});
// 初始化字典与列表
loadDicts();

async function loadDicts(){
  const fetchOne = async (type: string): Promise<DItem[]> => {
    try {
      const resp:any = await fetch(`/api/difficultAssistance/getDict?type=${encodeURIComponent(type)}`).then(r=>r.json()).catch(()=>null);
      const arr = resp?.data || resp || [];
      return (Array.isArray(arr)?arr:[]).map((it:any)=>({
        label: String(it?.label ?? it?.name ?? it?.dictName ?? it ?? ''),
        value: it?.value ?? it?.dictValue ?? it?.code ?? it?.key ?? (it?.label ?? it?.name ?? it)
      }));
    } catch { return []; }
  };
  poorTypeOpts.value   = await fetchOne('poorTypeNewList');
  helpOutTypeOpts.value= await fetchOne('helpOutType');
  familyTypeOpts.value = await fetchOne('fileTypeNameList');
}

async function fetchList(){
  try{
    const qs = new URLSearchParams();
    if(q.name?.trim()) qs.set('name', q.name.trim());
    if(q.poorType.length) qs.set('poorType', q.poorType.join(','));
    if(q.helpOutType.length) qs.set('helpOutType', q.helpOutType.join(','));
    if(q.familyType.length) qs.set('familyType', q.familyType.join(','));
    qs.set('pageNum', String(page.value));
    qs.set('pageSize', String(pageSize));
    const resp:any = await fetch(`/api/difficultAssistance/list?${qs.toString()}`).then(r=>r.json()).catch(()=>null);
    const totalVal = Number(resp?.total || 0) || 0;
    const rows = Array.isArray(resp?.rows) ? resp.rows : [];
    total.value = totalVal;
    allRows.value = rows.map((r:any, i:number)=>({
      index: (page.value-1)*pageSize + i + 1,
      reportUnit: r.userDept || '-',
      archiveType: r.poorTypeNew || '-',
      workerNo: r.number || '-',
      name: r.name || '-',
      gender: r.gender || '-',
      idCard: r.certificateNo || '-',
      householdType: r.residenceType || '-',
      qualified: r.qualified || '-',
      archiveCategory: r.helpOutType || '-',
      difficultyType: r.familyType || '-',
      cause: r.mainPoorType || '-'
    }));
  }catch(e){ total.value = 0; allRows.value = []; }
}

// 导出
async function onExport(){
  try{
    const body:any = {
      name: q.name?.trim() || undefined,
      poorType: q.poorType.length ? q.poorType.join(',') : undefined,
      helpOutType: q.helpOutType.length ? q.helpOutType.join(',') : undefined,
      familyType: q.familyType.length ? q.familyType.join(',') : undefined,
    };
    // 清理 undefined
    Object.keys(body).forEach(k=>{ if(body[k]==null || body[k]==='') delete body[k]; });
    const res = await fetch('/api/difficultAssistance/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error('导出失败');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date();
    const pad = (n:number)=>String(n).padStart(2,'0');
    a.href = url;
    a.download = `帮扶职工列表_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.xlsx`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }catch(e){ console.error(e); }
}

function normalizeToArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((it) => String(it)).filter((s) => s.trim().length > 0);
  }
  if (typeof value === 'string') {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function syncFiltersFromRoute() {
  q.poorType = normalizeToArray(route.query.poorType);
  q.helpOutType = normalizeToArray(route.query.helpOutType);
  q.familyType = normalizeToArray(route.query.familyType);
  q.name = typeof route.query.name === 'string' ? route.query.name : '';
}

watch(
  () => route.query,
  () => {
    syncFiltersFromRoute();
    page.value = 1;
    fetchList();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.grid-page { height: 970px; padding: 0 20px 20px; display: grid; grid-template-rows: auto 1fr; gap: 12px; }
.filters { border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 6px 12px; position: relative; }
.flt-wrap { position: relative; }
.flt { display: flex; gap: 8px 12px; }
.flt--center { align-items: center; }
.flt :deep(.el-form-item__label){ font-weight: 700; }
.actions { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 8px; }
.w160{ width:160px; } .w140{ width:140px; } .w120{ width:120px; }
.table-wrap{ position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager{ display:flex; align-items:center; justify-content:flex-end; padding-top:8px; color:#2a6ff0; }
</style>
