<template>
  <div ref="el" class="echart" :style="{ width, height }"></div>
  
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref, watch, shallowRef } from 'vue';

type EChartsOption = echarts.EChartsOption;

interface Props {
  option: EChartsOption;
  width?: string;
  height?: string;
  theme?: string | object;
  // 事件映射：{ eventName: handler }
  // 示例：{ click: (params, ec) => { ... } }
  events?: Record<string, (params: any, ec: echarts.ECharts) => void>;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%'
});

const el = ref<HTMLDivElement | null>(null);
const chart = shallowRef<echarts.ECharts | null>(null);
const bound = new Map<string, (p: any) => void>();
let ro: ResizeObserver | null = null;

function init() {
  if (!el.value) return;
  chart.value = echarts.init(el.value, props.theme);
  if (props.option) chart.value.setOption(props.option, { notMerge: true });
  bindEvents();
  // auto resize
  ro = new ResizeObserver(() => {
    if (chart.value) chart.value.resize();
  });
  ro.observe(el.value);
}

onMounted(init);
onBeforeUnmount(() => {
  if (ro && el.value) ro.unobserve(el.value);
  ro = null;
  if (chart.value) {
    // unbind events
    for (const [evt, handler] of bound.entries()) {
      chart.value.off(evt as any, handler as any);
    }
    bound.clear();
    chart.value.dispose();
    chart.value = null;
  }
});

watch(
  () => props.option,
  (opt) => {
    if (chart.value && opt) chart.value.setOption(opt, { notMerge: true });
  },
  { deep: true }
);

watch(
  () => props.events,
  () => bindEvents(),
  { deep: true }
);

function bindEvents() {
  if (!chart.value) return;
  // 清理旧的
  for (const [evt, handler] of bound.entries()) {
    chart.value.off(evt as any, handler as any);
  }
  bound.clear();
  const events = props.events || {};
  Object.entries(events).forEach(([evt, fn]) => {
    if (typeof fn === 'function') {
      const handler = (params: any) => fn(params, chart.value as any);
      bound.set(evt, handler);
      chart.value!.on(evt as any, handler as any);
    }
  });
}

defineExpose({
  getChart: () => chart.value
});
</script>

<style scoped>
.echart { display: block; }
</style>
