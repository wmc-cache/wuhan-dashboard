<template>
  <BarChart
    :years="years"
    :dataByYear="dataByYear"
    :initialYear="initialYear"
    :yMax="yMax"
    :barName="barName"
    :lineName="lineName"
    :barGradientStart="barGradientStart"
    :barGradientEnd="barGradientEnd"
    :lineColor="lineColor"
  />
</template>

<script setup lang="ts">
// 年入会数统计：基于通用 BarChart 组件，通过 props 传色彩与文案
import BarChart from '../BarChart.vue';

type Year = number | string;

interface YearData { total: number[]; added: number[]; }

interface Props {
  years?: Year[];
  dataByYear?: Record<string, YearData>;
  initialYear?: Year;
  yMax?: number;
  barName?: string;
  lineName?: string;
  barGradientStart?: string;
  barGradientEnd?: string;
  lineColor?: string;
}

withDefaults(defineProps<Props>(), {
  years: () => [2018, 2019, 2020, 2021, 2022, 2023, 2024],
  yMax: 500,
  barName: '会员总数',
  lineName: '新增会员数',
  barGradientStart: 'rgba(255,165,66,1)',
  barGradientEnd: 'rgba(255,165,66,0.35)',
  lineColor: '#8F6CFF',
  dataByYear: () => ({
    2018: { total: [180, 120, 230, 260, 110, 350, 150, 280, 300, 360, 220, 160], added: [200, 80, 160, 230, 95, 180, 120, 300, 420, 350, 180, 100] },
    2019: { total: [190, 110, 240, 250, 120, 340, 140, 290, 310, 370, 230, 150], added: [190, 120, 150, 220, 110, 170, 140, 280, 410, 340, 170, 110] },
    2020: { total: [170, 100, 220, 240, 115, 330, 130, 275, 290, 350, 210, 140], added: [200, 110, 160, 210, 100, 180, 120, 290, 400, 330, 160, 100] },
    2021: { total: [160, 95, 210, 230, 100, 320, 120, 260, 280, 340, 200, 130], added: [195, 115, 165, 205, 105, 175, 115, 285, 395, 325, 165, 95] },
    2022: { total: [200, 110, 250, 260, 130, 360, 150, 300, 450, 380, 240, 160], added: [205, 125, 170, 215, 108, 178, 118, 305, 430, 360, 175, 98] },
    2023: { total: [210, 130, 260, 270, 140, 370, 160, 320, 480, 350, 260, 180], added: [205, 130, 175, 220, 105, 185, 115, 305, 410, 360, 180, 120] },
    2024: { total: [200, 140, 270, 280, 150, 380, 170, 330, 490, 360, 250, 190], added: [210, 140, 185, 230, 110, 190, 120, 310, 420, 340, 160, 95] },
  })
});
</script>

<style scoped>
/* 复用 BarChart 的内部样式，这里无需额外样式 */
</style>

