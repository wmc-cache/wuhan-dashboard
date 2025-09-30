<template>
  <div class="rank-type2">
    <div class="header">
      <i class="title-img" aria-hidden="true" />
      <i class="more-img" role="button" aria-label="查看更多" @click="$emit('more')" />
    </div>

    <ul class="list">
      <li v-for="(it, i) in rows" :key="it.name + i" class="row">
        <i class="medal" :class="'medal--' + (i + 1)" aria-hidden="true" />
        <span class="name" :title="it.name">{{ it.name }}</span>
        <SegmentedBar class="bar" mode="smooth" :percent="percent(it.value)" :color="barColor" :width="barWidth" :height="10" :radius="5" />
        <span class="val">{{ money(it.value) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SegmentedBar from '../SegmentedBar.vue';

interface Item { name: string; value: number }
interface Props {
  items: Item[];
  maxRows?: number;
  barColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  maxRows: 5,
  barColor: '#F59E0B'
});

const rows = computed(() => props.items.slice(0, props.maxRows));
const maxV = computed(() => Math.max(1, ...rows.value.map(r => r.value || 0)));
const barWidth = 260; // 视觉上与示例接近
function percent(v: number) { return Math.max(0, Math.min(1, v / maxV.value)); }
function money(v: number) { return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元'; }
</script>

<style scoped lang="scss">
.rank-type2 { height: 100%; display: grid; grid-template-rows: auto 1fr; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.title-img,
.more-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-img {
  width: 155px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/refund/title4/编组 21.png') 1x, url('../../images/refund/title4/编组 21@2x.png') 2x);
  background-image: image-set(url('../../images/refund/title4/编组 21.png') 1x, url('../../images/refund/title4/编组 21@2x.png') 2x);
}

.more-img {
  width: 59px;
  height: 13px;
  cursor: pointer;
  background-image: -webkit-image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x);
}

.list { list-style: none; margin: 0; padding: 2px 6px 2px 2px; display: grid; row-gap: 14px; }
.row { position: relative; display: grid; grid-template-columns: 34px 1fr auto auto; align-items: center; column-gap: 16px; min-height: 48px; }

/* 名次圆形徽章（1~5） */
.medal { width: 28px; height: 28px; background-repeat: no-repeat; background-size: 100% 100%; }
.medal--1 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x); }
.medal--2 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x); }
.medal--3 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x); }
.medal--4 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x); }
.medal--5 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x); }

.name { color: #0f3a86; font-weight: 900; font-size: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar { justify-self: start; }
.val { color: #1b59c8; font-weight: 900; font-size: 20px; }
</style>

