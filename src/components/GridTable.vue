<template>
  <div class="grid-table">
    <!-- 顶部标题 + 查看更多 -->
    <div v-if="showHeader" class="table-header">
      <span class="title-img" :style="titleStyle" aria-hidden="true"></span>
      <i class="more-img" :style="moreStyle" role="button" aria-label="查看更多" @click="emit('more')"></i>
    </div>
    <!-- 表头 -->
    <div class="thead" :style="rowGridStyle" role="row">
      <div v-for="col in columns" :key="col.key" class="th" :style="{ textAlign: col.align || 'center' }"
        role="columnheader">
        {{ col.title }}
      </div>
    </div>

    <!-- 数据行 -->
    <ul class="tbody" role="rowgroup">
      <li v-for="(row, rIdx) in rows" :key="rowKey ? (row as any)[rowKey] ?? rIdx : rIdx" class="tr"
        :style="rowGridStyle" role="row" :aria-rowindex="rIdx + 1">
        <div v-for="col in columns" :key="col.key" class="td" :class="col.clickable ? 'td--link' : 'td--text'"
          :style="{ textAlign: col.align || 'center' }" role="cell"
          @click="col.clickable ? emitCell(row, col, rIdx) : void 0">
          <span class="cell" :class="{ clickable: !!col.clickable }">
            {{ formatCell((row as any)[col.key], col) }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface ColumnDef {
  key: string; // 对应行字段
  title: string; // 表头
  align?: 'left' | 'center' | 'right';
  clickable?: boolean; // 是否可点击
  formatter?: (val: any, row: Record<string, any>) => string;
}

interface Props {
  columns: ColumnDef[];
  rows: Record<string, any>[];
  gridTemplate?: string; // CSS grid-template-columns
  rowKey?: string; // 行唯一 key 字段
  showHeader?: boolean;
  // 标题尺寸（使用“新增公会”切图）
  titleWidth?: string;
  titleHeight?: string;
  // 查看更多尺寸
  moreWidth?: string;
  moreHeight?: string;
}

const props = withDefaults(defineProps<Props>(), {
  gridTemplate: '1.2fr 1fr 1fr 1.2fr'
});

const emit = defineEmits<{
  (e: 'cell-click', payload: { row: Record<string, any>; column: ColumnDef; rowIndex: number }): void;
  (e: 'more'): void;
}>();

const rowGridStyle = computed(() => ({ gridTemplateColumns: props.gridTemplate }));

// Header defaults（使用项目内切图）
const showHeader = computed(() => props.showHeader !== false);
const titleStyle = computed(() => ({
  width: props.titleWidth || '110px',
  height: props.titleHeight || '35px'
}));

const moreStyle = computed(() => ({
  width: props.moreWidth || '40px',
  height: props.moreHeight || '15px'
}));

function emitCell(row: Record<string, any>, column: ColumnDef, rowIndex: number) {
  emit('cell-click', { row, column, rowIndex });
}

function formatCell(val: any, col: ColumnDef): string {
  if (col.formatter) return col.formatter(val, {} as any);
  return String(val ?? '');
}
</script>

<style scoped lang="scss">
.grid-table {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr;
}

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

.title-img {
  width: 110px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x);
  background-image: image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x);
}

.more-img {
  width: 66px;
  height: 24px;
  background-image: -webkit-image-set(url('../images/show-all/查看更多.png') 1x, url('../images/show-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../images/show-all/查看更多.png') 1x, url('../images/show-all/查看更多@2x.png') 2x);
  cursor: pointer;
}

.thead,
.tr {
  display: grid;
  align-items: center;
  column-gap: 12px;
  padding: 8px 16px;
}

.thead {
  background: rgba(50, 135, 254, 0.18);
  color: #2a6ff0;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-radius: 4px;
}

.tbody {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tr {
  min-height: 38px;
  font-weight: 600;
}

.tr:nth-child(odd) {
  background: rgba(50, 135, 254, 0.05);
}

.tr:nth-child(even) {
  background: rgba(50, 135, 254, 0.12);
}

.th {
  font-size: 18px;
  text-align: center;
}

.td {
  font-size: 16px;
  text-align: center;
}

/* 点击与非点击颜色规范 */
.td--link .cell {
  color: rgba(48, 121, 254, 1);
  cursor: pointer;
}

.td--text .cell {
  color: rgba(51, 51, 51, 1);
}

.cell.clickable:hover {
  text-decoration: underline;
}
</style>

