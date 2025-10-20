<template>
  <div class="ethnic-distribution">
    <RingPie
      v-model:activeIndex="activeIndex"
      :data="minorItems"
      :center="seriesCenter"
      :radius="['48%', '72%']"
      gap-color="transparent"
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
      <!-- 使用具名对象接收插槽参数，避免“未定义”告警 -->
      <template #legend="sp">
        <!-- 概览：当前高亮民族 + 数量 + 占比 -->
        <div class="summary">
          <img class="summary__icon" :src="summaryIcon1x" :srcset="summaryIcon2x + ' 2x'" alt="" />
          <div class="summary__text">
            <div class="summary__name">{{ majorItem.name }}</div>
            <div class="summary__meta">{{ formatCount(majorItem.value) }}、{{ percentText(majorItem) }}</div>
          </div>
        </div>

        <!-- 列表图例：名称 + 数量 + 占比 -->
        <ul class="legend" role="list">
          <li
            v-for="(it, idx) in sp.items"
            :key="(it?.name || '') + idx"
            class="legend-item"
            :class="{ active: (sp.pageStart + idx) === sp.activeIndex }"
            @mouseenter="sp.setActive(sp.pageStart + idx)"
          >
            <span class="dot" :style="{ backgroundColor: it?.color }" aria-hidden="true"></span>
            <span class="label">{{ it?.name }}</span>
            <span class="count">{{ formatCount(it?.value || 0) }}、{{ percentText(it as any) }}</span>
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

// 右侧概览处的小图标（替换为 member-v2/icon 目录下的新图标）
import summaryIcon1x from '../../images/member-v2/icon/位图.png';
import summaryIcon2x from '../../images/member-v2/icon/位图@2x.png';

interface Item { name: string; value: number; region?: string; color?: string }
interface Props { items?: Item[]; majorName?: string }

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  majorName: '汉族'
});

// 使用 computed 包装 props.items，避免初始为空时引用错误，并保持响应性
const allItems = computed<Item[]>(() => Array.isArray(props.items) ? props.items : []);
const activeIndex = ref(0); // 用于环图高亮

// 主民族：优先名称匹配；无数据时提供占位
const majorItem = computed<Item>(() => {
  const list = allItems.value;
  if (!list.length) return { name: '—', value: 0 };
  const byName = list.find((i) => String(i?.name || '').trim() === props.majorName);
  if (byName) return byName;
  return list.reduce((max, i) => (i.value > max.value ? i : max), list[0]);
});

// 次要民族 = 全部 - 主民族
const minorItems = computed<Item[]>(() => allItems.value.filter((i) => i !== majorItem.value));

// 占比计算：对总量安全处理
const totalAll = computed(() => allItems.value.reduce((s, i) => s + (i?.value || 0), 0));

function percentAll(v: number) {
  const n = totalAll.value ? (v / totalAll.value) * 100 : 0;
  return `${Math.round(n)}%`;
}

// 展示百分比：优先采用后端提供的 region 文案；无则回退到按总量计算
function percentText(item?: Item | null) {
  if (!item) return '0%';
  const r: any = (item as any).region;
  if (r != null && String(r).trim() !== '') return String(r).trim();
  return percentAll(item.value);
}

// 调整环形图中心位置，让右侧有足够空间显示图例
const seriesCenter = ref<[string, string]>(['38%', '48%']);

function formatCount(value?: number) {
  const num = Number(value) || 0;
  if (num >= 1_000_000) {
    const wan = num / 10000;
    const digits = wan >= 100 ? 0 : wan >= 10 ? 1 : 2;
    return `${wan.toLocaleString('zh-CN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })}万人`;
  }
  return `${num.toLocaleString('zh-CN')}人`;
}
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
.summary__name { font-size: 16px; font-weight: 900; color: #2a6ff0; letter-spacing: 1px; }
.summary__meta { font-size: 14px; font-weight: 800; color: rgba(42,111,240,0.95); line-height: 1; }

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
