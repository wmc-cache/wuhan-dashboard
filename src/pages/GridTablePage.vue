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
            <el-select v-model="q.region" placeholder="选择" clearable class="w140">
              <el-option v-for="d in regions" :key="d" :label="d" :value="d" />
            </el-select>
          </el-form-item>
          <el-form-item label="行业类别：">
            <el-select v-model="q.industry" placeholder="选择" clearable class="w140">
              <el-option v-for="i in industries" :key="i" :label="i" :value="i" />
            </el-select>
          </el-form-item>
          <el-form-item label="成立时间：">
            <el-date-picker v-model="q.date" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" class="w160" />
          </el-form-item>
        </el-form>
        <!-- 右侧按钮组 -->
        <div class="actions">
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="primary" link @click="goBack">返回</el-button>
        </div>
      </div>
    </section>

    <!-- 表格主体（占满剩余高度） -->
    <section class="table-wrap">
      <GridTable :columns="columns" :rows="pagedRows" :grid-template="gridTemplate" :visible-rows="20" :row-height="40"
        :show-header="false" @cell-click="onCellClick" />

      <div class="pager">
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background
          layout="total, prev, pager, next, jumper" @current-change="(p: number) => to(p)" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import GridTable, { ColumnDef } from '../components/GridTable.vue';
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

const router = useRouter();

// 简易筛选条件
const q = reactive({ name: '', region: '', industry: '', date: '' });
const regions = ['武昌区', '江岸区', '江汉区', '洪山区', '黄陂区', '新洲区', '江夏区', '东西湖区', '汉阳区', '青山区', '硚口区', '东湖新技术开发区', '东湖生态旅游风景区', '武汉经济技术开发区'];
const industries = ['类别1', '类别2', '类别3'];

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

// 造一份演示数据（800 条）
interface Row {
  index: number; name: string; region: string; industry: string; createdAt: string; memberCount: number; contact: string; phone: string; chairman: string;
}
const allRows = ref<Row[]>(Array.from({ length: 800 }, (_, i) => ({
  index: i + 1,
  name: `名称${i + 1}`,
  region: regions[i % regions.length],
  industry: industries[(i + 1) % industries.length],
  createdAt: '2024-03-02',
  memberCount: 120 + (i % 500),
  contact: ['王霞', '王小颖', '王晓', '李春夏', '李和平', '李和积', '刘进空', '刘欣'][i % 8],
  phone: '18089432787',
  chairman: ['王霞', '王小颖', '王晓', '李春夏', '李和平', '李和积', '刘进空', '刘欣'][7 - (i % 8)],
})));

// 搜索（本地过滤示意）
const filtered = computed(() => {
  return allRows.value.filter(r =>
    (!q.name || r.name.includes(q.name)) &&
    (!q.region || r.region === q.region) &&
    (!q.industry || r.industry === q.industry) &&
    (!q.date || r.createdAt === q.date)
  );
});

function onSearch() { /* 计算属性已自动更新，这里留空即可 */ }
function onReset() { q.name = ''; q.region = ''; q.industry = ''; q.date = ''; }
function goBack() { router.back(); }

// 简易分页
const pageSize = 20; // 每页 30 条
const page = ref(1);
const total = computed(() => filtered.value.length);
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});
function to(p: number) { page.value = Math.min(pageCount.value, Math.max(1, p)); }

function onCellClick(payload: { row: Row }) {
  // 占位：可在此跳详情
  console.log('cell clicked', payload.row);
}
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

.table-wrap { position: relative; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 12px; display: grid; grid-template-rows: 1fr auto; }
.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
</style>
