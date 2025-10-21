<template>
  <div class="org-total">
    <!-- 左侧：3D 漏斗 + 总数（还原参考图：18,897 人 + 下方标题） -->
    <div
      class="org-total__left"
      role="button"
      tabindex="0"
      aria-label="查看帮扶职工列表"
      @click="handleTotalClick"
      @keyup.enter.prevent="handleTotalClick"
      @keyup.space.prevent="handleTotalClick"
    >
      <div class="cone">
        <i class="cone__img" aria-hidden="true"></i>
        <div class="cone__num">
          <CountUpNumber
            :value="total"
            unit="人"
            unit-class="cone__unit"
            :duration="1500"
          />
        </div>

      </div>
      <!-- 标题改为切图（src/images/dashboard/part4/帮扶职工总数[ @2x].png） -->
      <i class="cone__label-img" aria-hidden="true"></i>
    </div>

    <!-- 右侧：困难类型三项（蓝/绿/橙，与参考图一致） -->
    <ul class="org-total__list" role="list">
      <li
        class="list-item list-item--blue"
        role="button"
        tabindex="0"
        aria-label="查看深度困难列表"
        @click="handleTypeClick('深度困难')"
        @keyup.enter.prevent="handleTypeClick('深度困难')"
        @keyup.space.prevent="handleTypeClick('深度困难')"
      >
        <i class="list-item__bg" aria-hidden="true"></i>
        <span class="dot dot--blue" aria-hidden="true"></span>
        <span class="label">深度困难</span>
        <span class="value value--blue">
          <CountUpNumber
            :value="deep"
            unit="人"
            :duration="1500"
          />
        </span>
      </li>
      <li
        class="list-item list-item--green"
        role="button"
        tabindex="0"
        aria-label="查看相对困难列表"
        @click="handleTypeClick('相对困难')"
        @keyup.enter.prevent="handleTypeClick('相对困难')"
        @keyup.space.prevent="handleTypeClick('相对困难')"
      >
        <i class="list-item__bg" aria-hidden="true"></i>
        <span class="dot dot--green" aria-hidden="true"></span>
        <span class="label">相对困难</span>
        <span class="value value--green">
          <CountUpNumber
            :value="relative"
            unit="人"
            :duration="1500"
          />
        </span>
      </li>
      <li
        class="list-item list-item--orange"
        role="button"
        tabindex="0"
        aria-label="查看意外致困列表"
        @click="handleTypeClick('意外致困')"
        @keyup.enter.prevent="handleTypeClick('意外致困')"
        @keyup.space.prevent="handleTypeClick('意外致困')"
      >
        <i class="list-item__bg" aria-hidden="true"></i>
        <span class="dot dot--orange" aria-hidden="true"></span>
        <span class="label">意外致困</span>
        <span class="value value--orange">
          <CountUpNumber
            :value="accident"
            unit="人"
            :duration="1500"
          />
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';

interface Props {
  total?: number; // 帮扶职工总数
  deep?: number; // 深度困难人数
  relative?: number; // 相对困难人数
  accident?: number; // 意外致困人数
}
const props = withDefaults(defineProps<Props>(), {
  total: 0,
  deep: 0,
  relative: 0,
  accident: 0,
});
const emit = defineEmits<{
  (e: 'total-click'): void;
  (e: 'type-click', type: string): void;
}>();

// 保持对父组件数据更新的响应（避免解构 props 造成的失去响应性）
const total = computed(() => props.total);
const deep = computed(() => props.deep);
const relative = computed(() => props.relative);
const accident = computed(() => props.accident);

function formatNumber(n: number | undefined): string {
  const v = typeof n === 'number' ? n : 0;
  return v.toLocaleString('zh-CN');
}

function handleTotalClick() {
  emit('total-click');
}

function handleTypeClick(type: string) {
  emit('type-click', type);
}
</script>

<style scoped lang="scss">
.org-total {
  height: 100%;
  display: grid;
  grid-template-columns: 240px 263px;
  /* 左侧圆锥 + 右侧列表 */
  gap: 24px;
  align-items: center;
}

/* 左侧圆锥与数字 */
.org-total__left {
  display: grid;
  justify-items: center;
  align-content: start;
  row-gap: 6px;
  cursor: pointer;
  user-select: none;
}

.cone {
  position: relative;
  width: 160px;
  height: 150px;
  display: grid;
  place-items: center;
}

.cone__img {
  display: block;
  width: 123px;
  height: 147px;
  /* 1x 尺寸 */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../../images/org-total/3D圆锥/编组 11.png') 1x,
      url('../../images/org-total/3D圆锥/编组 11@2x.png') 2x);
  background-image: image-set(url('../../images/org-total/3D圆锥/编组 11.png') 1x,
      url('../../images/org-total/3D圆锥/编组 11@2x.png') 2x);
}

.cone__num {
  white-space: nowrap;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-40%);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(180deg, #4a93ff 0%, #2a6ff0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 8px rgba(38, 112, 255, 0.35);
}

.cone__unit {
  font-size: 16px;
  color: #2a6ff0;
}
/* 标题切图（替换文字） */
.cone__label-img {
  display: inline-block;
  width: 133px;  /* 1x 尺寸 */
  height: 19px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../../images/dashboard/part4/帮扶职工总数.png') 1x,
    url('../../images/dashboard/part4/帮扶职工总数@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part4/帮扶职工总数.png') 1x,
    url('../../images/dashboard/part4/帮扶职工总数@2x.png') 2x);
}

/* 右侧三项卡片 */
.org-total__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 16px;
}

.list-item {
  position: relative;
  height: 47px;
  display: grid;
  grid-template-columns: 28px auto 1fr;
  align-items: center;
  padding: 0 16px 0 52px;
  cursor: pointer;
  user-select: none;
}

.list-item__bg {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  opacity: 0.95;
  background-image: -webkit-image-set(url('../../images/org-total/矩形背景/矩形.png') 1x,
      url('../../images/org-total/矩形背景/矩形@2x.png') 2x);
  background-image: image-set(url('../../images/org-total/矩形背景/矩形.png') 1x,
      url('../../images/org-total/矩形背景/矩形@2x.png') 2x);
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 12px;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25) inset;
}

.dot--green {
  background-color: #2ecc71;
}

.dot--orange {
  background-color: #ffaf2e;
}

.dot--blue {
  background-color: #2e7bff;
}

.label {
  font-size: 16px;
  color: #333;
  letter-spacing: 1px;
}

.list-item--green .label {  }
.list-item--orange .label {  }
.list-item--blue .label {  }

.value {
  margin-left: auto;
  font-size: 22px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.value small {
  font-size: 60%;
  opacity: 0.9;
  margin-left: 2px;
}

.value--green {
  color: #25c56b;
}

.value--orange {
  color: #ff9a1a;
}

.value--blue {
  color: #2c6eff;
}

.arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-right: 3px solid currentColor;
  border-top: 3px solid currentColor;
  transform: rotate(-45deg);
  margin-left: 2px;
}

</style>
