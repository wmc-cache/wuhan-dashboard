<template>
  <section class="mod">
    <h3 class="mod__title"><span class="title-img title-img--aid-title3" aria-hidden="true"></span></h3>
    <div class="mod__body mod__body--full">
      <StripedBarChart :categories="categories" :values="values" :y-max="yMax" />
    </div>
  </section>
</template>

<script setup lang="ts">
import StripedBarChart from '../StripedBarChart.vue';

interface Props {
  title?: string;
  categories?: string[];
  values?: number[];
  yMax?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: '救助种类人数统计',
  categories: () => ['冠状肿瘤救助', '自救', '赈济', '支票', '临时救助'],
  values: () => [780, 520, 680, 900, 720],
  yMax: 1200
});

const { title, categories, values, yMax } = props;
</script>

<style scoped lang="scss">
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title {
  margin: 0 0 10px;
}

.mod__body {
  overflow: auto;
}

.mod__body--full {
  display: grid;
}

/* 标题切图（1x/2x） */
.title-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-img--aid-title3 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/aid/title3/编组 21.png') 1x, url('../../images/aid/title3/编组 21@2x.png') 2x);
  background-image: image-set(url('../../images/aid/title3/编组 21.png') 1x, url('../../images/aid/title3/编组 21@2x.png') 2x);
}
</style>

