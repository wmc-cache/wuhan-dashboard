<template>
  <section class="mod">
    <h3 class="mod__title">{{ title }}</h3>
    <div class="mod__body mod__body--full">
      <HorizontalGenderStack
        :labels="labels"
        :male="male"
        :female="female"
        :min-total="60"
        :step="15"
        unit-text="万人"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import HorizontalGenderStack from '../HorizontalGenderStack.vue';

interface Props {
  title?: string;
  labels?: string[];
  male?: number[];
  female?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '救助人员年龄分布（男女）',
  labels: () => ['80岁以上', '60-80岁', '40-60岁', '20-40岁', '20岁以下'],
  male: () => [8, 22, 45, 20, 5],
  female: () => [10, 28, 54, 30, 8]
});

const { title, labels, male, female } = toRefs(props);
</script>

<style scoped lang="scss">
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../../images/module-broder/矩形.png') 1x, url('../../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
.mod__body--full { display: grid; }
</style>
