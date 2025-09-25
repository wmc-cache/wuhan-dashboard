<template>
  <BarChart :years="years" :data-by-year="dataByYear" :initial-year="initialYear" :y-max="yMax" :bar-name="barName"
    :line-name="lineName" @year-change="emit('year-change', $event)" />
</template>

<script setup lang="ts">
import BarChart from '../BarChart.vue';

type Year = number | string;

interface YearData {
  total: number[];
  added: number[];
}

interface Props {
  years?: Year[];
  dataByYear?: Record<string, YearData>;
  initialYear?: Year;
  yMax?: number;
  barName?: string;
  lineName?: string;
}

withDefaults(defineProps<Props>(), {
  years: () => [2018, 2019, 2020, 2021, 2022, 2023, 2024],
  yMax: 500,
  barName: '工会总数',
  lineName: '新增工会数',
  dataByYear: () => ({
    2018: { total: [180, 160, 250, 240, 100, 260, 110, 300, 380, 360, 290, 100], added: [210, 80, 160, 230, 95, 180, 120, 300, 420, 350, 180, 100] },
    2019: { total: [200, 150, 250, 260, 120, 260, 130, 330, 390, 360, 300, 110], added: [190, 120, 150, 220, 110, 170, 140, 280, 410, 340, 170, 110] },
    2020: { total: [170, 160, 240, 250, 120, 260, 130, 320, 370, 350, 280, 100], added: [200, 110, 160, 210, 100, 180, 120, 290, 400, 330, 160, 100] },
    2021: { total: [190, 150, 255, 245, 110, 255, 120, 310, 365, 345, 275, 95], added: [195, 115, 165, 205, 105, 175, 115, 285, 395, 325, 165, 95] },
    2022: { total: [185, 155, 245, 235, 115, 250, 125, 420, 370, 350, 285, 98], added: [205, 125, 170, 215, 108, 178, 118, 305, 430, 360, 175, 98] },
    2023: { total: [180, 150, 260, 250, 110, 260, 115, 320, 450, 380, 290, 100], added: [205, 130, 175, 220, 105, 185, 115, 305, 430, 360, 180, 100] },
    2024: { total: [175, 145, 255, 245, 108, 255, 112, 315, 360, 350, 200, 95], added: [210, 140, 185, 230, 110, 190, 120, 310, 420, 340, 160, 95] },
  })
});

const emit = defineEmits<{ (e: 'year-change', year: Year): void }>();
</script>

<style scoped lang="scss">
/* YearCreate 组件不需要额外样式，由 BarChart 组件负责 */
</style>
