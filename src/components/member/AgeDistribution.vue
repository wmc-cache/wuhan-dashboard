<template>
  <div class="age-distribution">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

interface AgeItem { name: string; value: number }

interface Props {
  items?: AgeItem[];      // 从上到下的年龄段
  max?: number;           // x 轴最大刻度（万人）
  tick?: number;          // 刻度间隔（万人）
  showPercent?: boolean;  // 右侧是否显示占比
  yUnit?: string;         // x 轴单位文案（默认“万人”）；传入“人”可用于劳模页
}

const props = withDefaults(defineProps<Props>(), {
  // 参照原型：从年长到年少排列
  items: () => [
    { name: '80岁以上', value: 72 },
    { name: '60-80岁', value: 58 },
    { name: '40-60岁', value: 46 },
    { name: '20-40岁', value: 38 },
    { name: '20岁以下', value: 26 }
  ],
  max: 90,
  tick: 15,
  showPercent: true,
  yUnit: '万人'
});

const total = computed(() => props.items.reduce((s, i) => s + i.value, 0));

const option = computed(() => {
  const axisColor = 'rgba(40,100,200,0.35)';
  const gridLine = 'rgba(67,127,255,0.20)';
  const values = props.items.map(i => i.value);
  const categories = props.items.map(i => i.name);
  const maxArr = new Array(values.length).fill(props.max);
  return {
    grid: { left: 84, right: 120, top: 12, bottom: 36 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'value',
      min: 0,
      max: props.max,
      interval: props.tick,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: axisColor } },
      splitLine: { lineStyle: { type: 'dashed', color: gridLine } },
      axisLabel: {
        color: '#2a6ff0',
        formatter: (val: number) => (val === props.max ? `${val}${props.yUnit}` : `${val}`)
      }
    },
    yAxis: {
      type: 'category',
      data: categories,
      inverse: true, // 与原型一致：从上到下
      axisTick: { show: false },
      axisLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: '#2a6ff0', fontWeight: 700 }
    },
    series: [
      // 背景条（最大值，用作轨道）
      {
        type: 'bar',
        data: maxArr,
        barWidth: 14,
        itemStyle: { color: 'rgba(90,160,255,0.15)', borderRadius: [0, 8, 8, 0] },
        barGap: '-100%',
        silent: true,
        tooltip: { show: false },
        z: 1
      },
      // 实际值
      {
        type: 'bar',
        data: values,
        barWidth: 14,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#5AA0FF' },
            { offset: 1, color: 'rgba(5,135,254,0.35)' }
          ]),
          borderRadius: [0, 8, 8, 0]
        },
        label: {
          show: true,
          position: 'right',
          distance: 8,
          color: '#2a2a2a',
          formatter: (p: any) => {
            if (!props.showPercent) return `${p.value}`;
            const pct = total.value ? Math.round((p.value / total.value) * 100) : 0;
            return `${p.value}  (${pct}%)`;
          }
        },
        z: 3
      }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.age-distribution { height: 100%; }
</style>
