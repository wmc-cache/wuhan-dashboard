<template>
  <div class="org-new">
    <GridTable :columns="columns" :rows="items" :grid-template="gridTemplate" row-key="name" @cell-click="onCellClick"
      @more="onMore" show-header />
  </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import GridTable, { ColumnDef } from '../../components/GridTable.vue';

interface OrgNewItem {
  name: string;
  count: number;
  district: string;
  createdAt: string; // YYYY-MM-DD
}

interface Props {
  items?: OrgNewItem[];
  pageSize?: number; // 默认显示条数
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 6,
  items: () => [
    { name: '名称1', count: 245, district: '武昌区', createdAt: '2025-08-06' },
    { name: '名称2', count: 234, district: '武昌区', createdAt: '2024-08-01' },
    { name: '名称3', count: 345, district: '江岸区', createdAt: '2021-01-01' },
    { name: '名称4', count: 345, district: '江汉区', createdAt: '2025-08-06' },
    { name: '名称5', count: 256, district: '硚口区', createdAt: '2024-08-01' },
    { name: '名称6', count: 235, district: '江夏区', createdAt: '2021-01-01' },
  ]
});

const emit = defineEmits<{
  (e: 'more'): void;
  (e: 'cell-click', payload: { row: OrgNewItem; column: ColumnDef; rowIndex: number }): void;
}>();

// 滚动由 GridTable 控制

const gridTemplate = '1.2fr 1fr 1fr 1.2fr';
const columns: ColumnDef[] = [
  { key: 'name', title: '工会名称', clickable: true },
  { key: 'count', title: '工会人数' },
  { key: 'district', title: '行政区划' },
  { key: 'createdAt', title: '成立时间' },
];

function onCellClick(payload: { row: OrgNewItem; column: ColumnDef; rowIndex: number }) {
  emit('cell-click', payload);
}

function onMore() {
  emit('more');
}
</script>

<style scoped lang="scss">
.org-new { position: relative; height: 100%; }
</style>
