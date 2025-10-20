<template>
  <div class="top-search">
    <!-- 主输入框（包含左侧分类、放大镜、输入框） -->
    <div class="field" @keyup.enter="fireSearch">
      <button class="cat" type="button" @click="toggleCats" :aria-expanded="open ? 'true' : 'false'">
        <span class="cat__label">{{ activeLabel }}</span>
        <i class="cat__caret" aria-hidden="true" />
      </button>
      <span class="sep" aria-hidden="true" />
      <div class="input-wrap">
        <img class="icon-search" :src="search1x" :srcset="search2x + ' 2x'" alt="" />
        <input class="input" type="text" :placeholder="inputPlaceholder" :value="modelValue" @input="onInput" />
      </div>

      <!-- 下拉列表 -->
      <div v-if="open" class="cat-menu" role="menu">
        <button
          v-for="c in categories"
          :key="c.value"
          class="cat-item"
          role="menuitemradio"
          :aria-checked="c.value === category ? 'true' : 'false'"
          @click="pick(c.value)"
        >{{ c.label }}</button>
      </div>
    </div>

    <!-- 右侧搜索按钮 -->
    <button class="btn" type="button" @click="fireSearch">搜索</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import search1x from '../images/search/搜索.png';
import search2x from '../images/search/搜索@2x.png';

export interface CategoryOption { label: string; value: string }

interface Props {
  modelValue?: string;
  category?: string;
  categories?: CategoryOption[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  category: 'org',
  placeholder: '请输入搜索内容',
  categories: () => [
    { label: '工会组织', value: 'org' },
    { label: '工会会员', value: 'member' }
  ]
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'update:category', v: string): void;
  (e: 'search', payload: { keyword: string; category: string }): void;
}>();

const open = ref(false);
const activeLabel = computed(() => props.categories.find(c => c.value === props.category)?.label ?? '');
const inputPlaceholder = computed(() =>
  props.category === 'member' ? '请输入会员姓名' : props.placeholder
);

function onInput(e: Event) { emit('update:modelValue', (e.target as HTMLInputElement).value); }
function pick(v: string) { emit('update:category', v); open.value = false; }
function toggleCats() { open.value = !open.value; }
function fireSearch() { emit('search', { keyword: props.modelValue, category: props.category }); }

function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return;
  if (!t.closest('.top-search')) open.value = false;
}
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<style scoped lang="scss">
/* 顶部搜索：尽量还原截图视觉（圆角描边、浅底、外发光、内含分类与放大镜） */
.top-search {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 14px;
}

.field {
  position: relative;
  height: 48px;
  border-radius: 12px;
  border: 2px solid rgba(90, 160, 255, .9);
  background: rgba(255, 255, 255, .96);
  box-shadow: 0 4px 18px rgba(30, 100, 220, 0.12), inset 0 0 20px rgba(120, 170, 255, .06);
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  padding: 0 14px 0 0;
}

.cat {
  margin: 0;
  height: 100%;
  padding: 0 14px 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2a6ff0;
  font-weight: 800;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.cat__label { white-space: nowrap; }
.cat__caret { width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #6fa2ff; display: inline-block; }

.sep { width: 1px; height: 24px; background: linear-gradient(180deg, rgba(90,160,255,.5), rgba(90,160,255,.15)); border-radius: 1px; }

.input-wrap { position: relative; display: grid; align-items: center; }
.icon-search { position: absolute; left: 12px; width: 22px; height: 22px; user-select: none; pointer-events: none; }
.input {
  width: 100%;
  height: 100%;
  padding-left: 42px; /* 给放大镜留白 */
  padding-right: 8px;
  border: 0;
  outline: none;
  background: transparent;
  color: #2a6ff0;
  font-size: 16px;
}
.input::placeholder { color: rgba(42, 111, 240, .6); }

.cat-menu {
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 8px;
  min-width: 160px;
  background: rgba(255,255,255,.96);
  border: 1px solid rgba(120, 170, 255, .35);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 6px 20px rgba(20,80,200,.18);
  backdrop-filter: blur(6px);
  z-index: 10;
}
.cat-item { display: block; width: 100%; text-align: left; padding: 10px 12px; border-radius: 6px; color: #2a6ff0; font-weight: 800; background: transparent; border: 0; cursor: pointer; }
.cat-item:hover { background: rgba(88,151,255,.1); }

.btn {
  height: 48px;
  padding: 0 22px;
  border-radius: 12px;
  border: 2px solid rgba(90, 160, 255, .9);
  background: rgba(255, 255, 255, .96);
  color: #2a6ff0;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(30, 100, 220, 0.12), inset 0 0 20px rgba(120, 170, 255, .06);
}


</style>
