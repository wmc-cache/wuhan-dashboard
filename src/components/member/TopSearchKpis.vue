<template>
  <div class="member-top">
    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="input-wrap">
        <img class="icon-search" :src="search1x" :srcset="search2x + ' 2x'" alt="搜索" draggable="false" />
        <input
          class="input"
          type="text"
          :placeholder="placeholder"
          :value="modelValue"
          @input="onInput"
          @keyup.enter="onSearch"
        />
      </div>
      <button class="btn" @click="onSearch">搜索</button>
    </div>

    <!-- KPI 卡片两列（整图背景，贴合设计稿） -->
    <div class="kpi-row">
      <div class="card card--left">
        <div class="num num--blue">
          {{ fmt(leftItem?.value) }}<span class="unit">名</span>
        </div>
        <div class="label">{{ leftItem?.title }}</div>
      </div>
      <div class="card card--right">
        <div class="num num--orange">
          {{ fmt(rightItem?.value) }}<span class="unit">名</span>
        </div>
        <div class="label">{{ rightItem?.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员页顶部：搜索 + KPI 双卡
// - 使用两张整图作为卡片背景（1x/2x）以贴合视觉稿
// - 接收 items[0], items[1] 作为左右两卡的数据源
import { computed } from 'vue';
import search1x from '../../images/search/搜索.png';
import search2x from '../../images/search/搜索@2x.png';

interface KItem { title: string; value: number | string }
interface Props {
  modelValue?: string;
  placeholder?: string;
  items?: KItem[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入搜索内容',
  items: () => ([
    { title: '会员总数', value: 18897 },
    { title: '新就业形态劳动者', value: 48897 }
  ])
});

const leftItem = computed(() => props.items?.[0]);
const rightItem = computed(() => props.items?.[1]);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'search', keyword: string): void;
}>();
function onInput(e: Event) { emit('update:modelValue', (e.target as HTMLInputElement).value); }
function onSearch() { emit('search', props.modelValue); }

function fmt(v?: number | string) {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString('zh-CN') : String(v ?? '');
}
</script>

<style scoped lang="scss">
.member-top { display: grid; grid-template-rows: auto 1fr; row-gap: 12px; height: 100%; }

/* 搜索条 */
.search-bar { display: grid; grid-template-columns: 600px 120px; column-gap: 16px; align-items: center; justify-self: center; }
.input-wrap { position: relative; display: grid; }
.icon-search { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; object-fit: contain; pointer-events: none; user-select: none; }
.input { height: 44px; padding: 0 14px 0 44px; border-radius: 12px; border: 2px solid rgba(90,160,255,0.8); background: rgba(255,255,255,0.75); color: #2a6ff0; font-size: 16px; outline: none; }
.input::placeholder { color: rgba(42,111,240,0.6); }
.btn { height: 44px; border-radius: 12px; border: 2px solid rgba(90,160,255,0.9); background: rgba(255,255,255,0.9); color: #2a6ff0; font-weight: 800; font-size: 18px; cursor: pointer; }

/* KPI 双卡 */
.kpi-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; align-items: center; }
.card {
  position: relative;
  height: 170px;
  display: grid;
  place-items: center;
  /* 使用整图背景，确保 1x/2x 清晰 */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-top: 6px;
  /* 提供可调的位移变量，便于按视觉稿微调 */
  --num-x: 40px;         /* 数字整体向右 */
  --num-y: -2px;         /* 数字纵向微调（略上提） */
  --label-x: 0px;        /* 标题水平微调 */
  --label-y: -18px;      /* 标题向上 */
}
.card--left {
  background-image: -webkit-image-set(url('../../images/member-v2/1/编组 33.png') 1x, url('../../images/member-v2/1/编组 33@2x.png') 2x);
  background-image: image-set(url('../../images/member-v2/1/编组 33.png') 1x, url('../../images/member-v2/1/编组 33@2x.png') 2x);
}
.card--right {
  background-image: -webkit-image-set(url('../../images/member-v2/2/编组 40.png') 1x, url('../../images/member-v2/2/编组 40@2x.png') 2x);
  background-image: image-set(url('../../images/member-v2/2/编组 40.png') 1x, url('../../images/member-v2/2/编组 40@2x.png') 2x);
}

.num {
  position: relative;
  z-index: 1;
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1;
  text-shadow: 0 6px 14px rgba(45,110,255,0.12);
  transform: translate(var(--num-x), var(--num-y));
}
.num--blue {
  /* 蓝色数值使用渐变以贴合设计 */
  background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 88%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.num--orange {
  background: linear-gradient(180deg, #FFB37F 0%, #FE870B 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 6px 14px rgba(255,140,20,0.18);
}
.unit { margin-left: 6px; font-size: 20px; font-weight: 800; }
.label { position: relative; z-index: 1; margin-top: 8px; font-size: 18px; font-weight: 800; color: #333; transform: translate(var(--label-x), var(--label-y)); white-space: nowrap; }

/* 左右卡片可以分别细调位移（如需不同距离） */
.card--left { --num-x: 64px; --num-y: -2px; --label-x: 40px; --label-y: -28px; }
.card--right { --num-x: 72px; --num-y: -2px; --label-x: 44px; --label-y: -28px; }

/* 按图整体下移 */
.kpi-row { margin-top: 76px; }
</style>
