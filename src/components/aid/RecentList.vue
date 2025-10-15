<template>
  <section class="mod">
    <h3 class="mod__title">
      <span class="title-img title-img--aid-title5" aria-hidden="true"></span>
    </h3>
    <div class="mod__body">
      <GridTable :columns="cols" :rows="rows" :grid-template="'1fr 1.2fr 1fr'" :visible-rows="8" :row-height="36"
        :show-header="false" empty-text="暂无记录" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import GridTable, { type ColumnDef } from '../GridTable.vue';

interface Row { name: string; type: string; date: string }
interface Props { title?: string; rows?: Row[] }

const props = withDefaults(defineProps<Props>(), {
  title: '近期困难救助人员',
  rows: () => ([
    { name: '王小丽', type: '冠状肿瘤救助', date: '2025-08-06' },
    { name: '李强', type: '意外救助', date: '2024-08-01' },
    { name: '王敏', type: '冠状肿瘤救助', date: '2024-01-01' },
    { name: '刘勇', type: '意外救助', date: '2025-08-06' },
    { name: '李军', type: '冠状肿瘤救助', date: '2025-08-06' },
    { name: '王杰', type: '冠状肿瘤救助', date: '2024-01-01' },
    { name: '李慧', type: '冠状肿瘤救助', date: '2024-08-01' },
    { name: '王安妮', type: '冠状肿瘤救助', date: '2021-01-01' }
  ])
});

const cols: ColumnDef[] = [
  { key: 'name', title: '会员姓名', align: 'left' },
  { key: 'type', title: '救助名称', align: 'left' },
  { key: 'date', title: '时间' }
];

const { rows } = toRefs(props);
</script>

<style scoped lang="scss">
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
/* 标题切图（1x/2x） */
.title-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-img--aid-title5 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/aid/title5/编组 21.png') 1x, url('../../images/aid/title5/编组 21@2x.png') 2x);
  background-image: image-set(url('../../images/aid/title5/编组 21.png') 1x, url('../../images/aid/title5/编组 21@2x.png') 2x);
}
</style>
