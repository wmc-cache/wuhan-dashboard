<template>
  <div class="member-new">
    <GridTable
      :columns="columns"
      :rows="items"
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

interface MemberNewItem {
  id: string | number;
  name: string;      // 会员姓名
  union: string;     // 所属工会
  joinedAt: string;  // 入会时间 YYYY-MM-DD
}

interface Props {
  items?: MemberNewItem[];
  pageSize?: number; // 若需要限制可视行数，可传 visible-rows 给 GridTable；此处默认占满容器高度
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
  (e: 'cell-click', payload: { row: MemberNewItem; column: ColumnDef; rowIndex: number }): void;
}>();

const gridTemplate = '1.4fr 1.2fr 1.2fr';
const columns: ColumnDef[] = [
  { key: 'name', title: '会员姓名', align: 'left', clickable: true },
  { key: 'union', title: '所属工会', align: 'center' },
  { key: 'joinedAt', title: '入会时间', align: 'right' },
];

function onCellClick(payload: { row: MemberNewItem; column: ColumnDef; rowIndex: number }) {
  emit('cell-click', payload);
}

function onMore() {
  emit('more');
}
</script>

<style scoped lang="scss">
.member-new { position: relative; height: 100%; }
</style>
