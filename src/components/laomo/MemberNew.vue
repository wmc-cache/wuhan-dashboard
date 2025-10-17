<template>
  <div class="member-new" @mouseenter="onHover(true)" @mouseleave="onHover(false)">
    <GridTable
      :columns="columns"
      :rows="gridRows"
      :grid-template="gridTemplate"
      more-page-name="laomo-list"
      :show-header="true"
      :title-img1x="titleImg1x"
      :title-img2x="titleImg2x"
      title-width="111px"
      title-height="35px"
      row-key="__key"
      :visible-rows="visibleRows"
      :row-height="42"
      @cell-click="onCellClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import GridTable, { type ColumnDef } from '../GridTable.vue';
// 表格左上标题：使用 laomo/font-title/6 作为小标题切图（111x35）
import titleImg1x from '../../images/laomo/font-title/6/编组 21.png';
import titleImg2x from '../../images/laomo/font-title/6/编组 21@2x.png';

interface Item {
  id: string | number;
  name: string;     // 会员姓名
  union: string;    // 所属工会
  joinedAt: string; // 入会时间 YYYY-MM-DD
}

interface Props {
  items?: Item[];
  pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 6,
  items: () => [
    { id: 1, name: '王小额', union: '名称1', joinedAt: '2025-08-06' },
    { id: 2, name: '黎晓',   union: '名称2', joinedAt: '2024-08-01' },
    { id: 3, name: '王牧场', union: '名称3', joinedAt: '2021-01-01' },
    { id: 4, name: '刘凯',   union: '名称4', joinedAt: '2025-08-06' },
    { id: 5, name: '李星',   union: '名称5', joinedAt: '2024-08-01' },
    { id: 6, name: '王木色', union: '名称6', joinedAt: '2021-01-01' },
  ]
});

const emit = defineEmits<{
  (e: 'more'): void;
  (e: 'cell-click', payload: { row: Item; column: ColumnDef; rowIndex: number }): void;
}>();

const itemsList = computed(() => props.items ?? []);
const visibleRows = computed(() => Math.max(1, props.pageSize));
const needsScroll = computed(() => itemsList.value.length > visibleRows.value);
const scrollIndex = ref(0);
const hovering = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

type DisplayRow = Item & { __key: string; __origIndex: number };
const displayRows = computed<DisplayRow[]>(() => {
  const list = itemsList.value;
  if (!list.length) return [];
  const size = Math.min(visibleRows.value, list.length);
  const rows: DisplayRow[] = [];
  for (let i = 0; i < size; i++) {
    const idx = needsScroll.value ? (scrollIndex.value + i) % list.length : i;
    const item = list[idx];
    rows.push({ ...item, __origIndex: idx, __key: `${idx}-${item.id ?? i}` });
  }
  return rows;
});

const gridRows = computed(() => displayRows.value);

const gridTemplate = '1.4fr 1.2fr 1.2fr';
const columns: ColumnDef[] = [
  { key: 'name', title: '会员姓名', align: 'left', clickable: true },
  { key: 'union', title: '所属工会', align: 'center' },
  { key: 'joinedAt', title: '入会时间', align: 'right' },
];

function onCellClick(payload: { row: Item; column: ColumnDef; rowIndex: number }) {
  const row = (payload.row as DisplayRow);
  const orig = itemsList.value[row.__origIndex] || row;
  emit('cell-click', { ...payload, row: orig });
}

function onMore() {
  emit('more');
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
}, { deep: true });

</script>

<style scoped lang="scss">
.member-new { position: relative; height: 100%; display: grid; grid-template-rows: auto 1fr; }

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title-img,
.more-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

/* 新增会员标题切图 */
.title-img {
  width: 110px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/home-title/新增会员/编组 25.png') 1x, url('../../images/home-title/新增会员/编组 25@2x.png') 2x);
  background-image: image-set(url('../../images/home-title/新增会员/编组 25.png') 1x, url('../../images/home-title/新增会员/编组 25@2x.png') 2x);
}

.more-img {
  width: 66px;
  height: 24px;
  cursor: pointer;
  background-image: -webkit-image-set(url('../../images/show-all/查看更多.png') 1x, url('../../images/show-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../../images/show-all/查看更多.png') 1x, url('../../images/show-all/查看更多@2x.png') 2x);
}

.scroll-enter-active,
.scroll-leave-active {
  transition: all 0.35s ease;
}
.scroll-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.scroll-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}
.scroll-leave-active {
  position: absolute;
}
</style>
