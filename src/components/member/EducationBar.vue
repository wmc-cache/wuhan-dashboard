<template>
  <div class="education-bar">
    <StripedBarChart
      y-unit="人"
      :categories="cats"
      :values="vals"
      :yMax="ymax"
      :gridLeft="64"
      :gridRight="20"
      :gridTop="25"
      :gridBottom="54"
      :xLabelInterval="0"
    />
  </div>
<!-- 说明：
  - 使用 computed 包装 props，避免直接解构导致的非响应问题
  - yUnit 改为“人”，与接口口径一致；如需“万人”，可在父层自行换算
-->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import StripedBarChart from '../StripedBarChart.vue';

interface Props { categories?: string[]; values?: number[]; yMax?: number }
const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  values: () => [],
  yMax: 10
});

// 保持响应：不直接赋值，使用 computed 读取 props
const cats = computed(() => props.categories || []);
const vals = computed(() => props.values || []);
const ymax = computed(() => Number(props.yMax || 10));
</script>

<style scoped lang="scss">
.education-bar { height: 100%; }
</style>
