<template>
  <div class="join-age">
    <!-- 标题图片 -->
    <div class="title-img">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="参加年龄分布统计" draggable="false" />
    </div>

    <!-- 自定义图例（男女） -->
    <div class="legend">
      <div class="legend__item"><span class="dot dot--male"></span>男性</div>
      <div class="legend__item"><span class="dot dot--female"></span>女性</div>
    </div>

    <!-- 图表区域 -->
    <div class="chart">
      <EChart :option="option" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EChart from '../EChart.vue';
import title1x from '../../images/yiliao/part3/title/编组 21.png';
import title2x from '../../images/yiliao/part3/title/编组 21@2x.png';

interface Row { label: string; male: number; female: number }
interface Props { data?: Row[] }

const props = withDefaults(defineProps<Props>(), {
  data: () => [
    { label: '80岁以上', male: 30, female: 35 },
    { label: '60-80岁',  male: 32, female: 28 },
    { label: '40-60岁',  male: 26, female: 35 },
    { label: '20-40岁',  male: 28, female: 32 },
    { label: '20岁以下', male: 20, female: 18 }
  ]
});

const maleColor = '#2a6ff0';
const femaleColor = '#ff6b97';

function ceilToStep(n: number, step = 15) {
  return Math.ceil(n / step) * step;
}

const option = computed(() => {
  const labels = props.data.map(d => d.label);
  const males = props.data.map(d => d.male);
  const females = props.data.map(d => d.female);
  const totals = props.data.map(d => d.male + d.female);
  const max = Math.max(...totals, 1);
  const maxAxis = Math.max(ceilToStep(max, 15), 60); // 至少 60，按 15 取整

  return {
    grid: { left: 100, right: 20, top: 30, bottom: 40 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'value',
      min: 0,
      max: maxAxis,
      interval: 15,
      axisLabel: {
        color: 'rgba(0,0,0,0.45)',
        formatter: (v: number) => (v === maxAxis ? v + '万人' : v)
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: 'rgba(42,111,240,0.25)' } }
    },
    yAxis: {
      type: 'category',
      data: labels,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#333', fontWeight: 700 }
    },
    series: [
      {
        name: '男性',
        type: 'bar',
        stack: 'total',
        barWidth: 12,
        data: males,
        itemStyle: { color: maleColor, borderRadius: [0, 6, 6, 0] }
      },
      {
        name: '女性',
        type: 'bar',
        stack: 'total',
        barWidth: 12,
        data: females,
        itemStyle: { color: femaleColor, borderRadius: [0, 6, 6, 0] }
      }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.join-age { position: relative; width: 100%; height: 100%; padding: 18px 16px 12px; box-sizing: border-box; }
.title-img { position: absolute; left: 12px; top: 8px; }
.title-img img { display: block; width: 151px; height: 35px; object-fit: contain; }
.legend { position: absolute; right: 18px; top: 12px; display: flex; gap: 24px; align-items: center; }
.legend__item { display: inline-grid; grid-auto-flow: column; align-items: center; gap: 8px; font-size: 14px; color: #4c5566; font-weight: 600; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot--male { background: #2a6ff0; }
.dot--female { background: #ff6b97; }
.chart { position: absolute; inset: 40px 8px 8px 0; }
</style>

