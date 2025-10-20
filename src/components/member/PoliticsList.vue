<template>
  <div class="politics-list">
    <!-- 参考 member/AgeDistribution 的实现，改为 ECharts 横向条形，带坐标轴与虚线网格 -->
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

interface Item { name: string; value: number }
interface Props {
  items?: Item[];
  max?: number;   // 视觉最大刻度，默认与“90万人”风格一致
  tick?: number;  // 刻度间隔
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { name: '中共党员', value: 23877 },
    { name: '中共预备党员', value: 23877 },
    { name: '共青团员', value: 23877 },
    { name: '民革党员', value: 23877 },
    { name: '民盟盟员', value: 23877 },
    { name: '民建会员', value: 23877 },
    { name: '民进会员', value: 23877 },
    { name: '农工党党员', value: 23877 },
    { name: '致公党党员', value: 23877 },
    { name: '九三学社社员', value: 23877 },
    { name: '台盟盟员', value: 23877 },
    { name: '无党派人士', value: 23877 },
    { name: '群众', value: 23877 }
  ],
  max: 90,
  tick: 15
});

const rows = computed(() => props.items);
const total = computed(() => rows.value.reduce((s, r) => s + (r.value || 0), 0));

// 将实际数值映射到 0~max 的视觉刻度（仅用于条长与网格的对齐，右侧文本仍显示原值与占比）
const scale = computed(() => {
  const m = Math.max(1, ...rows.value.map(r => r.value || 0));
  return props.max / m;
});

const categories = computed(() => rows.value.map(r => r.name));
const seriesData = computed(() => rows.value.map(r => ({ value: (r.value || 0) * scale.value, raw: r.value })));
const maxArr = computed(() => new Array(rows.value.length).fill(props.max));

const option = computed(() => {
  const axisColor = 'rgba(40,100,200,0.35)';
  const gridLine = 'rgba(67,127,255,0.20)';
  return {
    grid: { left: 100, right: 140, top: 16, bottom: 40 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const first = Array.isArray(params) ? params[0] : params;
        const name = first?.name ?? '';
        const raw = Number(first?.data?.raw ?? first?.value ?? 0);
        const pct = total.value ? Math.round((raw / total.value) * 100) : 0;
        return `${name}<br/>${formatWan(raw)} (${pct}%)`;
      }
    },
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
        fontWeight: 600,
        formatter: (val: number) => `${val}万人`
      }
    },
    yAxis: {
      type: 'category',
      data: categories.value,
      inverse: true,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: axisColor } },
      axisLabel: {
        color: '#4A90E2',
        fontWeight: 600,
        fontSize: 12
      }
    },
    series: [
      // 背景虚线条
      {
        type: 'bar',
        data: maxArr.value,
        barWidth: 12,
        itemStyle: {
          color: 'transparent',
          borderColor: 'rgba(90,160,255,0.3)',
          borderWidth: 1,
          borderType: 'dashed',
          borderRadius: [0, 6, 6, 0]
        },
        barGap: '-100%',
        silent: true,
        tooltip: { show: false },
        z: 1
      },
      // 实际值条形
      {
        type: 'bar',
        data: seriesData.value,
        barWidth: 12,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#5AA0FF' },
            { offset: 1, color: '#1A65FF' }
          ]),
          borderRadius: [0, 6, 6, 0]
        },
        label: {
          show: true,
          position: 'right',
          distance: 16,
          color: '#333',
          fontWeight: 600,
          fontSize: 11,
          formatter: (p: any) => {
            const raw = Number(p.data?.raw ?? p.value);
            const pct = total.value ? Math.round((raw / total.value) * 100) : 0;
            return `${formatCount(raw)} (${pct}%)`;
          }
        },
        z: 3
      }
    ]
  } as any;
});

function formatCount(v: number) {
  const num = Number(v) || 0;
  if (num >= 1_000_000) {
    const wan = num / 10000;
    const digits = wan >= 100 ? 0 : wan >= 10 ? 1 : 2;
    return `${wan.toLocaleString('zh-CN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })}万人`;
  }
  return `${num.toLocaleString('zh-CN')}人`;
}
</script>

<style scoped lang="scss">
.politics-list {
  height: 100%;
}
</style>
