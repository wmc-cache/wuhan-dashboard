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
        <div class="bar-wrap">
          <SegmentedBar class="bar" :percent="percent(it.value)" :color="getBarColor(i)" mode="smooth" :width="barWidth"
            :height="barHeight" :radius="4" :showDot="variant === 'plain'" />
        </div>

      </div>

    </li>
  </ul>
</template>

<script setup lang="ts">
import SegmentedBar from '../SegmentedBar.vue';
interface Item { name: string; value: number }
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
// 数据单位按接口为“万元”，这里不再除以 10000；直接显示“万元”
function money(v: number) {
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元';
}

// 根据行索引返回条形图颜色
function getBarColor(index: number) {
  if (props.variant === 'plain') {
    return index % 2 === 0 ? '#1098F8' : '#FE870B'; // 奇数行蓝色，偶数行橙色
  }
  return props.barColor;
}

import { computed } from 'vue';

// 根据 variant 选择不同的条宽和高度（右侧面板更窄）
const barWidth = computed(() => (props.variant === 'plain' ? 180 : 220));
const barHeight = computed(() => (props.variant === 'plain' ? 6 : 8));
const variantClass = computed(() => (props.variant === 'plain' ? 'rank-list--plain' : ''));
</script>

<style scoped lang="scss">
.bar-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  background: #DFF2FF;
  border: 1px solid #D0E7F8;
}
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
    justify-content: center;
    padding: 8px;
    border-radius: 6px;
  }
  
  .row__top {
    display: flex;
    justify-content: space-between;

  }

  .no {
    font-size: 16px;
    color: #1098F8;
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
  
  
  .rank-list--plain {
    row-gap: 0px;
    padding-right: 0;
  }
  
  .rank-list--plain .row {
    padding: 4px 0;
    border-radius: 0;
  }
  
.rank-list--plain .no {
  display: inline-block;
  min-width: 44px;
  text-align: center;
  padding: 2px 6px;
  font-weight: 900;
  font-size: 16px;
  
    border-radius: 2px;
  }
  
  .rank-list--plain .row:nth-child(odd) .no {
    color: #1098F8;
  
  }
  
  .rank-list--plain .row:nth-child(even) .no {
    color: #FE870B;
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
