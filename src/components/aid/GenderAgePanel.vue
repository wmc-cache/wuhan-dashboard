<template>
  <section class="mod">
    <div class="content">
      <!-- 左：性别分布环图 -->
      <div class="left">
        <h3 class="sub-title">{{ leftTitle }}</h3>
        <GenderPie :data="gender" :chart-center="['54%', '55%']" />
      </div>

      <!-- 右：年龄分布（男女） -->
      <div class="right">
        <div class="sub-title">{{ rightTitle }}</div>
        <HorizontalGenderStack :labels="ageLabels" :male="male" :female="female" :min-total="60" :step="15"
          unit-text="万人" :grid-left="112" :grid-right="16" :grid-top="36" :grid-bottom="50" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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

const leftTitle = props.leftTitle;
const rightTitle = props.rightTitle;
const gender = props.gender;
const ageLabels = props.ageLabels;
const male = props.male;
const female = props.female;

// 左侧饼图交由 GenderPie 处理
</script>

<style scoped lang="scss">
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; }
.content { display: grid; grid-template-columns: 1.05fr 1fr; column-gap: 16px; height: 100%; }
.sub-title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
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
