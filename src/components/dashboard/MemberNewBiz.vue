<template>
  <div class="member-new-biz">
    <!-- 左：环形图（自适应） -->
    <div class="chart-wrap">
      <EChart :option="option" />
      <!-- 中心数字/标签：跟随饼图 center 百分比定位，避免偏移 -->
      <div class="center" :style="centerStyle">
        <div class="num">{{ active.value }}</div>
        <div class="name">{{ active.name }}</div>
      </div>
    </div>

    <!-- 右：图例 + 分页箭头 -->
    <div class="legend-wrap">
      <ul class="legend" role="list">
        <li
          v-for="(it, idx) in visibleItems"
          :key="it.name + idx"
          class="legend-item"
          :class="{ active: (pageStart + idx) === activeIndex }"
          @mouseenter="setActive(pageStart + idx)"
        >
          <span class="dot" :style="{ backgroundColor: it.color }" aria-hidden="true"></span>
          <span class="label">{{ it.name }}</span>
          <span class="count">({{ formatNumber(it.value) }})</span>
        </li>
      </ul>
      <!-- 右下：上下箭头（分页控制） -->
      <div class="legend-arrows">
        <i
          class="tri tri--up"
          :class="{ disabled: pageIndex === 0 }"
          role="button"
          aria-label="上一页"
          :aria-disabled="pageIndex === 0"
          @click="pageUp"
        ></i>
        <i
          class="tri tri--down"
          :class="{ disabled: pageIndex >= totalPages - 1 }"
          role="button"
          aria-label="下一页"
          :aria-disabled="pageIndex >= totalPages - 1"
          @click="pageDown"
        ></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import EChart from '../EChart.vue';

interface BizItem {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  items?: BizItem[];
  startIndex?: number; // 初始高亮/中心项
  pageSize?: number; // 图例分页大小
}

const props = withDefaults(defineProps<Props>(), {
  // 默认数据仅用于开发占位，可按接口替换
  items: () => [
    { name: '快递员', value: 92, color: '#C9D2FF' },
    { name: '物流货运司机', value: 125, color: '#506EFF' },
    { name: '外卖配送员', value: 78, color: '#5EE0D2' },
    { name: '网约车司机', value: 136, color: '#6F85FF' },
    { name: '物业保安', value: 86, color: '#8D63FF' },
    { name: '其他', value: 42, color: '#D8D6D2' },
    // 追加若干条用于分页联调
    { name: '保洁员', value: 68, color: '#B7C4FF' },
    { name: '代驾', value: 54, color: '#77C8FF' },
    { name: '商超理货员', value: 61, color: '#6FD9C9' },
    { name: '直播电商', value: 70, color: '#9A8CFF' },
    { name: '货拉拉司机', value: 80, color: '#5AA0FF' },
    { name: '维修技工', value: 66, color: '#9CC8FF' }
  ],
  startIndex: 1,
  pageSize: 6
});

const activeIndex = ref(props.startIndex);
const items = reactive(props.items);

function setActive(idx: number) {
  activeIndex.value = idx;
}

const active = computed(() => items[activeIndex.value] ?? items[0]);

// 图例分页
const pageSize = computed(() => props.pageSize);
const pageIndex = ref(Math.floor(activeIndex.value / pageSize.value));
const totalPages = computed(() => Math.max(1, Math.ceil(items.length / pageSize.value)));
const pageStart = computed(() => pageIndex.value * pageSize.value);
const visibleItems = computed(() => items.slice(pageStart.value, pageStart.value + pageSize.value));

function pageUp() {
  if (pageIndex.value > 0) pageIndex.value -= 1;
}
function pageDown() {
  if (pageIndex.value < totalPages.value - 1) pageIndex.value += 1;
}

function formatNumber(n: number): string {
  return n.toLocaleString('zh-CN');
}

// 图表配置：左侧厚边环形，扇区之间留白
const seriesCenter = ref<[string, string]>(['38%', '52%']);
const centerStyle = computed(() => ({ left: seriesCenter.value[0], top: seriesCenter.value[1] }));

const option = computed(() => {
  const gapColor = 'rgba(242,247,255,0.95)'; // 与整体背景接近，用作扇区间隙
  return {
    animation: true,
    tooltip: { trigger: 'item', formatter: '{b}<br/>{c}' },
    series: [
      {
        type: 'pie',
        center: seriesCenter.value,
        radius: ['48%', '72%'],
        startAngle: 90,
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        clockwise: true,
        itemStyle: {
          borderWidth: 6,
          borderColor: gapColor,
        },
        data: items.map((it) => ({
          name: it.name,
          value: it.value,
          itemStyle: { color: it.color }
        }))
      }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.member-new-biz {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 1.05fr 1fr; // 左图略宽
  align-items: center;
  column-gap: 8px;
}

.chart-wrap {
  position: relative;
  height: 100%;
}

.center {
  position: absolute;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  gap: 4px;
  pointer-events: none;
  text-align: center;
}

.center .num {
  font-size: 42px;
  font-weight: 800;
  color: #3e74ff;
}

.center .name {
  font-size: 16px;
  color: #2a6ff0;
  font-weight: 700;
}

.legend-wrap {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto; /* 列表占满，箭头置底 */
}

.legend {
  list-style: none;
  padding: 0 6px 0 0;
  margin: 0;
  display: grid;
  row-gap: 12px;
}

.legend-item {
  display: grid;
  grid-template-columns: 20px auto 1fr;
  align-items: center;
  column-gap: 8px;
  color: rgba(19, 115, 255, 0.9);
  font-weight: 700;
}

.legend-item .label { font-size: 16px; }
.legend-item .count { font-size: 14px; opacity: 0.9; margin-left: 6px; justify-self: end; }

.legend-item.active .label { color: #2a6ff0; text-shadow: 0 0 10px rgba(88,151,255,0.2); }

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6) inset;
}

.legend-arrows {
  justify-self: start;
  display: inline-grid;
  grid-auto-flow: column;
  column-gap: 14px; /* 两个箭头水平排列 */
  padding: 6px 0 2px;
}

.tri {
  width: 0; height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  opacity: 0.9;
  cursor: pointer;
  filter: drop-shadow(0 2px 3px rgba(90,160,255,0.25));
}

.tri--up { border-bottom: 10px solid rgba(130, 170, 255, 0.95); }
.tri--down { border-top: 10px solid rgba(130, 170, 255, 0.95); }

.tri.disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}
</style>
