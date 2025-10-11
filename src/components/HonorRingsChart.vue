<template>
  <div class="honor-rings">
    <EChart :option="option" />
    <!-- 可选中心内容：图标与文字，位置跟随 center -->
    <div v-if="centerText || centerIcon" class="center-layer" :style="centerStyle">
      <img
        v-if="centerIcon"
        class="center-icon"
        :src="centerIcon"
        :srcset="centerIcon2x ? `${centerIcon2x} 2x` : undefined"
        :style="{ width: centerIconSize + 'px', height: centerIconSize + 'px' }"
        alt=""
      />
      <div v-if="centerText" class="center-label">{{ centerText }}</div>
    </div>
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
  // 中心图标（可选），建议传入经 Vite 导入的资源 URL
  centerIcon?: string;
  centerIcon2x?: string; // Retina 可选
  centerIconSize?: number; // px
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
  centerIcon: undefined,
  centerIcon2x: undefined,
  centerIconSize: 34,
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

// 支持 1~3 项时的环图图层（外/中/内）配置
// 说明：之前写死了 data[2] 等索引，导致只有两项时会越界。
// 这里根据传入项数量自适应映射，保证 2 项也能正常显示。
const rings = computed(() => {
  const defs = [
    { radius: ['60%', '74%'] as [string, string], startAngle: 30 },   // 外环
    { radius: ['46%', '58%'] as [string, string], startAngle: 180 },  // 中环
    { radius: ['32%', '44%'] as [string, string], startAngle: 315 }   // 内环
  ];
  const n = Math.max(0, Math.min(3, data.length));
  // 与旧版展示顺序保持一致：三项时为 [0,2,1]（省→国→市）
  // 两项时简化为 [0,1]；一项时为 [0]
  const order = n >= 3 ? [0, 2, 1] : n === 2 ? [0, 1] : [0];
  return order.map((dataIdx, k) => ({
    radius: defs[k].radius,
    startAngle: defs[k].startAngle,
    color: data[dataIdx].color,
    value: data[dataIdx].value
  }));
});

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
  // 三项时顺序为 [0,2,1]；两项时为 [0,1]；一项为 [0]
  const order = data.length >= 3 ? [0, 2, 1] : (data.length === 2 ? [0, 1] : [0]);
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
      labelLine: { show: true, length: 8, length2: 6, lineStyle: { color: data[idx].color, width: 1.5 } }
    });
    solidData.push({ value: gapValue, name: `gap-s-${i}`, itemStyle: { color: 'rgba(0,0,0,0)' }, tooltip: { show: false }, label: { show: false }, labelLine: { show: false } });
  });
  const underRing = { name: 'under', type: 'pie' as const, hoverAnimation: false, legendHoverLink: false, radius: ['52%', '70%'], center, startAngle: props.baseStart, label: { show: false }, labelLine: { show: false }, tooltip: { show: false }, data: underData };
  const solidRing = { name: 'solid', type: 'pie' as const, hoverAnimation: false, legendHoverLink: false, radius: ['60%', '70%'], center, startAngle: props.baseStart, label: { show: false }, labelLine: { show: false }, data: solidData };

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

// 中心层样式跟随 center，避免移动时错位
const centerStyle = computed(() => ({
  left: props.center?.[0] || '46%',
  top: props.center?.[1] || '55%'
}));

</script>

<style scoped lang="scss">
.honor-rings { position: relative; width: 100%; height: 100%; }
.center-layer { position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center; pointer-events: none; }
.center-icon { object-fit: contain; display: block; }
.center-label { margin-top: 6px; font-size: 14px; font-weight: 600; color: #607d8b; text-align: center; }
</style>
