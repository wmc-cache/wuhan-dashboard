<template>
  <div class="gender-wrap">
    <!-- 左侧：钻石主图 -->
    <div class="left">
      <img
        class="diamond"
        :src="diamond1x"
        :srcset="diamond2x + ' 2x'"
        alt="会员钻石"
        draggable="false"
      />
    </div>

    <!-- 右侧：女性 / 男性 两列 -->
    <div class="right">
      <!-- 女性 -->
      <div class="col female">
        <div class="value" :style="{ color: femaleColor }">{{ pretty(femaleCount) }}</div>
        <div class="legend" :style="{ color: femaleColor }">
          <!-- <span class="dot" :style="{ borderColor: femaleColor }"></span> -->
          女性会员
        </div>
        <img class="icon" :src="female1x" :srcset="female2x + ' 2x'" alt="女性会员图标" draggable="false" />
      </div>

      <!-- 男性 -->
      <div class="col male">
        <div class="value" :style="{ color: maleColor }">{{ pretty(maleCount) }}</div>
        <div class="legend" :style="{ color: maleColor }">
          <!-- <span class="dot" :style="{ borderColor: maleColor }"></span> -->
          男性会员
        </div>
        <img class="icon" :src="male1x" :srcset="male2x + ' 2x'" alt="男性会员图标" draggable="false" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 会员性别分布统计（页面左上角）
// 视觉遵循原型：左侧有钻石图，右侧为两个大数字与人像图标

// 左侧主图（1x/2x）
import diamond1x from '../../images/member/title1/编组 6.png';
import diamond2x from '../../images/member/title1/编组 6@2x.png';

// 右侧下方人像图标（女性/男性）（1x/2x）
import female1x from '../../images/member/title2/编组 44.png';
import female2x from '../../images/member/title2/编组 44@2x.png';
import male1x from '../../images/member/title3/编组 17.png';
import male2x from '../../images/member/title3/编组 17@2x.png';

interface Props {
  maleCount?: number;
  femaleCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  // 默认值按照示意图
  maleCount: 343889,
  femaleCount: 343889
});

const maleCount = props.maleCount;
const femaleCount = props.femaleCount;

// 颜色与原型一致：男蓝 女橙
const maleColor = '#2a6ff0';
const femaleColor = '#FFA36B';

function pretty(n?: number) {
  if (typeof n !== 'number') return '-';
  return n.toLocaleString('zh-CN');
}
</script>

<style scoped lang="scss">
.gender-wrap {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: 220px 1fr; /* 左侧主图 + 右侧两列 */
  column-gap: 14px;
  align-items: center;
}

.left { display: grid; place-items: center; }
.diamond { width: 168px; height: auto; max-width: 92%; }

.right {
  height: 100%;
  display: inline-grid; /* 让容器按内容收缩 */
  /* 两列按内容自宽，整体居中，避免被拉伸到很宽 */
  grid-template-columns: repeat(2, max-content);
  justify-content: center;
  justify-self: center; /* 让整个右侧容器以内容宽度居中，而不是拉伸占满列 */
  width: fit-content;
  max-width: 80px;
    /* 上限，确保不会撑到边界 */
  column-gap: 20px;
  align-items: center;
  justify-items: center;
}

.col { display: grid; grid-template-rows: auto auto 1fr; align-items: start; justify-items: center; }
.value {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 1px;
  line-height: 1;
  white-space: nowrap;
}

.legend { margin-top: 6px; display: inline-flex; align-items: center; gap: 6px; font-size: 16px; font-weight: 800; }
.dot {
  width: 12px; height: 12px; border-radius: 2px; border: 2px solid currentColor; box-sizing: border-box;
}

.icon { margin-top: 12px; width: 86px; height: auto; }

/* 轻微自适应，避免极窄时溢出 */
@media (max-width: 1180px) {
  .gender-wrap { grid-template-columns: 200px 1fr; }
  .right { column-gap: 22px; }
  .value { font-size: 34px; }
}
</style>
