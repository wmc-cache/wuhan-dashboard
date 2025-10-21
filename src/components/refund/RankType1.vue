<template>
  <div class="rank-type1" @mouseenter="onHover(true)" @mouseleave="onHover(false)">
    <div class="header">
      <i class="title-img" aria-hidden="true" />
      <i class="more-img" role="button" aria-label="查看更多" @click="$emit('more')" />
    </div>

    <ul class="list">
      <li
        v-for="(it, i) in displayRows"
        :key="it.__key"
        class="row"
        @click="emit('row-click', { item: it, index: it.__index })"
      >
        <span class="medal" :class="medalClass(it.__index)" aria-hidden="true">
          <span v-if="showMedalNumber(it.__index)" class="medal__text">NO.{{ it.__index + 1 }}</span>
        </span>
        <span class="name" :title="it.name">{{ it.name }}</span>
        <span class="val">{{ money(it.value) }}</span>
        <i class="underline" aria-hidden="true" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
const emit = defineEmits<{ (e:'row-click', payload:{ item: {name:string; value:number}; index:number }): void }>();

interface Item { name: string; value: number }
interface Props { items: Item[]; maxRows?: number }
const props = withDefaults(defineProps<Props>(), { items: () => [], maxRows: 4 });

const list = computed<Item[]>(() => props.items ?? []);
const maxRows = computed(() => Math.max(1, props.maxRows ?? 4));
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
  const rows: Array<Item & { __key: string; __index: number }> = [];
  for (let i = 0; i < size; i++) {
    const idx = needsScroll.value ? (scrollIndex.value + i) % data.length : i;
    const item = data[idx] || { name: '', value: 0 };
    const key = [`idx-${idx}`, item.name ?? '', item.value ?? ''].filter(Boolean).join('|');
    rows.push({ ...item, __index: idx, __key: key || `idx-${idx}` });
  }
  return rows;
});

function money(v: number) {
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元';
}

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

const medalMap: Record<number, string> = {
  0: 'medal--1',
  1: 'medal--2',
  2: 'medal--3',
  3: 'medal--4',
  4: 'medal--5',
  5: 'medal--6',
  6: 'medal--7',
  7: 'medal--8',
  8: 'medal--9',
  9: 'medal--10'
};

function medalClass(rank: number) {
  return medalMap[rank] || 'medal--num';
}

function showMedalNumber(rank: number) {
  return medalClass(rank) === 'medal--num';
}

onMounted(() => start());
onBeforeUnmount(() => stop());
watch([list, visibleCount], () => reset(), { deep: true });
</script>

<style scoped lang="scss">
.rank-type1 { height: 100%; display: grid; grid-template-rows: auto 1fr; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.title-img, .more-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
.title-img { width: 180px; height: 35px; background-image: -webkit-image-set(url('../../images/refund/title3/编组 21.png') 1x, url('../../images/refund/title3/编组 21@2x.png') 2x); background-image: image-set(url('../../images/refund/title3/编组 21.png') 1x, url('../../images/refund/title3/编组 21@2x.png') 2x); }
.more-img { width: 59px; height: 13px; cursor: pointer; background-image: -webkit-image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x); background-image: image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x); }

.list {
  list-style: none;
  margin: 0;
  padding: 2px 6px 10px 2px; /* 底部更紧凑 */
  display: grid;
  row-gap: 14px;
  overflow: hidden;
}
.row { position: relative; display: grid; grid-template-columns: 44px 1fr auto; align-items: center; column-gap: 16px; min-height: 52px; padding-bottom: 10px; cursor: pointer; }

.medal {
  width: 32px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.medal--1 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/1/位图.png') 1x, url('../../images/refund/rank-type1/1/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/1/位图.png') 1x, url('../../images/refund/rank-type1/1/位图@2x.png') 2x); }
.medal--2 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/2/位图.png') 1x, url('../../images/refund/rank-type1/2/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/2/位图.png') 1x, url('../../images/refund/rank-type1/2/位图@2x.png') 2x); }
.medal--3 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/3/位图.png') 1x, url('../../images/refund/rank-type1/3/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/3/位图.png') 1x, url('../../images/refund/rank-type1/3/位图@2x.png') 2x); }
.medal--4 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/4/编组 13.png') 1x, url('../../images/refund/rank-type1/4/编组 13@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/4/编组 13.png') 1x, url('../../images/refund/rank-type1/4/编组 13@2x.png') 2x); }
.medal--5 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/5/编组 13备份.png') 1x, url('../../images/refund/rank-type1/5/编组 13备份@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/5/编组 13备份.png') 1x, url('../../images/refund/rank-type1/5/编组 13备份@2x.png') 2x); }
.medal--6 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/6/编组 13备份 2.png') 1x, url('../../images/refund/rank-type1/6/编组 13备份 2@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/6/编组 13备份 2.png') 1x, url('../../images/refund/rank-type1/6/编组 13备份 2@2x.png') 2x); }
.medal--7 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/7/编组 13备份 3.png') 1x, url('../../images/refund/rank-type1/7/编组 13备份 3@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/7/编组 13备份 3.png') 1x, url('../../images/refund/rank-type1/7/编组 13备份 3@2x.png') 2x); }
.medal--8 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/8/编组 13备份 4.png') 1x, url('../../images/refund/rank-type1/8/编组 13备份 4@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/8/编组 13备份 4.png') 1x, url('../../images/refund/rank-type1/8/编组 13备份 4@2x.png') 2x); }
.medal--9 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/9/编组 13备份 5.png') 1x, url('../../images/refund/rank-type1/9/编组 13备份 5@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/9/编组 13备份 5.png') 1x, url('../../images/refund/rank-type1/9/编组 13备份 5@2x.png') 2x); }
.medal--10 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/10/编组 13备份 6.png') 1x, url('../../images/refund/rank-type1/10/编组 13备份 6@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/10/编组 13备份 6.png') 1x, url('../../images/refund/rank-type1/10/编组 13备份 6@2x.png') 2x); }
.medal--num {
  background: rgba(106, 161, 251, 0.2);
  border: 1px solid #6da1fb;
  border-radius: 8px;
  color: #2a6ff0;
  font-weight: 800;
  font-size: 14px;
  padding: 0 8px;
  min-width: 32px;
  height: 38px;
  align-items: center;
}

.medal__text {
  transform: none;
}

.name { font-weight: 400;
    font-size: 16px;
      color: #333333;
      white-space: nowrap;
        overflow: hidden;
    text-overflow: ellipsis; }
.val {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
}

/* 蓝色粗横线（行底部装饰） */
.underline { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); background-image: image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); pointer-events: none; }
</style>
