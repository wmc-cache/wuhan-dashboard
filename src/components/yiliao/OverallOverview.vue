<template>
  <div class="overview">
    <!-- 左上角标题贴图 -->
    <div class="title-img" aria-hidden="true">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="总体概览" draggable="false" />
    </div>

    <!-- 右上角年份选择（简单下拉） -->
    <div class="year-select" :data-year="year">
      <NiceSelect v-model="year" :options="years" :width="122" :formatter="(y: number) => y + '年'" />
    </div>

    <!-- 中心装饰图（心形+底座） -->
    <div class="center-icon">
      <img :src="icon1x" :srcset="icon2x + ' 2x'" alt="icon" draggable="false" />
    </div>

    <!-- 左右 3 项指标（精细化样式：楔形徽章 + 台阶阴影） -->
    <div class="metrics metrics--left">
      <div class="metric metric--top">
        <div class="label">{{ leftMetrics[0].label }}</div>
        <div class="badge-img badge-img--left">
          <img class="badge-bg" :src="leftBg1x" :srcset="leftBg2x + ' 2x'" alt="" aria-hidden="true" />
          <span class="num">{{ pretty(leftMetrics[0].value) }}</span>
        </div>

      </div>
      <div class="metric metric--mid">
        <div class="label">{{ leftMetrics[1].label }}</div>
        <div class="badge-img badge-img--left">
          <img class="badge-bg" :src="leftBg1x" :srcset="leftBg2x + ' 2x'" alt="" aria-hidden="true" />
          <span class="num">{{ pretty(leftMetrics[1].value) }}</span>
        </div>

      </div>
      <div class="metric metric--bot">
        <div class="label">{{ leftMetrics[2].label }}</div>
        <div class="badge-img badge-img--left">
          <img class="badge-bg" :src="leftBg1x" :srcset="leftBg2x + ' 2x'" alt="" aria-hidden="true" />
          <span class="num">{{ pretty(leftMetrics[2].value) }}</span>
        </div>

      </div>
    </div>
    <div class="metrics metrics--right">
      <div class="metric metric--top">
        <div class="label">{{ rightMetrics[0].label }}</div>
        <div class="badge-img badge-img--right">
          <img class="badge-bg" :src="rightBg1x" :srcset="rightBg2x + ' 2x'" alt="" aria-hidden="true" />
          <span class="num">{{ pretty(rightMetrics[0].value) }}</span>
        </div>

      </div>
      <div class="metric metric--mid">
        <div class="label">{{ rightMetrics[1].label }}</div>
        <div class="badge-img badge-img--right">
          <img class="badge-bg" :src="rightBg1x" :srcset="rightBg2x + ' 2x'" alt="" aria-hidden="true" />
          <span class="num">{{ pretty(rightMetrics[1].value) }}</span>
        </div>

      </div>
      <div class="metric metric--bot">
        <div class="label">{{ rightMetrics[2].label }}</div>
        <div class="badge-img badge-img--right">
          <img class="badge-bg" :src="rightBg1x" :srcset="rightBg2x + ' 2x'" alt="" aria-hidden="true" />
          <span class="num">{{ pretty(rightMetrics[2].value) }}</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import NiceSelect from '../NiceSelect.vue';
import title1x from '../../images/yiliao/part8/title/编组 21.png';
import title2x from '../../images/yiliao/part8/title/编组 21@2x.png';
import icon1x from '../../images/yiliao/part8/icon/编组 19.png';
import icon2x from '../../images/yiliao/part8/icon/编组 19@2x.png';
import leftBg1x from '../../images/yiliao/part8/left/编组 16.png';
import leftBg2x from '../../images/yiliao/part8/left/编组 16@2x.png';
import rightBg1x from '../../images/yiliao/part8/right/编组 16.png';
import rightBg2x from '../../images/yiliao/part8/right/编组 16@2x.png';

