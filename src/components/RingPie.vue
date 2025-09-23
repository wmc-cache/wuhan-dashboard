<template>
  <div class="ring-pie">
    <EChart :option="option" />
    <!-- 中心插槽：根据 center 百分比精准定位 -->
    <div v-if="$slots.center" class="center" :style="centerStyle">
      <slot name="center" />
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EChart from './EChart.vue';

interface DataItem { name: string; value: number; color?: string }

interface Props {
  data: DataItem[];
  center?: [string, string]; // ['x%','y%']
  radius?: [string, string]; // ['inner','outer']
  gapColor?: string; // 扇区间隙颜色
  borderWidth?: number; // 间隙宽
  emphasisScale?: number; // 悬停放大
  startAngle?: number;
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  center: () => ['50%', '50%'],
  radius: () => ['48%', '72%'],
  gapColor: 'rgba(242,247,255,0.95)',
  borderWidth: 6,
  emphasisScale: 18,
  startAngle: 90,
  showLabel: false
});

const centerStyle = computed(() => ({ left: props.center[0], top: props.center[1] }));

const option = computed(() => ({
  animation: true,
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c}' },
  series: [
    {
      type: 'pie',
      center: props.center as any,
      radius: props.radius as any,
      startAngle: props.startAngle,
      avoidLabelOverlap: true,
      label: { show: props.showLabel },
      labelLine: { show: props.showLabel },
      clockwise: true,
      itemStyle: {
        borderWidth: props.borderWidth,
        borderColor: props.gapColor,
      },
      emphasis: {
        scale: true,
        scaleSize: props.emphasisScale,
        itemStyle: {
          borderWidth: Math.max(1, props.borderWidth + 1), // 保持视觉分隔
          borderColor: props.gapColor,
          shadowBlur: 12,
          shadowColor: 'rgba(80,140,255,0.35)'
        }
      },
      data: props.data.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
    }
  ]
}) as any);
</script>

<style scoped lang="scss">
.ring-pie { position: relative; height: 100%; }
.center {
  position: absolute;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
}
</style>
