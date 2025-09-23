<template>
  <div class="org-new">
    <!-- 列表表头 -->
    <div class="thead" role="row">
      <div class="th th--name" role="columnheader">工会名称</div>
      <div class="th th--num" role="columnheader">工会人数</div>
      <div class="th th--area" role="columnheader">行政区划</div>
      <div class="th th--date" role="columnheader">成立时间</div>
    </div>
    <!-- 列表主体 -->
    <ul class="tbody" role="rowgroup">
      <li v-for="(row, idx) in visible" :key="row.name + idx" class="tr" role="row" :aria-rowindex="idx + 1">
        <div class="td td--name" role="cell">{{ row.name }}</div>
        <div class="td td--num" role="cell">{{ row.count }}</div>
        <div class="td td--area" role="cell">{{ row.district }}</div>
        <div class="td td--date" role="cell">{{ row.createdAt }}</div>
      </li>
    </ul>
  </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';

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

defineEmits<{ (e: 'more'): void }>();

const visible = computed(() => props.items.slice(0, props.pageSize));
</script>

<style scoped lang="scss">
.org-new {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

/* 表格：使用 grid 实现响应的列宽 */
.thead,
.tr {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.2fr;
  /* 名称略宽，时间略宽 */
  align-items: center;
    /* 垂直居中 */
      justify-items: center;
      /* 水平居中 */
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
      color: rgba(15, 70, 150, 0.95);
      font-weight: 600;
    }
    
    /* 斑马纹背景 */
    .tr:nth-child(odd) {
      background: rgba(50, 135, 254, 0.05);
    }
    
    .tr:nth-child(even) {
      background: rgba(50, 135, 254, 0.12);
    }
    
    /* 单元格水平居中 */
    .th,
    .td {
      text-align: center;
    }
    
    /* 文字尺寸微调 */
    .th {
      font-size: 18px;
    }
    
    .td {
      font-size: 16px;
    }
</style>
