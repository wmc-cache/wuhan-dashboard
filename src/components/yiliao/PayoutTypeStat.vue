<template>
  <div class="payout-type">
    <!-- 左上角标题装饰图（part5/title） -->
    <div class="title-img" aria-hidden="true">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="给付类型统计" draggable="false" />
    </div>
    <!-- 顶部图例：男性 / 女性（与 JoinTypeStat 风格一致） -->
    <div class="legend">
      <div class="legend__item"><span class="dot dot--male"></span><span>男性</span></div>
      <div class="legend__item"><span class="dot dot--female"></span><span>女性</span></div>
    </div>

    <!-- 主体：左侧装饰图 + 右侧三类条形（与 JoinTypeStat 布局一致） -->
    <div class="body">
      <div class="left-visual">
        <img :src="icon1x" :srcset="icon2x + ' 2x'" alt="装饰" draggable="false" />
      </div>

      <div class="right-list">
        <div v-for="(item, idx) in data" :key="idx" class="row">
          <!-- <div class="row__name">{{ item.name }}</div> -->
          <!-- 男性条 -->
          <div class="row__bar">
            <SegmentedBar :percent="item.male.percent" :seg-total="segTotal" color="#2a6ff0" :label="item.name + ' 男性'" />
            <div class="row__value">{{ pretty(item.male.count) }} <span class="pct">({{ toPct(item.male.percent) }})</span></div>
          </div>
          <!-- 女性条 -->
          <div class="row__bar">
            <SegmentedBar :percent="item.female.percent" :seg-total="segTotal" color="#ff6b97" :label="item.name + ' 女性'" />
            <div class="row__value">{{ pretty(item.female.count) }} <span class="pct">({{ toPct(item.female.percent) }})</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SegmentedBar from '../SegmentedBar.vue';
import icon1x from '../../images/yiliao/part5/编组 15.png';
import icon2x from '../../images/yiliao/part5/编组 15@2x.png';
import title1x from '../../images/yiliao/part5/title/编组 21.png';
import title2x from '../../images/yiliao/part5/title/编组 21@2x.png';

interface SexStat { count: number; percent: number } // percent: 0~1
interface Row { name: string; male: SexStat; female: SexStat }
interface Props { data?: Row[] }

const props = withDefaults(defineProps<Props>(), {
  data: () => [
    { name: '住院给付', male: { count: 23877, percent: 0.28 }, female: { count: 17990, percent: 0.21 } },
    { name: '综合给付', male: { count: 16880, percent: 0.20 }, female: { count: 21020, percent: 0.25 } },
    { name: '重疾给付', male: { count: 12660, percent: 0.15 }, female: { count: 13540, percent: 0.16 } },
  ]
});

const data = props.data;
const segTotal = 10;

function pretty(n: number) { return n.toLocaleString('zh-CN'); }
function toPct(p: number) { return Math.round(Math.max(0, Math.min(1, p)) * 100) + '%'; }
</script>

<style scoped lang="scss">
.payout-type { position: relative; width: 100%; height: 100%; box-sizing: border-box; padding: 18px 16px 12px; }
.title-img { position: absolute; left: 12px; top: 8px; }
.title-img img { display: block; width: 151px; height: 35px; object-fit: contain; }

/* 右上角图例（同 JoinTypeStat） */
.legend { position: absolute; right: 32px; top: 12px; display: flex; gap: 24px; align-items: center; white-space: nowrap; }
.legend__item { display: inline-grid; grid-auto-flow: column; align-items: center; column-gap: 8px; font-size: 14px; color: #4c5566; font-weight: 600; line-height: 1; }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot--male { background: #2a6ff0; }
.dot--female { background: #ff6b97; }

/* 主体两列，与 JoinTypeStat 一致，仅把左列宽调整为 225px */
.body {
  /* 主体相对卡片顶部下移一点，避免贴得过紧（与左侧“参加类型统计”观感更一致） */
  position: absolute;
  inset: 46px 12px 12px 12px;
  display: grid;
  grid-template-columns: 225px 1fr;
  column-gap: 20px;
  align-items: center;
  margin-top: 10px; /* 下移一点 */
}

.left-visual { height: 100%; display: grid; place-items: center; }
.left-visual img { width: 100%; max-width: 240px; height: auto; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(0, 0, 0, .08)); }

.right-list { display: grid; row-gap: 18px; padding-right: 20px; max-width: 360px; justify-self: start; }

.row { display: flex;
  flex-direction: column;
   grid-template-columns: 88px 1fr; align-items: center; row-gap: 2px; }
.row__name { position: relative; color: #333; font-size: 14px; font-weight: 700; }

/* 两行条形（男/女） */
.row__bar { display: flex; 
  align-items: center; padding: 6px 0; gap: 10px; }
.row__value { font-size: 14px; color: #4c5566; white-space: nowrap; }
.row__value .pct { margin-left: 4px; color: rgba(0, 0, 0, 0.45); }
</style>
