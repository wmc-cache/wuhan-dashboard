<template>
  <div class="stacked-col-chart">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from './EChart.vue';

interface Serie { name: string; data: number[]; color?: string }
interface Props {
  categories?: string[];
  series?: Serie[];
  yMax?: number;
  // 样式/布局
  barWidth?: number;
  axisColor?: string;
  gridLineColor?: string;
  textColor?: string;
  gridLeft?: number; gridRight?: number; gridTop?: number; gridBottom?: number;
  xLabelRotate?: number; xLabelInterval?: number | 'auto'; ySplitNumber?: number;
  showLegend?: boolean;
  legendTop?: number | string; legendLeft?: number | string;
  showTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['武昌区','硚口区','江岸区','东湖开发区','新洲区','洪山区','青山区','蔡甸区','江夏区','汉阳区','东西湖区','东湖风景区','黄陂区','经开区','江汉区'],
  series: () => [
    { name: '未建会', data: [60, 40, 50, 30, 45, 55, 48, 36, 44, 50, 42, 38, 47, 35, 46] },
    { name: '总工会', data: [180, 120, 150, 110, 130, 140, 145, 120, 150, 160, 148, 135, 142, 150, 155] },
    { name: '其他', data: [40, 35, 38, 28, 30, 32, 30, 28, 29, 30, 30, 28, 30, 28, 29] },
    { name: '工会小组', data: [120, 80, 90, 70, 72, 75, 68, 66, 74, 78, 70, 72, 76, 74, 79] },
    { name: '分工会', data: [240, 160, 180, 130, 128, 140, 132, 120, 150, 170, 150, 145, 155, 165, 168] },
    { name: '单独基层工会', data: [200, 130, 150, 100, 96, 120, 110, 108, 126, 136, 120, 118, 124, 130, 132] },
    { name: '联合基层工会', data: [110, 90, 100, 86, 70, 82, 80, 78, 84, 90, 86, 80, 88, 92, 94] },
    { name: '行业性工会联合会', data: [40, 35, 36, 30, 26, 28, 26, 24, 30, 32, 28, 26, 28, 30, 32] }
  ],
  yMax: 1200,
  barWidth: 26,
  axisColor: 'rgba(67,127,255,0.35)',
  gridLineColor: 'rgba(67,127,255,0.20)',
  textColor: 'rgba(25, 90, 200, 0.95)',
  gridLeft: 56, gridRight: 16, gridTop: 28, gridBottom: 56,
  xLabelRotate: 0, xLabelInterval: 0, ySplitNumber: 4,
  showLegend: true,
  legendTop: 0, legendLeft: 70,
  showTooltip: true
});

const palette = ['#8FB9FF','#6FA7FF','#A8C4FF','#7EC8FF','#5AA0FF','#4E8FFF','#6FD9C9','#9AA0AD'];

const option = computed(() => {
  const series = props.series.map((s, i) => ({
    type: 'bar', name: s.name, stack: 'Total',
    barWidth: props.barWidth,
    data: s.data,
    itemStyle: { color: s.color || palette[i % palette.length] },
    emphasis: { focus: 'series' }
  }));
  return {
    animation: true,
    grid: { left: props.gridLeft, right: props.gridRight, top: props.gridTop, bottom: props.gridBottom, containLabel: true },
    tooltip: props.showTooltip ? { trigger: 'axis', axisPointer: { type: 'shadow' } } : undefined,
    legend: props.showLegend ? { top: props.legendTop, left: props.legendLeft, textStyle: { color: props.textColor }, itemWidth: 10, itemHeight: 10 } : undefined,
    xAxis: {
      type: 'category', data: props.categories,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: props.axisColor } },
      axisLabel: { color: props.textColor, interval: props.xLabelInterval as any, rotate: props.xLabelRotate }
    },
    yAxis: {
      type: 'value', min: 0, max: props.yMax, splitNumber: props.ySplitNumber,
      axisLine: { lineStyle: { color: props.axisColor } }, axisTick: { show: false },
      axisLabel: { color: props.textColor },
      splitLine: { lineStyle: { type: 'dashed', color: props.gridLineColor } }
    },
    series
  } as echarts.EChartsOption;
});
</script>

<style scoped lang="scss">
.stacked-col-chart { height: 100%; }
</style>

