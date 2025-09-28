<template>
  <div class="h-gender-stack">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EChart from './EChart.vue';

interface Props {
  labels: string[];
  male: number[];
  female: number[];
  step?: number;
  minTotal?: number;
  maleColor?: string;
  femaleColor?: string;
  barWidth?: number;
  gridLeft?: number; gridRight?: number; gridTop?: number; gridBottom?: number;
  unitText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 15,
  minTotal: 60,
  maleColor: '#2a6ff0',
  femaleColor: '#ff6b97',
  barWidth: 12,
  gridLeft: 100,
  gridRight: 20,
  gridTop: 30,
  gridBottom: 40,
  unitText: '万人'
});

function ceilToStep(n: number, step: number) { return Math.ceil(n / step) * step; }

const option = computed(() => {
  const totals = props.labels.map((_, i) => (props.male[i] ?? 0) + (props.female[i] ?? 0));
  const max = Math.max(...totals, 1);
  const maxAxis = Math.max(ceilToStep(max, props.step), props.minTotal);

  return {
    grid: { left: props.gridLeft, right: props.gridRight, top: props.gridTop, bottom: props.gridBottom },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'value', min: 0, max: maxAxis, interval: props.step,
      axisLabel: { color: 'rgba(0,0,0,0.45)', formatter: (v: number) => (v === maxAxis ? v + props.unitText : v) },
      axisLine: { show: false }, axisTick: { show: false },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: 'rgba(42,111,240,0.25)' } }
    },
    yAxis: {
      type: 'category', data: props.labels,
      axisTick: { show: false }, axisLine: { show: false },
      axisLabel: { color: '#333', fontWeight: 700 }
    },
    series: [
      { name: '男性', type: 'bar', stack: 'total', barWidth: props.barWidth, data: props.male,
        itemStyle: { color: props.maleColor, borderRadius: [0, 6, 6, 0] } },
      { name: '女性', type: 'bar', stack: 'total', barWidth: props.barWidth, data: props.female,
        itemStyle: { color: props.femaleColor, borderRadius: [0, 6, 6, 0] } }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.h-gender-stack { position: relative; height: 100%; }
</style>

