<template>
  <div class="month-trend">
    <StripedBarChart
      y-unit="人"
      :categories="months"
      :values="vals"
      :yMax="ymax"
      :gridLeft="56"
      :gridRight="16"
      :gridTop="27"
      :gridBottom="52"
      :xLabelInterval="0"
      stripeColor="#FE870B"
      :showLabels="false"
    />
  </div>
<!-- 说明：values/yMax 改为 computed 包装 props，确保父组件更新后能响应 -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StripedBarChart from '../StripedBarChart.vue';

const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

interface Props { values?: number[]; yMax?: number }
const props = withDefaults(defineProps<Props>(), {
  values: () => [],
  yMax: 10
});

const vals = computed(() => props.values || []);
const ymax = computed(() => Number(props.yMax || 10));
</script>

<style scoped lang="scss">
.month-trend { height: 100%; }
</style>
