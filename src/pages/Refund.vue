<template>
  <!-- 布局与其他页面保持一致：左右 540，中间自适应；顶 220 / 中 360 / 底自适应 -->
  <main class="refund__grid">
    <!-- 左列 -->
    <section class="mod" style="grid-area: tl;">
      <div class="mod__body mod__body--full">
        <RefundTopCards :items="topCards" @more="goDetail('zje')" @item-click="onUnionClick('zje', $event?.name)" />
      </div>
    </section>

    <section class="mod" style="grid-area: ml;">
      <div class="mod__body">
        <RefundRankType1 :items="provinceAmountTop" @more="goDetail('szje')" @row-click="onUnionClick('szje', $event?.item?.name)" />
      </div>
    </section>

    <section class="mod" style="grid-area: bl;">
      <div class="mod__body">
        <RefundRankType2 :items="feeTop" @more="goDetail('sxf')" @row-click="onUnionClick('sxf', $event?.item?.name)" />
      </div>
    </section>

    <!-- 中列：上部大环图跨两行；底部表格 -->
    <section class="mod mod--tall mod--no-frame" style="grid-column: 2; grid-row: 1 / span 2;">
      <div class="mod__head">
        <div class="year-select">
          <NiceSelect v-model="year" :options="years" :width="122" :formatter="(y: number) => y + '年'" />
        </div>
      </div>
      <div class="mod__body mod__body--full">
        <RefundOverview :year="year" :top-items="overviewTop" :bottom-items="overviewBottom" :value-unit="overviewUnit" @open-detail="onOpenDetail" />
      </div>
    </section>

    <section class="mod" style="grid-area: bc;">
      <div class="mod__body mod__body--full">
        <RefundCompanyTable :rows="companyRows" value-title="企业产业金额" unit-text="万元" />
      </div>
    </section>

    <!-- 右列 -->
    <section class="mod" style="grid-area: tr;">
      <!-- 右上：市州金额 TOP4，补充右上角“查看更多”按钮 -->
      <div class="mod__titlebar">
        <span class="title-img title-img--refund-6" aria-hidden="true"></span>
        <i class="more-img" role="button" aria-label="查看更多" @click="goDetail('dsje')"></i>
      </div>

      <div class="mod__body">
        <RefundRankList :items="districtTop4" :max-rows="4" bar-color="#52c41a" show-no variant="plain" @row-click="onUnionClick('dsje', $event?.item?.name)" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <div class="mod__body">
        <RefundRankType2 :items="districtTop5" :show-right-name="false" :bar-color="'#4E8FFF'" :title-img1x="titleImg1x"
          :title-img2x="titleImg2x" @more="goDetail('xsje')" @row-click="onUnionClick('xsje', $event?.item?.name)" />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <div class="mod__body">
        <RefundRankType3 :items="basicTop5" @more="goDetail('jcje')" @row-click="onUnionClick('jcje', $event?.item?.name)" />
      </div>
    </section>
  </main>
  <!-- 详情弹窗：点击中心大环图触发 -->
  <NiceDialog v-model="dlgOpen" :title="dlgTitle" :width="358" :x="dlgX" :y="dlgY">
    <ul class="refund-detail" role="list">
      <li v-for="(it, i) in dlgItems" :key="i" class="row">
        <span class="name">{{ it.name }}</span>
        <span class="val">{{ it.value.toLocaleString('zh-CN') }}</span>
      </li>
    </ul>
  </NiceDialog>
</template>

<script setup lang="ts">
import NiceSelect from '../components/NiceSelect.vue';
import RefundTopCards from '../components/refund/TopCards.vue';
import RefundRankList from '../components/refund/RankList.vue';
import RefundRankType1 from '../components/refund/RankType1.vue';
import RefundCompanyTable from '../components/refund/CompanyTable.vue';
import RefundOverview from '../components/refund/Overview.vue';
import NiceDialog from '../components/NiceDialog.vue';
import RefundRankType2 from '../components/refund/RankType2.vue';
import RefundRankType3 from '../components/refund/RankType3.vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { apiGet } from '../utils/api';
import titleImg1x from '../images/refund/title5/编组 21.png';
import titleImg2x from '../images/refund/title5/编组 21@2x.png';

// 年份选择
const years = [2021, 2022, 2023, 2024, 2025];
const year = ref<number>(new Date().getFullYear());

