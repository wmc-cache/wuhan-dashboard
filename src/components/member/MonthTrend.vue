<template>
  <div class="month-trend">
    <StripedBarChart y-unit="人" :categories="months" :values="values" :yMax="yMax" :gridLeft="56" :gridRight="16"
      :gridTop="27" :gridBottom="52" :xLabelInterval="0" stripeColor="#FE870B" :showLabels="false" />
  </div>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';

const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

interface Props { values?: number[]; yMax?: number }
const props = withDefaults(defineProps<Props>(), {
  values: () => [120, 180, 240, 280, 320, 360, 420, 460, 440, 420, 380, 350],
  yMax: 500
});

const values = props.values; const yMax = props.yMax;
</script>

<style scoped lang="scss">
.month-trend { height: 100%; }
</style>

