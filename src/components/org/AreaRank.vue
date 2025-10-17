<template>
  <div
    class="org-area-rank"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <TransitionGroup name="scroll" tag="ul" class="list">
      <li v-for="row in visibleRows" :key="row.__key" class="row">
        <span class="medal" :class="medalClass(row.__index)" aria-hidden="true">
          <template v-if="!hasMedalImage(row.__index)">{{ row.__index + 1 }}</template>
        </span>
        <span class="name" :title="row.name">{{ row.name }}</span>
        <SegmentedBar class="bar" mode="smooth" :percent="percent(row.value)" :color="barColor" :width="barWidth"
          :height="10" :radius="5" />
        <span class="val">{{ format(row.value) }}</span>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
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

const itemsList = computed(() => props.items ?? []);
const maxVisible = computed(() => Math.max(1, props.maxRows));
const needsScroll = computed(() => itemsList.value.length > maxVisible.value);
const scrollIndex = ref(0);
const hovering = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const visibleRows = computed(() => {
  const list = itemsList.value;
  if (!list.length) return [];
  const size = Math.min(maxVisible.value, list.length);
  const rows: (Item & { __index: number; __key: string })[] = [];
  for (let i = 0; i < size; i++) {
    const idx = needsScroll.value ? (scrollIndex.value + i) % list.length : i;
    const item = list[idx] || { name: '', value: 0 };
    rows.push({ ...item, __index: idx, __key: `${idx}-${item.name}` });
  }
  return rows;
});

const maxV = computed(() => Math.max(1, ...itemsList.value.map(r => r.value || 0)));
const barWidth = 100; // 列宽更长一些，靠近参考图
function percent(v: number) { return Math.max(0, Math.min(1, v / maxV.value)); }
function format(v: number) { return `${Number(v).toLocaleString('zh-CN')}${props.unit}`; }

function hasMedalImage(index: number) { return index >= 0 && index < 5; }
function medalClass(i: number) { return hasMedalImage(i) ? `medal--img-${i + 1}` : 'medal--num'; }

function advance() {
  if (!needsScroll.value) return;
  scrollIndex.value = (scrollIndex.value + 1) % itemsList.value.length;
}

function stop() {
  if (timer) { clearInterval(timer); timer = null; }
}

function start() {
  stop();
  if (!needsScroll.value) return;
  timer = setInterval(() => {
    if (!hovering.value) advance();
  }, 3000);
}

function onHover(state: boolean) { hovering.value = state; }
function resetAndStart() { scrollIndex.value = 0; start(); }

onMounted(() => { start(); });
onBeforeUnmount(() => { stop(); });

watch([needsScroll, itemsList], () => { resetAndStart(); });
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
.medal {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 50%;
}
.medal--img-1 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x); color: transparent; }
.medal--img-2 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x); color: transparent; }
.medal--img-3 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x); color: transparent; }
.medal--img-4 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x); color: transparent; }
.medal--img-5 { background-image: -webkit-image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x); background-image: image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x); color: transparent; }
.medal--num {
  background: rgba(106, 161, 251, 0.2);
  border: 1px solid #6DA1FB;
  color: #2a6ff0;
  font-weight: 800;
  font-size: 14px;
}

.name { font-weight: 800; font-size: 16px; color: #2a6ff0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar { justify-self: start; }
.val { font-weight: 800; font-size: 16px; color: #2a6ff0; text-align: right; }

.scroll-enter-active,
.scroll-leave-active { transition: all 0.35s ease; }
.scroll-enter-from { opacity: 0; transform: translateY(18px); }
.scroll-leave-to { opacity: 0; transform: translateY(-18px); }
.scroll-leave-active { position: absolute; }
</style>
