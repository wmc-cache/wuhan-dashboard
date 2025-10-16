<template>
  <div class="org-area-rank">
    <ul class="list">
      <li v-for="(it, i) in rows" :key="it.name + i" class="row">
        <i class="medal" :class="medalClass(i)" aria-hidden="true" />
        <span class="name" :title="it.name">{{ it.name }}</span>
        <SegmentedBar class="bar" mode="smooth" :percent="percent(it.value)" :color="barColor" :width="barWidth"
          :height="10" :radius="5" />
        <span class="val">{{ format(it.value) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SegmentedBar from '../SegmentedBar.vue';

interface Item { name: string; value: number }
interface Props {
  items?: Item[];
  maxRows?: number;
  barColor?: string;
  unit?: string; // 右侧数值单位，默认“个”
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { name: '武昌区', value: 61898 },
    { name: '东湖新技术开发区', value: 61897 },
    { name: '汉阳区', value: 3092 },
    { name: '洪山区', value: 792 },
    { name: '江汉区', value: 6189 },
    { name: '江夏区', value: 5230 }
  ],
  // 默认只展示前 5 条，和设计稿保持一致
  maxRows: 5,
  barColor: '#4E8FFF',
  unit: '个'
});

const rows = computed(() => props.items.slice(0, props.maxRows));
const maxV = computed(() => Math.max(1, ...rows.value.map(r => r.value || 0)));
const barWidth = 100; // 列宽更长一些，靠近参考图
function percent(v: number) { return Math.max(0, Math.min(1, v / maxV.value)); }
function format(v: number) { return `${Number(v).toLocaleString('zh-CN')}${props.unit}`; }

function medalClass(i: number) { return i < 5 ? `medal--${i + 1}` : 'medal--5'; }
</script>

<style scoped lang="scss">
.org-area-rank { height: 100%; display: grid; grid-template-rows: 1fr; }

.list { list-style: none; margin: 0; padding: 2px 6px 2px 2px; display: grid; row-gap: 10px; }

.row {
  position: relative;
  display: grid;
  grid-template-columns: 34px 1.2fr auto 1fr auto;
  align-items: center;
  column-gap: 12px;
  min-height: 18px;
  background: rgba(174, 203, 255, 0.23);
  border: 1px solid #6DA1FB;
  padding: 5px 10px;
}

/* 徽章：复用退款模块的切图 */
.medal { width: 28px; height: 28px; background-repeat: no-repeat; background-size: 100% 100%; }
.medal--1 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x); }
.medal--2 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x); }
.medal--3 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x); }
.medal--4 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x); }
.medal--5 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x); }

.name { font-weight: 800; font-size: 16px; color: #2a6ff0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar { justify-self: start; }
.val { font-weight: 800; font-size: 16px; color: #2a6ff0; text-align: right; }
</style>
