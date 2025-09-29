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

const { title, labels, male, female } = props;
</script>

<style scoped lang="scss">
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
.mod__body--full { display: grid; }
</style>

