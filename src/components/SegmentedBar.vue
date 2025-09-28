<template>
  <div class="segmented-bar" role="img" :aria-label="ariaLabel">
    <span
      v-for="i in segTotal"
      :key="i"
      class="seg"
      :class="{ on: i <= filled }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
interface Props {
  // 百分比（0~1）
  percent: number;
  // 开启段数（默认 10 段）
  segTotal?: number;
  // 亮起段的颜色
  color?: string;
  // 无障碍描述，可选
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  segTotal: 10,
  color: '#2a6ff0',
  label: ''
});

// 暴露给 <style> 使用的动态颜色变量
const color = computed(() => props.color);

const filled = computed(() => {
  const p = Math.max(0, Math.min(1, props.percent));
  return Math.round(p * props.segTotal);
});

const ariaLabel = computed(() =>
  props.label ? `${props.label}：${Math.round(props.percent * 100)}%` : `${Math.round(props.percent * 100)}%`
);
</script>

<style scoped lang="scss">
.segmented-bar {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  column-gap: 2px;
}

.seg {
  width: 14px;
  height: 10px;
  border-radius: 3px;
  background: transparent;
}

.seg.on { background: v-bind(color); }
</style>
