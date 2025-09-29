<template>
  <div class="honor-rings">
    <EChart :option="option" />
    <div v-if="centerText" class="center-label">{{ centerText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from './EChart.vue';

interface Item { name: string; value: number; color: string }

interface Props {
  items?: Item[]; // 三项：省/市/国家 之类
  // 中心文案
  centerText?: string;
  // 布局参数（按当前视觉还原给出默认值，可按需覆写）
  center?: [string, string];
  sweepAngle?: number; // 每个环扫过的角度（非整圈，用于留白断口）
  baseStart?: number; // 主环起始角
  gapDeg?: number;    // 主环各段缝隙角度
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { name: '省级', value: 23, color: '#4DD0E1' },
    { name: '市级', value: 22, color: '#4293FF' },
    { name: '国家级', value: 44, color: '#FF7875' }
  ],
  centerText: '荣誉分类',
  center: () => ['46%', '55%'],
  sweepAngle: 260,
  baseStart: 20,
  gapDeg: 8
});

const data = props.items;
const total = computed(() => data.reduce((s, d) => s + d.value, 0));

function angleByValue(v: number) {
  return (v / total.value) * props.sweepAngle;
}

// 3 个环的几何参数与对应数据（外/中/内）
const rings = computed(() => [
  { radius: ['60%', '74%'] as [string, string], startAngle: 30,  color: data[0].color, value: data[0].value }, // 省级（外）
  { radius: ['46%', '58%'] as [string, string], startAngle: 180, color: data[2].color, value: data[2].value }, // 国家级（中）
  { radius: ['32%', '44%'] as [string, string], startAngle: 315, color: data[1].color, value: data[1].value }  // 市级（内）
]);

const option = computed(() => {
  const center = props.center as any;

  // 背景轨道（可选：当前默认不加入最终 series，仅保留实现方便后续复用）
  const backSeries = rings.value.map((r) => ({
    type: 'pie' as const,
    silent: true,
    z: 1,
    center,
    radius: r.radius,
    startAngle: 0,
    label: { show: false },
    labelLine: { show: false },
    itemStyle: { borderWidth: 0 },
    data: [
      { value: 360, name: '', itemStyle: { color: 'rgba(120,160,255,0.12)' } },
      { value: 0,   name: '', itemStyle: { color: 'rgba(0,0,0,0)' } }
    ]
  }));

  // 渐变环（260° 扫描 + 留白断口，默认不加入最终 series）
  const ringSeries = rings.value.map((r) => {
    const v = angleByValue(r.value);
    const rest = 360 - v;
    function grad(color: string) {
      const c = color.replace('#', '');
      const R = parseInt(c.substring(0, 2), 16);
      const G = parseInt(c.substring(2, 4), 16);
      const B = parseInt(c.substring(4, 6), 16);
      const l = (n: number) => Math.min(255, Math.round(n + (255 - n) * 0.38));
      const light = `rgb(${l(R)},${l(G)},${l(B)})`;
      return new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: light },
        { offset: 1, color }
      ]);
    }
    return {
      type: 'pie' as const,
      silent: true,
      center,
      radius: r.radius,
      startAngle: r.startAngle,
      clockwise: true,
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: { borderWidth: 0 },
      data: [
        { value: v,   name: '', itemStyle: { color: grad(r.color), shadowBlur: 8, shadowColor: 'rgba(50,120,255,0.25)' } },
        { value: rest, name: '', itemStyle: { color: 'rgba(0,0,0,0)' } }
      ]
    };
  });

  // 主环（半透明底 + 实色层），并带缝隙
  const order = [0, 2, 1]; // 省→国→市
  const sumVal = data.reduce((s, d) => s + d.value, 0);
  const usable = 360 - props.gapDeg * data.length;
  const ang = data.map((d) => (d.value / sumVal) * usable);
  const r = props.gapDeg / 360;
  const gapValue = (r * sumVal) / (1 - data.length * r);

  const underData: any[] = [];
  const solidData: any[] = [];
  function hexToRgba(hex: string, alpha: number) {
    const c = hex.replace('#', '');
    const R = parseInt(c.substring(0, 2), 16);
    const G = parseInt(c.substring(2, 4), 16);
    const B = parseInt(c.substring(4, 6), 16);
    return `rgba(${R},${G},${B},${alpha})`;
  }
  order.forEach((idx, i) => {
    underData.push({ value: data[idx].value, name: data[idx].name, itemStyle: { color: hexToRgba(data[idx].color, 0.3) } });
    underData.push({ value: gapValue, name: `gap-u-${i}`, itemStyle: { color: 'rgba(0,0,0,0)' }, tooltip: { show: false }, label: { show: false }, labelLine: { show: false } });
    solidData.push({
      value: data[idx].value,
      name: data[idx].name,
      itemStyle: { color: data[idx].color, borderColor: '#eef2f7', borderWidth: 2 },
      label: {
        show: true,
        position: 'outside',
        formatter: (p: any) => `${p.name}\n${p.value}`,
        alignTo: 'edge', edgeDistance: 10,
        color: '#2a6ff0', fontSize: 12, width: 72, lineHeight: 16, overflow: 'break'
      },
      labelLine: { show: true, length: 16, length2: 10, lineStyle: { color: data[idx].color, width: 1.5 } }
    });
    solidData.push({ value: gapValue, name: `gap-s-${i}`, itemStyle: { color: 'rgba(0,0,0,0)' }, tooltip: { show: false }, label: { show: false }, labelLine: { show: false } });
  });
  const underRing = { name: 'under', type: 'pie' as const, hoverAnimation: false, legendHoverLink: false, radius: ['47%', '60%'], center, startAngle: props.baseStart, label: { show: false }, labelLine: { show: false }, tooltip: { show: false }, data: underData };
  const solidRing = { name: 'solid', type: 'pie' as const, hoverAnimation: false, legendHoverLink: false, radius: ['55%', '60%'], center, startAngle: props.baseStart, label: { show: false }, labelLine: { show: false }, data: solidData };

  // 内环虚线刻度
  const tickRing: echarts.EChartsOption['series'] = {
    type: 'gauge', center, radius: '26%', startAngle: 220, endAngle: -40, min: 0, max: 100, splitNumber: 12,
    axisLine: { lineStyle: { width: 1, color: [[1, 'rgba(0,0,0,0)']] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, pointer: { show: false }, detail: { show: false }
  } as any;

  const base = {
    tooltip: { show: true, formatter: '{b}: {c}' },
    series: [underRing, solidRing, tickRing]
  } as echarts.EChartsOption;
  return base;
});

</script>

<style scoped lang="scss">
.honor-rings { position: relative; width: 100%; height: 100%; }
.center-label {
  position: absolute;
  top: 55%;
  left: 46%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 600;
  color: #607d8b;
  pointer-events: none;
}
</style>
