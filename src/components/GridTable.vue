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
    <ul class="tbody" role="rowgroup" :style="tbodyStyle">
      <li
        v-for="(row, rIdx) in displayRows"
        :key="isPlaceholderRow(row) ? '__ph_' + rIdx : (rowKey ? (row as any)[rowKey] ?? rIdx : rIdx)"
        class="tr"
        :class="{ 'tr--ph': isPlaceholderRow(row) }"
        :style="rowGridStyle"
        role="row"
        :aria-rowindex="rIdx + 1"
      >
        <div
          v-for="col in columns"
          :key="col.key"
          class="td"
          :class="col.clickable && !isPlaceholderRow(row) ? 'td--link' : 'td--text'"
          :style="{ textAlign: col.align || 'center' }"
          role="cell"
          @click="col.clickable && !isPlaceholderRow(row) ? emitCell(row, col, rIdx) : void 0"
        >
          <span class="cell" :class="{ clickable: !!col.clickable }">
            <template v-if="!isPlaceholderRow(row)">
              {{ formatCell((row as any)[col.key], col) }}
            </template>
            <template v-else>
              
            </template>
          </span>
        </div>
      </li>
      <div v-if="isEmpty" class="empty">{{ props.emptyText }}</div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
// 默认标题切图：新增公会
import titleOrg1x from '../images/home-title/新增公会/编组 18.png';
import titleOrg2x from '../images/home-title/新增公会/编组 18@2x.png';

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
  // 可视行数与行高：超过后在表体内滚动（滚动区域高度=可见行数×行高，避免出现半截行）
  visibleRows?: number; // 默认 6 行
  rowHeight?: number;   // 单行高度，默认 38px
  // 标题尺寸（使用“新增公会”切图）
  titleWidth?: string;
  titleHeight?: string;
  // 标题图片自定义（1x/2x）
  titleImg1x?: string;
  titleImg2x?: string;
  // 查看更多尺寸
  moreWidth?: string;
  moreHeight?: string;
  // 空数据占位
  emptyText?: string;   // 空数据时显示的文字
  fillPlaceholder?: boolean; // 是否以空行填充至 visibleRows 行
}

const props = withDefaults(defineProps<Props>(), {
  gridTemplate: '1.2fr 1fr 1fr 1.2fr',
  visibleRows: 6,
  rowHeight: 36,
  emptyText: '暂无数据',
  fillPlaceholder: true,
  titleImg1x: titleOrg1x,
  titleImg2x: titleOrg2x
});

const emit = defineEmits<{
  (e: 'cell-click', payload: { row: Record<string, any>; column: ColumnDef; rowIndex: number }): void;
  (e: 'more'): void;
}>();

const rowGridStyle = computed(() => ({ gridTemplateColumns: props.gridTemplate }));

// Header defaults（使用项目内切图）
const showHeader = computed(() => props.showHeader !== false);
// 为了兼容性，这里返回 style 字符串，包含多次 background-image 声明：
// 1) url(1x) 作为兜底；2) -webkit-image-set；3) image-set
const titleStyle = computed(() => {
  const width = props.titleWidth || '110px';
  const height = props.titleHeight || '35px';
  const img1x = props.titleImg1x || titleOrg1x;
  const img2x = props.titleImg2x || titleOrg2x;
  const styleStr = [
    `width:${width}`,
    `height:${height}`,
    `background-image:url('${img1x}')`,
    `background-image:-webkit-image-set(url('${img1x}') 1x, url('${img2x}') 2x)`,
    `background-image:image-set(url('${img1x}') 1x, url('${img2x}') 2x)`
  ].join(';');
  return styleStr;
});

const moreStyle = computed(() => ({
  width: props.moreWidth || '40px',
  height: props.moreHeight || '15px'
}));

// 计算表体固定高度：可见行数 × 行高；
// 超出部分滚动；不足部分用空行填充（可配置）。
const tbodyStyle = computed(() => {
  const total = Array.isArray(props.rows) ? props.rows.length : 0;
  const vis = Math.max(1, props.visibleRows || 6);
  const needScroll = total > vis;
  return {
    height: `${vis * props.rowHeight}px`,
    overflowY: needScroll ? 'auto' : 'hidden'
  } as Record<string, string>;
});

const isEmpty = computed(() => (props.rows?.length ?? 0) === 0);

const displayRows = computed(() => {
  const rows = Array.isArray(props.rows) ? props.rows : [];
  if (!props.fillPlaceholder) return rows;
  const vis = Math.max(1, props.visibleRows || 6);
  const fillerCount = Math.max(0, vis - rows.length);
  if (fillerCount === 0) return rows;
  const fillers = Array.from({ length: fillerCount }, (_, i) => ({ __placeholder__: true, __ph__: i }));
  return rows.concat(fillers);
});

function isPlaceholderRow(row: Record<string, any>): boolean {
  return !!(row && (row as any).__placeholder__);
}

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

.thead, .tr { display: grid; align-items: center; column-gap: 12px; }
.thead { padding: 8px 16px; }
.tr { padding: 0 16px; box-sizing: border-box; height: v-bind('rowHeight + "px"'); }

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
  position: relative;
  /* 让外部可通过内联样式控制滚动区域高度 */
}

.tr { font-weight: 600; }

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

/* 占位行：仅用于撑开高度，采用更淡的背景 */
.tr--ph { opacity: 0.5; }
.tr--ph .td { color: transparent; }

.empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: rgba(42,111,240,0.65);
  font-weight: 800;
  letter-spacing: 1px;
  pointer-events: none;
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
