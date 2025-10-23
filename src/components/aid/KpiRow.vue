<template>
  <section class="kpi-row">
    <div v-for="(k, i) in items" :key="k.label" class="kpi">
      <div class="kpi__icon" :class="'kpi__icon--' + (i + 1)" aria-hidden="true"></div>
      <div class="kpi__meta">
        <!-- 使用通用的 CountUpNumber 组件替换数值展示；
             不改动原有结构与样式（外层仍保留 .kpi__value），
             以避免影响布局和字体样式 -->
        <div class="kpi__value">
          <CountUpNumber :value="k.value" :duration="1200" />
        </div>
        <div class="kpi__label">{{ k.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';
interface KpiItem { label: string; value: number }
interface Props { items?: KpiItem[] }

const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { label: '申请总人次(人)', value: 2210 },
    { label: '总金额(元)', value: 7801010 },
    { label: '四类金额(元)', value: 2231000 },
    { label: '临时救助金额(元)', value: 450 }
  ])
});

// 保持响应式：把 props.items 暴露为 ref，模板直接用 items
const { items } = toRefs(props);
</script>

<style scoped lang="scss">
/* 顶部 KPI 只占容器 70% 宽度并水平居中 */
.kpi-row {
  width: 70%;
  margin: 0 auto; /* 居中 */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: stretch;
}
.kpi {
  position: relative;
  display: grid; grid-template-columns: 62px 1fr; align-items: center; column-gap: 10px;
  border-radius: 10px;
  background: rgba(240,247,255,0.9);
  border: 1px solid rgba(120,170,255,0.35);
  box-shadow: 0 6px 18px rgba(20,80,200,0.10);
  padding: 10px 12px;
}
.kpi__icon {
  width: 76px;
  height: 81px;
  border-radius: 12px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

/* 1~4 使用项目提供的位图 1x/2x */
.kpi__icon--1 {
  background-image: -webkit-image-set(url('../../images/aid/icon1/位图.png') 1x, url('../../images/aid/icon1/位图@2x.png') 2x);
  background-image: image-set(url('../../images/aid/icon1/位图.png') 1x, url('../../images/aid/icon1/位图@2x.png') 2x);
}

.kpi__icon--2 {
  background-image: -webkit-image-set(url('../../images/aid/icon2/位图.png') 1x, url('../../images/aid/icon2/位图@2x.png') 2x);
  background-image: image-set(url('../../images/aid/icon2/位图.png') 1x, url('../../images/aid/icon2/位图@2x.png') 2x);
}

.kpi__icon--3 {
  background-image: -webkit-image-set(url('../../images/aid/icon3/位图.png') 1x, url('../../images/aid/icon3/位图@2x.png') 2x);
  background-image: image-set(url('../../images/aid/icon3/位图.png') 1x, url('../../images/aid/icon3/位图@2x.png') 2x);
}

.kpi__icon--4 {
  background-image: -webkit-image-set(url('../../images/aid/icon4/位图.png') 1x, url('../../images/aid/icon4/位图@2x.png') 2x);
  background-image: image-set(url('../../images/aid/icon4/位图.png') 1x, url('../../images/aid/icon4/位图@2x.png') 2x);
}
.kpi__value { font-size: 26px; font-weight: 900; color: #2a6ff0; line-height: 1; letter-spacing: .5px; }
.kpi__label { margin-top: 6px; color: rgba(0,0,0,.55); font-weight: 700; }

/* 让数值与文字在“图标右侧的空白区域”水平+垂直居中 */
.kpi__meta {
  display: grid;
  place-items: center; /* 水平垂直居中 */
  text-align: center;
}
</style>
