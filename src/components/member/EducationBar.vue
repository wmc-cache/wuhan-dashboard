<template>
  <div class="education-bar">
    <StripedBarChart
      y-unit="万人"
      :categories="categories"
      :values="values"
      :yMax="yMax"
      :gridLeft="64"
      :gridRight="20"
      :gridTop="20"
      :gridBottom="54"
      :xLabelInterval="0"
    />
  </div>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';

interface Props { categories?: string[]; values?: number[]; yMax?: number }

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['博士', '硕士', '本科', '大专', '中专', '高中', '初中', '小学及以下'],
  values: () => [120, 300, 880, 760, 480, 620, 540, 380],
  yMax: 1200
});

const categories = props.categories; const values = props.values; const yMax = props.yMax;
</script>

<style scoped lang="scss">
.education-bar { height: 100%; }
</style>

