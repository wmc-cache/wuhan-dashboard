<template>
  <div class="org-search-kpis">
    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="input-wrap">
        <input class="input" type="text" :placeholder="placeholder" :value="modelValue" @input="onInput"
          @keyup.enter="onSearch" />
      </div>
      <button class="btn" @click="onSearch">搜索</button>
    </div>

    <!-- 指标卡三列 -->
    <div class="kpi-row">
      <div v-for="(it, i) in items" :key="i" class="kpi-card card-bg">

        <div>
          <img class="icon" :src="it.icon1x" :srcset="it.icon2x + ' 2x'" :alt="it.title" draggable="false" />
        </div>
        <div class="num">{{ fmt(it.value) }}</div>
        <div class="title">{{ it.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bg1x from '../../images/org/bg/编组 8.png';
import bg2x from '../../images/org/bg/编组 8@2x.png';
import icon31x from '../../images/org/title3/位图.png';
import icon32x from '../../images/org/title3/位图@2x.png';
import icon41x from '../../images/org/title4/位图.png';
import icon42x from '../../images/org/title4/位图@2x.png';
import icon51x from '../../images/org/title5/位图.png';
import icon52x from '../../images/org/title5/位图@2x.png';

interface KItem { title: string; value: number | string; icon1x: string; icon2x: string }
interface Props {
  modelValue?: string;
  placeholder?: string;
  items?: KItem[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入搜索内容',
  items: () => [
    { title: '市总工会', value: 1,   icon1x: icon31x, icon2x: icon32x },
    { title: '各区总工会、产业和大型企业单位工会', value: 821, icon1x: icon41x, icon2x: icon42x },
    { title: '街道工会', value: 78,  icon1x: icon51x, icon2x: icon52x }
  ]
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'search', keyword: string): void;
}>();

function onInput(e: Event) { emit('update:modelValue', (e.target as HTMLInputElement).value); }
function onSearch() { emit('search', props.modelValue); }

function fmt(v: number | string) { const n = Number(v); return Number.isFinite(n) ? n.toLocaleString('zh-CN') : String(v); }
</script>

<style scoped lang="scss">
.org-search-kpis { position: relative; height: 100%; display: grid; grid-template-rows: auto 1fr; row-gap: 12px; }

/* 搜索条 */
.search-bar { display: grid; grid-template-columns: 1fr 140px; column-gap: 16px; align-items: center; }
.input { height: 44px; padding: 0 14px; border-radius: 12px; border: 2px solid rgba(90,160,255,0.8); background: rgba(255,255,255,0.8); color: #2a6ff0; font-size: 16px; outline: none; }
.input::placeholder { color: rgba(42,111,240,0.6); }
.btn { height: 44px; border-radius: 12px; border: 2px solid rgba(90,160,255,0.9); background: rgba(255,255,255,0.95); color: #2a6ff0; font-weight: 800; font-size: 18px; cursor: pointer; }

/* KPI 卡片 */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: end;
  column-gap: 14px;
}
.kpi-card { display: grid; grid-template-rows: auto 1fr auto; justify-items: center; row-gap: 8px; }
.num {
  font-size: 36px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 4px 8px rgba(30, 100, 220, 0.18);
}

.card-bg {
  width: 182px;
  height: 175px;
  background-image: -webkit-image-set(url('../../images/org/bg/编组 8.png') 1x, url('../../images/org/bg/编组 8@2x.png') 2x);
  background-image: image-set(url('../../images/org/bg/编组 8.png') 1x, url('../../images/org/bg/编组 8@2x.png') 2x);
  background-size: 100% 100%;
  display: grid;
  place-items: center;
  padding: 8px;
}

.icon {
  width: 60px;
  height: auto;
}
.title { font-size: 14px; color: #2a6ff0; font-weight: 800; text-align: center; }


</style>

