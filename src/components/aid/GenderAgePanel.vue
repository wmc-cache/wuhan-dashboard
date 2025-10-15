<template>
  <section class="mod mod--wide">
    <div class="content">
      <!-- 左：性别分布环图 -->
      <div class="left">
        <span class="title-img title-img--aid-title1" aria-hidden="true"></span>
        <GenderPie :data="gender" :chart-center="['54%', '55%']" />
      </div>

      <!-- 右：年龄分布（男女） -->
      <div class="right">
        <span class="title-img" aria-hidden="true"></span>
        <HorizontalGenderStack
          :labels="ageLabels"
          :male="male"
          :female="female"
          :min-total="10"
          :step="axisStep"
          unit-text="人"
          :grid-left="80" :grid-right="30" :grid-top="36" :grid-bottom="50"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { niceMax } from '../../utils/api';
import GenderPie from './GenderPie.vue';
import HorizontalGenderStack from '../HorizontalGenderStack.vue';

interface Gender { name: string; value: number; color?: string }

interface Props {
  leftTitle?: string;
  rightTitle?: string;
  gender?: Gender[];
  ageLabels?: string[];
  male?: number[];
  female?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  leftTitle: '',
  rightTitle: '',
  gender: () => ([
    { name: '男性', value: 47885, color: '#2a6ff0' },
    { name: '女性', value: 234546, color: '#ff6b97' }
  ]),
  ageLabels: () => ['80岁以上', '60-80岁', '40-60岁', '20-40岁', '20岁以下'],
  male: () => [8, 22, 45, 20, 5],
  female: () => [10, 28, 54, 30, 8]
});

const { leftTitle, rightTitle, gender, ageLabels, male, female } = toRefs(props);

// 根据数据规模动态选择“好看”的步长，避免密集分隔线
const totals = computed(() => (male.value || []).map((m: number, i: number) => (Number(m) || 0) + (Number((female.value || [])[i]) || 0)));
const axisMax = computed(() => niceMax(totals.value, 10));
const axisStep = computed(() => {
  const target = Math.max(1, Math.ceil(axisMax.value / 6));
  const mag = Math.pow(10, Math.floor(Math.log10(target)));
  const norm = target / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return nice * mag;
});

// 左侧饼图交由 GenderPie 处理
</script>

<style scoped lang="scss">
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod--tall::before { background-image: -webkit-image-set(url('../../images/module-broder-height/矩形.png') 1x, url('../../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder-height/矩形.png') 1x, url('../../images/module-broder-height/矩形@2x.png') 2x); }
.mod--wide::before { background-image: -webkit-image-set(url('../../images/module-broder-width/矩形.png') 1x, url('../../images/module-broder-width/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder-width/矩形.png') 1x, url('../../images/module-broder-width/矩形@2x.png') 2x); }
.content { display: grid; grid-template-columns: 1.05fr 1fr; column-gap: 16px; height: 100%; }
.sub-title { display:none; }
.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; margin: 0 0 10px; }
.title-img--aid-title1 { width: 186px; height: 35px; background-image: -webkit-image-set(url('../../images/aid/title1/编组 21.png') 1x, url('../../images/aid/title1/编组 21@2x.png') 2x); background-image: image-set(url('../../images/aid/title1/编组 21.png') 1x, url('../../images/aid/title1/编组 21@2x.png') 2x); }
.title-img--aid-title2 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../../images/aid/title2/编组 21.png') 1x, url('../../images/aid/title2/编组 21@2x.png') 2x); background-image: image-set(url('../../images/aid/title2/编组 21.png') 1x, url('../../images/aid/title2/编组 21@2x.png') 2x); }
.left,
.right {
  display: grid;
  grid-template-rows: auto 1fr;
}
.left__inner { display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 16px; }
.legend { list-style: none; margin: 0; padding: 0 10px 0 0; display: grid; row-gap: 18px; }
.legend li { display: grid; grid-template-columns: 16px auto 1fr; column-gap: 8px; align-items: center; font-weight: 800; color: #2a6ff0; }
.legend .val { justify-self: end; }
.dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 0 3px rgba(255,255,255,.6) inset; }
.center { text-align: center; transform: translateY(-8px); }
.center .total { font-weight: 900; font-size: 22px; color: #2a6ff0; }
.center .txt { color: rgba(0,0,0,.55); margin-top: 4px; font-weight: 700; }
</style>
