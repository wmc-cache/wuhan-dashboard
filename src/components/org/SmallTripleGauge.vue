<template>
  <div class="small3-gauge">
    <EChart :option="option" />
    <div class="center" :style="{ left: center[0], top: center[1] }">
      <div class="num">{{ fmt(total) }}<span class="arrow" aria-hidden="true">↑</span></div>
    </div>
    <div class="footer">小三级工会总数</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

interface Props {
  total?: number;
  max?: number; // 刻度最大，仅影响环形刻度视觉，不影响中心数字
  center?: [string, string];
}

const props = withDefaults(defineProps<Props>(), {
  total: 6329,
  max: 100,
  center: () => ['50%', '52%']
});

const center = props.center;

const option = computed(() => {
  // 两个 gauge 实现：外虚线刻度+内细环；隐藏指针，仅保留分割线与刻度感
  const splitColor = 'rgba(78,143,255,0.45)';
  const tickColor = 'rgba(78,143,255,0.45)';
  const arcColor = new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: 'rgba(120,170,255,0.75)' },
    { offset: 1, color: 'rgba(78,143,255,0.95)' }
  ]);
  return {
    animation: true,
    series: [
      // 外圈刻度（短虚线效果）
      {
        type: 'gauge', center, radius: '84%', min: 0, max: props.max, startAngle: 220, endAngle: -40,
        splitNumber: 12,
        axisLine: { lineStyle: { width: 2, color: [[1, 'rgba(0,0,0,0)']] } },
        splitLine: { length: 12, lineStyle: { width: 1, color: splitColor } },
        axisTick: { length: 6, lineStyle: { color: tickColor, width: 1 } },
        axisLabel: { show: false }, pointer: { show: false }, detail: { show: false }
      },
      // 内圈主环
      {
        type: 'gauge', center, radius: '62%', min: 0, max: props.max, startAngle: 220, endAngle: -40,
        axisLine: { lineStyle: { width: 10, color: [[1, arcColor]] } },
        splitLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false },
        pointer: { show: false }, detail: { show: false }
      }
    ]
  } as echarts.EChartsOption;
});

function fmt(n?: number) { return (n ?? 0).toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.small3-gauge { position: relative; height: 100%; }
.center { position: absolute; transform: translate(-50%, -50%); display: grid; place-items: center; text-align: center; }
.num { font-size: 36px; font-weight: 900; letter-spacing: 1px; background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 4px 9px rgba(30, 100, 220, 0.18); }
.arrow { display: inline-block; margin-left: 2px; color: #6FA7FF; font-size: 20px; transform: translateY(-4px); }
.footer { position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%); padding: 4px 10px; border: 1px dashed rgba(78,143,255,0.5); border-radius: 6px; color: #2a6ff0; font-weight: 800; font-size: 14px; background: rgba(255,255,255,0.55); }
</style>
