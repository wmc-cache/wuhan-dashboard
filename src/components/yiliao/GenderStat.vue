<template>
  <div class="gender-stat">
    <!-- 标题贴图 -->
    <div class="title-img" aria-hidden="true">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="参加性别统计" draggable="false" />
    </div>

    <!-- 内容：男女两列 -->
    <div class="content">
      <!-- 男性 -->
      <div class="item male">
        <img class="icon" :src="male1x" :srcset="male2x + ' 2x'" alt="男性" draggable="false" />
        <div class="texts">
          <div class="label">男性</div>
          <div class="value"><span class="num">{{ maleCount }}</span>人</div>
        </div>
      </div>

      <!-- 女性 -->
      <div class="item female">
        <img class="icon" :src="female1x" :srcset="female2x + ' 2x'" alt="女性" draggable="false" />
        <div class="texts">
          <div class="label">女性</div>
          <div class="value"><span class="num">{{ femaleCount }}</span>人</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import title1x from '../../images/yiliao/part1/title/编组 21.png';
import title2x from '../../images/yiliao/part1/title/编组 21@2x.png';
import male1x from '../../images/yiliao/part1/icon1/编组 6.png';
import male2x from '../../images/yiliao/part1/icon1/编组 6@2x.png';
import female1x from '../../images/yiliao/part1/icon2/编组 7.png';
import female2x from '../../images/yiliao/part1/icon2/编组 7@2x.png';

interface Props {
  maleCount?: number;
  femaleCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maleCount: 324,
  femaleCount: 324
});

const maleCount = props.maleCount;
const femaleCount = props.femaleCount;

// 无 JS 逻辑
</script>

<style scoped lang="scss">
.gender-stat {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 18px 12px 12px; /* 顶部为标题留白 */
  box-sizing: border-box;
}

/* 左上角蓝色装饰标题 */
.title-img { position: absolute; left: 12px; top: 10px; }
.title-img img { display: block; width: 150px; height: auto; }

/* 主体：横向排两项 */
.content {
  position: absolute;
  inset: 0 12px 12px 12px; /* 填满卡片，但给边留点内距 */
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  margin-top: 60px;
}

.item { display: grid; grid-template-columns: 110px auto; align-items: center; column-gap: 16px; }
.icon { width: 110px; height: 117px; object-fit: contain; }
.texts { display: grid; row-gap: 6px; align-content: center; }
.label { font-size: 16px; color: #4c5566; }
.value { font-size: 32px; font-weight: 800; letter-spacing: 1px; }
.male .value { color: #2a6ff0; }
.female .value { color: #ff6b97; }
.num { margin-right: 4px; }

/* 自适应较窄屏宽时的缩放与排版微调 */
@media (max-width: 1680px) {
  .item { grid-template-columns: 96px auto; column-gap: 14px; }
  .icon { width: 96px; height: 102px; }
  .value { font-size: 28px; }
}
</style>
