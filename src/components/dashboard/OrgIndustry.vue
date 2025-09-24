<template>
  <div class="org-industry">
    <EChart :option="option" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

interface Props {
  categories?: string[];
  values?: number[];
  yMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => ['行业1', '行业2', '行业3', '行业4', '行业5', '行业6'],
  values: () => [662, 483, 784, 900, 432, 661],
  yMax: 1200
});

const option = computed(() => {
  // 统一配色，贴近视觉稿
  const colors = {
    // 背景立柱：上稍亮、下更透明
    bgTop: 'rgba(80, 150, 255, 0.22)',
    // 调整：底部再淡一些，让柱底更“透”
    bgBottom: 'rgba(80, 150, 255, 0.03)',
    // 条纹：顶部亮、底部透明（产生向上聚焦效果）
    barTop: '#0587FE',
    barBottom: 'rgba(5, 135, 254, 0)',
    // 坐标与文字
    axis: 'rgba(67,127,255,0.35)',
    text: 'rgba(25, 90, 200, 0.95)'
  };

  return {
    grid: { left: 72, right: 20, top: 8, bottom: 56 },
    xAxis: {
      type: 'category',
      data: props.categories,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colors.axis } },
      axisLabel: { color: colors.text, fontWeight: 600 }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: props.yMax,
      splitNumber: 4,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colors.axis } },
      axisLabel: { color: colors.text },
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(67,127,255,0.22)' } }
    },
    tooltip: { trigger: 'item' },
    animation: true,
    series: [
      // 背景柱
      {
        // 背景立柱：用于形成淡蓝色的行业柱形槽
        type: 'bar',
        data: new Array(props.values.length).fill(props.yMax),
        barWidth: 44,
        itemStyle: {
          color: new (echarts as any).graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors.bgTop },
            { offset: 1, color: colors.bgBottom }
          ]),
        },
        barGap: '-100%', // 与前景条纹严格重合
        silent: true,
        z: 1
      },
      // 条纹前景（改为 custom：逐段绘制并按高度衰减透明度）
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

          const bandW = api.size([1, 0])[0];
          const barW = 44;
          const segW = 30; // 小方块宽
          const segH = 15; // 小方块高
          const gap = 2;   // 小方块间距

          // 让方块水平居中对齐到背景柱
          const xLeft = bottom[0] - barW / 2 + (barW - segW) / 2;

          const children: any[] = [];

          // 自底向上逐段绘制
          let y = bottom[1] - segH;
          const limitTop = top[1];
          const labelPad = 24; // 给顶部数字留出空间，防止遮挡
          while (y + segH >= limitTop + labelPad) {
            const center = y + segH / 2;
            // 0 在底部，1 在顶部；底部更透明，上部更实
            const t = (bottom[1] - center) / (bottom[1] - limitTop);
            const alpha = Math.max(0.08, Math.min(1, Math.pow(t, 0.9))); // 非线性更顺滑

            children.push({
              type: 'rect',
              shape: { x: xLeft, y, width: segW, height: segH },
              style: { fill: `rgba(5,135,254,${alpha})` }
            });

            y -= segH + gap;
          }

          // 顶部数值标签
          const labelY = top[1] - 8;
          children.push({
            type: 'text',
            style: {
              text: String(value),
              x: bottom[0],
              y: labelY,
              fill: '#0587FE',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14
            }
          });

          return { type: 'group', children } as any;
        }
      }
    ]
  } as any;
});
</script>

<style scoped lang="scss">
.org-industry { position: relative; height: 100%; }
</style>
