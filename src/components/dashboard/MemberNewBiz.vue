<template>
  <div class="member-new-biz">
    <!-- 环形图 + 图例 + 翻页箭头 -->
    <RingPie
      :data="items"
      :center="seriesCenter"
      :radius="['48%', '72%']"
      gap-color="transparent"
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

interface BizItem {
  name: string;
  value: number;
  color?: string;
}

interface Props {
  items?: BizItem[];
  startIndex?: number; // 初始高亮/中心项
  pageSize?: number; // 图例分页大小
}

const props = withDefaults(defineProps<Props>(), {
  // 默认数据仅用于开发占位，可按接口替换
  items: () => [
    { name: '快递员', value: 92, color: '#C9D2FF' },
    { name: '物流货运司机', value: 125, color: '#506EFF' },
    { name: '外卖配送员', value: 78, color: '#5EE0D2' },
    { name: '网约车司机', value: 136, color: '#6F85FF' },
    { name: '物业保安', value: 86, color: '#8D63FF' },
    { name: '其他', value: 42, color: '#D8D6D2' },
    // 追加若干条用于分页联调
    { name: '保洁员', value: 68, color: '#B7C4FF' },
    { name: '代驾', value: 54, color: '#77C8FF' },
    { name: '商超理货员', value: 61, color: '#6FD9C9' },
    { name: '直播电商', value: 70, color: '#9A8CFF' },
    { name: '货拉拉司机', value: 80, color: '#5AA0FF' },
    { name: '维修技工', value: 66, color: '#9CC8FF' }
  ],
  startIndex: 1,
  pageSize: 6
});

const activeIndex = ref(props.startIndex);
const items = reactive(props.items);

const active = computed(() => items[activeIndex.value] ?? items[0]);

function onActiveChange(_item: BizItem, _index: number) {
  // 可以在这里添加额外的激活变化处理逻辑
}

// 图表中心位置（与 RingPie 同步）
const seriesCenter = ref<[string, string]>(['38%', '52%']);
</script>

<style scoped lang="scss">
.member-new-biz {
  position: relative;
  height: 100%;
}

.num {
  font-size: 26px; /* 中心数字略调小，避免过分抢眼 */
  font-weight: 800;
  color: #3e74ff;
}
.name {
  font-size: 16px;
  color: #2a6ff0;
  font-weight: 700;
}
</style>
