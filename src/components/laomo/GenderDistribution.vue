<template>
  <div class="gender-distribution">
    <!-- 左侧：图标与标题 -->
    <div class="left">
      <img class="icon" :src="icon1x" :srcset="icon2x + ' 2x'" alt="劳模会员" draggable="false" />
      
    </div>

    <!-- 右侧：两个环图 -->
    <div class="rings">
      <!-- 男性 -->
      <div class="ring-card">
        <RingPie :data="maleData" :center="['50%', '52%']" :radius="['82%', '98%']" :border-width="0"
          gap-color="transparent" :emphasis-scale="16" :start-angle="90" :show-label="false">
          <template #center>
            <div class="center">
              <div class="pct" :style="{ color: maleColor }">{{ malePct }}%</div>
              <div class="count" :style="{ color: maleColor }">{{ formatPeople(maleCount) }}</div>
            </div>
          </template>
        </RingPie>
        <div class="legend" :style="{ color: maleColor }">男性</div>
      </div>

      <!-- 女性 -->
      <div class="ring-card">
        <RingPie :data="femaleData" :center="['50%', '52%']" :radius="['82%', '98%']" :border-width="0"
          gap-color="transparent" :emphasis-scale="16" :start-angle="90" :show-label="false">
          <template #center>
            <div class="center">
              <div class="pct" :style="{ color: femaleColor }">{{ femalePct }}%</div>
              <div class="count" :style="{ color: femaleColor }">{{ formatPeople(femaleCount) }}</div>
            </div>
          </template>
        </RingPie>
        <div class="legend" :style="{ color: femaleColor }">女性</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RingPie from '../RingPie.vue';
import icon1x from '../../images/laomo/title5/编组 7备份.png';
import icon2x from '../../images/laomo/title5/编组 7备份@2x.png';

interface Props {
  malePct?: number;     // 百分比 0~100
  femalePct?: number;   // 百分比 0~100
  maleCount?: number;   // 人数
  femaleCount?: number; // 人数
}

const props = withDefaults(defineProps<Props>(), {
  malePct: 80,
  femalePct: 15,
  maleCount: 4416,
  femaleCount: 1912
});

const maleColor = '#35D7C8';
const maleRest = 'rgba(53,215,200,0.10)';
const femaleColor = '#FFA36B';
const femaleRest = 'rgba(255,163,107,0.12)';

const maleData = [
  { name: '男性', value: props.malePct, color: maleColor },
  { name: '其余', value: 100 - props.malePct, color: maleRest }
];
const femaleData = [
  { name: '女性', value: props.femalePct, color: femaleColor },
  { name: '其余', value: 100 - props.femalePct, color: femaleRest }
];

const malePct = props.malePct;
const femalePct = props.femalePct;
const maleCount = props.maleCount;
const femaleCount = props.femaleCount;

function formatPeople(n: number) { return `${n.toLocaleString('zh-CN')}人`; }
</script>

<style scoped lang="scss">
.gender-distribution {
  position: relative;
  height: 100%;
  display: grid;
  /* 左列加宽，让左侧图标可以更大，同时整体更贴设计 */
  grid-template-columns: 130px 1fr;
    /* 左列更窄，给环图更多空间 */
    column-gap: 5px;
    align-items: center;
  }
  
  .left {
    display: grid;
    justify-items: center;
    row-gap: 10px;
  }
  
  .left .icon {
    width: 110px;   /* 放大图标 */
    max-width: 100%;
    height: auto;
    transform: translateX(30px);
  }
  
  .left-title {
    font-size: 18px;
    font-weight: 800;
    color: #2f74ff;
    letter-spacing: 1px;
  }
  
  .rings {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
    margin: 0 -15px;  /* 使用负边距让两个饼图重叠 */
    /* 让两个饼图整体向右偏移一点，贴近原型的视觉位置 */
    transform: translateX(50px);
    }
    
    .ring-card {
      position: relative;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      align-items: center;
      justify-items: center;
      width: 120px;
      flex-shrink: 0;
        /* 使底部文字与环图水平居中对齐 */
      }
      
      .center {
        text-align: center;
      }
      
      .pct {
        font-size: 20px;
        /* 中部百分比进一步减小 */
        font-weight: 800;
      }
      
      .count {
        margin-top: 6px;
        font-size: 14px;
        /* 次行人数再小一点 */
  color: rgba(0, 0, 0, 0.55);
  font-weight: 700;
}
.legend {
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  margin-top: 4px;
  width: 100%;
  display: block;
}
</style>
