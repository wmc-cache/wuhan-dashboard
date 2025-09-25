<template>
  <div class="year-bar-chart">
    <EChart :option="option" />

    <!-- 年份时间轴（置于底部） -->
    <div class="timeline">
      <!-- 使用 Element Plus 的方向图标替代纯 CSS 三角形 -->
      <button class="arrow" :disabled="selIndex === 0" @click="goPrev" aria-label="上一年">
        <ElIcon :size="28">
          <CaretLeft />
        </ElIcon>
      </button>
      <ul class="years" role="list" :style="{ ['--pos' as any]: progress }">
        <li v-for="(y, i) in years" :key="y" class="year"
          :class="{ active: i === selIndex, past: i < selIndex, future: i > selIndex }" @click="select(i)">
          <span class="dot" aria-hidden="true"></span>
          <span class="label">{{ y }}</span>
        </li>
      </ul>
      <button class="arrow" :disabled="selIndex >= years.length - 1" @click="goNext" aria-label="下一年">
        <ElIcon :size="28">
          <CaretRight />
        </ElIcon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import * as echarts from 'echarts';
import EChart from './EChart.vue';
// 按需引入 Element Plus 图标（只引入 ElIcon 包装器和所需的两个方向图标）
import { ElIcon } from 'element-plus';
import { CaretLeft, CaretRight } from '@element-plus/icons-vue';
// 仅加载图标组件所需样式（按需样式引入）
import 'element-plus/es/components/icon/style/css';

type Year = number | string;

interface YearData {
  total: number[];  // 工会总数（柱）
  added: number[];  // 新增工会数（线）
}

interface Props {
  years?: Year[];
  dataByYear?: Record<string, YearData>;
  initialYear?: Year;
  yMax?: number;
  barName?: string;
  lineName?: string;
  // 可配置颜色
  barGradientStart?: string; // 柱顶端颜色
  barGradientEnd?: string;   // 柱底端颜色（透明度可低些）
  lineColor?: string;        // 折线与圆点颜色
}

const props = withDefaults(defineProps<Props>(), {
  years: () => [2018, 2019, 2020, 2021, 2022, 2023, 2024],
  yMax: 500,
  barName: '工会总数',
  lineName: '新增工会数',
  // 默认保持之前配色（蓝柱+蓝线）
  barGradientStart: '#5AA0FF',
  barGradientEnd: 'rgba(5,135,254,0.35)',
  lineColor: '#6EA8FF',
  dataByYear: () => ({
    2018: { total: [180, 160, 250, 240, 100, 260, 110, 300, 380, 360, 290, 100], added: [210, 80, 160, 230, 95, 180, 120, 300, 420, 350, 180, 100] },
    2019: { total: [200, 150, 250, 260, 120, 260, 130, 330, 390, 360, 300, 110], added: [190, 120, 150, 220, 110, 170, 140, 280, 410, 340, 170, 110] },
    2020: { total: [170, 160, 240, 250, 120, 260, 130, 320, 370, 350, 280, 100], added: [200, 110, 160, 210, 100, 180, 120, 290, 400, 330, 160, 100] },
    2021: { total: [190, 150, 255, 245, 110, 255, 120, 310, 365, 345, 275, 95], added: [195, 115, 165, 205, 105, 175, 115, 285, 395, 325, 165, 95] },
    2022: { total: [185, 155, 245, 235, 115, 250, 125, 420, 370, 350, 285, 98], added: [205, 125, 170, 215, 108, 178, 118, 305, 430, 360, 175, 98] },
    2023: { total: [180, 150, 260, 250, 110, 260, 115, 320, 450, 380, 290, 100], added: [205, 130, 175, 220, 105, 185, 115, 305, 430, 360, 180, 100] },
    2024: { total: [175, 145, 255, 245, 108, 255, 112, 315, 360, 350, 200, 95], added: [210, 140, 185, 230, 110, 190, 120, 310, 420, 340, 160, 95] },
  })
});

const emit = defineEmits<{ (e: 'year-change', year: Year): void }>();

// 选择年份
const selIndex = ref(Math.max(0, props.years.findIndex((y) => String(y) === String(props.initialYear ?? props.years[props.years.length - 1]))));
if (selIndex.value === -1) selIndex.value = props.years.length - 1;
const years = computed(() => props.years);
const selYear = computed(() => years.value[selIndex.value]);

function select(i: number) {
  if (i < 0 || i >= years.value.length) return;
  selIndex.value = i;
  emit('year-change', selYear.value);
}
function goPrev() { select(selIndex.value - 1); }
function goNext() { select(selIndex.value + 1); }

// 当前年份数据
const curData = computed<YearData>(() => {
  const key = String(selYear.value);
  return props.dataByYear[key] || { total: new Array(12).fill(0), added: new Array(12).fill(0) };
});

const progress = computed(() => {
  const total = Math.max(1, years.value.length - 1);
  return (selIndex.value) / total; // 0~1
});

