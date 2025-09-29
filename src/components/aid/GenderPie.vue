<template>
  <section class="mod">
    <h3 class="mod__title">{{ title }}</h3>
    <div class="mod__body mod__body--full">
      <div class="two-cols">
        <RingPie :data="data" :center="['38%', '50%']" :radius="['48%', '72%']">
          <template #center>
            <div class="pie-center">
              <div class="num">{{ pretty(total) }}</div>
              <div class="txt">总人数</div>
            </div>
          </template>
        </RingPie>
        <div class="legend-block">
          <ul class="legend">
            <li v-for="item in data" :key="item.name">
              <span class="dot" :style="{ backgroundColor: item.color }"></span>
              <span class="label">{{ item.name }}</span>
              <span class="count">{{ pretty(item.value) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import RingPie from '../RingPie.vue';

interface Item { name: string; value: number; color?: string }
interface Props {
  title?: string;
  data?: Item[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '救助人员性别分布',
  data: () => ([
    { name: '男性', value: 47885, color: '#2a6ff0' },
    { name: '女性', value: 234546, color: '#ff6b97' }
  ])
});

const data = props.data;
const total = computed(() => data.reduce((s, i) => s + i.value, 0));
function pretty(n: number) { return n.toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
.mod__body--full { display: grid; }
.two-cols { display: grid; grid-template-columns: 1.1fr 1fr; align-items: center; }
.pie-center { text-align: center; }
.pie-center .num { font-weight: 900; font-size: 20px; color: #2a6ff0; }
.pie-center .txt { color: rgba(0,0,0,.55); margin-top: 4px; font-weight: 700; }
.legend-block { display: grid; align-content: center; }
.legend { list-style: none; margin: 0; padding: 0; display: grid; row-gap: 12px; }
.legend li { display: grid; grid-template-columns: 16px 1fr auto; column-gap: 8px; align-items: center; color: #2a6ff0; font-weight: 800; }
.legend .dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 0 3px rgba(255,255,255,.6) inset; }
.legend .label { color: #2a6ff0; }
.legend .count { color: #2a6ff0; opacity: .9; }
</style>

