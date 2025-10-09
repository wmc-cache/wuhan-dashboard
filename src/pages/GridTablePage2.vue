<template>
  <main class="grid-page">
    <!-- 顶部：筛选（Element Plus，居中，按钮靠右） -->
    <section class="filters">
      <div class="flt-wrap">
        <el-form inline :model="q" label-position="left" label-width="auto" class="flt flt--center">
          <el-form-item label="所属工会：">
            <el-input v-model="q.union" placeholder="请输入" clearable class="w180" />
          </el-form-item>
          <el-form-item label="性别：">
            <el-select v-model="q.gender" placeholder="选择" clearable class="w120">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="入会时间：">
            <el-date-picker v-model="q.joinedAt" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" class="w180" />
          </el-form-item>
        </el-form>
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
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
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();
function goBack() { router.back(); }

// 查询条件
const q = reactive({ union: '', gender: '', joinedAt: '' });

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

// 造数据
const names = ['名称1','名称2','名称3','名称4','名称5','名称6','名称7','名称8','名称9','名称10','名称11','名称12','名称13','名称14','名称15'];
const unions = ['名称1','名称2','名称3','名称4','名称5','名称6','名称7','名称8','名称9','名称10','名称11','名称12','名称13','名称14','名称15'];
const positions = ['职务','组长','干事','文员'];
const politicals = ['群众','团员','党员'];
const edus = ['高中','大专','本科','硕士'];
interface Row { index: number; name: string; union: string; gender: '男'|'女'; joinedAt: string; age: number; company: string; position: string; phone: string; political: string; edu: string; }
const allRows = ref<Row[]>(Array.from({ length: 800 }, (_, i) => ({
  index: i + 1,
  name: names[i % names.length],
  union: unions[(i+1) % unions.length],
  gender: i % 2 === 0 ? '男' : '女',
  joinedAt: '2024-03-02',
  age: 22 + (i % 30),
  company: '单位名称',
  position: positions[i % positions.length],
  phone: '18089432787',
  political: politicals[i % politicals.length],
  edu: edus[i % edus.length],
})));

const filtered = computed(() => {
  return allRows.value.filter(r =>
    (!q.union || r.union.includes(q.union)) &&
    (!q.gender || r.gender === q.gender) &&
    (!q.joinedAt || r.joinedAt === q.joinedAt)
  );
});
function onSearch() {}
function onReset() { q.union = ''; q.gender = ''; q.joinedAt = ''; }

// 分页
const pageSize = 30;
const page = ref(1);
const total = computed(() => filtered.value.length);
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});
function to(p: number) { page.value = Math.min(pageCount.value, Math.max(1, p)); }
</script>

<style scoped lang="scss">
.grid-page { height: 980px; padding: 0 20px 20px; display: grid; grid-template-rows: auto 1fr; gap: 12px; }
.filters { border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 6px 12px; position: relative; }
.flt-wrap { position: relative; }
.flt { display: flex; gap: 8px 12px; }
.flt--center { align-items: center; }
.flt :deep(.el-form-item__label) { color: #2a6ff0; font-weight: 700; }
.actions { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: inline-flex; gap: 8px; }
.w180 { width: 180px; }
.w120 { width: 120px; }

.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
</style>

