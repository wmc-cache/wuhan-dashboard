<template>
  <ul class="rank-list" :class="variantClass" @mouseenter="onHover(true)" @mouseleave="onHover(false)">
    <li
      v-for="(it, i) in displayRows"
      :key="it.__key"
      class="row"
      @click="emit('row-click', { item: it, index: it.__index })"
    >
      <div class="row__top">
        <div>
          <span class="no" v-if="showNo">NO.{{ it.__index + 1 }}</span>
          <span class="name" :title="it.name">{{ it.name }}</span>
        </div>
        <div>
          <span class="val">{{ money(it.value) }}</span>
        </div>
      </div>
      <div>
        <div class="bar-wrap">
          <SegmentedBar
            class="bar"
            :percent="percent(it.value)"
            :color="getBarColor(i)"
            mode="smooth"
            :width="barWidth"
            :height="barHeight"
            :radius="4"
            :showDot="variant === 'plain'"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

const list = computed<Item[]>(() => props.items ?? []);
const maxRows = computed(() => Math.max(1, props.maxRows ?? 5));
const visibleCount = computed(() => {
  if (!list.value.length) return 0;
  return Math.min(maxRows.value, list.value.length);
});
const needsScroll = computed(() => list.value.length > 1);
const scrollIndex = ref(0);
const hovering = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const displayRows = computed(() => {
  const data = list.value;
  const size = visibleCount.value;
  if (!data.length || size === 0) return [];
  const out: Array<Item & { __key: string; __index: number }> = [];
  for (let i = 0; i < size; i++) {
    const idx = needsScroll.value ? (scrollIndex.value + i) % data.length : i;
    const item = data[idx] || { name: '', value: 0 };
    const key = [`idx-${idx}`, item.name ?? '', item.value ?? ''].filter(Boolean).join('|');
    out.push({ ...item, __index: idx, __key: key || `idx-${idx}` });
  }
  return out;
});

const maxV = computed(() => Math.max(1, ...list.value.map(r => r.value || 0)));
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

const emit = defineEmits<{ (e:'row-click', payload:{ item: Item; index:number }): void }>();

// 根据 variant 选择不同的条宽和高度（右侧面板更窄）
const barWidth = computed(() => (props.variant === 'plain' ? 180 : 220));
const barHeight = computed(() => (props.variant === 'plain' ? 6 : 8));
const variantClass = computed(() => (props.variant === 'plain' ? 'rank-list--plain' : ''));

function advance() {
  if (!needsScroll.value) return;
  scrollIndex.value = (scrollIndex.value + 1) % list.value.length;
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function start() {
  stop();
  if (!needsScroll.value) return;
  timer = setInterval(() => {
    if (!hovering.value) advance();
  }, 3000);
}

function onHover(state: boolean) {
  hovering.value = state;
}

function reset() {
  scrollIndex.value = 0;
  start();
}

onMounted(() => start());
onBeforeUnmount(() => stop());
watch([list, visibleCount], () => reset(), { deep: true });
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
  overflow: hidden;
}

.row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
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
