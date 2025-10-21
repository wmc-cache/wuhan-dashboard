<template>
  <div class="kpi-pair">
    <div
      class="card card--left"
      :class="[leftBgClass, leftClickable ? 'is-clickable' : '']"
      :role="leftClickable ? 'button' : undefined"
      :tabindex="leftClickable ? 0 : undefined"
      @click="onLeftClick"
      @keyup.enter.prevent="onLeftClick"
      @keyup.space.prevent="onLeftClick"
    >
      <div class="num" :class="leftGradient">
        <CountUpNumber
          :value="items[0]?.value"
          :unit="items[0]?.unit"
          unit-class="unit"
          :duration="1500"
          :decimal-places="getDecimalPlaces(items[0]?.value)"
        />
      </div>
      <div class="label" style="margin-left: 5px;">{{ items[0]?.title }}</div>
    </div>
    <div
      class="card card--right"
      :class="[rightBgClass, rightClickable ? 'is-clickable' : '']"
      :role="rightClickable ? 'button' : undefined"
      :tabindex="rightClickable ? 0 : undefined"
      @click="onRightClick"
      @keyup.enter.prevent="onRightClick"
      @keyup.space.prevent="onRightClick"
    >
      <div class="num" :class="rightGradient">
        <CountUpNumber
          :value="items[1]?.value"
          :unit="items[1]?.unit"
          unit-class="unit"
          :duration="1500"
          :decimal-places="getDecimalPlaces(items[1]?.value)"
        />
      </div>
      <div class="label">{{ items[1]?.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';
// 首页顶部双 KPI 卡片（与 Member/TopSearchKpis 的卡面视觉一致，不含搜索）
interface KItem { title: string; value: number | string; unit?: string }
type BgKey = 'member-1' | 'member-2' | 'top-1' | 'top-2' | 'top-3' | 'top-4'
interface Props {
  items?: [KItem, KItem];
  leftBg?: BgKey;
  rightBg?: BgKey;
  leftClickable?: boolean;
  rightClickable?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { title: '工会总数(个)', value: 18897, unit: '' },
    { title: '本年度新增工会(个)', value: 12597, unit: '' }
  ]),
  leftBg: 'member-1',
  rightBg: 'member-2',
  leftClickable: false,
  rightClickable: false,
});

const emit = defineEmits<{
  (e: 'left-click'): void;
  (e: 'right-click'): void;
}>();

function fmt(v?: number | string) {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString('zh-CN') : String(v ?? '');
}

// 渐变类名，便于左右分别控制颜色（蓝/橙）
const leftGradient = 'num--blue';
const rightGradient = 'num--orange';

const leftBgClass = computed(() => `bg-${props.leftBg}`);
const rightBgClass = computed(() => `bg-${props.rightBg}`);

function onLeftClick() {
  if (!props.leftClickable) return;
  emit('left-click');
}
function onRightClick() {
  if (!props.rightClickable) return;
  emit('right-click');
}

// 自动检测数值的小数位数
function getDecimalPlaces(value?: number | string): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;

  // 检查是否有小数部分
  const str = String(num);
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) return 0;

  // 返回小数位数
  return str.length - decimalIndex - 1;
}
</script>

.style-debug { outline: 1px dashed transparent; }

<style scoped lang="scss">
/* 容器：顶部对齐、留少量上边距使其靠近导航条 */
.kpi-pair { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; align-items: start; height: 100%; padding-top: 6px; }

/* 卡片整图背景（沿用 member-v2 资源） */
.card {
  position: relative;
  height: 133px; /* 高度固定 133px */
  aspect-ratio: 299 / 133; /* 按 299x133 的比例渲染背景 */
  display: grid;
  justify-items: start; /* 文案统一以左对齐，避免视觉漂移 */
  align-content: center;
  row-gap: 6px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-left: 105px; /* 数字与标题整体右移 */
}
.card.is-clickable {
  cursor: pointer;
  outline: none;
}
.card.is-clickable:focus-visible {
  box-shadow: 0 0 0 3px rgba(80, 140, 255, 0.45);
  border-radius: 18px;
}
/* 背景切图主题：默认 member-v2，也支持 dashboard/top 的四张（从左到右：1-4） */
.bg-member-1 {
  background-image: -webkit-image-set(url('../../images/member-v2/1/编组 33.png') 1x, url('../../images/member-v2/1/编组 33@2x.png') 2x);
  background-image: image-set(url('../../images/member-v2/1/编组 33.png') 1x, url('../../images/member-v2/1/编组 33@2x.png') 2x);
}
.bg-member-2 {
  background-image: -webkit-image-set(url('../../images/member-v2/2/编组 40.png') 1x, url('../../images/member-v2/2/编组 40@2x.png') 2x);
  background-image: image-set(url('../../images/member-v2/2/编组 40.png') 1x, url('../../images/member-v2/2/编组 40@2x.png') 2x);
}
.bg-top-1 {
  background-image: -webkit-image-set(url('../../images/dashboard/top/1/编组 33.png') 1x, url('../../images/dashboard/top/1/编组 33@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/top/1/编组 33.png') 1x, url('../../images/dashboard/top/1/编组 33@2x.png') 2x);
}
.bg-top-2 {
  background-image: -webkit-image-set(url('../../images/dashboard/top/2/编组 38.png') 1x, url('../../images/dashboard/top/2/编组 38@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/top/2/编组 38.png') 1x, url('../../images/dashboard/top/2/编组 38@2x.png') 2x);
}
.bg-top-3 {
  background-image: -webkit-image-set(url('../../images/dashboard/top/3/编组 40.png') 1x, url('../../images/dashboard/top/3/编组 40@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/top/3/编组 40.png') 1x, url('../../images/dashboard/top/3/编组 40@2x.png') 2x);
}
.bg-top-4 {
  background-image: -webkit-image-set(url('../../images/dashboard/top/4/编组 39.png') 1x, url('../../images/dashboard/top/4/编组 39@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/top/4/编组 39.png') 1x, url('../../images/dashboard/top/4/编组 39@2x.png') 2x);
}

.num { position: relative; z-index: 1; font-size: 36px; font-weight: 900; letter-spacing: 1px; line-height: 1; text-shadow: 0 6px 14px rgba(45,110,255,0.12); white-space: nowrap;
 margin-top: -20px;
 
}
.num--blue { background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 88%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.num--orange { background: linear-gradient(180deg, #FFB37F 0%, #FE870B 90%); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 6px 14px rgba(255,140,20,0.18); }
.unit { margin-left: 6px; font-size: 20px; font-weight: 800; }
.label { position: relative; z-index: 1; margin-top: 4px; margin-left: -10px;font-size: 16px; font-weight: 800; color: #333; white-space: nowrap; }

</style>
