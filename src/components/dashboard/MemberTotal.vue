<template>
  <div class="member-total">
    <!-- 左：总量 + 台阶立体图标 + 文案 -->
    <div class="left">
      <div class="num">{{ formatNumber(total) }}</div>
      <i class="stage" aria-hidden="true"></i>
      <div class="label">工会会员总数（人）</div>
    </div>

    <!-- 右：男女两张斜切卡片（带小图标） -->
    <ul class="right" role="list">
      <li class="item item--female">
        <i class="item__bg" aria-hidden="true"></i>
        <img class="item__icon" :src="femaleIcon1x" :srcset="femaleIcon2x + ' 2x'" alt="女性会员" draggable="false" />
        <span class="item__label">女性会员</span>
        <span class="item__value item__value--female"><span class="item__num">{{ female }}</span><small class="unit">人</small></span>
      </li>
      <li class="item item--male">
        <i class="item__bg" aria-hidden="true"></i>
        <img class="item__icon" :src="maleIcon1x" :srcset="maleIcon2x + ' 2x'" alt="男性会员" draggable="false" />
        <span class="item__label">男性会员</span>
        <span class="item__value item__value--male"><span class="item__num">{{ male }}</span><small class="unit">人</small></span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// 右列：工会会员总数（参考效果图）
// - 左侧显示总量与立体台阶图标
// - 右侧为男女两项卡片，带背景与对应小图标

import { computed } from 'vue';

// 小图标（男女）
import femaleIcon1x from '../../images/dashboard/icon2/位图.png';
import femaleIcon2x from '../../images/dashboard/icon2/位图@2x.png';
import maleIcon1x from '../../images/dashboard/icon3/位图.png';
import maleIcon2x from '../../images/dashboard/icon3/位图@2x.png';

interface Props {
  total?: number;
  female?: number;
  male?: number;
}

const props = withDefaults(defineProps<Props>(), {
  total: 18897,
  female: 622,
  male: 902
});

const total = computed(() => props.total);
const female = computed(() => props.female);
const male = computed(() => props.male);

function formatNumber(n?: number): string {
  return (n ?? 0).toLocaleString('zh-CN');
}
</script>

<style scoped lang="scss">
.member-total {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 260px 1fr; /* 左侧总数固定宽度，右侧自适应 */
  align-items: center;
  column-gap: 18px;
}

/* 左侧：总量 + 台阶图标 */
.left { display: grid; justify-items: center; align-content: start; row-gap: 8px; }
.num {
  font-size: 50px; /* 字体小一点 */
  font-weight: 900;
  letter-spacing: 1px;
  line-height: 1;
  background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 4px 9px rgba(30, 100, 220, 0.18);
}

/* 台阶立体图标（1x/2x 自适应） */
.stage {
  display: block;
  width: 110px;  /* 视觉占位，按给图比例缩放 */
  height: 92px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(
    url('../../images/dashboard/icon1/编组 12.png') 1x,
    url('../../images/dashboard/icon1/编组 12@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/dashboard/icon1/编组 12.png') 1x,
    url('../../images/dashboard/icon1/编组 12@2x.png') 2x
  );
}

.label { font-size: 16px; color: #2a6ff0; font-weight: 700; letter-spacing: 1px; }

/* 右侧：两张斜切卡片 */
.right { list-style: none; padding: 0; margin: 0; display: grid; row-gap: 18px; }

.item {
  position: relative;
  height: 72px;
  display: grid;
  grid-template-columns: 96px auto 1fr; /* 第一列专供图标，便于居中 */
  align-items: center;
  padding: 0 18px; /* 去掉额外左边距，图标通过网格居中 */
  column-gap: 14px; /* 文案与数字之间留间隔 */
}

.item__bg {
  content: "";
  position: absolute; inset: 0; z-index: -1; display: block;
  background-repeat: no-repeat; background-size: 100% 100%; opacity: 0.96;
  background-image: -webkit-image-set(
    url('../../images/dashboard/bg/矩形备份 6.png') 1x,
    url('../../images/dashboard/bg/矩形备份 6@2x.png') 2x
  );
  background-image: image-set(
    url('../../images/dashboard/bg/矩形备份 6.png') 1x,
    url('../../images/dashboard/bg/矩形备份 6@2x.png') 2x
  );
}

.item__icon { width: 44px; height: 44px; object-fit: contain; justify-self: center; }
.item__label { font-size: 14px; color: rgba(231, 162, 23, 0.95); font-weight: 700; white-space: nowrap; }
.item--male .item__label { color: #2a6ff0; }

.item__value {
  justify-self: end; /* 不依赖 margin 推动，避免布局抖动 */
  font-size: 18px; /* 字体再小一点 */
  font-weight: 800;
  white-space: nowrap; /* 不能换行 */
}

/* 数字与单位之间留间隔 */
.item__value .unit { margin-left: 6px; font-size: 0.8em; opacity: 0.95; }

.item__value--female { color: #ff9a1a; }
.item__value--male { color: #2c6eff; }

@media (max-width: 1280px) {
  .num { font-size: 44px; }
  .stage { width: 96px; height: 80px; }
  .label { font-size: 14px; }
  .item { height: 64px; grid-template-columns: 88px auto 1fr; }
  .item__icon { width: 40px; height: 40px; }
  .item__label { font-size: 13px; }
  .item__value { font-size: 16px; }
}

/* 留白由父布局控制：见 Dashboard.vue 中 .panel > .title-img { margin-bottom: 8px; } */
</style>
