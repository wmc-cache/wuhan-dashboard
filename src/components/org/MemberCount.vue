<template>
  <div class="member-count" ref="root">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
// 左右对称的横向条形图（左：分工会总数，右：会员总数）
// 采用 ECharts 双 grid 实现：
// - 左 grid 使用 value 轴反向(inverse)向左增长；y 轴在右侧显示城市名称，位于中缝
// - 右 grid 正常向右增长；y 轴不显示标签，仅用于对齐
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

interface Props {
  areas?: string[];               // 行政区名称
  leftData?: number[];            // 分工会总数（个）
  rightData?: number[];           // 会员总数（万人）
  leftMax?: number;               // 左侧坐标上限
  rightMax?: number;              // 右侧坐标上限
  leftName?: string;              // 左侧图例名称
  rightName?: string;             // 右侧图例名称
  // 颜色保持不变：提供默认值，也允许外部覆盖
  leftColorStart?: string;
  leftColorEnd?: string;
  leftBorderColor?: string;
  rightColorStart?: string;
  rightColorEnd?: string;
  rightBorderColor?: string;
  centerWidth?: string;           // 中间文本列宽度（百分比），默认 12%
  sideWidth?: string;             // 左右图表列宽度（百分比），默认 34%
  barWidth?: number;              // 柱宽，默认 14
  centerNudgePx?: number;         // 文本微调（px），负数向左，默认 -6
}

const props = withDefaults(defineProps<Props>(), {
  areas: () => [
    '武昌区', '江岸区', '江汉区', '洪山区', '黄陂区', '新洲区', '江夏区',
    '武汉经济技术开发区', '东西湖区', '汉阳区', '东湖新技术开发区', '青山区', '硚口区', '东湖生态旅游风景区', '蔡甸区'
  ],
  // 随机示意数据（可用真实数据替换）
  leftData: () => [320, 260, 220, 180, 140, 210, 200, 280, 230, 240, 190, 170, 160, 150, 140],
  rightData: () => [22, 18, 16, 14, 9, 15, 13, 17, 12, 13, 10, 9, 8, 7, 7],
  leftMax: 400,
  rightMax: 25,
  leftName: '分工会总数（个）',
  rightName: '会员总数（万人）',
  // 默认沿用当前项目配色（左蓝右橙）
  leftColorStart: '#7FB1FF',
  leftColorEnd: 'rgba(5,135,254,0.45)',
  leftBorderColor: 'rgba(120,170,255,1)',
  rightColorStart: '#FFB45E',
  rightColorEnd: 'rgba(255,136,0,0.65)',
  rightBorderColor: 'rgba(255,158,31,1)'
  ,centerWidth: '12%', sideWidth: '34%', barWidth: 14, centerNudgePx: -6
});

const root = ref<HTMLDivElement | null>(null);
const centerOffsetPxRef = ref(0);

let ro: ResizeObserver | null = null;
onMounted(() => {
  const getPct = (v: string) => Math.max(0, Math.min(100, parseFloat(String(v)) || 0));
  const update = () => {
    const el = root.value;
    if (!el) return;
    const w = el.clientWidth || 0;
    const centerPct = getPct(props.centerWidth);
    // 将中间列宽度百分比转换为像素，并取一半作为偏移
    centerOffsetPxRef.value = (w * centerPct) / 100 / 2;
  };
  ro = new ResizeObserver(update);
  if (root.value) ro.observe(root.value);
  update();
});
onBeforeUnmount(() => { if (ro && root.value) ro.unobserve(root.value); ro = null; });

