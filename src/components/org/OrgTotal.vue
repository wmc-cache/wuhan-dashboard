<template>
  <div class="org-total" :style="cssVars">
    <div class="title">截至今日工会总数为：</div>
    <div class="digits" role="group" aria-label="今日工会总数">
      <div
        v-for="(d, i) in paddedDigits"
        :key="i"
        class="digit"
        :style="{ width: tileW, height: tileH }"
      >
        <span class="text" :style="{ fontSize: digitFont }">{{ d }}</span>
      </div>
    </div>
    <div class="meta">
      <div class="incr">
        <span class="arrow-up" aria-hidden="true"></span>
        比上周新增 <span class="num">{{ weeklyIncrease }}</span> 个
      </div>
      <div class="progress"><div class="bar" :style="{ width: progress + '%' }"></div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  total?: number | string;   // 今日总数
  padLength?: number;        // 位数，不足补 0
  weeklyIncrease?: number;   // 上周新增
  progress?: number;         // 进度百分比
  tileWidth?: number;        // 单个数字卡宽
  tileHeight?: number;       // 高
  fontSize?: number;         // 数字字号
}

const props = withDefaults(defineProps<Props>(), {
  total: 112211,
  padLength: 6,
  weeklyIncrease: 10,
  progress: 64,
  tileWidth: 84,
  tileHeight: 104,
  fontSize: 54
});

const paddedDigits = computed(() => {
  const s = String(props.total ?? '').replace(/[^0-9]/g, '');
  const pad = Math.max(props.padLength, s.length);
  return s.padStart(pad, '0').split('');
});

// 通过 CSS 变量把数字卡宽高/字号传入样式，避免 v-bind 在样式里的兼容问题
const cssVars = computed(() => ({
  '--tile-w': props.tileWidth + 'px',
  '--tile-h': props.tileHeight + 'px',
  '--digit-font': props.fontSize + 'px'
}));
const tileW = computed(() => props.tileWidth + 'px');
const tileH = computed(() => props.tileHeight + 'px');
const digitFont = computed(() => props.fontSize + 'px');
</script>

<style scoped lang="scss">
.org-total { position: relative; height: 100%; display: grid; grid-template-rows: auto auto 1fr; row-gap: 12px; }
.title { font-size: 22px; font-weight: 900; color: rgba(42,111,240,0.9); letter-spacing: 2px; }
.digits { display: flex; align-items: flex-end; justify-content: center; gap: 12px; padding-top: 4px; }
.digit {
  width: var(--tile-w, 84px);
  height: var(--tile-h, 104px);
  display: grid; place-items: center;
  background-image: -webkit-image-set(
    url('../../images/member/font-bg/ico／数字bg备份 6.png') 1x,
    url('../../images/member/font-bg/ico／数字bg备份 6@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/member/font-bg/ico／数字bg备份 6.png') 1x,
    url('../../images/member/font-bg/ico／数字bg备份 6@2x.png') 2x
  );
  background-size: 100% 100%; border-radius: 8px; box-shadow: 0 6px 14px rgba(45,110,255,0.10);
}
.digit .text { font-size: var(--digit-font, 54px); font-weight: 800; color: #2a6ff0; line-height: 1; }

.meta { display: grid; grid-template-columns: auto 1fr; align-items: center; column-gap: 16px; }
.incr { color: #2a6ff0; font-size: 18px; font-weight: 800; }
.incr .num { color: #FFA36B; margin: 0 4px; }
.arrow-up { display: inline-block; width: 0; height: 0; margin-right: 8px; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 10px solid #FFA36B; transform: translateY(-1px); }
.progress { position: relative; height: 12px; border-radius: 8px; background: rgba(90,160,255,0.25); }
.bar { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 8px; background: linear-gradient(90deg, #FFA36B 0%, rgba(255,163,107,0.55) 100%); }
</style>
