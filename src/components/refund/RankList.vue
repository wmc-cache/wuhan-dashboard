<template>
  <ul class="rank-list">
    <li v-for="(it, i) in rows" :key="it.name + i" class="row">
      <span class="no" v-if="showNo">NO.{{ i + 1 }}</span>
      <span class="name" :title="it.name">{{ it.name }}</span>
      <SegmentedBar class="bar" :percent="percent(it.value)" :color="barColor" mode="smooth" :width="220" :height="8" :radius="4" />
      <span class="val">{{ money(it.value) }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import SegmentedBar from '../SegmentedBar.vue';

interface Item { name: string; value: number }
interface Props { items: Item[]; maxRows?: number; barColor?: string; showNo?: boolean }

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  maxRows: 5,
  barColor: '#2a6ff0',
  showNo: false
});

const rows = computed(() => props.items.slice(0, props.maxRows));
const maxV = computed(() => Math.max(1, ...rows.value.map(r => r.value || 0)));
function percent(v: number) { return Math.max(0, Math.min(1, v / maxV.value)); }
function money(v: number) { return (Number(v) / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 2 }) + '万元'; }

import { computed } from 'vue';
</script>

<style scoped lang="scss">
.rank-list { list-style: none; margin: 0; padding: 2px 4px 2px 0; display: grid; row-gap: 10px; }
.row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  column-gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(50, 135, 254, 0.05);
}
.row:nth-child(even) { background: rgba(50, 135, 254, 0.12); }

.no { color: #2a6ff0; font-weight: 900; font-size: 12px; }
.name { color: #123a8b; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar { justify-self: start; }
.val { color: #1b59c8; font-weight: 900; }
</style>

