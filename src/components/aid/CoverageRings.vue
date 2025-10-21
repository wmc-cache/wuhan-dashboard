<template>
  <div class="cov3">
    <div
      v-for="(it, i) in items"
      :key="i"
      class="row"
      :style="{ '--c': it.color || '#4E8FFF' } as any"
      role="button"
      tabindex="0"
      @click="emitClick(it)"
      @keyup.enter="emitClick(it)"
      @keyup.space.prevent="emitClick(it)"
    >
      <div class="ring">
        <EChart :option="ringOption(it)" />
      
        <div class="ring__center">{{ Math.round(it.percent) }}<small>%</small></div>
      </div>

     
      <div class="box">
        <div class="num">{{ it.value.toLocaleString('zh-CN') }}<small class="unit">人</small></div>
        <div class="label">{{ it.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EChart from '../EChart.vue';

interface Item { percent: number; value: number; label: string; color?: string }
interface Props { items?: Item[] }

const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { percent: 80, value: 2347, label: '城镇困难职工', color: '#4E8FFF' },
    { percent: 80, value: 2347, label: '困难农民工', color: '#27b87a' },
    { percent: 80, value: 2347, label: '职工涵盖', color: '#f6a03a' },
  ])
});

const emit = defineEmits<{
  (e: 'item-click', payload: Item): void;
}>();

function ringOption(it: Item) {
  const pct = Math.max(0, Math.min(100, Number(it.percent) || 0));
  const color = it.color || '#4E8FFF';
  return {
    animation: false,
    tooltip: { show: false },
    series: [
      // 外层进度环（圆角）
      {
        type: 'gauge',
        min: 0, max: 100, startAngle: 90, endAngle: -270, radius: '100%',
        // 略微缩窄环宽，整体更轻巧
        progress: { show: true, roundCap: true, width: 8, itemStyle: { color } },
        axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(120,160,255,.15)']] } },
        axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, pointer: { show: false },
        detail: { show: false }, data: [{ value: pct }]
      },
      // 内层刻度（虚线/短线）
      {
        type: 'gauge',
        min: 0, max: 100, startAngle: 90, endAngle: -270, radius: '72%',
        progress: { show: false },
        axisLine: { lineStyle: { width: 0 } },
        axisTick: { show: true, splitNumber: 6, length: 5, distance: -6, lineStyle: { color: 'rgba(42,111,240,0.35)', width: 1 } },
        splitLine: { show: true, length: 8, distance: -6, lineStyle: { color: 'rgba(42,111,240,0.22)', width: 1 } },
        axisLabel: { show: false }, pointer: { show: false }, detail: { show: false }, data: [{ value: 100 }]
      }
    ]
  } as any;
}

function emitClick(item: Item) {
  if (!item?.label) return;
  emit('item-click', item);
}
</script>

<style scoped lang="scss">
.cov3 { height: 100%; display: grid; align-content: center; row-gap: 18px; }
.row { display: grid; grid-template-columns: 110px 1fr; align-items: center; column-gap: 16px; cursor: pointer; outline: none; }
.row:focus-visible { box-shadow: 0 0 0 2px rgba(42,111,240,0.35); border-radius: 12px; }
.ring { position: relative; width: 110px; height: 110px; }
.ring :deep(canvas), .ring :deep(div[style*="position: relative"]) { border-radius: 50%; }
.ring__center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-weight: 900; color: var(--c, #2a6ff0); text-shadow: 0 2px 8px rgba(38,112,255,.25); font-size: 22px; }
.ring__center small { font-size: 12px; margin-left: 2px; }
.box { display: grid; align-content: center; row-gap: 8px; padding: 10px 14px; border-radius: 10px; background: linear-gradient(90deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,.7) 40%, rgba(255,255,255,.35) 100%); box-shadow: 0 8px 18px rgba(30,100,220,.08) inset; }
.num { font-size: 44px; font-weight: 900; line-height: 1; 
  color: #1c60ea;
  background: linear-gradient(180deg, var(--c, #2a6ff0) 0%, #1c60ea 85%);
   -webkit-background-clip: text; 
   background-clip: text; 
   color: transparent; 
   text-shadow: 0 4px 12px rgba(38,112,255,.18); }
.num .unit { 
  font-size: 20px; margin-left: 6px;
   color: #2a6ff0; 
   -webkit-text-fill-color: initial; }
.label { font-size: 18px; color: #3f5d8f; font-weight: 800; }
</style>
