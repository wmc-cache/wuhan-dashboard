<template>
  <div class="join-type">
    <!-- 左上角标题装饰图 -->
    <div class="title-img" aria-hidden="true">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="参加类型统计" draggable="false" />
    </div>

    <!-- 顶部图例：男性 / 女性 -->
    <div class="legend">
      <div class="legend__item">
        <span class="dot dot--male"></span>
        <span>男性</span>
      </div>
      <div class="legend__item">
        <span class="dot dot--female"></span>
        <span>女性</span>
      </div>
    </div>

    <!-- 主体：左侧装饰图 + 右侧三类条形 -->
    <div class="body">
      <div class="left-visual">
        <img :src="icon1x" :srcset="icon2x + ' 2x'" alt="装饰" draggable="false" />
      </div>

      <div class="right-list">
        <div
          v-for="(item, idx) in data"
          :key="idx"
          class="row"
        >
          <!-- <div class="row__name">{{ item.name }}</div> -->

          <!-- 男性条 -->
          <div class="row__bar">
            <SegmentedBar
              :percent="item.male.percent"
              :seg-total="segTotal"
              color="#2a6ff0"
              mode="segment"
              :width="barWidth"
              :label="item.name + ' 男性'"
            />
            <div class="row__value">
              {{ pretty(item.male.count) }}
              <span class="pct">({{ toPct(item.male.percent) }})</span>
            </div>
          </div>

          <!-- 女性条 -->
        <div class="row__bar">
            <SegmentedBar
              :percent="item.female.percent"
              :seg-total="segTotal"
              color="#ff6b97"
              mode="segment"
              :width="barWidth"
              :label="item.name + ' 女性'"
            />
            <div class="row__value">
              {{ pretty(item.female.count) }}
              <span class="pct">({{ toPct(item.female.percent) }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 标题与左侧装饰图
import title1x from '../../images/yiliao/part4/title/编组 21.png';
import title2x from '../../images/yiliao/part4/title/编组 21@2x.png';
import icon1x from '../../images/yiliao/part4/icon1/编组 10.png';
import icon2x from '../../images/yiliao/part4/icon1/编组 10@2x.png';
import SegmentedBar from '../SegmentedBar.vue';

interface SexStat { count: number; percent: number } // percent: 0~1
interface Row { name: string; male: SexStat; female: SexStat }
import { computed } from 'vue';
interface Props { data?: Row[] }

const props = withDefaults(defineProps<Props>(), {
  data: () => [
    { name: '住院参加', male: { count: 23877, percent: 0.2 }, female: { count: 23877, percent: 0.2 } },
    { name: '综合参加', male: { count: 23877, percent: 0.2 }, female: { count: 23877, percent: 0.2 } },
    { name: '重疾参加', male: { count: 23877, percent: 0.2 }, female: { count: 23877, percent: 0.2 } },
  ]
});

const data = computed(() => props.data || []);
const segTotal = 10; // 默认 10 段（如需 10 小格的视觉）
const barWidth = 96; // 固定条宽，避免不同行出现长度差异
function pretty(n: number) { return n.toLocaleString('zh-CN'); }
function toPct(p: number) { return Math.round(p * 100) + '%'; }
</script>

<style scoped lang="scss">
.join-type { position: relative; width: 100%; height: 100%; box-sizing: border-box; padding: 18px 16px 12px; }

/* 左上角蓝色标题图片 */
.title-img { position: absolute; left: 12px; top: 8px; }
.title-img img { display: block; width: 151px; height: 35px; object-fit: contain; }

/* 右上角图例 */
.legend { position: absolute; right: 32px; top: 12px; display: flex; gap: 24px; align-items: center; white-space: nowrap; }

.legend__item { display: inline-grid; grid-auto-flow: column; align-items: center; column-gap: 8px; font-size: 14px; color: #4c5566; font-weight: 600; line-height: 1; }

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot--male {
  background: #2a6ff0;
}

.dot--female {
  background: #ff6b97;
}

/* 主体两列 */
.body {
  position: absolute;
  inset: 38px 12px 12px 12px;
  display: grid;
  grid-template-columns: 220px 1fr; /* 再收紧整体宽度 */
  column-gap: 20px;
  align-items: center;
  margin-top: 30px;
}

.left-visual {
  height: 100%;
  display: grid;
  place-items: center;
}

.left-visual img {
  width: 100%;
  max-width: 240px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, .08));
}

.right-list { display: grid; row-gap: 18px; padding-right: 20px; max-width: 360px; justify-self: start; }

.row {
  display: flex;
  flex-direction: column;
  align-items: center;

}

.row__name {
  position: relative;
  color: #333;
  font-size: 16px;
  font-weight: 700;
}

/* 两行条形（男/女） */
.row__bar { display: flex; align-items: center; padding: 6px 0; gap: 10px; }

/* 单条条形由 SegmentedBar 组件渲染 */

.row__value {
  font-size: 14px;
  color: #4c5566;
  white-space: nowrap;
}

.row__value .pct {
  margin-left: 4px;
  color: rgba(0, 0, 0, 0.45);
}

</style>
