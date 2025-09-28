<template>
  <div class="join-age">
    <!-- 标题图片 -->


    <div class="title-img" aria-hidden="true">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="给付类型统计" draggable="false" />
    </div>

    <!-- 自定义图例（男女） -->
    <div class="legend">
      <div class="legend__item"><span class="dot dot--male"></span>男性</div>
      <div class="legend__item"><span class="dot dot--female"></span>女性</div>
    </div>

    <!-- 图表区域 -->
    <div class="chart">
      <HorizontalGenderStack :labels="labels" :male="males" :female="females" :step="15" :min-total="60" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import HorizontalGenderStack from '../HorizontalGenderStack.vue';
import title1x from '../../images/yiliao/part3/title/编组 21.png';
import title2x from '../../images/yiliao/part3/title/编组 21@2x.png';

interface Row { label: string; male: number; female: number }
interface Props { data?: Row[] }

const props = withDefaults(defineProps<Props>(), {
  data: () => [
    { label: '80岁以上', male: 30, female: 35 },
    { label: '60-80岁', male: 32, female: 28 },
    { label: '40-60岁', male: 26, female: 35 },
    { label: '20-40岁', male: 28, female: 32 },
    { label: '20岁以下', male: 20, female: 18 }
  ]
});

const labels = computed(() => props.data.map(d => d.label));
const males = computed(() => props.data.map(d => d.male));
const females = computed(() => props.data.map(d => d.female));
</script>

<style scoped lang="scss">
.join-age {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 18px 16px 12px;
  box-sizing: border-box;
}

.legend {
  position: absolute;
  right: 18px;
  top: 12px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.legend__item {
  display: inline-grid;
  grid-auto-flow: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4c5566;
  font-weight: 600;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot--male {
  background: #2a6ff0;
}

.dot--female {
  background: #ff6b97;
}

.chart {
  position: absolute;
  inset: 40px 8px 8px 0;
}
</style>
