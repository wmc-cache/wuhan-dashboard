<template>
  <div class="org-industry">
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
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'],
  values: () => [662, 483, 784, 900, 432, 661],
  yMax: 1200
});

const option = computed(() => {
  const colors = {
    bg: 'rgba(50, 145, 254, 0.19)',
    barBottom: 'rgba(5,135,254,0)',
    barTop: '#0587FE',
    axis: 'rgba(40,100,200,0.35)',
    text: 'rgba(25,90,200,0.9)'
  };

  return {
    grid: { left: 64, right: 16, top: 16, bottom: 56 },
    xAxis: {
      type: 'category',
      data: props.categories,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colors.axis } },
      axisLabel: { color: colors.text, fontWeight: 600 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: props.yMax,
      splitNumber: 4,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colors.axis } },
      axisLabel: { color: colors.text },
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(67,127,255,0.2)' } }
    },
    tooltip: { trigger: 'item' },
    animation: true,
    series: [
      // 背景柱
      {
        type: 'bar',
        data: new Array(props.values.length).fill(props.yMax),
        barWidth: 36,
        itemStyle: {
          color: colors.bg,
          borderRadius: [6, 6, 0, 0]
        },
        silent: true,
        z: 1
      },
      // 条纹前景（pictorial 重复矩形，按数值裁切）
      {
        type: 'pictorialBar',
        data: props.values,
        symbol: 'rect',
        symbolSize: [18, 20],
        symbolMargin: 1,
        symbolRepeat: true,
        symbolBoundingData: props.yMax,
        symbolClip: true,
        itemStyle: {
          // 渐变在整个坐标系上生效（非单个方块），从下到上更浅
          color: new (echarts as any).graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: colors.barBottom },
            { offset: 1, color: colors.barTop }
          ], true)
        },
        z: 3,
        label: {
          show: true,
          position: 'top',
          formatter: ({ value }: any) => String(value),
          color: '#0587FE',
          fontWeight: 700,
          fontSize: 14,
          offset: [0, -8]
        }
      }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.org-industry { position: relative; height: 100%; }
</style>
