<template>
  <div class="member-top">
    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="input-wrap">
        <img class="icon-search" :src="search1x" :srcset="search2x + ' 2x'" alt="搜索" draggable="false" />
        <input class="input" type="text" :placeholder="placeholder" :value="modelValue" @input="onInput" @keyup.enter="onSearch" />
      </div>
      <button class="btn" @click="onSearch">搜索</button>
    </div>

    <!-- KPI 卡片两列（使用提供的整图背景） -->
    <div class="kpi-row">
      <div class="card">
        <img class="card-bg" :src="leftBg1x" :srcset="leftBg2x + ' 2x'" alt="会员总数" draggable="false" />
        <div class="num">{{ fmt(leftValue) }}<span class="unit">名</span></div>
        <div class="label">{{ leftLabel }}</div>
      </div>
      <div class="card">
        <img class="card-bg" :src="rightBg1x" :srcset="rightBg2x + ' 2x'" alt="新就业形态劳动者" draggable="false" />
        <div class="num num--orange">{{ fmt(rightValue) }}<span class="unit">名</span></div>
        <div class="label">{{ rightLabel }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import search1x from '../../images/search/搜索.png';
import search2x from '../../images/search/搜索@2x.png';
import leftBg1x from '../../images/member-v2/1/编组 33.png';
import leftBg2x from '../../images/member-v2/1/编组 33@2x.png';
import rightBg1x from '../../images/member-v2/2/编组 40.png';
import rightBg2x from '../../images/member-v2/2/编组 40@2x.png';

interface Props {
  modelValue?: string;
  placeholder?: string;
  leftValue?: number; leftLabel?: string;
  rightValue?: number; rightLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入搜索内容',
  leftValue: 18897,
  leftLabel: '会员总数',
  rightValue: 48897,
  rightLabel: '新就业形态劳动者'
});

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void; (e: 'search', keyword: string): void }>();
function onInput(e: Event) { emit('update:modelValue', (e.target as HTMLInputElement).value); }
function onSearch() { emit('search', props.modelValue); }

function fmt(n?: number) { return (Number(n) || 0).toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.member-top { display: grid; grid-template-rows: auto 1fr; row-gap: 10px; height: 100%; }

.search-bar { display: grid; grid-template-columns: 1fr 140px; column-gap: 16px; align-items: center; }
.input-wrap { position: relative; }
.icon-search { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; object-fit: contain; pointer-events: none; user-select: none; }
.input { height: 44px; padding: 0 14px 0 44px; border-radius: 12px; border: 2px solid rgba(90,160,255,0.8); background: rgba(255,255,255,0.75); color: #2a6ff0; font-size: 16px; outline: none; }
.btn { height: 44px; border-radius: 12px; border: 2px solid rgba(90,160,255,0.9); background: rgba(255,255,255,0.9); color: #2a6ff0; font-weight: 800; font-size: 18px; cursor: pointer; }

.kpi-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; align-items: center; }
.card { position: relative; display: grid; place-items: center; height: 170px; }
.card-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
.num { position: relative; z-index: 1; font-size: 44px; font-weight: 900; color: #4E8FFF; letter-spacing: 1px; line-height: 1; }
.num--orange { color: #FE870B; }
.unit { margin-left: 6px; font-size: 20px; font-weight: 800; }
.label { position: relative; z-index: 1; margin-top: 8px; font-size: 16px; font-weight: 800; color: #2a6ff0; }
</style>

