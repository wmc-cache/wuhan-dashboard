<template>
  <div class="honor-classification">
    <div class="header">
      <span class="title-img"></span>
      <span class="title">荣誉分类统计</span>
    </div>
    <div class="content">
      <div class="chart-container">
        <EChart :option="chartOption" />
        <div class="center-label">荣誉分类</div>
      </div>
      <div class="legend" aria-label="legend">
        <div class="legend-item">
          <span class="dot dot--city"></span>
          <span class="label">市级劳模</span>
        </div>
        <div class="legend-item">
          <span class="dot dot--prov"></span>
          <span class="label">省级劳模</span>
        </div>
        <div class="legend-item">
          <span class="dot dot--country"></span>
          <span class="label">国家级劳模</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import EChart from '../EChart.vue';

// 数据源（可替换为接口数据）
const data = [
  { name: '省级', value: 23, color: '#4DD0E1' },
  { name: '市级', value: 22, color: '#4293FF' },
  { name: '国家级', value: 44, color: '#FF7875' }
];

const total = data.reduce((s, d) => s + d.value, 0);

// 将值映射到环的角度比例（只扫过 260°，保留 100°的留白以形成断口感）
const sweepAngle = 260; // 可微调
function angleByValue(v: number) {
  return (v / total) * sweepAngle;
}

const center = ['38%', '55%']; // 稍偏左，右侧放图例

const chartOption = computed(() => {
  // 三个环，使用 pie(两段) 实现有断口的进度环
  const rings = [
    // 外环：省级
    {
      radius: ['60%', '74%'],
      startAngle: 30, // 位于右上
      color: data[0].color,
      value: data[0].value
    },
    // 中环：国家级（左侧）
    {
      radius: ['46%', '58%'],
      startAngle: 180, // 位于左侧
      color: data[2].color,
      value: data[2].value
    },
    // 内环：市级（右下）
    {
      radius: ['32%', '44%'],
      startAngle: 315, // 位于右下
      color: data[1].color,
      value: data[1].value
    }
  ];

  // 背景轨道（淡色整圈），放在最底层
  const backSeries = rings.map((r) => ({
    type: 'pie' as const,
    silent: true,
    z: 1,
    center,
    radius: r.radius,
    startAngle: 0,
    label: { show: false },
    labelLine: { show: false },
    itemStyle: { borderWidth: 0 },
    data: [
      { value: 360, name: '', itemStyle: { color: 'rgba(120,160,255,0.12)' } },
      { value: 0, name: '', itemStyle: { color: 'rgba(0,0,0,0)' } }
    ]
  }));

  const ringSeries = rings.map((r) => {
    const v = angleByValue(r.value);
    const rest = 360 - v; // 剩余部分透明以形成断口
    // helper: create a gentle left-to-right gradient based on the ring color
    function grad(color: string) {
      // simple lighten: mix color with white
      const c = color.replace('#', '');
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      const l = (n: number) => Math.min(255, Math.round(n + (255 - n) * 0.38));
      const light = `rgb(${l(r)},${l(g)},${l(b)})`;
      return new (echarts as any).graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: light },
        { offset: 1, color }
      ]);
    }

    return {
      type: 'pie' as const,
      silent: true,
      center,
      radius: r.radius,
      startAngle: r.startAngle,
      clockwise: true,
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: { borderWidth: 0 },
      data: [
        {
          value: v,
          name: '',
          itemStyle: {
            color: grad(r.color),
            shadowBlur: 8,
            shadowColor: 'rgba(50,120,255,0.25)'
          }
        },
        {
          value: rest,
          name: '',
          itemStyle: { color: 'rgba(0,0,0,0)' }
        }
      ]
    };
  });

  // ---------- 同层主环（参考你的示例）：两层重叠（30%透明底色 + 实色），再单独生成标注 ----------
  const baseStart = 20; // 起始角（让“省级”位于右上，标注在右侧）
  const gapDeg = 8; // 三段之间的缝隙角度
  function hexToRgba(hex: string, alpha: number) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const order = [0, 2, 1]; // 顺序：省→国→市（顶右青→左下红→右下蓝），与图例颜色一一对应
  const sumVal = data.reduce((s, d) => s + d.value, 0);
  const usable = 360 - gapDeg * data.length;
  const ang = data.map((d) => (d.value / sumVal) * usable);
  // 让 pie 的“缝隙”占用固定角度 gapDeg，需要把 gap 的 value 计算成等效数值
  const r = gapDeg / 360;
  const gapValue = (r * sumVal) / (1 - data.length * r);

  const underData: any[] = [];
  const solidData: any[] = [];
  order.forEach((idx, i) => {
    const a = ang[idx];
    underData.push({ value: data[idx].value, name: data[idx].name, itemStyle: { color: hexToRgba(data[idx].color, 0.3) } });
    underData.push({ value: gapValue, name: `gap-u-${i}`, itemStyle: { color: 'rgba(0,0,0,0)' }, tooltip: { show: false }, label: { show: false }, labelLine: { show: false } });
    solidData.push({
      value: data[idx].value,
      name: data[idx].name,
      itemStyle: { color: data[idx].color, borderColor: '#eef2f7', borderWidth: 2 },
      label: { show: true, position: 'outside', formatter: '{b}\n{c}' },
      labelLine: { show: true, length: idx === 2 ? 22 : 16, length2: idx === 2 ? 36 : 24, lineStyle: { color: data[idx].color, width: 1.5 } }
    });
    solidData.push({ value: gapValue, name: `gap-s-${i}`, itemStyle: { color: 'rgba(0,0,0,0)' }, tooltip: { show: false }, label: { show: false }, labelLine: { show: false } });
  });
  const underRing = {
    name: 'under', type: 'pie' as const, hoverAnimation: false, legendHoverLink: false,
    radius: ['47%', '60%'], center, startAngle: baseStart,
    label: { show: false }, labelLine: { show: false }, tooltip: { show: false }, data: underData
  };
  const solidRing = {
    name: 'solid', type: 'pie' as const, hoverAnimation: false, legendHoverLink: false,
    radius: ['55%', '60%'], center, startAngle: baseStart,
    label: { show: false }, labelLine: { show: false }, data: solidData
  };

    // 取消额外标注系列，直接使用 solidRing 的每个扇区的 label/labelLine
  const labelSeriesList: any[] = [];

  // 内环虚线刻度效果
  const tickRing: echarts.EChartsOption['series'] = {
    type: 'gauge',
    center,
    radius: '26%',
    startAngle: 220,
    endAngle: -40,
    min: 0,
    max: 100,
    splitNumber: 12,
    axisLine: { lineStyle: { width: 1, color: [[1, 'rgba(0,0,0,0)']] } },
    axisTick: {
      show: true,
      distance: 0,
      splitNumber: 5,
      length: 3,
      lineStyle: { color: 'rgba(80,120,255,0.35)', width: 1 }
    },
    splitLine: {
      show: true,
      distance: 0,
      length: 6,
      lineStyle: { color: 'rgba(80,120,255,0.25)', width: 1 }
    },
    axisLabel: { show: false },
    pointer: { show: false },
    detail: { show: false }
  } as any;

  return {
    tooltip: { show: true, formatter: '{b}: {c}' },
    series: [
      underRing,
      solidRing,
      tickRing,
      ...labelSeriesList
    ]
  } as echarts.EChartsOption;
});
</script>