// 当外部年份变更（prop）时，重定位到该年
watch(
  () => props.initialYear,
  (y) => {
    const i = years.value.findIndex((yy) => String(yy) === String(y));
    if (i >= 0) selIndex.value = i;
  }
);

const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const option = computed(() => {
  const axisColor = 'rgba(40,100,200,0.35)';
  const gridLine = 'rgba(67,127,255,0.20)';
  return {
    grid: { left: 64, right: 16, top: 32, bottom: 110 },
    legend: {
      right: 16, top: -2,
      data: [props.barName, props.lineName],
      textStyle: { color: '#2a6ff0', fontWeight: 700 }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: months,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: '#2a6ff0', fontWeight: 700 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: props.yMax,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: axisColor } },
      axisLabel: { color: '#2a6ff0' },
      splitLine: { lineStyle: { type: 'dashed', color: gridLine } }
    },
    series: [
      // 背景柱（上限）
      {
        type: 'bar',
        name: '',
        data: new Array(12).fill(props.yMax),
        barWidth: 16,
        itemStyle: { color: 'rgba(90,160,255,0.15)', borderRadius: [6, 6, 0, 0] },
        barGap: '-100%',
        silent: true,
        legendHoverLink: false,
        tooltip: { show: false },
        z: 1
      },
      // 主柱
      {
        type: 'bar',
        name: props.barName,
        data: curData.value.total,
        barWidth: 16,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: props.barGradientStart },
            { offset: 1, color: props.barGradientEnd }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        z: 3
      },
      // 折线
      {
        type: 'line',
        name: props.lineName,
        data: curData.value.added,
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: props.lineColor },
        itemStyle: { color: props.lineColor, borderWidth: 0 },
        z: 4
      }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.year-bar-chart {
  position: relative;
  height: 100%;
  width: 100%;
}

/* 底部年份时间轴（模仿原型：圆点+文字+左右箭头） */
.timeline {
  position: absolute;
  left: 50%;
  bottom: 2px;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 2px 6px;
}

.years {
  --dot: 16px;
  /* 圆点直径 */
    --track: 4px;
    /* 灰轨厚度（更细） */
    list-style: none;
    padding: 0;
    margin: 0 18px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-width: 600px;
      /* 通过上内边距让轨道中心与圆点中心严格对齐 */
      padding-top: calc(var(--dot) / 2 - var(--track) / 2);
    }

    /* 轨道：左蓝右灰，端点与两端圆点中心对齐 */
    .years::before {
      content: '';
      position: absolute;
      left: calc(var(--dot) / 2);
      right: calc(var(--dot) / 2);
      top: 11px;
      /* 微调，使灰轨更居中 */
      height: var(--track);
      border-radius: calc(var(--track) / 2);
      background: #8f94a3;
      z-index: 0;
    }

    /* 蓝色进度轨：更细，靠下，使用 scaleX 控制长度，避免 calc 百分比不兼容 */
    .years::after {
      content: '';
      position: absolute;
      left: calc(var(--dot) / 2);
      /* 从第一个圆点中心开始 */
      top: calc(var(--dot) / 2 + 4px);
      /* 上移，使其更贴近圆点中心 */
      height: 2px;
      width: calc(100% - var(--dot));
      border-radius: 1px;
      background: #4e8fff;
      transform-origin: left center;
      transform: scaleX(var(--pos));
      z-index: 1;
    }

    .year {
      display: inline-grid;
      justify-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .year .dot {
      width: var(--dot);
      height: var(--dot);
      border-radius: 50%;
      background: #4e8fff;
      position: relative;
      z-index: 1;
    }

    .year .label {
      font-size: 18px;
      font-weight: 800;
    }

    /* 过去与未来颜色 */
    .year.past .dot {
      background: #4e8fff;
    }

    .year.future .dot {
      background: #9aa0ad;
    }

    .year.past .label {
      color: #3d7bff;
    }

    .year.future .label {
      color: #8f94a3;
    }

    /* 选中：更大并带外圈光晕 */
    .year.active .dot {
      width: calc(var(--dot) + 6px);
      height: calc(var(--dot) + 6px);
      transform: translateY(-3px);
      /* 激活圆点略上移 */
      background: #7fa7ff;
      box-shadow: 0 0 0 6px rgba(100, 150, 255, 0.2);
    }

    .year.active .label {
      color: #3d7bff;
      text-shadow: 0 0 10px rgba(82, 140, 255, 0.35);
    }

    .arrow {
      display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: #8f94a3;
        /* 默认灰色 */
        background: transparent;
        border: 1px solid transparent;
        transition: color .15s ease, background .15s ease, opacity .15s ease;
      cursor: pointer;
}

.arrow:hover:not([disabled]) {
  color: #4e8fff;
  background: rgba(78, 143, 255, 0.08);
}

.arrow[disabled] {
  opacity: 0.35;
  cursor: default;
}
</style>
