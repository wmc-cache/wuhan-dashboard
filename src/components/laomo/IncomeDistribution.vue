<template>
  <div class="income-distribution">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

interface Props {
  categories?: string[];
  values?: number[];
  yMax?: number;
  yUnit?: string;        // y 轴单位 (默认“人”)
  yAxisName?: string;    // 覆盖 y 轴名称，优先级高于 yUnit
  gridLeft?: number;
  gridRight?: number;
  gridTop?: number;
  gridBottom?: number;
  lineColor?: string;
  areaStart?: string;
  areaEnd?: string;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['3千以下', '3-5千', '5-7千', '7千-1万', '1万以上'],
  values: () => [120, 782, 260, 740, 430],
  yMax: 1200,
  yUnit: '人',
  yAxisName: '',
  gridLeft: 56,
  gridRight: 16,
  gridTop: 25,
  gridBottom: 40,
  lineColor: '#3E7BFF',
  areaStart: 'rgba(62,123,255,0.45)',
  areaEnd: 'rgba(62,123,255,0.05)'
});

const option = computed(() => ({
  grid: { left: props.gridLeft, right: props.gridRight, top: props.gridTop, bottom: props.gridBottom },
  xAxis: {
    type: 'category',
    data: props.categories,
    boundaryGap: true,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: 'rgba(67,127,255,0.35)' } },
    axisLabel: { color: 'rgba(25,90,200,0.95)', fontWeight: 600 }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: props.yMax,
    splitNumber: 4,
    // 单位放在 y 轴顶部
    name: props.yAxisName ? props.yAxisName : (props.yUnit ? `(${props.yUnit})` : ''),
    nameLocation: 'end',
    nameGap: 12,
    nameTextStyle: { color: 'rgba(25,90,200,0.95)', fontWeight: 700 },
    axisTick: { show: false },
    axisLine: { lineStyle: { color: 'rgba(67,127,255,0.35)' } },
    axisLabel: { color: 'rgba(25,90,200,0.95)' },
    splitLine: { lineStyle: { type: 'dashed', color: 'rgba(67,127,255,0.22)' } }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter: (p: any) => {
      const pt = Array.isArray(p) ? p[0] : p;
      return `${pt.name}<br/>${pt.value}人`;
    }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: props.values,
      showSymbol: false,
      emphasis: { focus: 'series' },
      lineStyle: { width: 3, color: props.lineColor },
      areaStyle: {
        color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: props.areaStart },
          { offset: 1, color: props.areaEnd }
        ])
      }
    },
    // hover 时高亮圆点
    {
      type: 'scatter',
      data: props.values,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: { color: '#fff', borderColor: props.lineColor, borderWidth: 2 },
      emphasis: { scale: 1.2 },
      tooltip: { show: false }
    }
  ]
}) as echarts.EChartsOption);
</script>

<style scoped lang="scss">
.income-distribution { height: 100%; }
</style>

