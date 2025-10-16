<template>
  <div class="rank-type1">
    <div class="header">
      <i class="title-img" aria-hidden="true" />
      <i class="more-img" role="button" aria-label="查看更多" @click="$emit('more')" />
    </div>

    <ul class="list">
      <li v-for="(it, i) in rows" :key="it.name + i" class="row" @click="emit('row-click', { item: it, index: i })">
        <i class="medal" :class="'medal--' + (i + 1)" aria-hidden="true" />
        <span class="name" :title="it.name">{{ it.name }}</span>
        <span class="val">{{ money(it.value) }}</span>
        <i class="underline" aria-hidden="true" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const emit = defineEmits<{ (e:'row-click', payload:{ item: {name:string; value:number}; index:number }): void }>();

interface Item { name: string; value: number }
interface Props { items: Item[]; maxRows?: number }
const props = withDefaults(defineProps<Props>(), { items: () => [], maxRows: 4 });

const rows = computed(() => props.items.slice(0, props.maxRows));
function money(v: number) {
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元';
}
</script>

<style scoped lang="scss">
.rank-type1 { height: 100%; display: grid; grid-template-rows: auto 1fr; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.title-img, .more-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
.title-img { width: 180px; height: 35px; background-image: -webkit-image-set(url('../../images/refund/title3/编组 21.png') 1x, url('../../images/refund/title3/编组 21@2x.png') 2x); background-image: image-set(url('../../images/refund/title3/编组 21.png') 1x, url('../../images/refund/title3/编组 21@2x.png') 2x); }
.more-img { width: 59px; height: 13px; cursor: pointer; background-image: -webkit-image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x); background-image: image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x); }

.list {
  list-style: none;
  margin: 0;
  padding: 2px 6px 10px 2px; /* 底部更紧凑 */
  display: grid;
  row-gap: 14px;
}
.row { position: relative; display: grid; grid-template-columns: 44px 1fr auto; align-items: center; column-gap: 16px; min-height: 52px; padding-bottom: 10px; cursor: pointer; }

.medal { width: 32px; height: 38px; background-repeat: no-repeat; background-size: 100% 100%; }
.medal--1 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/1/位图.png') 1x, url('../../images/refund/rank-type1/1/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/1/位图.png') 1x, url('../../images/refund/rank-type1/1/位图@2x.png') 2x); }
.medal--2 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/2/位图.png') 1x, url('../../images/refund/rank-type1/2/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/2/位图.png') 1x, url('../../images/refund/rank-type1/2/位图@2x.png') 2x); }
.medal--3 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/3/位图.png') 1x, url('../../images/refund/rank-type1/3/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/3/位图.png') 1x, url('../../images/refund/rank-type1/3/位图@2x.png') 2x); }
.medal--4 { background-image: -webkit-image-set(url('../../images/refund/rank-type1/4/编组 13.png') 1x, url('../../images/refund/rank-type1/4/编组 13@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type1/4/编组 13.png') 1x, url('../../images/refund/rank-type1/4/编组 13@2x.png') 2x); }

.name { font-weight: 400;
    font-size: 16px;
      color: #333333;
      white-space: nowrap;
        overflow: hidden;
    text-overflow: ellipsis; }
.val {
    font-weight: 600;
    font-size: 16px;
    color: #333333;
}

/* 蓝色粗横线（行底部装饰） */
.underline { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); background-image: image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); pointer-events: none; }
</style>
