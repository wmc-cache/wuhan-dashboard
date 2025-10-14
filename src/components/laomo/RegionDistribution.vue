<template>
  <div class="region-distribution">
    <StripedBarChart
      y-unit="个"
      :categories="cats"
      :values="vals"
      :y-max="ymax"
      :x-label-interval="0"
      :gridLeft="64" :gridRight="20" :gridTop="25" :gridBottom="56" :barWidth="40" :stripeWidth="28" :stripeHeight="14"
      :stripeGap="2" :showLabels="false" :enableTooltip="true" stripeColor="#FFA542" axisColor="rgba(67,127,255,0.35)"
      textColor="rgba(25, 90, 200, 0.95)" gridLineColor="rgba(67,127,255,0.22)" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StripedBarChart from '../StripedBarChart.vue';

interface Props { categories?: string[]; values?: number[]; yMax?: number }

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  values: () => [],
  yMax: 1200
});

// 保持对父组件传值的响应，不复制为常量
const cats = computed(() => props.categories || []);
const vals = computed(() => props.values || []);
const ymax = computed(() => Number(props.yMax || 0));
</script>

<style scoped lang="scss">
.region-distribution { position: relative; height: 100%; }
</style>
