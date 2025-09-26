<template>
  <div class="ring-pie-wrapper">
    <!-- 左：环形图 -->
    <div class="ring-pie">
      <EChart :option="option" :events="chartEvents" />
      <!-- 中心插槽：根据 center 百分比精准定位 -->
      <div v-if="$slots.center" class="center" :style="centerStyle">
        <slot name="center" />
      </div>
    </div>

    <!-- 右：图例和翻页控制（当启用翻页时显示） -->
    <div v-if="enablePagination" class="legend-wrap">
      <div class="legend-content" @mouseenter="pauseAuto()" @mouseleave="resumeAuto()">
        <!-- 图例插槽，允许父组件自定义图例样式 -->
        <slot
          name="legend"
          :items="visibleItems"
          :activeIndex="localActiveIndex"
          :pageStart="pageStart"
          :setActive="setActive"
          :formatNumber="formatNumber"
        >
          <!-- 默认图例实现 -->
          <ul class="legend" role="list">
            <li
              v-for="(item, idx) in visibleItems"
              :key="item.name + idx"
              class="legend-item"
              :class="{ active: (scrollStart + idx) === localActiveIndex }"
              @mouseenter="setActive(scrollStart + idx)"
            >
              <span class="dot" :style="{ backgroundColor: item.color }" aria-hidden="true"></span>
              <span class="label">{{ item.name }}</span>
              <span class="count">({{ formatNumber(item.value) }})</span>
            </li>
          </ul>
        </slot>
      </div>

      <!-- 翻页箭头 -->
      <div v-if="canPaginate" class="pagination-arrows">
        <slot
          name="arrows"
          :pageUp="pageUp"
          :pageDown="pageDown"
          :canPageUp="canPageUp"
          :canPageDown="canPageDown"
        >
          <!-- 默认箭头实现 -->
          <div class="legend-arrows">
            <i
              class="tri tri--up"
              :class="{ disabled: !canPageUp }"
              role="button"
              aria-label="上一页"
              :aria-disabled="!canPageUp"
              @click="pageUp"
            ></i>
            <i
              class="tri tri--down"
              :class="{ disabled: !canPageDown }"
              role="button"
              aria-label="下一页"
              :aria-disabled="!canPageDown"
              @click="pageDown"
            ></i>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import EChart from './EChart.vue';

interface DataItem { name: string; value: number; color?: string }

interface Props {
  data: DataItem[];
  center?: [string, string]; // ['x%','y%']
  radius?: [string, string]; // ['inner','outer']
  gapColor?: string; // 扇区间隙颜色
  borderWidth?: number; // 间隙宽
  emphasisScale?: number; // 悬停放大
  startAngle?: number;
  showLabel?: boolean;
  // 翻页功能相关
  enablePagination?: boolean; // 是否启用翻页功能
  pageSize?: number; // 每页显示的图例数量
  initialActiveIndex?: number; // 初始激活的数据项索引
  activeIndex?: number; // 外部控制的激活索引（支持 v-model）
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  center: () => ['50%', '50%'],
  radius: () => ['48%', '72%'],
  gapColor: 'rgba(242,247,255,0.95)',
  borderWidth: 6,
  // 触摸/悬停放大幅度：使用更接近 ECharts 默认的值，避免过于明显
  emphasisScale: 10,
  startAngle: 90,
  showLabel: false,
  enablePagination: false,
  pageSize: 6,
  initialActiveIndex: 0,
  activeIndex: undefined
});

const emit = defineEmits<{
  'update:activeIndex': [index: number];
  'page-change': [page: number];
  'active-change': [item: DataItem, index: number];
}>();

const centerStyle = computed(() => ({ left: props.center[0], top: props.center[1] }));

// 激活索引管理
const localActiveIndex = ref(props.activeIndex ?? props.initialActiveIndex);

// 监听外部 activeIndex 变化
watch(() => props.activeIndex, (newValue) => {
  if (newValue !== undefined && newValue !== localActiveIndex.value) {
    localActiveIndex.value = newValue;
  }
});

function setActive(index: number) {
  localActiveIndex.value = index;
  emit('update:activeIndex', index);
  const activeItem = props.data[index];
  if (activeItem) {
    emit('active-change', activeItem, index);
  }
  // 若激活项不在可视窗口内，自动滚动使其可见
  const end = scrollStart.value + props.pageSize - 1;
  if (index < scrollStart.value) {
    scrollStart.value = index;
  } else if (index > end) {
    scrollStart.value = index - props.pageSize + 1;
  }
  clampScroll();
}

// 滚动逻辑：窗口一次移动 1 条
const scrollStart = ref(0);
const canPaginate = computed(() => props.data.length > props.pageSize);
const canPageUp = computed(() => scrollStart.value > 0);
const canPageDown = computed(() => scrollStart.value < Math.max(0, props.data.length - props.pageSize));
const visibleItems = computed(() => props.data.slice(scrollStart.value, scrollStart.value + props.pageSize));

