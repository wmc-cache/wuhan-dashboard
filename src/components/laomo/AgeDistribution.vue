<template>
  <div class="age-distribution-wrap">
    <!-- 复用通用年龄分布组件，默认显示百分比 -->
    <MemberAgeDistribution :items="items" :max="90" :tick="15" :showPercent="true" />
  </div>
</template>

<script setup lang="ts">
import MemberAgeDistribution from '../member/AgeDistribution.vue';

interface Item { name: string; value: number }

interface Props { items?: Item[] }

const props = withDefaults(defineProps<Props>(), {
  // 若需要，可以在使用处覆盖这些默认值
  items: () => [
    { name: '80岁以上', value: 72 },
    { name: '60-80岁', value: 58 },
    { name: '40-60岁', value: 46 },
    { name: '20-40岁', value: 38 },
    { name: '20岁以下', value: 26 }
  ]
});

const items = props.items;
</script>

<style scoped lang="scss">
.age-distribution-wrap { position: relative; height: 100%; }
</style>

