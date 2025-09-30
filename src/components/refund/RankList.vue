<template>
  <ul class="rank-list" :class="variantClass">
    <li v-for="(it, i) in rows" :key="it.name + i" class="row">
      <div class="row__top">
        <div>
          <span class="no" v-if="showNo">NO.{{ i + 1 }}</span>
          <span class="name" :title="it.name">{{ it.name }}</span>
        </div>
        <div>
          <span class="val">{{ money(it.value) }}</span>
        </div>
      </div>
      <div>
        <SegmentedBar class="bar" :percent="percent(it.value)" :color="barColor" mode="smooth" :width="barWidth"
          :height="barHeight" :radius="4" />
      </div>

    </li>
  </ul>
</template>

<script setup lang="ts">
import SegmentedBar from '../SegmentedBar.vue';

interface Item { name: string; value: number }
// variant: 默认带浅蓝底条；plain: 去底色、更紧凑（用于“州市金额 TOP4”样式）
type Variant = 'default' | 'plain'
interface Props {
  items: Item[];
  maxRows?: number;
  barColor?: string;
  showNo?: boolean;
  variant?: Variant;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  maxRows: 5,
  barColor: '#2a6ff0',
  showNo: false,
  variant: 'default'
});

const rows = computed(() => props.items.slice(0, props.maxRows));
const maxV = computed(() => Math.max(1, ...rows.value.map(r => r.value || 0)));
function percent(v: number) { return Math.max(0, Math.min(1, v / maxV.value)); }
function money(v: number) { return (Number(v) / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 2 }) }

import { computed } from 'vue';

// 根据 variant 选择不同的条宽和高度（右侧面板更窄）
const barWidth = computed(() => (props.variant === 'plain' ? 180 : 220));
const barHeight = computed(() => (props.variant === 'plain' ? 6 : 8));
const variantClass = computed(() => (props.variant === 'plain' ? 'rank-list--plain' : ''));
</script>

<style scoped lang="scss">
.rank-list {
  list-style: none;
  margin: 0;
  padding: 2px 4px 2px 0;
  display: grid;
  row-gap: 10px;
  }
  
  .row {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 6px;
    background: rgba(50, 135, 254, 0.05);
  }
  
  .row__top {
    display: flex;
    justify-content: space-between;
  
  }
  
  .row:nth-child(even) {
    background: rgba(50, 135, 254, 0.12);
  }
  
  .no {
    color: #2a6ff0;
    font-weight: 900;
    font-size: 12px;
    margin-right: 6px;
  }
  
  .name {
    color: #123a8b;
    font-weight: 800;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .bar {
    justify-self: start;
  }
  
  .val {
    color: #1b59c8;
    font-weight: 900;
  }
  
  /* 紧凑、无底色版本（右上“州市金额 TOP4”） */
  .rank-list--plain {
    row-gap: 8px;
    padding-right: 0;
  }
  
  .rank-list--plain .row {
    padding: 4px 0;
    background: transparent;
    border-radius: 0;
  }
  
  .rank-list--plain .row:nth-child(even) {
    background: transparent;
  }
  
  .rank-list--plain .no {
    display: inline-block;
    min-width: 44px;
    text-align: center;
    padding: 2px 6px;
    border-radius: 10px;
    border: 1px solid #6DA1FB;
    background: linear-gradient(180deg, rgba(219, 235, 255, 0.9) 0%, rgba(197, 226, 255, 0.9) 100%);
    color: #2a6ff0;
    font-weight: 900;
    font-size: 12px;
  }

.rank-list--plain .name {
  color: #333;
  font-weight: 600;
}

.rank-list--plain .val {
  color: #333;
  font-weight: 600;
}
</style>