interface Metric { label: string; value: number }
interface Props {
  years?: number[];
  initialYear?: number;
  leftMetrics?: Metric[];   // 参加类（左）
  rightMetrics?: Metric[];  // 给付类（右）
}

const props = withDefaults(defineProps<Props>(), {
  years: () => [2025, 2024, 2023],
  initialYear: 2025,
  leftMetrics: () => [
    { label: '参加综合金额(元)', value: 7460 },
    { label: '参加重大疾病金额(元)', value: 9542 },
    { label: '参加住院金额(元)', value: 2734 }
  ],
  rightMetrics: () => [
    { label: '给付综合金额(元)', value: 5331 },
    { label: '给付重大疾病金额(元)', value: 9481 },
    { label: '给付住院金额(元)', value: 5884 }
  ]
});

const year = ref(props.initialYear);
const years = props.years;
const leftMetrics = computed(() => props.leftMetrics || []);
const rightMetrics = computed(() => props.rightMetrics || []);

const emit = defineEmits<{ 'year-change': [year: number] }>();
watch(year, (y) => emit('year-change', Number(y)));

function pretty(n: number) { return n.toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.overview { position: relative; height: 100%; width: 100%; box-sizing: border-box; padding: 10px 12px; overflow: hidden;
  --left-x: 6.5%;
  --right-x: 6.5%;
  --top-y: 16%;
  --row-gap: 52px;
  --center-size: 520px;
}
.title-img { position: absolute; left: 10px; top: 6px; }
.title-img img { display: block; width: 140px; height: auto; }

/* 年份选择：浅底 + 蓝边 + 自定义箭头 */
.year-select { position: absolute; right: 18px; top: 8px; }
/* 控制组件内按钮高度，与设计一致 */
.year-select :deep(.trigger) { height: 32px; }

/* 中心图标：略靠上 */
.center-icon {
  position: absolute;
  left: 50%;
  top: 65%;
  transform: translate(-50%, -50%);
}
.center-icon img { width: var(--center-size); height: auto; object-fit: contain; filter: drop-shadow(0 6px 14px rgba(90,140,255,.28)); }

/* 左右三项指标：精细布局。使用绝对定位列 + 每行微调位移以贴合视觉 */
.metrics { position: absolute; display: grid; row-gap: var(--row-gap); }
.metrics--left { left: var(--left-x); top: var(--top-y); }
.metrics--right { right: var(--right-x); top: var(--top-y); }

.metric { position: relative; display: grid; align-content: start; row-gap: 10px; }
.metric .label {
  color: #4b5a73;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: .5px;
}
.metrics--right .metric .label {
  text-align: right;
  justify-self: end;
}
/* 徽章：使用切图背景（左/右两套），保证视觉一致 */
.badge-img { position: relative; width: 320px; height: 58px; display: grid; place-items: center; }
.badge-img .badge-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 0 rgba(72, 138, 255, 0.22));
}

.badge-img .num {
  bottom: 10px;
  position: relative;
  z-index: 1;
  color: #fff;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(80, 140, 255, 0.3);
}

.badge-img--left {
  justify-self: start;

  .num {
    left: 20px;
  }
}

.badge-img--right {
  justify-self: end;

  .num {
    right: 20px;
  }
}

/* 调整“中间一行”徽章左右外移，使更靠向两侧 */
.metrics--left .metric--mid .badge-img { transform: translateX(-120px); }
.metrics--right .metric--mid .badge-img { transform: translateX(120px); }

/* 台阶反光底座 */
.plate { position: absolute; left: 8px; right: 16px; height: 10px; bottom: -12px;
  border-radius: 10px; background: linear-gradient(90deg, rgba(180,210,255,.35), rgba(255,255,255,.85), rgba(180,210,255,.35));
  filter: blur(0.2px); box-shadow: 0 6px 8px rgba(64,129,255,.20);
}
.plate--right { left: 16px; right: 8px; }


</style>