// 顶部 TOP4（代收金额）
const topCards = ref<{ name: string; amount: number }[]>([]);
// 左上：省总金额 TOP4（szje）
const provinceAmountTop = ref<{ name: string; value: number }[]>([]);
// 左下：手续费 TOP5（sxf）
const feeTop = ref<{ name: string; value: number }[]>([]);
// 右上：市州金额 TOP4（dsje）
const districtTop4 = ref<{ name: string; value: number }[]>([]);
// 右中：县区金额 TOP5（xsje）
const districtTop5 = ref<{ name: string; value: number }[]>([]);
// 右下：基层金额 TOP5（jcje）
const basicTop5 = ref<{ name: string; value: number }[]>([]);

// 中部 7 项概览
const overviewTop = ref<{ name: string; value: number }[]>([]);     // 3 项
const overviewBottom = ref<{ name: string; value: number }[]>([]);  // 4 项
const overviewUnit = ref<'yuan' | 'wan' | 'yi'>('yuan');

// 底部企业/单位表格（默认展示手续费 TOP5）
import type { Row as CompanyRow } from '../components/refund/CompanyTable.vue';
const companyRows = ref<CompanyRow[]>([]);

// 简易详情弹窗数据与开关
const dlgOpen = ref(false);
const dlgX = ref<number | null>(null);
const dlgY = ref<number | null>(null);
const dlgTitle = '汇总统计';
const dlgItems = ref<{ name: string; value: number }[]>([]);

// 路由
const router = useRouter();
function goDetail(orderName: string, unionName?: string){
  try {
    const q: Record<string, any> = { year: String(year.value), orderName };
    if (unionName && unionName.trim()) q.unionName = unionName.trim();
    router.push({ name: 'refund-detail-list', query: q });
  } catch {}
}

// 列表行点击：根据被点击的工会名跳转，并在列表页自动选中上级工会
function onUnionClick(orderName: string, unionName?: string){
  goDetail(orderName, unionName);
}

function onOpenDetail(payload: { x: number; y: number }) {
  dlgX.value = payload.x;
  dlgY.value = payload.y;
  // 用当前概览数据填充弹窗
  dlgItems.value = [
    ...(overviewTop.value || []),
    ...(overviewBottom.value || [])
  ];
  dlgOpen.value = true;
}

// ---------------- API 对接 ----------------
function qs(params: Record<string, any>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    usp.set(k, String(v));
  });
  return usp.toString();
}

async function listApi(p: Record<string, any>) {
  const q = qs(p);
  return await apiGet<any>(`/refundOfFunds/list?${q}`).catch(() => null);
}

async function detailListApi(p: Record<string, any>) {
  const q = qs(p);
  return await apiGet<any>(`/refundOfFunds/detailList?${q}`).catch(() => null);
}

/**
 * 统计汇总（中部 7 项）：当 sum=0 时接口返回统计；
 * 若后端仍返回 rows，则对 rows 求和作为兜底。
 */
async function loadOverview(y: number) {
  const res = await listApi({ year: y, pageNum: 1, pageSize: 10000, orderName: '', sum: 0 });
  const rows: any[] = Array.isArray(res?.rows) ? res.rows : [];
  const pick = (k: string) => {
    if (typeof res?.[k] === 'number') return Number(res[k]);
    // 兜底：按 rows 求和
    return rows.reduce((s, r) => s + (Number(r?.[k]) || 0), 0);
  };
  const zje = pick('zje');
  const szje = pick('szje');
  const qycyje = pick('qycyje');
  const dsje = pick('dsje');
  const xsje = pick('xsje');
  const jcje = pick('jcje');
  const sxf = pick('sxf');

  overviewTop.value = [
    { name: '代收金额合计', value: zje },
    { name: '省总金额合计', value: szje },
    { name: '企业产业金额合计', value: qycyje }
  ];
  overviewBottom.value = [
    { name: '市州金额合计', value: dsje },
    { name: '县市金额合计', value: xsje },
    { name: '基层金额合计', value: jcje },
    { name: '手续费合计', value: sxf }
  ];

  // 单位推断：若量级普遍 < 1000（如 8.9、1.0 等），多数后端是“亿元”；否则按“元”→万/亿。
  const maxVal = Math.max(zje, szje, qycyje, dsje, xsje, jcje, sxf);
  overviewUnit.value = maxVal < 1000 ? 'yi' : 'yuan';
}

async function loadRank(y: number, field: string, size = 5) {
  const res = await listApi({ year: y, pageNum: 1, pageSize: size, orderName: field, sum: 1 });
  const rows: any[] = Array.isArray(res?.rows) ? res.rows : [];
  return rows.map((r) => ({ name: String(r?.ghzzmc || ''), value: Number(r?.[field] || 0) }));
}

