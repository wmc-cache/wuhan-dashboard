<template>
  <div class="org-industry">
    <StripedBarChart
      :categories="props.categories"
      :values="props.values"
      :y-max="props.yMax"
    />
  </div>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';

interface Props {
  categories?: string[];
  values?: number[];
  yMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'],
  values: () => [662, 483, 784, 900, 432, 661],
  yMax: 1200
});
</script>

<style scoped lang="scss">
.org-industry { position: relative; height: 100%; }
</style>
