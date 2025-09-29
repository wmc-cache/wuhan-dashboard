<template>
  <section class="mod">
    <h3 class="mod__title">{{ title }}</h3>
    <div class="mod__body mod__body--full">
      <StripedBarChart :categories="categories" :values="values" :y-max="yMax" />
    </div>
  </section>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';

interface Props {
  title?: string;
  categories?: string[];
  values?: number[];
  yMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: '救助种类人数统计',
  categories: () => ['冠状肿瘤救助', '自救', '赈济', '支票', '临时救助'],
  values: () => [780, 520, 680, 900, 720],
  yMax: 1200
});

const { title, categories, values, yMax } = props;
</script>

<style scoped lang="scss">
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
.mod__body--full { display: grid; }
</style>

