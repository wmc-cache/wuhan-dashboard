<template>
  <div class="member-new">
    <div class="table-header">
      <span class="title-img" aria-hidden="true"></span>
      <i class="more-img" role="button" aria-label="查看更多" @click="onMore"></i>
    </div>

    <GridTable
      :columns="columns"
      :rows="visible"
      :grid-template="gridTemplate"
      :show-header="false"
      row-key="id"
      @cell-click="onCellClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GridTable, { type ColumnDef } from '../GridTable.vue';

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

const visible = computed(() => props.items.slice(0, props.pageSize));

const gridTemplate = '1.4fr 1.2fr 1.2fr';
const columns: ColumnDef[] = [
  { key: 'name', title: '会员姓名', align: 'left', clickable: true },
  { key: 'union', title: '所属工会', align: 'center' },
  { key: 'joinedAt', title: '入会时间', align: 'right' },
];

function onCellClick(payload: { row: Item; column: ColumnDef; rowIndex: number }) {
  emit('cell-click', payload);
}

function onMore() {
  emit('more');
}
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
</style>

