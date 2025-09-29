<template>
  <div class="region-distribution">
    <StripedBarChart y-unit="个" :categories="categories" :values="values" :yMax="1200" :xLabelInterval="0"
      :gridLeft="64" :gridRight="20" :gridTop="25" :gridBottom="56" :barWidth="40" :stripeWidth="28" :stripeHeight="14"
      :stripeGap="2" :showLabels="false" :enableTooltip="true" stripeColor="#5EE0D2" axisColor="rgba(67,127,255,0.35)"
      textColor="rgba(25, 90, 200, 0.95)" gridLineColor="rgba(67,127,255,0.22)" />
  </div>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';

interface Props { categories?: string[]; values?: number[] }

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    '武昌区','硚口区','江岸区','东湖开发区','新洲区','洪山区','青山区','蔡甸区','江夏区','汉阳区','东西湖区','东湖风景区','黄陂区','经开区','江汉区'
  ],
  values: () => [980, 820, 930, 880, 650, 720, 760, 640, 1000, 940, 900, 910, 870, 960, 920]
});

const categories = props.categories; const values = props.values;
</script>

<style scoped lang="scss">
.region-distribution { height: 100%; }
</style>

