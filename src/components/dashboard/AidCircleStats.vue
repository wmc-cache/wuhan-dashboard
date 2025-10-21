<template>
  <!-- 底部右侧：环形 + 四角指标卡（如图模块） -->
  <div class="aid-circle" :style="rootStyle">
    <!-- 整块使用一张切图做背景，文字覆盖其上 -->
    <i class="bg" aria-hidden="true"></i>

    <!-- 六组指标（左 3 + 右 3） 若仅传 4 项，也支持四角布局 -->
    <div class="overlay" :class="{ 'overlay--six': items.length >= 6 }" :style="overlayVars">
      <!-- 左上/右上/左中/右中/左下/右下 -->
      <div v-if="items[0]" class="stat stat--l1">
        <div class="num">
          <CountUpNumber :value="items[0].value" :unit="items[0].unit" unit-class="unit" :duration="1500" />
        </div>
        <div class="label">{{ items[0].label }}</div>
      </div>
      <div v-if="items[1]" class="stat stat--r1">
        <div class="num">
          <CountUpNumber :value="items[1].value" :unit="items[1].unit" unit-class="unit" :duration="1500" />
        </div>
        <div class="label">{{ items[1].label }}</div>
      </div>
      <div v-if="items[2]" class="stat stat--l2">
        <div class="num">
          <CountUpNumber :value="items[2].value" :unit="items[2].unit" unit-class="unit" :duration="1500" />
        </div>
        <div class="label">{{ items[2].label }}</div>
      </div>
      <div v-if="items[3]" class="stat stat--r2">
        <div class="num">
          <CountUpNumber :value="items[3].value" :unit="items[3].unit" unit-class="unit" :duration="1500" />
        </div>
        <div class="label">{{ items[3].label }}</div>
      </div>
      <div v-if="items[4]" class="stat stat--l3">
        <div class="num">
          <CountUpNumber :value="items[4].value" :unit="items[4].unit" unit-class="unit" :duration="1500" />
        </div>
        <div class="label">{{ items[4].label }}</div>
      </div>
      <div v-if="items[5]" class="stat stat--r3">
        <div class="num">
          <CountUpNumber :value="items[5].value" :unit="items[5].unit" unit-class="unit" :duration="1500" />
        </div>
        <div class="label">{{ items[5].label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';

interface StatItem {
  label: string;
  value: number | string;
  unit?: string; // 例如：元、人、次
}

interface Props {
  items?: StatItem[];
  centerWidth?: number; // 中间圆大致宽度（越小两侧越靠近）
  rightShift?: number;  // 右侧三项整体左移像素（正数=左移）
  width?: number | string; // 组件自身宽度（可传 520、'520px'、'60%'; 为空则按高度自适应）
}

const props = withDefaults(defineProps<Props>(), {
  // 默认 6 组（与参考图一致）。如仅传 4 组，将落位四角。
  items: () => [
    { label: '参加综合金额(元)', value: 7801010 },
    { label: '给付综合金额(元)', value: 7801010 },
    { label: '参加重大疾病金额(元)', value: 7801010 },
    { label: '给付重大疾病金额(元)', value: 7801010 },
    { label: '参加住院金额（元）', value: 7801010 },
    { label: '给付住院金额(元)', value: 7801010 },
  ],
  centerWidth: 300,
  rightShift: 100,
});

const items = props.items;

const overlayVars = computed(() => ({
  ['--center-width' as any]: props.centerWidth + 'px',
  ['--r-shift' as any]: `-${props.rightShift}px`,
}));

// 根容器尺寸：
// - 未传 width：占满父容器高度，保持原始宽高比
// - 传了 width：按给定宽度 + aspect-ratio 计算高度
const rootStyle = computed(() => {
  if (props.width == null || props.width === '') return {};
  const w = typeof props.width === 'number' ? props.width + 'px' : String(props.width);
  return { width: w, height: 'auto' } as const;
});

function fmt(v: number | string | undefined) {
  if (v === undefined || v === null) return '-';
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toLocaleString('zh-CN');
}
</script>

<style scoped lang="scss">
.aid-circle {
  position: relative;
  /* 让组件可以塞进固定高的面板：高度占满，宽度按原图比例计算 */
  height: 100%;
  aspect-ratio: 537 / 226;
  width: auto;
  margin: 0 auto;
}

.bg {
  position: absolute; inset: 0; z-index: -1; display: block;
  background-repeat: no-repeat; background-size: 100% 100%;
  /* 处理 1x/2x 视网膜资源 */
  background-image: -webkit-image-set(
    url('../../images/dashboard/part3/编组 19.png') 1x,
    url('../../images/dashboard/part3/编组 19@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/dashboard/part3/编组 19.png') 1x,
    url('../../images/dashboard/part3/编组 19@2x.png') 2x
  );
}

/* 四角文案覆盖层：三列三行的网格，中间留给圆形区域 */
.overlay {
  position: absolute; inset: 0; display: grid;
  grid-template-columns: 1fr var(--center-width, 300px) 1fr; /* 中央圆区域大致宽度，按视觉微调 */
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center; justify-items: center;
  padding: 8px 4px; /* 轻微内边距，避免贴边 */
  pointer-events: none; /* 仅展示，不拦截事件 */
}

.stat { text-align: center; display: grid; row-gap: 6px; }
.stat--l1 { grid-column: 1; grid-row: 1; margin-top: -10px; }
.stat--r1 { grid-column: 3; grid-row: 1; margin-top: -10px; }
.stat--l2 { grid-column: 1; grid-row: 2; }
.stat--r2 { grid-column: 3; grid-row: 2; }
.stat--l3 { grid-column: 1; grid-row: 3; margin-bottom: -30px;}
.stat--r3 { grid-column: 3; grid-row: 3; margin-bottom: -30px; }

/* 右侧三项左对齐并整体左移一定像素 */
.stat--r1, .stat--r2, .stat--r3 {
  justify-self: start;
  text-align: left;
  justify-items: start;
  transform: translateX(var(--r-shift, 0px));
}

.num {
  font-size: 16px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(180deg, #4a93ff 0%, #2a6ff0 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 2px 8px rgba(38, 112, 255, 0.35);
}
.unit { font-size: 12px; margin-left: 4px; opacity: 0.9; }
.label { font-size: 12px; color: #4d6aa4; font-weight: 700; white-space: nowrap; }

</style>