<style scoped lang="scss">
.honor-classification {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f7faff 0%, #eef2f7 100%);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(52, 114, 255, 0.06);

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .title-img {
      width: 10px;
      height: 10px;
      margin-right: 8px;
      border-radius: 2px;
      background: linear-gradient(135deg, #8ac3ff, #2a6ff0);
      box-shadow: 0 0 10px rgba(42, 111, 240, 0.4);
      transform: rotate(45deg);
    }

    .title {
      font-size: 18px;
      font-weight: 700;
      background: linear-gradient(180deg, #69a8ff 0%, #2a6ff0 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0 4px 12px rgba(42, 111, 240, 0.25);
    }
  }

  .content {
    display: flex;
    align-items: center;
    height: calc(100% - 60px);

    .chart-container {
      position: relative;
      width: 68%;
      height: 100%;

      .center-label {
        position: absolute;
        top: 55%;
        left: 38%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        font-weight: 600;
        color: #607d8b;
        pointer-events: none;
      }
    }

    .legend {
      width: 32%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 14px;
      padding-left: 20px;

      .legend-item {
        display: flex;
        align-items: center;

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
        }

        .label {
          font-size: 14px;
          color: #4a5568;
        }
      }

      .dot--prov { background: #4DD0E1; }
      .dot--city { background: #4293FF; }
      .dot--country { background: #FF7875; }
    }
  }
}
</style>
