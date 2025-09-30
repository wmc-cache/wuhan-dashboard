<template>
  <GridTable :columns="cols" :rows="rows" :grid-template="'64px 1.6fr 1.1fr'" :visible-rows="6" :row-height="44"
    :show-header="true" empty-text="暂无数据" title-width="180px" title-height="35px" :title-img1x="title1x"
    :title-img2x="title2x" />
</template>

<script setup lang="ts">
import GridTable, { type ColumnDef } from '../GridTable.vue';

// 标题切图（企业产业金额排名）
import title1x from '../../images/refund/title1/编组 21.png';
import title2x from '../../images/refund/title1/编组 21@2x.png';

interface Row { lv?: string | number; name: string; fee: number }

const cols: ColumnDef[] = [
  { key: 'lv', title: '', iconLv: true },
  { key: 'name', title: '工会名称', align: 'left' },
  { key: 'fee', title: '手续费', align: 'right', formatter: (v) => (Number(v) / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 3 }) + '万元' }
];

const rows: Row[] = [
  { lv: 1, name: '武汉钢铁集团', fee: 6189873.092 },
  { lv: 2, name: '第一冶金建设公司工会', fee: 6189873.092 },
  { lv: 3, name: '长江文化有限公司', fee: 6189873.092 },
  { lv: '3+', name: '第一冶金工业工会', fee: 6189873.092 },
  { lv: '', name: '江夏汽车制造有限公司工会', fee: 6189873.092 },
  { lv: '', name: '经济开发工会', fee: 6189873.092 }
];


</script>

<style scoped></style>
