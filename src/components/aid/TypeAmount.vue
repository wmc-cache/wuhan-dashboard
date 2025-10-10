<template>
  <section class="mod">
    <h3 class="mod__title">
      <span class="title-img title-img--aid-title4" aria-hidden="true"></span>
    </h3>
    <div class="mod__body mod__body--full">
      <!-- 金额统计：改为橙色条纹与数值颜色 -->
      <StripedBarChart y-unit="金额" :grid-top="25" :categories="categories" :values="values" :y-max="yMax"
        stripe-color="#FF7A00" />
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
  title: '救助种类金额统计',
  categories: () => ['冠状肿瘤救助', '自救', '赈济', '支票', '临时救助'],
  values: () => [1200, 980, 1280, 1150, 1260],
  yMax: 1300
});

const { title, categories, values, yMax } = props;
</script>

<style scoped lang="scss">
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod--tall::before { background-image: -webkit-image-set(url('../../images/module-broder-height/矩形.png') 1x, url('../../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder-height/矩形.png') 1x, url('../../images/module-broder-height/矩形@2x.png') 2x); }
.mod--wide::before { background-image: -webkit-image-set(url('../../images/module-broder-width/矩形.png') 1x, url('../../images/module-broder-width/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder-width/矩形.png') 1x, url('../../images/module-broder-width/矩形@2x.png') 2x); }

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

.title-img--aid-title4 {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/aid/title4/编组 21.png') 1x, url('../../images/aid/title4/编组 21@2x.png') 2x);
  background-image: image-set(url('../../images/aid/title4/编组 21.png') 1x, url('../../images/aid/title4/编组 21@2x.png') 2x);
}
</style>
