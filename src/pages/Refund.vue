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
      <div class="mod__body">
        <RefundRankType1 :items="provinceAmountTop" />
      </div>
    </section>

    <section class="mod" style="grid-area: bl;">
      <div class="mod__body">
        <RefundRankType2 :items="feeTop" />
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
        <RefundOverview :year="year" @open-detail="onOpenDetail" />
      </div>
    </section>

    <section class="mod" style="grid-area: bc;">
      <div class="mod__body mod__body--full">
        <RefundCompanyTable />
      </div>
    </section>

    <!-- 右列 -->
    <section class="mod" style="grid-area: tr;">
      <span class="title-img title-img--refund-6" aria-hidden="true"></span>

      <div class="mod__body">
        <RefundRankList :items="districtTop4" :max-rows="4" bar-color="#52c41a" show-no variant="plain" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <div class="mod__body">
        <RefundRankType2 :items="districtTop5" :show-right-name="false" :bar-color="'#4E8FFF'" :title-img1x="titleImg1x"
          :title-img2x="titleImg2x" />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <div class="mod__body">
        <RefundRankType3 :items="basicTop5" />
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
import { ref } from 'vue';
import titleImg1x from '../images/refund/title5/编组 21.png';
import titleImg2x from '../images/refund/title5/编组 21@2x.png';

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

const provinceAmountTop = [
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

// 简易详情弹窗数据与开关
const dlgOpen = ref(false);
const dlgX = ref<number | null>(null);
const dlgY = ref<number | null>(null);
const dlgTitle = '武汉市筹备金工会';
const dlgItems = [
  { name: '代收金额', value: 42352552.212 },
  { name: '省总金额', value: 42352552.212 },
  { name: '企业产业金额', value: 0 },
  { name: '市州金额', value: 42352552.212 },
  { name: '县市金额', value: 42352552.212 },
  { name: '基层金额', value: 42352552.212 },
  { name: '手续费', value: 42352552.212 }
];

function onOpenDetail(payload: { x: number; y: number }) {
  dlgX.value = payload.x;
  dlgY.value = payload.y;
  dlgOpen.value = true;
}
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
/* 图片标题（替换文字标题） */
.mod>.title-img {
  display: inline-block;
  margin-bottom: 8px;
}

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
