<template>
  <div class="nice-select" ref="wrap" :style="{ width: width + 'px' }">
    <button type="button" class="trigger" @click="toggle" :aria-expanded="open">
      <span class="label">{{ format(modelValue) }}</span>
      <!-- <i class="caret"></i> -->
    </button>
    <ul v-if="open" class="menu" role="listbox">
      <li
        v-for="opt in options"
        :key="String(opt)"
        class="item"
        :class="{ active: isActive(opt) }"
        role="option"
        @click="select(opt)"
      >
        {{ format(opt) }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Props<T = any> {
  modelValue: T;
  options: T[];
  width?: number; // px
  formatter?: (v: T) => string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 120,
  formatter: (v: any) => String(v)
});

const emit = defineEmits<{ 'update:modelValue': [any] }>();
const open = ref(false);
const wrap = ref<HTMLElement | null>(null);

function toggle() { open.value = !open.value; }
function select(v: any) { emit('update:modelValue', v); open.value = false; }
function isActive(v: any) { return v === props.modelValue; }
function onDocClick(e: MouseEvent) {
  if (!wrap.value) return;
  if (!wrap.value.contains(e.target as Node)) open.value = false;
}
onMounted(() => document.addEventListener('mousedown', onDocClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));

function format(v: any) { return props.formatter ? props.formatter(v) : String(v); }
</script>

<style scoped lang="scss">
.nice-select { position: relative; }
.trigger {
  width: 100%;
  height: 34px;
  padding: 0 34px 0 14px;
  border: 1px solid rgba(44,120,255,0.55);
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(240,246,255,0.98), rgba(230,242,255,0.92));
  color: #1b59c8; font-weight: 800; letter-spacing: .5px;
  box-shadow: 0 2px 0 rgba(62,126,255,0.18) inset, 0 6px 12px rgba(40,100,200,0.08);
  display: grid; grid-template-columns: 1fr 12px; align-items: center; cursor: pointer;
}
.trigger .label { justify-self: start; }
.trigger .caret {
  width: 0; height: 0; justify-self: end;
  border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #2a6ff0;
}

.menu {
  position: absolute; left: 0; top: calc(100% + 8px);
  width: 100%; padding: 6px 0; margin: 0; list-style: none;
  border-radius: 10px; border: 1px solid rgba(120,160,255,0.35);
  background: rgba(250,252,255,0.98);
  box-shadow: 0 12px 24px rgba(70,130,255,0.18), 0 2px 0 rgba(255,255,255,0.9) inset;
  z-index: 10;
}
.item { padding: 8px 12px; color: #1a4fb3; font-weight: 800; cursor: pointer; }
.item:hover { background: rgba(120,170,255,0.12); }
.item.active { color: #0c3a9a; background: rgba(120,170,255,0.2); }
</style>

