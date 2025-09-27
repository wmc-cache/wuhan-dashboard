<template>
  <div class="org-new">
    <GridTable
      :columns="columns"
      :rows="items"
      :grid-template="gridTemplate"
      :show-header="true"
      row-key="id"
      @cell-click="onCellClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import GridTable, { type ColumnDef } from '../GridTable.vue';

interface OrgItem {
  id: string | number;
  name: string;        // 工会名称
  members: number;     // 工会人数
  district: string;    // 行政区域
  foundedAt: string;   // 成立时间
}

interface Props { items?: OrgItem[]; pageSize?: number }

const props = withDefaults(defineProps<Props>(), {
  pageSize: 7,
  items: () => [
    { id: 1, name: '名称1', members: 245, district: '武昌区', foundedAt: '2025-08-06' },
    { id: 2, name: '名称2', members: 234, district: '武昌区', foundedAt: '2024-08-01' },
    { id: 3, name: '名称3', members: 345, district: '江岸区', foundedAt: '2021-01-01' },
    { id: 4, name: '名称4', members: 345, district: '江汉区', foundedAt: '2025-08-06' },
    { id: 5, name: '名称5', members: 256, district: '硚口区', foundedAt: '2024-08-01' },
    { id: 6, name: '名称6', members: 235, district: '江夏区', foundedAt: '2021-01-01' },
    { id: 7, name: '名称7', members: 123, district: '东湖风景区', foundedAt: '2020-10-10' },
  ]
});

const emit = defineEmits<{
  (e: 'more'): void;
  (e: 'cell-click', payload: { row: OrgItem; column: ColumnDef; rowIndex: number }): void;
}>();

// 滚动由 GridTable 控制，不再切分

const gridTemplate = '1.3fr 1fr 1fr 1.1fr';
const columns: ColumnDef[] = [
  { key: 'name', title: '工会名称', align: 'left', clickable: true },
  { key: 'members', title: '工会人数', align: 'center' },
  { key: 'district', title: '行政区域', align: 'center' },
  { key: 'foundedAt', title: '成立时间', align: 'right' },
];

function onCellClick(payload: { row: OrgItem; column: ColumnDef; rowIndex: number }) { emit('cell-click', payload); }
function onMore() { emit('more'); }
</script>

<style scoped lang="scss">
.org-new { position: relative; height: 100%; display: grid; grid-template-rows: auto 1fr; }

.table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.title-img, .more-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }

/* 左侧标题：新增工会 */
.title-img {
  width: 110px; height: 35px;
  background-image: -webkit-image-set(url('../../images/home-title/新增公会/编组 18.png') 1x, url('../../images/home-title/新增公会/编组 18@2x.png') 2x);
  background-image: image-set(url('../../images/home-title/新增公会/编组 18.png') 1x, url('../../images/home-title/新增公会/编组 18@2x.png') 2x);
}

/* 右侧查看更多按钮 */
.more-img {
  width: 66px; height: 24px; cursor: pointer;
  background-image: -webkit-image-set(url('../../images/show-all/查看更多.png') 1x, url('../../images/show-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../../images/show-all/查看更多.png') 1x, url('../../images/show-all/查看更多@2x.png') 2x);
}
</style>
