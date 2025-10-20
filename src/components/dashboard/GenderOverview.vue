<template>
  <!-- 工会会员性别统计（右列中部模块） -->
  <div class="gender-part2">
    <!-- 背景整图（包含左右人物与中间圆形） -->
    <i class="bg" aria-hidden="true"></i>

    <!-- 覆盖在图片上的数字与文字（左右各一组） -->
    <div class="overlay">
      <div
        class="stat stat--male"
        role="button"
        tabindex="0"
        aria-label="查看男性会员列表"
        @click="onClick('male')"
        @keyup.enter.prevent="onClick('male')"
        @keyup.space.prevent="onClick('male')"
      >
        <div class="num">{{ pretty(maleCount) }}<span class="unit">人</span></div>
        <div class="label"><span  />男性会员</div>
      </div>

      <div
        class="stat stat--female"
        role="button"
        tabindex="0"
        aria-label="查看女性会员列表"
        @click="onClick('female')"
        @keyup.enter.prevent="onClick('female')"
        @keyup.space.prevent="onClick('female')"
      >
        <div class="num">{{ pretty(femaleCount) }}<span class="unit">人</span></div>
        <div class="label"><span  />女性会员</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  maleCount?: number;
  femaleCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maleCount: 532,
  femaleCount: 5132,
});
// NOTE: 使用 computed 包装 props，保持对父组件更新的响应
import { computed } from 'vue';
const emit = defineEmits<{ (e: 'gender-click', payload: 'male' | 'female'): void }>();

const maleCount = computed(() => props.maleCount);
const femaleCount = computed(() => props.femaleCount);

function pretty(n?: number) {
  if (typeof n !== 'number') return '-';
  return n.toLocaleString('zh-CN');
}

function onClick(type: 'male' | 'female') {
  emit('gender-click', type);
}
</script>

<style scoped lang="scss">
.gender-part2 {
  position: relative;
  height: 171px;
   width: 477px;
   margin: 0 auto;
  display: grid; /* 为了让覆盖元素更容易居中对齐 */
}

/* 背景整图（自适应 1x/2x） */
.bg {
  position: absolute; inset: 0; z-index: -1; display: block;
  background-repeat: no-repeat; background-size: 100% 100%;
  background-image: -webkit-image-set(
    url('../../images/dashboard/part2/编组 20.png') 1x,
    url('../../images/dashboard/part2/编组 20@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/dashboard/part2/编组 20.png') 1x,
    url('../../images/dashboard/part2/编组 20@2x.png') 2x
  );
}
.overlay {
  --center-col: 20%; /* 中央圆形大致占比，可按视觉微调 */
  position: absolute; inset: 0;
  display: grid;
  grid-template-columns: 1fr var(--center-col) 1fr;
  align-items: center;
}

.stat { text-align: center; display: grid; justify-items: center; cursor: pointer; outline: none; }
.stat--male { grid-column: 1; color: #2a6ff0; }
.stat--female { grid-column: 3; color: #FFA36B; }

.stat:focus-visible {
  box-shadow: 0 0 0 3px rgba(42, 111, 240, 0.45);
  border-radius: 12px;
}

.num {
  font-size: 25px;
  font-weight: 900;
  line-height: 1;
}
.unit { font-size: 12px; margin-left: 6px; font-weight: 700; opacity: .9; }

.label { margin-top: 6px; font-size: 14px; font-weight: 800; display: inline-flex; align-items: center; gap: 8px; }
.bullet { width: 12px; height: 12px; border-radius: 3px; border: 2px solid currentColor; box-sizing: border-box; }
.bullet--blue { color: #2a6ff0; }
.bullet--orange { color: #FFA36B; }
</style>
