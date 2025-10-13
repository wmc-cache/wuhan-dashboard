<template>
  <div class="subsidy-stats" :style="rootVars">
    <ul class="list" role="list">
      <li v-for="(it, i) in rows" :key="it.name + i" class="row">
        <span class="no" :class="noClass(i)">{{ i + 1 }}</span>
        <span class="name" :title="it.name">{{ it.name }}</span>
        <span class="people">{{ people(it.people) }}</span>
        <span class="amount">{{ money(it.amount) }}</span>
        <i class="underline" aria-hidden="true" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// 按参考图：左侧序号（1/2/3/4）、中间“人数”、右侧“金额（万元）”，底部蓝色粗横线
import { computed } from 'vue';

interface Item { name: string; people: number; amount: number }
interface Props { items?: Item[]; maxRows?: number; rowHeight?: number; widthPercent?: number; center?: boolean }

const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { name: '低收入补助',   people: 32134, amount: 6189873.092 },
    { name: '特殊困难补助', people: 32134, amount: 6189873.092 },
    { name: '去世慰问',     people: 32134, amount: 6189873.092 },
    { name: '医疗互助',     people: 32134, amount: 6189873.092 },
  ]),
  maxRows: 4,
  rowHeight: 44,
  widthPercent: 100,
  center: false,
});

const rows = computed(() => props.items.slice(0, props.maxRows));
const rootVars = computed(() => {
  const st: Record<string, string> = { ['--row-h']: (props.rowHeight || 44) + 'px' } as any;
  if (props.widthPercent && props.widthPercent > 0) st.width = props.widthPercent + '%';
  if (props.center) st.margin = '0 auto';
  return st as any;
});

function people(v: number) {
  return Number(v).toLocaleString('zh-CN') + '人';
}
function money(v: number) {
  // 与退款列表一致：保留 3 位小数，无千分位分隔
  return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元';
}

function noClass(i: number) {
  // 1/3 蓝色，2/4 橙色
  return i % 2 === 0 ? 'no--blue' : 'no--orange';
}
</script>

<style scoped lang="scss">
.subsidy-stats {
   height: 100%;
   display: grid;
   grid-template-rows: 1fr; }

.list { list-style: none; margin: 0; padding: 4px 6px 10px 2px; display: grid; row-gap: 0px; 
 
}

/* 行：更高的行高和更大的字号，贴近参考图 */
.row {
  position: relative;
  display: grid;
  grid-template-columns: 28px 1.6fr 1fr 1.2fr; /* 序号/名称/人数/金额 */
  align-items: center;
  column-gap: 0px;
  min-height: var(--row-h, 44px);
  height: var(--row-h, auto);
  padding: 8px 8px 8px 8px; /* 底部空间留给横线 */
}

.no {
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 1px;
}
.no--blue { color: #2a6ff0; }
.no--orange { color: #f59e0b; }

.name { font-weight: 500; font-size: 16px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.people { font-weight: 500; font-size: 16px; color: #333; text-align: center; }
.amount { font-weight: 800; font-size: 16px; color: #333; text-align: right; }

/* 蓝色粗横线（与退款 RankType1 相同切图） */
.underline { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); background-image: image-set(url('../../images/refund/line/编组 14.png') 1x, url('../../images/refund/line/编组 14@2x.png') 2x); pointer-events: none; }
</style>