function clampScroll() {
  const maxStart = Math.max(0, props.data.length - props.pageSize);
  if (scrollStart.value > maxStart) scrollStart.value = maxStart;
  if (scrollStart.value < 0) scrollStart.value = 0;
}

function pageUp() {
  if (canPageUp.value) {
    scrollStart.value -= 1;
    emit('page-change', scrollStart.value);
  }
}

function pageDown() {
  if (canPageDown.value) {
    scrollStart.value += 1;
    emit('page-change', scrollStart.value);
  }
}

function formatNumber(n: number): string {
  return n.toLocaleString('zh-CN');
}

const option = computed(() => ({
  animation: true,
  tooltip: { trigger: 'item', formatter: '{b}<br/>{c}' },
  series: [
    {
      type: 'pie',
      center: props.center as any,
      radius: props.radius as any,
      startAngle: props.startAngle,
      avoidLabelOverlap: true,
      label: { show: props.showLabel },
      labelLine: { show: props.showLabel },
      clockwise: true,
      itemStyle: {
        borderWidth: props.borderWidth,
        borderColor: props.gapColor,
      },
      // 触摸/悬停的强调效果：恢复到较为克制的默认表现
      // - 不再自定义加粗边框与阴影
      // - 不强制指定 scaleSize，交给 ECharts 默认处理（整体更自然）
      emphasis: {
        scale: true
      },
      data: props.data.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
    }
  ]
}) as any);

// 交互：当触摸/鼠标悬停/点击扇区时，更新中心展示
function onSliceEvent(p: any) {
  if (!p) return;
  // 仅处理饼图扇区
  if (p.componentType === 'series' && p.seriesType === 'pie' && typeof p.dataIndex === 'number') {
    setActive(p.dataIndex);
  }
}

const chartEvents = {
  mouseover: onSliceEvent,
  click: onSliceEvent,
  highlight: onSliceEvent
} as Record<string, (p: any) => void>;

// 自动滚动（可配置）
import { onMounted, onBeforeUnmount } from 'vue';
const autoTimer = ref<number | null>(null);
const AUTO_INTERVAL = 2500; // ms

function startAuto() {
  stopAuto();
  if (!canPaginate.value) return;
  autoTimer.value = window.setInterval(() => {
    if (canPageDown.value) {
      scrollStart.value += 1;
    } else {
      // 到底后回到顶部，形成循环
      scrollStart.value = 0;
    }
  }, AUTO_INTERVAL);
}

function stopAuto() {
  if (autoTimer.value) {
    clearInterval(autoTimer.value);
    autoTimer.value = null;
  }
}

function pauseAuto() { stopAuto(); }
function resumeAuto() { startAuto(); }

watch(() => [props.data.length, props.pageSize], () => {
  clampScroll();
  startAuto();
});

onMounted(() => startAuto());
onBeforeUnmount(() => stopAuto());
</script>

<style scoped lang="scss">
.ring-pie-wrapper {
  position: relative;
  height: 100%;
  display: grid;
  /* 默认只有环图（无翻页/图例）时，使用单列布局，
     避免右侧出现一个空列从而造成环图视觉“偏左”，
     这会让父级下面的文字看起来没对齐居中 */
  grid-template-columns: 1fr; // 默认单列
  align-items: center;
  column-gap: 8px;

  /* 当存在翻页/图例容器时，再切换为两列布局 */
  &:has(.legend-wrap) {
    grid-template-columns: 1.05fr 1fr; // 左图略宽
  }
}

.ring-pie { position: relative; height: 100%; }

.center {
  position: absolute;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
}

// 翻页功能样式
.legend-wrap {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto; // 列表占满，箭头置底
}

/* 让图例在可用高度内垂直居中 */
.legend-content {
  overflow: hidden;
  display: grid;
  align-content: center;  /* 垂直居中图例列表 */
  justify-items: start;    /* 水平仍靠左对齐 */
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.legend-item .label {
  font-size: 16px;
}

.legend-item .count {
  font-size: 14px;
  opacity: 0.9;
  margin-left: 6px;
  justify-self: end;
}

.legend-item.active .label {
  color: #2a6ff0;
  text-shadow: 0 0 10px rgba(88,151,255,0.2);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.6) inset;
  transition: transform 0.2s ease;
}

.legend-item:hover .dot {
  transform: scale(1.1);
}

// 翻页箭头样式
.pagination-arrows {
  justify-self: start;
  padding: 6px 0 2px;
}

.legend-arrows {
  display: inline-grid;
  grid-auto-flow: column;
  column-gap: 14px;
}

.tri {
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  opacity: 0.9;
  cursor: pointer;
  filter: drop-shadow(0 2px 3px rgba(90,160,255,0.25));
  transition: all 0.2s ease;
}

.tri:hover:not(.disabled) {
  opacity: 1;
  filter: drop-shadow(0 2px 5px rgba(90,160,255,0.4));
}

.tri--up {
  border-bottom: 10px solid rgba(130, 170, 255, 0.95);
}

.tri--down {
  border-top: 10px solid rgba(130, 170, 255, 0.95);
}

.tri.disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}
</style>
