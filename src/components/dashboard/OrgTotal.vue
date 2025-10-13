<template>
  <div class="org-total">
    <!-- 左侧：3D 漏斗 + 总数（还原参考图：18,897 人 + 下方标题） -->
    <div class="org-total__left">
      <div class="cone">
        <i class="cone__img" aria-hidden="true"></i>
        <div class="cone__num">
          {{ formatNumber(total) }} <span class="cone__unit">人</span>
        </div>

      </div>
      <div class="cone__label">帮扶职工总数</div>
    </div>

    <!-- 右侧：困难类型三项（蓝/绿/橙，与参考图一致） -->
    <ul class="org-total__list" role="list">
      <li class="list-item list-item--blue">
        <i class="list-item__bg" aria-hidden="true"></i>
        <span class="dot dot--blue" aria-hidden="true"></span>
        <span class="label">深度困难</span>
        <span class="value value--blue">{{ deep }}人</span>
      </li>
      <li class="list-item list-item--green">
        <i class="list-item__bg" aria-hidden="true"></i>
        <span class="dot dot--green" aria-hidden="true"></span>
        <span class="label">相对困难</span>
        <span class="value value--green">{{ relative }}人</span>
      </li>
      <li class="list-item list-item--orange">
        <i class="list-item__bg" aria-hidden="true"></i>
        <span class="dot dot--orange" aria-hidden="true"></span>
        <span class="label">意外致困</span>
        <span class="value value--orange">{{ accident }}人</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  total?: number; // 帮扶职工总数
  deep?: number; // 深度困难人数
  relative?: number; // 相对困难人数
  accident?: number; // 意外致困人数
}
const props = withDefaults(defineProps<Props>(), {
  total: 18897,
  deep: 500,
  relative: 100,
  accident: 50,
});

const { total, deep, relative, accident } = props;

function formatNumber(n: number): string {
  return n.toLocaleString('zh-CN');
}
</script>

<style scoped lang="scss">
.org-total {
  height: 100%;
  display: grid;
  grid-template-columns: 240px 263px;
  /* 左侧圆锥 + 右侧列表 */
  gap: 24px;
  align-items: center;
}

/* 左侧圆锥与数字 */
.org-total__left {
  display: grid;
  justify-items: center;
  align-content: start;
  row-gap: 6px;
}

.cone {
  position: relative;
  width: 160px;
  height: 150px;
  display: grid;
  place-items: center;
}

.cone__img {
  display: block;
  width: 123px;
  height: 147px;
  /* 1x 尺寸 */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../../images/org-total/3D圆锥/编组 11.png') 1x,
      url('../../images/org-total/3D圆锥/编组 11@2x.png') 2x);
  background-image: image-set(url('../../images/org-total/3D圆锥/编组 11.png') 1x,
      url('../../images/org-total/3D圆锥/编组 11@2x.png') 2x);
}

.cone__num {
  white-space: nowrap;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-40%);
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(180deg, #4a93ff 0%, #2a6ff0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 8px rgba(38, 112, 255, 0.35);
}

.cone__unit {
  font-size: 16px;
  color: #2a6ff0;
}
.cone__label {
  font-size: 18px;
  color: #2a6ff0;
  letter-spacing: 1px;
  font-weight: 600;
}

/* 右侧三项卡片 */
.org-total__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 16px;
}

.list-item {
  position: relative;
  height: 47px;
  display: grid;
  grid-template-columns: 28px auto 1fr;
  align-items: center;
  padding: 0 16px 0 52px;
}

.list-item__bg {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  opacity: 0.95;
  background-image: -webkit-image-set(url('../../images/org-total/矩形背景/矩形.png') 1x,
      url('../../images/org-total/矩形背景/矩形@2x.png') 2x);
  background-image: image-set(url('../../images/org-total/矩形背景/矩形.png') 1x,
      url('../../images/org-total/矩形背景/矩形@2x.png') 2x);
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 12px;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25) inset;
}

.dot--green {
  background-color: #2ecc71;
}

.dot--orange {
  background-color: #ffaf2e;
}

.dot--blue {
  background-color: #2e7bff;
}

.label {
  font-size: 16px;
  color: #333;
  letter-spacing: 1px;
}

.list-item--green .label {  }
.list-item--orange .label {  }
.list-item--blue .label {  }

.value {
  margin-left: auto;
  font-size: 22px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.value small {
  font-size: 60%;
  opacity: 0.9;
  margin-left: 2px;
}

.value--green {
  color: #25c56b;
}

.value--orange {
  color: #ff9a1a;
}

.value--blue {
  color: #2c6eff;
}

.arrow {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-right: 3px solid currentColor;
  border-top: 3px solid currentColor;
  transform: rotate(-45deg);
  margin-left: 2px;
}

</style>
