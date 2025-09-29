<template>
  <div class="striped-bar-chart">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from './EChart.vue';

interface Props {
  // 数据配置
  categories?: string[];
  values?: number[];
  yMax?: number;
  // y 轴单位（传入后会在坐标轴顶部显示“单位（xx）”）
  yUnit?: string;
  // 直接覆盖 y 轴名称文案（如果传入则优先使用该值）
  yAxisName?: string;

  // 样式配置
  bgGradientTop?: string;      // 背景柱顶部颜色
  bgGradientBottom?: string;   // 背景柱底部颜色
  stripeColor?: string;        // 条纹颜色
  barWidth?: number;           // 柱子宽度
  stripeWidth?: number;        // 条纹块宽度
  stripeHeight?: number;       // 条纹块高度
  stripeGap?: number;          // 条纹块间距

  // 坐标轴配置
  axisColor?: string;          // 坐标轴颜色
  textColor?: string;          // 文本颜色
  gridLineColor?: string;      // 网格线颜色
  xLabelInterval?: number | 'auto'; // x 轴标签间隔（0 显示全部）
  xLabelRotate?: number;       // x 轴标签旋转角度
  ySplitNumber?: number;       // y 轴分隔数

  // 布局配置
  gridLeft?: number;
  gridRight?: number;
  gridTop?: number;
  gridBottom?: number;

  // 功能配置
  showLabels?: boolean;        // 是否显示数值标签
  enableAnimation?: boolean;   // 是否启用动画
  enableTooltip?: boolean;     // 是否启用提示框

  // 高级配置
  labelPadding?: number;       // 标签与条形图的间距
  alphaStrength?: number;      // 透明度渐变强度 (0-1)
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['类别1', '类别2', '类别3', '类别4', '类别5', '类别6'],
  values: () => [662, 483, 784, 900, 432, 661],
  yMax: 1200,
  yUnit: '',
  yAxisName: '',

  // 默认样式（保持与原来一致）
  bgGradientTop: 'rgba(80, 150, 255, 0.22)',
  bgGradientBottom: 'rgba(80, 150, 255, 0.03)',
  stripeColor: '#0587FE',
  barWidth: 44,
  stripeWidth: 30,
  stripeHeight: 15,
  stripeGap: 2,

  axisColor: 'rgba(67,127,255,0.35)',
  textColor: 'rgba(25, 90, 200, 0.95)',
  gridLineColor: 'rgba(67,127,255,0.22)',

  gridLeft: 72,
  gridRight: 20,
  gridTop: 8,
  gridBottom: 56,

  showLabels: true,
  enableAnimation: true,
  enableTooltip: true,

  labelPadding: 24,
  alphaStrength: 0.9,
  xLabelInterval: 'auto',
  xLabelRotate: 0,
  ySplitNumber: 4
});

const option = computed(() => {
  return {
    grid: {
      left: props.gridLeft,
      right: props.gridRight,
      top: props.gridTop,
      bottom: props.gridBottom
    },
    xAxis: {
      type: 'category',
      data: props.categories,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: props.axisColor } },
      axisLabel: {
        color: props.textColor,
        fontWeight: 600,
        interval: props.xLabelInterval as any,
        rotate: props.xLabelRotate
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: props.yMax,
      splitNumber: props.ySplitNumber,
      // 在 y 轴顶部显示单位/名称
      name: props.yAxisName ? props.yAxisName : (props.yUnit ? `单位（${props.yUnit}）` : ''),
      nameLocation: 'end',
      nameRotate: 0,
      nameGap: 12,
      nameTextStyle: { color: props.textColor, fontWeight: 700 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: props.axisColor } },
      axisLabel: { color: props.textColor },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: props.gridLineColor
        }
      }
    },
    tooltip: props.enableTooltip ? { trigger: 'item' } : undefined,
    animation: props.enableAnimation,
    series: [
      // 背景柱
      {
        type: 'bar',
        data: new Array(props.values.length).fill(props.yMax),
        barWidth: props.barWidth,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: props.bgGradientTop },
            { offset: 1, color: props.bgGradientBottom }
          ]),
        },
        barGap: '-100%',
        silent: true,
        z: 1
      },
      // 条纹前景（custom渲染）
      {
        type: 'custom',
        z: 3,
        data: props.values.map((v, i) => [i, v]),
        encode: { x: 0, y: 1 },
        renderItem(params: any, api: any) {
          const xIndex = api.value(0);
          const value = api.value(1);

          // 像素坐标
          const bottom = api.coord([xIndex, 0]);
          const top = api.coord([xIndex, value]);

          const children: any[] = [];

          // 让方块水平居中对齐到背景柱
          const xLeft = bottom[0] - props.barWidth / 2 + (props.barWidth - props.stripeWidth) / 2;

          // 自底向上逐段绘制条纹
          let y = bottom[1] - props.stripeHeight;
          const limitTop = top[1];
          const labelPad = props.showLabels ? props.labelPadding : 0;

          while (y + props.stripeHeight >= limitTop + labelPad) {
            const center = y + props.stripeHeight / 2;
            // 0 在底部，1 在顶部；底部更透明，上部更实
            const t = (bottom[1] - center) / (bottom[1] - limitTop);
            const alpha = Math.max(0.08, Math.min(1, Math.pow(t, props.alphaStrength)));

            children.push({
              type: 'rect',
              shape: {
                x: xLeft,
                y,
                width: props.stripeWidth,
                height: props.stripeHeight
              },
              style: {
                fill: `rgba(${hexToRgb(props.stripeColor)}, ${alpha})`
              }
            });

            y -= props.stripeHeight + props.stripeGap;
          }

          // 顶部数值标签
          if (props.showLabels) {
            const labelY = top[1] - 8;
            children.push({
              type: 'text',
              style: {
                text: String(value),
                x: bottom[0],
                y: labelY,
                fill: props.stripeColor,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 14
              }
            });
          }

          return { type: 'group', children } as any;
        }
      }
    ]
  } as any;
});

// 辅助函数：将十六进制颜色转换为 RGB
function hexToRgb(hex: string): string {
  if (hex.startsWith('#')) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` :
      '5,135,254'; // 默认值
  }
  // 如果已经是 rgb 格式，直接返回数字部分
  const rgbMatch = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  return rgbMatch ? `${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]}` : '5,135,254';
}
</script>

<style scoped lang="scss">
.striped-bar-chart {
  position: relative;
  height: 100%;
}
</style>
