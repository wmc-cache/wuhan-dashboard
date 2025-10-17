<template>
  <div
    class="subsidy-stats"
    :style="rootVars"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <TransitionGroup name="scroll" tag="ul" class="list" role="list">
      <li v-for="row in visibleRows" :key="row.__key" class="row">
        <span class="no" :class="noClass(row.__index)">{{ row.__index + 1 }}</span>
        <span class="name" :title="row.name">{{ row.name }}</span>
        <span class="people">{{ people(row.people) }}</span>
        <span class="amount">{{ money(row.amount) }}</span>
        <i class="underline" aria-hidden="true" />
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
// 按参考图：左侧序号（1/2/3/4）、中间“人数”、右侧“金额（万元）”，底部蓝色粗横线
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface Item { name: string; people: number; amount: number }
interface Props { items?: Item[]; maxRows?: number; rowHeight?: number; widthPercent?: number; center?: boolean }

const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { name: '低收入补助',   people: 32134, amount: 6189873.092 },
    { name: '特殊困难补助', people: 32134, amount: 6189873.092 },
    { name: '去世慰问',     people: 32134, amount: 6189873.092 },
    { name: '医疗互助',     people: 32134, amount: 6189873.092 },
  ]),
  maxRows: 4,
  rowHeight: 44,
  widthPercent: 100,
  center: false,
});

const itemsList = computed(() => props.items ?? []);
const maxVisible = computed(() => Math.max(1, props.maxRows));
const needsScroll = computed(() => itemsList.value.length > maxVisible.value);
const scrollIndex = ref(0);
const hovering = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const visibleRows = computed(() => {
  const list = itemsList.value;
  if (!list.length) return [];
  const size = Math.min(maxVisible.value, list.length);
  const rows = [];
  for (let i = 0; i < size; i++) {
    const idx = needsScroll.value ? (scrollIndex.value + i) % list.length : i;
    const item = list[idx] || { name: '', people: 0, amount: 0 };
    rows.push({ ...item, __index: idx, __key: `${idx}-${item.name}` });
  }
  return rows;
});

const rootVars = computed(() => {
  const st: Record<string, string> = { ['--row-h']: (props.rowHeight || 44) + 'px' } as any;
  if (props.widthPercent && props.widthPercent > 0) st.width = props.widthPercent + '%';
  if (props.center) st.margin = '0 auto';
  return st as any;
});

function people(v: number) {
  return Number(v).toLocaleString('zh-CN') + '人';
}
function money(v: number) {
  // 与退款列表一致：保留 3 位小数，无千分位分隔
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元';
}

function noClass(i: number) {
  // 1/3 蓝色，2/4 橙色
  return i % 2 === 0 ? 'no--blue' : 'no--orange';
}

function advance() {
  if (!needsScroll.value) return;
  scrollIndex.value = (scrollIndex.value + 1) % itemsList.value.length;
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

function resetAndStart() {
  scrollIndex.value = 0;
  start();
}

onMounted(() => {
  start();
});

onBeforeUnmount(() => {
  stop();
});

watch([needsScroll, itemsList], () => {
  resetAndStart();
});
</script>

<style scoped lang="scss">
.subsidy-stats {
   height: 100%;
   display: grid;
   grid-template-rows: 1fr; }

.list { list-style: none; margin: 0; padding: 4px 6px 10px 2px; display: grid; row-gap: 0px; 
 
}

/* 行：更高的行高和更大的字号，贴近参考图 */
.row {
  position: relative;
  display: grid;
  grid-template-columns: 28px 1.6fr 1fr 1.2fr; /* 序号/名称/人数/金额 */
  align-items: center;
  column-gap: 0px;
  min-height: var(--row-h, 44px);
  height: var(--row-h, auto);
  padding: 8px 8px 8px 8px; /* 底部空间留给横线 */
}

.no {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 1px;
}
.no--blue { color: #2a6ff0; }
.no--orange { color: #f59e0b; }

.name { font-weight: 500; font-size: 16px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.people { font-weight: 500; font-size: 16px; color: #333; text-align: center; }
.amount { font-weight: 800; font-size: 16px; color: #333; text-align: right; }

/* 蓝色粗横线（与退款 RankType1 相同切图） */
.underline { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); background-image: image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); pointer-events: none; }

.scroll-enter-active,
.scroll-leave-active {
  transition: all 0.4s ease;
}
.scroll-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.scroll-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
.scroll-leave-active {
  position: absolute;
}
</style>
