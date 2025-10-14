<template>
  <div class="age-distribution-wrap">
    <!-- 复用通用年龄分布组件；单位改为“人”，x 轴上限与刻度根据数据自适配 -->
    <MemberAgeDistribution :items="safeItems" :max="xMax" :tick="xTick" :showPercent="true" y-unit="人" />
  </div>
<!-- 说明：
  - 之前固定 max=90（万人），导致接口返回为“人”时数值过小、肉眼不可见
  - 此处将单位改为“人”，并根据数据自动计算上限与刻度
-->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { niceMax } from '../../utils/api';
import MemberAgeDistribution from '../member/AgeDistribution.vue';

interface Item { name: string; value: number }
interface Props { items?: Item[] }

const props = withDefaults(defineProps<Props>(), { items: () => [] });

// 保持对外部传值的响应
const safeItems = computed<Item[]>(() => Array.isArray(props.items) ? props.items : []);
const xMax = computed(() => niceMax(safeItems.value.map(i => Number(i?.value || 0)), 10));
const xTick = computed(() => Math.max(1, Math.round((xMax.value || 10) / 6))); // 粗略 6 等分
</script>

<style scoped lang="scss">
.age-distribution-wrap { position: relative; height: 100%; }
</style>
