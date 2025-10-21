<template>
  <div class="four-stats">
    <div v-for="(item, i) in rows" :key="i" class="stat">
      <div class="value" :style="{ color: item.color }">
        <CountUpNumber :value="item.value" :duration="1500" />
      </div>
      <div class="label">{{ item.label }}</div>
      <img class="icon" :src="item.img1x" :srcset="item.img2x + ' 2x'" :alt="item.label" draggable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';

import icon1_1x from '../../images/laomo/title1/编组 7.png';
import icon1_2x from '../../images/laomo/title1/编组 7@2x.png';
import icon2_1x from '../../images/laomo/title2/编组 8.png';
import icon2_2x from '../../images/laomo/title2/编组 8@2x.png';
import icon3_1x from '../../images/laomo/title3/编组 11.png';
import icon3_2x from '../../images/laomo/title3/编组 11@2x.png';
import icon4_1x from '../../images/laomo/title4/编组 13.png';
import icon4_2x from '../../images/laomo/title4/编组 13@2x.png';

interface StatItem {
  label: string;
  value: number;
  color: string;
  img1x: string;
  img2x: string;
}

interface Props {
  items?: StatItem[];
  // 可选：仅覆盖数值，顺序与默认四项一致
  values?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { label: '劳模总数',     value: 6158, color: '#36B9FF', img1x: icon1_1x, img2x: icon1_2x },
    { label: '退休劳模总数', value: 8405, color: '#5EE0D2', img1x: icon2_1x, img2x: icon2_2x },
    { label: '特困劳模总数', value: 2680, color: '#FFA542', img1x: icon3_1x, img2x: icon3_2x },
    { label: '低收入人群总数', value: 4706, color: '#3E7BFF', img1x: icon4_1x, img2x: icon4_2x }
  ],
  values: () => []
});

// 合并覆盖：如果传入 values，则只替换数值，图标/颜色/标签沿用默认
const rows = computed<StatItem[]>(() => {
  const base = props.items || [];
  const vs = Array.isArray(props.values) ? props.values : [];
  return base.map((it, i) => ({ ...it, value: Number(vs[i] ?? it.value) || 0 }));
});

function formatNumber(n: number): string { return n.toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.four-stats {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: end; /* 图标对齐底部 */
  column-gap: 24px;
  padding-top: 12px; /* 整体下移一点 */
}

.stat {
  display: grid;
  grid-template-rows: auto auto 1fr;
  align-items: start;
  justify-items: center; /* 水平居中数值与文字 */
  text-align: center;
}

.value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 6px;
  text-shadow: 0 2px 10px rgba(60,120,255,0.12);
}

.label {
  color: rgba(0,0,0,0.65);
  font-weight: 700;
  margin-bottom: 8px;
}

.icon {
  width: 70%;
  max-width: 120px; /* 缩小图标以贴近视觉稿 */
  min-width: 88px;
  height: auto;
  justify-self: center;
  user-select: none;
}
</style>
