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
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '100%'
});

const el = ref<HTMLDivElement | null>(null);
const chart = shallowRef<echarts.ECharts | null>(null);
let ro: ResizeObserver | null = null;

function init() {
  if (!el.value) return;
  chart.value = echarts.init(el.value, props.theme);
  if (props.option) chart.value.setOption(props.option, { notMerge: true });
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
</script>

<style scoped>
.echart { display: block; }
</style>

