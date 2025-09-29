<template>
  <div class="disease-dist">
    <div class="title-img" aria-hidden="true">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="给付类型统计" draggable="false" />
    </div>
    <StripedBarChart :categories="categories" :values="values" :y-max="yMax" y-unit="人" :bar-width="44" :grid-left="72"
      :grid-right="24" :grid-bottom="48" :grid-top="28" :show-labels="true" :x-label-interval="'auto'"
      :y-split-number="4" />
  </div>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';
import title1x from '../../images/yiliao/part6/title/编组 21.png';
import title2x from '../../images/yiliao/part6/title/编组 21@2x.png';


interface Props {
  categories?: string[];
  values?: number[];
  yMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    '肿瘤相关', '脑血管', '头痛', '骨折', '脑出血', '糖尿病', '肾病', '心血管', '肝病', '呼吸系统'
  ],
  values: () => [980, 1120, 860, 720, 660, 840, 780, 690, 620, 560],
  yMax: 1200
});

const categories = props.categories;
const values = props.values;
const yMax = props.yMax;
</script>

<style scoped lang="scss">
.disease-dist {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 4px 0;
  box-sizing: border-box;
}
</style>

