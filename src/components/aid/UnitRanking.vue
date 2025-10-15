<template>
  <section class="mod">
    <h3 class="mod__title"><span class="title-img title-img--aid-title2" aria-hidden="true"></span></h3>
    <div class="mod__body">
      <GridTable :columns="cols" :rows="rows" :grid-template="'64px 1.6fr .8fr 1.1fr 1fr'" :visible-rows="6"
        :row-height="38" :show-header="false" empty-text="暂无数据" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import GridTable, { type ColumnDef } from '../GridTable.vue';

interface Row { lv?: string | number; name: string; count: number; amount: number; union: string }
interface Props { title?: string; rows?: Row[] }

const props = withDefaults(defineProps<Props>(), {
  title: '年度工作单位排名',
  rows: () => ([
    { name: '武汉快运运营有限公司', count: 20, amount: 2220, union: '武汉快运' },
    { name: '宜昌船舶', count: 12, amount: 11342, union: '市直属机关工会' },
    { name: '江夏区第一人民医院', count: 12, amount: 11242, union: '江夏区工会' },
    { name: '武汉科技股份', count: 20, amount: 2430, union: '武汉钢铁' },
    { name: '武汉明良材料', count: 12, amount: 2430, union: '洪山区' },
    { name: '长江公司', count: 12, amount: 1542, union: '长江工会' }
  ])
});

const cols: ColumnDef[] = [
  { key: 'lv', title: '', iconLv: true },
  { key: 'name', title: '单位名称', align: 'left' },
  { key: 'count', title: '申请人次' },
  { key: 'amount', title: '申请金额(元)', formatter: (v) => Number(v).toLocaleString('zh-CN') },
  { key: 'union', title: '工会' }
];

// 响应式接入
const { rows } = toRefs(props);
</script>

<style scoped lang="scss">
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }

.mod__title {
  margin: 0 0 10px;
}

.mod__body {
  overflow: auto;
}

/* 标题切图（1x/2x） */
.title-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-img--aid-title2 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/aid/title2/编组 21.png') 1x, url('../../images/aid/title2/编组 21@2x.png') 2x);
  background-image: image-set(url('../../images/aid/title2/编组 21.png') 1x, url('../../images/aid/title2/编组 21@2x.png') 2x);
}
</style>
