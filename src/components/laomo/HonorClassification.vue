<template>
  <div class="honor-classification">

    <div class="content">
      <div class="chart-container">
        <HonorRingsChart :items="data" center-text="荣誉分类" />
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
import HonorRingsChart from '../HonorRingsChart.vue';

interface Item { name: string; value: number; color?: string }
interface Props { items?: Item[] }

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { name: '省级', value: 23, color: '#4DD0E1' },
    { name: '市级', value: 22, color: '#4293FF' },
    { name: '国家级', value: 44, color: '#FF7875' }
  ]
});

// 给缺省项补色：省/市/国家固定颜色，其他顺序回退
const colorMap: Record<string, string> = {
  '省级': '#4DD0E1',
  '市级': '#4293FF',
  '国家级': '#FF7875'
};

const data = computed<Item[]>(() =>
  (props.items || []).map((it, i) => ({
    name: String(it?.name ?? ''),
    value: Number(it?.value ?? 0) || 0,
    color: it?.color || colorMap[String(it?.name ?? '')] || ['#4DD0E1','#4293FF','#FF7875'][i % 3]
  }))
);

// 交互与图形逻辑已抽到子组件中
</script>

<style scoped lang="scss">
.honor-classification {
  width: 100%;
  height: 100%;
  

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
        left: 46%;
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