async function loadCompanyTable(y: number) {
  // 企业产业金额排名（使用 list 接口 + qycyje 排序）
  const res = await listApi({ year: y, pageNum: 1, pageSize: 5, orderName: 'qycyje', sum: 1 });
  const rows: any[] = Array.isArray(res?.rows) ? res.rows : [];
  companyRows.value = rows.map((r, i) => ({ lv: i + 1, name: String(r?.ghzzmc || ''), fee: Number(r?.qycyje || 0) }));
}

async function loadAll(y: number) {
  await Promise.allSettled([
    loadOverview(y),
    (async () => { topCards.value = (await loadRank(y, 'zje', 4)).map(it => ({ name: it.name, amount: it.value })); })(),
    (async () => { provinceAmountTop.value = await loadRank(y, 'szje', 4); })(),
    (async () => { feeTop.value = await loadRank(y, 'sxf', 5); })(),
    (async () => { districtTop4.value = await loadRank(y, 'dsje', 4); })(),
    (async () => { districtTop5.value = await loadRank(y, 'xsje', 5); })(),
    (async () => { basicTop5.value = await loadRank(y, 'jcje', 5); })(),
    loadCompanyTable(y),
  ]);
}

onMounted(() => loadAll(year.value));
watch(year, (y) => loadAll(y));
</script>

<style scoped lang="scss">
.refund__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 16px; /* 底部余量更紧凑 */
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  /* 收紧上下行的占比，避免底部越界 */
  grid-template-rows: .95fr 1fr .95fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bc br';
  /* 模块间距统一为 10px */
  gap: 0px;
}

.mod {
  position: relative;
  border: none;
  border-radius: 10px;
  background: none;
    padding: 18px;
    display: grid;
    grid-template-rows: auto 1fr;
  }
  
  .mod::before {
    content: '';
    position: absolute;
    left: -8px;
    right: -8px;
    top: -8px;
    bottom: -8px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
    background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
    pointer-events: none;
    z-index: -1;
  }
  
  .mod--tall::before {
    background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
    background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
  }
  
  .mod--wide::before {
    background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
    background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
  }
  
  /* 仅概览模块去掉边框底图 */
  .mod--no-frame::before { background: none !important; }
  /* 并为概览模块增加专属背景 */
  .mod--no-frame {
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 616px 217px;
    background-image: -webkit-image-set(
      url('../images/refund/bg-center/编组 3.png') 1x,
      url('../images/refund/bg-center/编组 3@2x.png') 2x
    );
    background-image: image-set(
      url('../images/refund/bg-center/编组 3.png') 1x,
      url('../images/refund/bg-center/编组 3@2x.png') 2x
    );
  }
.mod__title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2a6ff0;
}

.mod__body { overflow: hidden; }

.mod__body--full {
  display: grid;
}

.mod__head {
  /* 仅当前页面使用：头部只放年份选择器，把它靠右展示 */
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 年份选择器挪到右侧 */
  margin-bottom: 6px;
}
/* 选择器尺寸统一：箭头已封装在组件内部 */
.year-select { position: relative; }
.year-select :deep(.trigger) { height: 32px; }

.mod__head .head-title {
  font-size: 16px;
  font-weight: 800;
  color: #2a6ff0;
}
/* 标题行：左侧标题切图 + 右侧“查看更多” */
.mod__titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* 图片标题（替换文字标题） */
.mod>.title-img { display: inline-block; margin-bottom: 8px; }

.title-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-img--refund-6 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/refund/title6/编组 21.png') 1x, url('../images/refund/title6/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/refund/title6/编组 21.png') 1x, url('../images/refund/title6/编组 21@2x.png') 2x);
}

/* 右上角“查看更多”按钮（与其它模块保持一致尺寸与素材） */
.more-img {
  width: 59px;
  height: 13px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../images/refund/see-all/查看更多.png') 1x, url('../images/refund/see-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../images/refund/see-all/查看更多.png') 1x, url('../images/refund/see-all/查看更多@2x.png') 2x);
}

/* 弹窗表格（按图示配色）：
   行高 45px；偶数/奇数行分别用 #C4E0FF、#ADE7FF；
   右侧数字加粗，分隔线更柔和。 */
.refund-detail {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid rgba(120, 160, 255, .38);
  overflow: hidden;
}

.refund-detail .row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  min-height: 45px;
  padding: 0 16px;
  background: #C4E0FF;
  /* 奇数行默认色 */
  border-bottom: 1px solid rgba(110, 150, 220, .35);
}

.refund-detail .row:nth-child(even) {
  background: #ADE7FF;
}

.refund-detail .row:last-child {
  border-bottom: 0;
}

.refund-detail .name {
  color: #2a539e;
  font-weight: 800;
  letter-spacing: .5px;
}

.refund-detail .val {
  color: #0f2e72;
  font-weight: 900;
}
</style>
