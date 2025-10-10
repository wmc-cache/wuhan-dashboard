<template>
  <main class="home__grid">
    <!-- 顶部：筛选条 -->
    <section class="tools">
      <div class="tools__left">
        <el-select v-model="selCat" class="w160" placeholder="工会组织">
          <el-option label="工会组织" value="org" />
          <el-option label="工会会员" value="member" />
        </el-select>
        <el-input v-model="keyword" class="w360" placeholder="请输入搜索内容" clearable @keyup.enter="onSearch" />
      </div>
      <div class="tools__right">
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <!-- <el-button link @click="goBack">返回</el-button> -->
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
      </aside>

      <!-- 右：表格与分页 -->
      <section class="table-area">
        <GridTable :columns="columns" :rows="pagedRows" :grid-template="gridTemplate" :visible-rows="15"
          :row-height="44" :show-header="false" :fill-placeholder="true" />

        <div class="pager">
          <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" background
            layout="total, prev, pager, next, jumper" @current-change="(p: number) => to(p)" />
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import GridTable, { type ColumnDef } from '../components/GridTable.vue';
import { ElSelect, ElOption, ElInput, ElButton, ElPagination } from 'element-plus';
import 'element-plus/es/components/select/style/css';
import 'element-plus/es/components/option/style/css';
import 'element-plus/es/components/input/style/css';
import 'element-plus/es/components/button/style/css';
import 'element-plus/es/components/pagination/style/css';
import { useRouter } from 'vue-router';
import { apiGet } from '../utils/api';

const router = useRouter();
function goBack() { router.back(); }

// 搜索与筛选
const selCat = ref('org');
const keyword = ref('');

// 列定义：根据后端字段自适应（优先展示“截图风格”的列；缺失时回退到已有字段）
const gridTemplate = computed(() => columns.value.map(() => '1fr').join(' '));
const columns = ref<ColumnDef[]>([
  { key: 'index', title: '序号', formatter: (v) => String(v).padStart(2, '0') },
  { key: 'fullname', title: '工会名称', clickable: true, align: 'left' },
  { key: 'memberCount', title: '会员人数' },
  { key: 'unitDistrictSuffix', title: '行政区划' },
  { key: 'establishDate', title: '成立时间' },
  { key: 'linkMan', title: '联系人' },
  { key: 'linkPhone', title: '联系电话' },
  { key: 'chair', title: '工会主席' },
]);

// 数据
interface Row {
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
}

const allRows = ref<Row[]>([]);
const total = ref(0);
const pageSize = 15;
const page = ref(1);

const filtered = computed(() => {
  const kw = keyword.value.trim();
  if (!kw) return allRows.value;
  return allRows.value.filter(r => r.fullname?.includes(kw));
});

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filtered.value.slice(start, start + pageSize);
});
function to(p: number) { page.value = p; }

const navItems = computed(() => {
  // 第一项：全总法人系统（count=total）；其余为占位的“其他数据（12）”以还原截图
  const items = [{ title: '全总法人系统', count: total.value || 0 }];
  for (let i = 0; i < 6; i++) items.push({ title: '其他数据', count: 12 });
  return items;
});

// 左侧菜单激活项（默认选中第一个）
const activeIndex = ref(0);
function setActive(i: number) {
  activeIndex.value = i;
}

function onSearch() {
  // 客户端过滤已生效；如需服务器端搜索，可在此发起请求
}

function buildColumnsByData(sample?: Row) {
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
  }
}

function mapRow(raw: any, i: number): Row {
  const r: Row = {
    index: i + 1,
    fullname: raw.fullname ?? raw.name ?? raw.unionName ?? raw.orgName ?? '',
    memberCount: toNum(raw.memberCount ?? raw.members),
    unitDistrictSuffix: raw.unitDistrictSuffix ?? raw.district ?? raw.area ?? raw.region,
    establishDate: raw.establishDate ?? raw.createdAt ?? raw.foundedAt ?? raw.createTime,
    unitIndustry: raw.unitIndustry,
    linkMan: raw.linkMan ?? raw.contact,
    linkPhone: raw.linkPhone ?? raw.phone,
    chair: raw.chair ?? raw.chairman,
    legalCode: raw.legalCode ?? raw.licenseCode ?? raw.corporateCode,
    unitName: raw.unitName,
    creditCode: raw.creditCode ?? raw.uscc ?? raw.socialCreditCode,
  };
  return r;
}

function toNum(v: any): number | undefined { const n = Number(v); return Number.isFinite(n) ? n : undefined; }

async function fetchList() {
  const res = await apiGet<any>('/business/union/list').catch(() => null);
  if (!res) return;
  const rows: any[] = Array.isArray(res.row) ? res.row : Array.isArray(res.rows) ? res.rows : Array.isArray(res.data) ? res.data : [];
  allRows.value = rows.map((r, i) => mapRow(r, i));
  total.value = (Number(res.total) || allRows.value.length);
  buildColumnsByData(allRows.value[0]);
}

onMounted(() => { fetchList(); });
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

.tools {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(235, 241, 247, .74);
  box-shadow: inset 0 0 40px rgba(120, 170, 255, .08);
}

.tools__left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.tools__right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.w160 {
  width: 160px;
}

.w360 {
  width: 360px;
}

.content {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}

.sidenav {
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

.pager { display: flex; align-items: center; justify-content: flex-end; color: #2a6ff0; padding-top: 8px; }
</style>
