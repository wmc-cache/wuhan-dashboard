<template>
  <main class="grid-page">
    <!-- 顶部：筛选（Element Plus，居中，按钮靠右） -->
    <section class="filters">
      <div class="flt-wrap">
        <el-form inline :model="q" label-position="left" label-width="auto" class="flt flt--center">
          <el-form-item label="会员姓名：">
            <el-input v-model="q.name" placeholder="请输入会员姓名" clearable class="w160" />
          </el-form-item>
          <el-form-item label="所属工会：">
            <el-input v-model="q.unionName" placeholder="请输入" clearable class="w180" />
          </el-form-item>
          <el-form-item label="性别：">
            <el-select v-model="q.sex" placeholder="选择" clearable class="w120">
              <el-option v-for="d in genderOpts" :key="String(d.value)" :label="d.label" :value="d.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button :loading="exporting" @click="onExport">导出</el-button>
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
          @current-change="(p:number) => to(p)"
        />
      </div>
    </section>
  </main>
  <MemberDetailDialog v-model="showMemberDlg" :data="memberDetail" :search-code="memberSearchCode" :default-tab="'org'" :width="1080" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import GridTable, { ColumnDef } from '../components/GridTable.vue';
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
import MemberDetailDialog, { type MemberDetail } from '../components/MemberDetailDialog.vue';
import { getDict, labelOf, type DictItem as DItem } from '../utils/dict';

const router = useRouter();
const route = useRoute();
function goBack() { router.back(); }

// 查询条件（与接口字段一致）
const q = reactive<{ name: string; unionName: string; sex: string | number | '' }>({ name: '', unionName: '', sex: '' });
const genderOpts = ref<DItem[]>([]);

