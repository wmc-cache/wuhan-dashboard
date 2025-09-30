<template>
  <!-- 布局与其他页面保持一致：左右 540，中间自适应；顶 220 / 中 360 / 底自适应 -->
  <main class="refund__grid">
    <!-- 左列 -->
    <section class="mod" style="grid-area: tl;">
      <div class="mod__body mod__body--full">
        <RefundTopCards :items="topCards" />
      </div>
    </section>

    <section class="mod" style="grid-area: ml;">
      <h3 class="mod__title">市总金额 TOP4</h3>
      <div class="mod__body">
        <RefundRankList :items="cityAmountTop" :max-rows="4" bar-color="#2a6ff0" />
      </div>
    </section>

    <section class="mod" style="grid-area: bl;">
      <h3 class="mod__title">手续费 TOP5</h3>
      <div class="mod__body">
        <RefundRankList :items="feeTop" :max-rows="5" bar-color="#f59e0b" />
      </div>
    </section>

    <!-- 中列：上部大环图跨两行；底部表格 -->
    <section class="mod" style="grid-column: 2; grid-row: 1 / span 2;">
      <div class="mod__head">
        <NiceSelect v-model="year" :options="years" :width="120" />
      </div>
      <div class="mod__body mod__body--full">
        <RefundOverview :year="year" />
      </div>
    </section>

    <section class="mod" style="grid-area: bc;">
      <div class="mod__body mod__body--full">
        <RefundCompanyTable />
      </div>
    </section>

    <!-- 右列 -->
    <section class="mod" style="grid-area: tr;">
      <h3 class="mod__title">区县金额 TOP4</h3>
      <div class="mod__body">
        <RefundRankList :items="districtTop4" :max-rows="4" bar-color="#52c41a" show-no />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <h3 class="mod__title">区县金额 TOP5</h3>
      <div class="mod__body">
        <RefundRankList :items="districtTop5" :max-rows="5" bar-color="#2a6ff0" />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <h3 class="mod__title">基层金额 TOP5</h3>
      <div class="mod__body">
        <RefundRankList :items="basicTop5" :max-rows="5" bar-color="#ff4d4f" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import NiceSelect from '../components/NiceSelect.vue';
import RefundTopCards from '../components/refund/TopCards.vue';
import RefundRankList from '../components/refund/RankList.vue';
import RefundCompanyTable from '../components/refund/CompanyTable.vue';
import RefundOverview from '../components/refund/Overview.vue';
import { ref } from 'vue';

// 年份选择
const years = [2021, 2022, 2023, 2024, 2025];
const year = ref(2024);

// 示例数据（可按需替换为真实接口数据）
const topCards = [
  { name: '硚口区总工会', amount: 6189873.092 },
  { name: '江岸区总工会', amount: 6189873.092 },
  { name: '武汉市新鑫工会', amount: 6189873.092 },
  { name: '汉阳区总工会', amount: 6189873.092 }
];

const cityAmountTop = [
  { name: '武汉市新鑫工会', value: 6189873.092 },
  { name: '江岸区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 },
  { name: '武汉经济开发区总工会', value: 6189873.092 }
];

const feeTop = [
  { name: '武汉市新鑫工会', value: 6189873.092 },
  { name: '江岸区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 },
  { name: '武汉经济开发区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 }
];

const districtTop4 = [
  { name: '武汉市新鑫工会', value: 43572819.232 },
  { name: '江岸区总工会', value: 43572819.232 },
  { name: '江汉区总工会', value: 43572819.232 },
  { name: '武昌区总工会', value: 43572819.232 }
];

const districtTop5 = [
  { name: '武汉市新鑫工会', value: 6189873.092 },
  { name: '江岸区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 },
  { name: '武汉经济开发区总工会', value: 6189873.092 },
  { name: '洪山区工会', value: 6189873.092 }
];

const basicTop5 = [
  { name: '武汉市新鑫工会', value: 6189873.092 },
  { name: '汉阳区总工会', value: 6189873.092 },
  { name: '硚口区总工会', value: 6189873.092 },
  { name: '新洲区总工会', value: 6189873.092 },
  { name: '化工区', value: 6189873.092 }
];
</script>

<style scoped lang="scss">
.refund__grid {
  height: 980px;
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  /* 三行统一高度，左侧三个模块自然等高；
     中央概览模块依旧跨两行，获得两倍高度 */
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bc br';
  gap: 20px;
}

.mod {
  border: none;
  border-radius: 10px;
  background: rgba(235, 241, 247, .74);
  box-shadow: inset 0 0 40px rgba(120, 170, 255, .08);
  padding: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod__title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2a6ff0;
}

.mod__body {
  overflow: auto;
}

.mod__body--full {
  display: grid;
}

.mod__head {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  margin-bottom: 8px;
}

.mod__head .head-title {
  font-size: 16px;
  font-weight: 800;
  color: #2a6ff0;
}
</style>
