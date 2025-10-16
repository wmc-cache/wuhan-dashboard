<template>
  <div class="top4">
    <!-- 头部：标题切图 + 查看更多 -->
    <div class="header">
      <i class="title-img" aria-hidden="true"></i>
      <i class="more-img" role="button" aria-label="查看更多" @click="$emit('more')"></i>
    </div>

    <!-- 内容：四列卡片，底部对齐，不同高度体现排名差异 -->
    <div class="cards">
      <div v-for="(it, i) in items.slice(0, 4)" :key="it.name + i" class="cell" @click="emit('item-click', { name: it.name, amount: it.amount, index: i })">
        <div class="amount">{{ money(it.amount) }}</div>
        <div class="name" :title="it.name">{{ it.name }}</div>
        <div class="pill" :class="pillClass(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 还原“代收金额TOP4”视觉：使用提供的切图资源
import { computed } from 'vue';

// 头部标题与查看更多切图
const title1x = new URL('../../images/refund/title2/编组 21.png', import.meta.url).href;
const title2x = new URL('../../images/refund/title2/编组 21@2x.png', import.meta.url).href;
const see1x = new URL('../../images/refund/see-all/查看更多.png', import.meta.url).href;
const see2x = new URL('../../images/refund/see-all/查看更多@2x.png', import.meta.url).href;

// TOP1~4 卡片切图
const top1x = new URL('../../images/refund/top1/编组 12.png', import.meta.url).href;
const top12x = new URL('../../images/refund/top1/编组 12@2x.png', import.meta.url).href;
const top2x = new URL('../../images/refund/top2/编组 11.png', import.meta.url).href;
const top22x = new URL('../../images/refund/top2/编组 11@2x.png', import.meta.url).href;
const top3x = new URL('../../images/refund/top3/编组 9.png', import.meta.url).href;
const top32x = new URL('../../images/refund/top3/编组 9@2x.png', import.meta.url).href;
const top4x = new URL('../../images/refund/top4/编组 8.png', import.meta.url).href;
const top42x = new URL('../../images/refund/top4/编组 8@2x.png', import.meta.url).href;

interface Item { name: string; amount: number }
interface Props { items: Item[] }
defineProps<Props>();
const emit = defineEmits<{ (e:'more'):void; (e:'item-click', payload:{name:string; amount:number; index:number}):void }>();

function money(n: number) {
  // 与设计参考更贴近：去掉千位分隔，不做单位换算
  return Number(n).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元';
}

function pillClass(i: number) {
  return i === 0 ? 'pill--t1' : i === 1 ? 'pill--t2' : i === 2 ? 'pill--t3' : 'pill--t4';
}
</script>

<style scoped lang="scss">
.top4 { height: 100%; display: grid; grid-template-rows: auto 1fr; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }

.title-img, .more-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
.title-img { width: 170px; height: 35px; background-image: -webkit-image-set(url('../../images/refund/title2/编组 21.png') 1x, url('../../images/refund/title2/编组 21@2x.png') 2x); background-image: image-set(url('../../images/refund/title2/编组 21.png') 1x, url('../../images/refund/title2/编组 21@2x.png') 2x); }
.more-img {
  width: 59px;
  height: 13px;
  cursor: pointer;
  background-image: -webkit-image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x);
}

.cards {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: end;
}

.cell {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: end;
  row-gap: 12px;
  min-width: 0;
  cursor: pointer;
}

.amount {
  color: #6f7ea1;
  font-weight: 900;
  font-size: 14px;
  white-space: nowrap;
}

.name {
  color: #0f3a86;
  font-weight: 900;
  font-size: 16px;
  line-height: 1.05;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 四个卡片的视觉尺寸：更接近原图的宽高 */
.pill { background-repeat: no-repeat; background-size: 100% 100%; border-radius: 10px; }
.pill--t1 {
  width: 74px;
  height: 165px;
  background-image: -webkit-image-set(url('../../images/refund/top1/编组 12.png') 1x, url('../../images/refund/top1/编组 12@2x.png') 2x);
  background-image: image-set(url('../../images/refund/top1/编组 12.png') 1x, url('../../images/refund/top1/编组 12@2x.png') 2x);
}

.pill--t2 {
  width: 72px;
  height: 121px;
  background-image: -webkit-image-set(url('../../images/refund/top2/编组 11.png') 1x, url('../../images/refund/top2/编组 11@2x.png') 2x);
  background-image: image-set(url('../../images/refund/top2/编组 11.png') 1x, url('../../images/refund/top2/编组 11@2x.png') 2x);
}

.pill--t3 {
  width: 74px;
  height: 101px;
  background-image: -webkit-image-set(url('../../images/refund/top3/编组 9.png') 1x, url('../../images/refund/top3/编组 9@2x.png') 2x);
  background-image: image-set(url('../../images/refund/top3/编组 9.png') 1x, url('../../images/refund/top3/编组 9@2x.png') 2x);
}

.pill--t4 {
  width: 71px;
  height: 67px;
  background-image: -webkit-image-set(url('../../images/refund/top4/编组 8.png') 1x, url('../../images/refund/top4/编组 8@2x.png') 2x);
  background-image: image-set(url('../../images/refund/top4/编组 8.png') 1x, url('../../images/refund/top4/编组 8@2x.png') 2x);
}
</style>