// 列定义：序号、会员姓名、所属工会、性别、入会时间、年龄、工作单位、职务、联系电话、政治面貌、学历
const gridTemplate = '64px 1.2fr 1.2fr .6fr 1.2fr .6fr 1.4fr 1fr 1.2fr 1fr .8fr';
const columns: ColumnDef[] = [
  { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
  { key: 'name', title: '会员姓名', align: 'left', clickable: true },
  { key: 'union', title: '所属工会' },
  { key: 'gender', title: '性别' },
  { key: 'joinedAt', title: '入会时间' },
  { key: 'age', title: '年龄' },
  { key: 'company', title: '工作单位' },
  { key: 'position', title: '职务' },
  { key: 'phone', title: '联系电话' },
  { key: 'political', title: '政治面貌' },
  { key: 'edu', title: '学历' },
];

// 行定义 + 服务端数据
interface Row { index: number; name: string; union: string; gender: string; joinedAt: string; age: string | number; company: string; position: string; phone: string; political: string; edu: string; idNumber?: string }
const rows = ref<Row[]>([]);
const loading = ref(false);
const exporting = ref(false);
const dictReady = ref(false);
function normalizeKw(v: unknown): string {
  if (Array.isArray(v)) return String(v[0] ?? '');
  if (v == null) return '';
  return String(v);
}

function parseSexValue(raw: string): string | number | '' {
  if (!raw) return '';
  const hit = genderOpts.value.find((item) => String(item?.value) === raw);
  if (hit) return hit.value;
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}

const pageSize = 20;
const page = ref(1);
const total = ref(0);

function fmtDate(v?: string): string {
  if (!v) return '';
  const s = String(v);
  if (s.toLowerCase().includes('invalid')) return '';
  const d = s.replace(/[^0-9]/g, '');
  if (d.length === 8) return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
  return s;
}

async function fetchList() {
  try {
    loading.value = true;
    const qs = new URLSearchParams();
    if (q.name?.trim()) {
      const nameVal = q.name.trim();
      qs.set('name', nameVal);
      qs.set('memberName', nameVal);
    }
    if (q.unionName?.trim()) qs.set('unionName', q.unionName.trim());
    if (q.sex !== '' && q.sex !== undefined && q.sex !== null) qs.set('sex', String(q.sex));
    qs.set('pageNum', String(page.value));
    qs.set('pageSize', String(pageSize));

    const url = `/business/member/list?${qs.toString()}`;
    const resp: any = await apiGet<any>(url).catch(() => ({}));
    const totalVal = Number(resp?.total ?? resp?.count ?? 0) || 0;
    const arr = Array.isArray(resp?.rows) ? resp.rows : Array.isArray(resp?.data) ? resp.data : [];
    total.value = totalVal;
    const start = (page.value - 1) * pageSize;
    rows.value = (arr as any[]).map((r: any, i: number) => ({
      index: start + i + 1,
      name: r.name ?? '-',
      union: r.unionName ?? r.unionFull ?? '-',
      gender: labelOf('gender', r.sex, String(r.sex ?? '')),
      joinedAt: fmtDate(r.joinDate),
      age: r.age ?? '-',
      company: r.workUnit ?? r.companyName ?? '-',
      position: labelOf('memberPosition', r.unionJob, String(r.unionJob ?? '')),
      phone: r.mobile ?? '-',
      political: labelOf('politicalStatus', r.politicalStatus, String(r.politicalStatus ?? '')),
      edu: labelOf('education', r.education, String(r.education ?? '')),
      // 身份证优先使用明文字段 idNumberBright（其次 certificateNumBright）
      idNumber: r.idNumberBright ?? r.certificateNumBright ?? r.idNumber ?? r.certificateNum ?? r.certificateNo,
    } as Row));
  } catch {
    total.value = 0;
    rows.value = [];
  } finally { loading.value = false; }
}

function onSearch() { page.value = 1; fetchList(); }
function onReset() { q.name = ''; q.unionName = ''; q.sex = ''; page.value = 1; fetchList(); }

const pageCount = computed(() => Math.max(1, Math.ceil((total.value || 0) / pageSize)));
const pagedRows = computed(() => rows.value);
function to(p: number) { page.value = Math.min(pageCount.value, Math.max(1, p)); fetchList(); }

const highlightFields = computed<Record<string, string | string[]>>(() => {
  const map: Record<string, string | string[]> = {};
  const nameKw = q.name.trim();
  if (nameKw) map.name = nameKw;
  const unionKw = q.unionName.trim();
  if (unionKw) map.union = unionKw;
  if (q.sex !== '') {
    const label = labelOf('gender', q.sex, String(q.sex ?? '')).trim();
    if (label) map.gender = label;
  }
  return map;
});

onMounted(async () => {
  // 预拉取展示用字典
  genderOpts.value = await getDict('gender');
  await Promise.all([
    getDict('memberPosition'),
    getDict('politicalStatus'),
    getDict('education'),
  ]).catch(() => void 0);
  dictReady.value = true;
  const nameQ = normalizeKw(route.query.name).trim();
  const kw = normalizeKw(route.query.kw).trim();
  const unionQuery = normalizeKw(route.query.unionName).trim();
  if (nameQ) q.name = nameQ;
  else if (kw) q.name = kw;
  if (unionQuery) q.unionName = unionQuery;
  const sex = normalizeKw(route.query.sex).trim();
  q.sex = parseSexValue(sex);
  await fetchList();
});

watch(
  () => [route.query.name, route.query.kw, route.query.unionName, route.query.sex],
  () => {
    if (!dictReady.value) return;
    const prevName = q.name;
    const prevSex = q.sex;
    const prevUnion = q.unionName;
    const nameQ = normalizeKw(route.query.name).trim();
    const kw = normalizeKw(route.query.kw).trim();
    const unionQuery = normalizeKw(route.query.unionName).trim();
    const sex = normalizeKw(route.query.sex).trim();
    q.name = nameQ || kw || '';
    q.unionName = unionQuery || '';
    q.sex = parseSexValue(sex);
    if (q.name === prevName && q.unionName === prevUnion && q.sex === prevSex) return;
    page.value = 1;
    fetchList();
  }
);

// 点击姓名 -> 打开详情（使用身份证号查询）
const showMemberDlg = ref(false);
const memberDetail = ref<MemberDetail>({});
const memberSearchCode = ref<string | undefined>(undefined);
function onCellClick(payload: { row: Row; column: ColumnDef }) {
  if (payload.column.key !== 'name') return;
  memberDetail.value = {
    name: payload.row.name,
    union: payload.row.union,
    gender: payload.row.gender,
    age: payload.row.age,
    company: payload.row.company,
    phone: payload.row.phone,
  };
  memberSearchCode.value = payload.row.idNumber;
  showMemberDlg.value = true;
}

// 导出：POST /business/member/export
const MEMBER_EXPORT_FIELDS = [
  'name',
  'unionName',
  'id',
  'joinDate',
  'sex',
  'age',
  'workUnit',
  'unionJob',
  'mobile',
  'politicalStatus',
  'education',
];

async function onExport() {
  try {
    exporting.value = true;
    const body: Record<string, any> = {
      name: q.name?.trim() || undefined,
      memberName: q.name?.trim() || undefined,
      unionName: q.unionName?.trim() || undefined,
      sex: q.sex !== '' ? q.sex : undefined,
      exportFields: MEMBER_EXPORT_FIELDS.join(','),
    };
    Object.keys(body).forEach((k) => {
      const v = (body as any)[k];
      if (v == null || v === '' || v === 'undefined' || v === 'null') delete (body as any)[k];
    });
    const res = await apiPostBlob('/business/member/export', body);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const ts = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const fallback = `会员列表_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.xlsx`;
    const a = document.createElement('a');
    a.href = url;
    const cd = res.headers.get('Content-Disposition') || res.headers.get('content-disposition');
    const m = cd && /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
    const srv = m ? decodeURIComponent(m[1] || m[2]) : '';
    a.download = srv || fallback;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    // 忽略错误；可按需接入 message 提示
  } finally {
    exporting.value = false;
  }
}
</script>

<style scoped lang="scss">
.grid-page { height: 970px; padding: 0 20px 20px; display: grid; grid-template-rows: auto 1fr; gap: 12px; }
.filters { border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 6px 12px; position: relative; }
.flt-wrap { position: relative; }
.flt { display: flex; gap: 8px 12px; }
.flt--center { align-items: center; }
.flt :deep(.el-form-item__label) { color: #333; font-weight: 700; }
.actions { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 8px; }
.w160 { width: 160px; }
.w180 { width: 180px; }
.w120 { width: 120px; }

.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
.loading-overlay { position: absolute; inset: 12px; background: rgba(255,255,255,.6); display: grid; place-items: center; z-index: 5; border-radius: 8px; }
.spinner { width: 34px; height: 34px; border: 3px solid rgba(42,111,240,.25); border-top-color: #2a6ff0; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-text { margin-top: 8px; font-weight: 800; color: #2a6ff0; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
