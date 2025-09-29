<template>

  <div class="two-cols">
    <!-- 包一层用于做像素级偏移；不改变图表 center 百分比，避免联动影响 -->
    <div class="chart-shift">
      <HonorRingsChart :items="items" :center="chartCenter" :gap-deg="8" :base-start="20" :sweep-angle="260"
        :center-icon="centerIcon" :center-icon2x="centerIcon2x" :center-icon-size="100" :center-text="''" />
    </div>
    <div class="legend-block legend-shift">
      <ul class="legend">
        <li v-for="item in items" :key="item.name">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <span class="label">{{ item.name }}</span>

        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import HonorRingsChart from '../HonorRingsChart.vue';
import centerIconUrl from '../../images/aid/icon5/位图.png';
import centerIconUrl2x from '../../images/aid/icon5/位图@2x.png';

interface Item { name: string; value: number; color?: string }
interface Props {
  title?: string;
  data?: Item[];
  chartCenter?: [string, string]; // 允许外部微调环图中心位置
  embedded?: boolean; // 嵌入其他面板内使用：不渲染外层容器与标题
}

const props = withDefaults(defineProps<Props>(), {
  title: '救助人员性别分布',
  data: () => ([
    { name: '男性', value: 47885, color: '#2a6ff0' },
    { name: '女性', value: 234546, color: '#ff6b97' }
  ]),
  chartCenter: () => ['46%', '55%'],
  embedded: false
});

const data = props.data;
const total = computed(() => data.reduce((s, i) => s + i.value, 0));
function pretty(n: number) { return n.toLocaleString('zh-CN'); }

// HonorRingsChart 期望的 items（确保都有颜色）
const defaultColors = ['#2a6ff0', '#ff6b97', '#4DD0E1'];
const items = computed(() => data.map((d, i) => ({
  name: d.name,
  value: d.value,
  color: d.color || defaultColors[i % defaultColors.length]
})));

// 中心图标（1x/2x）
const centerIcon = centerIconUrl as string;
const centerIcon2x = centerIconUrl2x as string;
</script>

<style scoped lang="scss">
.mod {
  border: none;
  border-radius: 10px;
  background: rgba(235, 241, 247, .74);
  box-shadow: inset 0 0 40px rgba(120, 170, 255, .08);
  padding: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod__title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2a6ff0;
}

.mod__body {
  overflow: auto;
}

.mod__body--full {
  display: grid;
}

.two-cols {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
}

/* 需求：饼图整体右移 100px（仅此处，不影响其它使用场景）
   包裹层需要占满可用高度，否则子组件百分比高度会塌陷导致图表变小。 */
.chart-shift {
  width: 100%;
  height: 100%;
  transform: translateX(100px);
}

.legend-block {
  display: grid;
  /* 让图例靠上（与外部设计一致） */
  align-content: start;
  align-self: start;
}

/* 需求：图例整体右移 50px */
.legend-shift {
  margin-left: 50px;
}

.legend {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  row-gap: 12px;
}

.legend li {
  display: grid;
  grid-template-columns: 16px 1fr auto;
  column-gap: 8px;
  align-items: center;
  color: #2a6ff0;
  font-weight: 800;
}

.legend .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .6) inset;
}

.legend .label {
  color: #2a6ff0;
}

.legend .count {
  color: #2a6ff0;
  opacity: .9;
}
</style>