const option = computed(() => {
  const categories = props.areas;
  const axisColor = 'rgba(40,100,200,0.35)';
  const splitLine = 'rgba(67,127,255,0.20)';
  // 背景柱衬底：对比度更柔和
  const bgLeftColor = 'rgba(90,160,255,0.12)';
  const bgRightColor = 'rgba(255,158,31,0.12)';

  // 计算三列布局：left:5% + sideWidth | center left = 5% + sideWidth
  const sidePct = Math.max(0, Math.min(80, parseFloat(String(props.sideWidth)) || 34));
  const centerLeftPct = 5 + sidePct; // 百分比

  return {
    // 三 grid：左/中(0宽)/右，完全参考给定配置
    grid: [
      // 可配置的三列布局
      { show: false, left: '5%',  top: '10%', bottom: '8%', containLabel: true, width: props.sideWidth },
      { show: false, left: `${centerLeftPct}%`, top: '10%', bottom: '8%', containLabel: true, width: props.centerWidth },
      { show: false, right: '2%', top: '10%', bottom: '8%', containLabel: true, width: props.sideWidth }
    ],
    legend: {
      top: '2%', right: '5%', itemWidth: 20, itemHeight: 5,
      icon: 'horizontal',
      textStyle: { color: '#2a6ff0', fontSize: 14, fontWeight: 700 },
      data: [props.leftName, props.rightName]
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: [
      {
        type: 'value', inverse: true, position: 'top',
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { show: true, color: '#2a6ff0' },
        splitLine: { show: true, lineStyle: { color: splitLine } },
        min: 0, max: props.leftMax
      },
      { gridIndex: 1, show: false },
      {
        gridIndex: 2, type: 'value', position: 'top',
        axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { show: true, color: '#2a6ff0' },
        splitLine: { show: true, lineStyle: { color: splitLine } },
        min: 0, max: props.rightMax
      }
    ],
    yAxis: [
      {
        type: 'category', inverse: true, position: 'right',
        axisLine: { show: true, lineStyle: { color: splitLine } },
        axisTick: { show: false }, axisLabel: { show: false },
        data: categories
      },
      {
        gridIndex: 1, type: 'category', inverse: true, position: 'left',
        axisLine: { show: false }, axisTick: { show: false },
        // 轴线放在中间列中心，通过 offset=列宽/2 实现；允许微调 nudge 修正视觉居中
        offset: centerOffsetPxRef.value + (props.centerNudgePx || 0),
        axisLabel: { show: true, inside: true, margin: 0, align: 'center', color: '#2a6ff0', fontSize: 16, fontWeight: 700 },
        data: categories.map((v) => ({ value: v, textStyle: { align: 'center' } }))
      },
      {
        gridIndex: 2, type: 'category', inverse: true, position: 'left',
        axisLine: { show: true, lineStyle: { color: splitLine } },
        axisTick: { show: false }, axisLabel: { show: false },
        data: categories
      }
    ],
    series: [
      // 左侧背景
      {
        type: 'bar', barWidth: props.barWidth, xAxisIndex: 0, yAxisIndex: 0,
        data: new Array(categories.length).fill(props.leftMax),
        barGap: '-100%', silent: true, tooltip: { show: false }, z: 1,
        itemStyle: { color: bgLeftColor, borderRadius: [10, 0, 0, 10] }
      },
      // 左侧主值（靠近 0 为平，远端圆角）
      {
        name: props.leftName, type: 'bar', barWidth: props.barWidth, xAxisIndex: 0, yAxisIndex: 0,
        data: props.leftData, z: 3,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: props.leftColorStart },
            { offset: 1, color: props.leftColorEnd }
          ]),
          borderColor: props.leftBorderColor, borderWidth: 1,
          borderRadius: [10, 0, 0, 10]
        }
      },
      // 右侧背景
      {
        type: 'bar', barWidth: props.barWidth, xAxisIndex: 2, yAxisIndex: 2,
        data: new Array(categories.length).fill(props.rightMax),
        barGap: '-100%', silent: true, tooltip: { show: false }, z: 1,
        itemStyle: { color: bgRightColor, borderRadius: [0, 10, 10, 0] }
      },
      // 右侧主值（靠近 0 为平，远端圆角）
      {
        name: props.rightName, type: 'bar', barWidth: props.barWidth, xAxisIndex: 2, yAxisIndex: 2,
        data: props.rightData, z: 3,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: props.rightColorStart },
            { offset: 1, color: props.rightColorEnd }
          ]),
          borderColor: props.rightBorderColor, borderWidth: 1,
          borderRadius: [0, 10, 10, 0]
        }
      }
    ]
  } as echarts.EChartsOption;
});
</script>

<style scoped lang="scss">
.member-count { position: relative; width: 100%; height: 100%; }
</style>
