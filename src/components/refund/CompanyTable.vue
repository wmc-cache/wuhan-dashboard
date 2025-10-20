<template>
  <GridTable
    :columns="cols"
    :rows="rows"
    :grid-template="'64px 1.6fr 1.1fr'"
    :visible-rows="5"
    :row-height="40"
    :show-header="true"
    empty-text="暂无数据"
    title-width="180px"
    title-height="35px"
    :title-img1x="title1x"
    :title-img2x="title2x"
    :auto-scroll="true"
  />
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import GridTable, { type ColumnDef } from '../GridTable.vue';

// 标题切图（企业产业金额排名）
import title1x from '../../images/refund/title1/编组 21.png';
import title2x from '../../images/refund/title1/编组 21@2x.png';

export interface Row { lv?: string | number; name: string; fee: number }
interface Props { rows?: Row[]; valueTitle?: string; unitText?: string }

const props = withDefaults(defineProps<Props>(), {
  rows: () => ([
    { lv: 1, name: '武汉钢铁集团', fee: 6189873.092 },
    { lv: 2, name: '第一冶金建设公司工会', fee: 6189873.092 },
    { lv: 3, name: '长江文化有限公司', fee: 6189873.092 },
    { lv: '3+', name: '第一冶金工业工会', fee: 6189873.092 },
    { lv: '', name: '江夏汽车制造有限公司工会', fee: 6189873.092 }
  ]),
  valueTitle: '手续费',
  unitText: '万元'
});

const cols = computed<ColumnDef[]>(() => [
  { key: 'lv', title: '', iconLv: true },
  { key: 'name', title: '单位名称', align: 'left' },
  { key: 'fee', title: props.valueTitle, align: 'right', formatter: (v) => Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + props.unitText }
]);

const { rows } = toRefs(props);

</script>

<style scoped></style>
