<template>
  <div class="overview">
    <!-- 舞台：包含上下两排“桶”与底部椭圆底座 -->
    <div class="stage">
      <!-- 上：3 个桶 -->
      <div class="row row--top">
        <div v-for="(it, i) in topItems" :key="i" class="cell cell--top" role="button" tabindex="0"
             @click="onCellClick($event)">
          <div class="barrel" aria-hidden="true"></div>
          <div class="amount">
            <span class="amount__num">{{ amountParts(it.value).n }}</span>
            <span class="amount__unit">{{ amountParts(it.value).u }}</span>
          </div>
          <!-- 顶部三桶：文字直接放到桶上，不要下面的底座牌 -->
          <div class="title-on-barrel">{{ it.name }}</div>
        </div>
      </div>
      <!-- 下：4 个桶 -->
      <div class="row row--bottom">
        <div v-for="(it, i) in bottomItems" :key="i" class="cell cell--top" role="button" tabindex="0"
             @click="onCellClick($event)">
          <div class="barrel" aria-hidden="true"></div>
          <div class="amount">
            <span class="amount__num">{{ amountParts(it.value).n }}</span>
            <span class="amount__unit">{{ amountParts(it.value).u }}</span>
          </div>
          <div class="title-on-barrel">{{ it.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
// 接收年份 + 可选的“顶部/底部 7 个统计项”，便于由页面统一取数
type Item = { name: string; value: number }
type ValueUnit = 'yuan' | 'wan' | 'yi'; // 原始数值单位（默认 'yuan'）
interface Props { year: number; topItems?: Item[]; bottomItems?: Item[]; valueUnit?: ValueUnit }
const props = withDefaults(defineProps<Props>(), {
  topItems: () => ([
    { name: '代收金额合计', value: 1221 * 1e8 },
    { name: '省总金额合计', value: 111 * 1e8 },
    { name: '企业产业金额合计', value: 8131 * 1e4 },
  ]),
  bottomItems: () => ([
    { name: '市州金额合计', value: 1221 * 1e8 },
    { name: '县市金额合计', value: 111 * 1e8 },
    { name: '基层金额合计', value: 8131 * 1e4 },
    { name: '手续费合计', value: 8131 * 1e4 },
  ]),
  valueUnit: 'yuan'
});

// 暴露点击位置，方便外层打开弹窗
const emit = defineEmits<{ (e: 'open-detail', payload: { x: number; y: number }): void }>();

// 渲染时使用 props 传入的数组（保持响应式）
const { topItems, bottomItems } = toRefs(props);

function onCellClick(e: MouseEvent) {
  emit('open-detail', { x: e.clientX, y: e.clientY });
}

// 将原始金额换算为 亿/万 的整洁文案，贴近效果图（不加千分位分隔）
function amountParts(v: number): { n: string; u: '亿' | '万' } {
  const unit = props.valueUnit;
  if (unit === 'yi') {
    // 后端已是“亿元”，直接保留 1 位小数
    return { n: (Number(v) || 0).toFixed(1), u: '亿' };
  }
  if (unit === 'wan') {
    return { n: (Math.round((Number(v) || 0))).toString(), u: '万' };
  }
  // 默认：原始是“元”，根据量级换算到亿/万
  const val = Number(v) || 0;
  if (val >= 1e8) return { n: String(Math.round(val / 1e8)), u: '亿' };
  return { n: String(Math.round(val / 1e4)), u: '万' };
}
</script>

<style scoped lang="scss">
.overview { position: relative; height: 100%; }

/* 舞台：两行桶 + 椭圆底座。尺寸用变量，便于日后微调。*/
.stage {
  --barrel-w: clamp(126px, 12.2vw, 150px);
  --gap-h: clamp(10px, 2.2vh, 18px);
  --gap-w: clamp(24px, 3.5vw, 36px);
  --amount-color: #2a58ff;
  --label-bg-from: #1B5CFF;
  --label-bg-to: #4DA7FF;
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr 1.1fr; /* 上下两排的占比与参考图接近 */
  align-items: center;
  justify-items: center;
}

.row {
  width: 100%;
  display: grid;
  justify-content: center;
  align-items: end;
}
.row--top { grid-template-columns: repeat(3, var(--barrel-w)); column-gap: var(--gap-w); justify-content: center; }
.row--bottom { grid-template-columns: repeat(4, var(--barrel-w)); column-gap: var(--gap-w); }

.cell {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: end;
  row-gap: 10px;
  cursor: pointer;
}

/* 顶部三桶：取消行内间距（不留给底座牌的空间） */
.cell--top { row-gap: 0; }

/* 小底座阴影：模拟每个桶下方的蓝色椭圆托盘 */
.cell::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(var(--barrel-w) * 1.05);
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(16,77,230,.85) 0%, rgba(16,77,230,.6) 40%, rgba(16,77,230,.35) 70%, rgba(16,77,230,0) 100%);
  filter: blur(.2px);
  z-index: -1;
}

/* 桶底图（位图），使用 image-set 适配 2x。保持接近原图的纵横比 */
.barrel {
  width: var(--barrel-w);
  aspect-ratio: 292 / 298; /* 基于 @2x 图尺寸换算 */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(
    url('../../images/refund/桶/编组 29.png') 1x,
    url('../../images/refund/桶/编组 29@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/refund/桶/编组 29.png') 1x,
    url('../../images/refund/桶/编组 29@2x.png') 2x
  );
}

/* 数字：落在桶的“窗口”内，字号与配色贴近视觉稿 */
.amount {
  position: absolute;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
  color: #2a58ff;
  font-weight: 900;
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  white-space: nowrap;
}

.amount__num {
  font-size: clamp(18px, 2.1vw, 28px);
}

.amount__unit {
  font-size: clamp(12px, 1.4vw, 18px);
  letter-spacing: 1px;
  text-shadow: 0 1px 0 rgba(255,255,255,.5);
  pointer-events: none;
}

/* 名称底座：深蓝色胶囊 + 轻微高光阴影，模拟切图中的底座牌 */
.label {
  min-width: calc(var(--barrel-w) * .9);
  padding: 8px 14px 10px;
  border-radius: 18px/20px;
  background: linear-gradient(180deg, var(--label-bg-to), var(--label-bg-from));
  color: #fff;
  font-weight: 900;
  font-size: clamp(14px, 1.6vw, 18px);
  text-align: center;
  line-height: 1.1;
  white-space: normal; /* 允许中文自动换行，长名称可折行为 2 行 */
  /* 固定 2 行高度，避免不同字数导致桶上下错位 */
  min-height: calc(1.1em * 2 + 6px);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  box-shadow: 0 8px 0 rgba(8, 53, 173, .28), 0 0 18px rgba(42, 128, 255, .28) inset;
}

/* 顶部三桶标题：覆盖在桶的下半部（水位之上），对齐参考图 */
.title-on-barrel {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 6px;
  width: calc(var(--barrel-w) * .88);
  max-width: calc(var(--barrel-w) * .9);
  color: #ffffff;
  font-weight: 900;
  font-size: clamp(14px, 1.6vw, 18px);
  line-height: 1.18;
  text-align: center;
  text-shadow: 0 1px 1px rgba(10, 32, 112, .35);
  /* 允许自动换行，最多两行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  pointer-events: none;
}


</style>
