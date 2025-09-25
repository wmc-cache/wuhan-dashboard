<template>
  <div class="member-type">
    <!-- 环形图 + 图例 + 翻页箭头 -->
    <RingPie
      :data="items"
      :center="seriesCenter"
      :radius="['48%', '72%']"
      gap-color="rgba(242,247,255,0.95)"
      :border-width="6"
      :emphasis-scale="20"
      enable-pagination
      :page-size="6"
      :initial-active-index="startIndex"
      v-model:activeIndex="activeIndex"
      @active-change="onActiveChange"
    >
      <template #center>
        <div class="num">{{ active.value }}</div>
        <div class="name">{{ active.name }}</div>
      </template>
    </RingPie>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import RingPie from '../RingPie.vue';

interface Item { name: string; value: number; color?: string }

interface Props { items?: Item[]; startIndex?: number; pageSize?: number }

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { name: '快递员', value: 743925, color: '#C9D2FF' },
    { name: '物流货运司机', value: 5454, color: '#506EFF' },
    { name: '外卖配送员', value: 787843, color: '#5EE0D2' },
    { name: '网约车司机', value: 5436436, color: '#6F85FF' },
    { name: '物业保安', value: 432432, color: '#8D63FF' },
    { name: '其他', value: 425, color: '#D8D6D2' }
  ],
  startIndex: 1,
  pageSize: 6
});

const activeIndex = ref(props.startIndex);
const items = reactive(props.items);

const active = computed(() => items[activeIndex.value] ?? items[0]);

function onActiveChange(_item: Item, _index: number) {
  // 可以在这里添加额外的激活变化处理逻辑
}

const seriesCenter = ref<[string, string]>(['38%', '52%']);
</script>

<style scoped lang="scss">
.member-type {
  position: relative;
  height: 100%;
}

.num { font-size: 42px; font-weight: 800; color: #3e74ff; }
.name { font-size: 16px; color: #2a6ff0; font-weight: 700; }
</style>

