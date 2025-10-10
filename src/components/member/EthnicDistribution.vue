<template>
  <div class="ethnic-distribution">
    <RingPie
      v-model:activeIndex="activeIndex"
      :data="minorItems"
      :center="seriesCenter"
      :radius="['48%', '72%']"
      gap-color="rgba(242,247,255,0.95)"
      :border-width="6"
      :emphasis-scale="18"
      enable-pagination
      :page-size="5"
      :initial-active-index="0"
    >
      <!-- 环中心：人物位图 -->
      <template #center>
        <img
          class="legend-img"
          :src="legend1x"
          :srcset="legend2x + ' 2x'"
          alt="民族分布图例"
          draggable="false"
        />
      </template>

      <!-- 右侧：自定义图例（含顶部概览） -->
      <template #legend="{ items: vis, activeIndex: ai, pageStart, setActive, formatNumber }">
        <!-- 概览：当前高亮民族 + 数量 + 占比 -->
        <div class="summary">
          <img class="summary__icon" :src="summaryIcon1x" :srcset="summaryIcon2x + ' 2x'" alt="" />
          <div class="summary__text">
            <div class="summary__name">{{ majorItem.name }}</div>
            <div class="summary__meta">{{ formatNumber(majorItem.value) }}人、{{ percentAll(majorItem.value) }}</div>
          </div>
        </div>

        <!-- 列表图例：名称 + 数量 + 占比 -->
        <ul class="legend" role="list">
          <li
            v-for="(it, idx) in vis"
            :key="it.name + idx"
            class="legend-item"
            :class="{ active: (pageStart + idx) === ai }"
            @mouseenter="setActive(pageStart + idx)"
          >
            <span class="dot" :style="{ backgroundColor: it.color }" aria-hidden="true"></span>
            <span class="label">{{ it.name }}</span>
            <span class="count">{{ formatNumber(it.value) }}、{{ percentAll(it.value) }}</span>
          </li>
        </ul>
      </template>
    </RingPie>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import RingPie from '../RingPie.vue';

// 中心位图（1x/2x）
import legend1x from '../../images/distribution-legend/位图.png';
import legend2x from '../../images/distribution-legend/位图@2x.png';

// 右侧概览处的小图标（复用现有素材）
import summaryIcon1x from '../../images/member-v2/2/编组 40.png';
import summaryIcon2x from '../../images/member-v2/2/编组 40@2x.png';

interface Item { name: string; value: number; color?: string }

interface Props { items?: Item[]; majorName?: string }

const props = withDefaults(defineProps<Props>(), {
  // 示例数据贴近设计稿：包含多项以触发翻页
  items: () => [
    { name: '汉族',     value: 865432, color: '#6F85FF' },
    { name: '回族',     value: 2345,   color: '#2a6ff0' },
    { name: '维吾尔族', value: 4788,   color: '#FFA640' },
    { name: '满族',     value: 23,     color: '#7A87DC' },
    { name: '傣族',     value: 21,     color: '#8C6BFF' },
    { name: '高山族',   value: 32,     color: '#D8D6D2' },
    { name: '苗族',     value: 21,     color: '#5EE0D2' },
    { name: '藏族',     value: 19,     color: '#6CD7FF' },
    { name: '蒙古族',   value: 18,     color: '#A7B1FF' },
    { name: '布依族',   value: 17,     color: '#7FC1FF' }
  ],
  majorName: '汉族'
});

const allItems = props.items; // 全部民族
const activeIndex = ref(0);   // 仅用于次要民族滚动/高亮

// 选出“主民族”（优先匹配名称；不存在时取最大值项）
const majorItem = computed<Item>(() => {
  const byName = allItems.find((i) => i.name === props.majorName);
  if (byName) return byName;
  return allItems.reduce((max, i) => (i.value > max.value ? i : max), allItems[0]);
});

// 次要民族 = 全部 - 主民族；用于环形图与右侧列表
const minorItems = computed<Item[]>(() => allItems.filter((i) => i !== majorItem.value));

// 总量用于百分比显示（图例显示“占总量”的占比，以贴合设计稿中小于 1% 的表现）
const totalAll = computed(() => allItems.reduce((s, i) => s + i.value, 0));

function percentAll(v: number) {
  const n = totalAll.value ? (v / totalAll.value) * 100 : 0;
  return `${Math.round(n)}%`;
}

// 调整环形图中心位置，让右侧有足够空间显示图例
const seriesCenter = ref<[string, string]>(['38%', '48%']);
</script>

<style scoped lang="scss">
.ethnic-distribution { position: relative; height: 100%; }

/* 中心图例大小根据容器高度适配，避免超出环形内径 */
.legend-img { width: 58px; height: auto; opacity: 0.95; user-select: none; }

/* 右侧概览（图标 + 文字） */
.summary {
  display: grid;
  grid-template-columns: 56px 1fr;
  column-gap: 12px;
  align-items: center;
  margin-bottom: 8px;
}
.summary__icon { width: 56px; height: 56px; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(90,160,255,0.25)); }
.summary__text { display: flex; align-items: baseline; column-gap: 12px; white-space: nowrap; }
.summary__name { font-size: 16 px; font-weight: 900; color: #2a6ff0; letter-spacing: 1px; }
.summary__meta { font-size: 16px; font-weight: 800; color: rgba(42,111,240,0.95); line-height: 1; }

/* 自定义图例样式，延续 RingPie 默认风格 */
.legend { list-style: none; padding: 0 6px 0 0; margin: 0; display: grid; row-gap: 12px; }
.legend-item { display: grid; grid-template-columns: 20px 1fr auto; align-items: center; column-gap: 8px; color: rgba(19,115,255,0.9); font-weight: 700; cursor: pointer; }
.legend-item .label { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.legend-item .count { font-size: 14px; opacity: 0.9; margin-left: 6px; justify-self: end; }
.legend-item.active .label { color: #2a6ff0; text-shadow: 0 0 10px rgba(88,151,255,0.2); }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; box-shadow: 0 0 0 3px rgba(255,255,255,0.6) inset; }

/* 让右侧列表靠上而非垂直居中，以贴近截图 */
:deep(.legend-content) { align-content: start; }
</style>
