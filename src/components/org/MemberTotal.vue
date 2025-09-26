<template>
  <div class="org-member-total">
    <!-- 左侧：直接使用提供的整图（不再绘制任何样式） -->
    <div class="left">
      <img class="left-img" :src="leftImg1x" :srcset="leftImg2x + ' 2x'" alt="工会会员总数图" draggable="false" />
    </div>

    <!-- 右侧：两个数字 + 图标 + 文案 -->
    <div class="right">
      <div class="item">
        <div class="num">{{ fmt(regionCount) }}</div>
        <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="地区工会" draggable="false" />
        <div class="label">地区工会</div>
      </div>
      <div class="item">
        <div class="num">{{ fmt(industryCount) }}</div>
        <img class="badge" :src="pin1x" :srcset="pin2x + ' 2x'" alt="行业产业工会" draggable="false" />
        <div class="label">行业产业工会</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组织页 - 工会会员总数（右上）
// 左：使用外部提供的整图；右：两组指标（数字 + 图标 + 文案）

// 素材：
import cube1x from '../../images/org/title1/编组 9.png'; // 作为默认占位（若未提供自定义整图）
import cube2x from '../../images/org/title1/编组 9@2x.png';
import pin1x from '../../images/org/title2/地图／定位／选中.png';
import pin2x from '../../images/org/title2/地图／定位／选中@2x.png';

interface Props {
  regionCount?: number;   // 地区工会数
  industryCount?: number; // 行业产业工会数
  leftImg1x?: string;     // 左侧整图 1x
  leftImg2x?: string;     // 左侧整图 2x
}

const props = withDefaults(defineProps<Props>(), {
  regionCount: 129,
  industryCount: 558,
  leftImg1x: cube1x,
  leftImg2x: cube2x
});

const regionCount = props.regionCount;
const industryCount = props.industryCount;
const leftImg1x = props.leftImg1x;
const leftImg2x = props.leftImg2x;

function fmt(n?: number) { return (n ?? 0).toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.org-member-total {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  column-gap: 10px;
}

.left { display: grid; place-items: center; }
.left-img { width: 150px; max-width: 100%; height: auto; }

.right {
  display: grid; grid-template-columns: 1fr 1fr; justify-items: center; align-items: center;
}
.item { display: grid; grid-template-rows: auto auto auto; align-items: center; justify-items: center; row-gap: 8px; }

.num {
  font-size: 49px; font-weight: 900; line-height: 1; letter-spacing: 1px;
  background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 4px 9px rgba(30, 100, 220, 0.18);
}

.badge { width: 56px; height: auto; }
.label { font-size: 14px; font-weight: 900; color: #2a6ff0; letter-spacing: 0.5px; }

@media (max-width: 1280px) {
  .left-img { width: 150px; }
  .num { font-size: 42px; }
  .badge { width: 48px; }
  .label { font-size: 12px; }
}
</style>
