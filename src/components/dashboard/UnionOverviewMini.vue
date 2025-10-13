<template>
  <!-- 工会概览（3 项）-->
  <div class="u-overview">
    <div v-for="(k, i) in items" :key="i" class="k">
      <i class="k__bg" aria-hidden="true" />
      <i class="k__icon" aria-hidden="true" />
      <div class="k__label">{{ k.label }}</div>
      <div class="k__num">{{ fmt(k.value) }}<span class="k__unit">个</span></div>
    </div>
  </div>

</template>

<script setup lang="ts">
// 工会概览模块（参考图还原）
// 使用切图：src/images/dashboard/part1/{1..6}
// 1/2/3 为三张矩形底图；4/5/6 为三枚圆形图标
interface K { label: string; value: number }
interface Props { items?: K[] }
const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { label: '下辖工会', value: 5 },
    { label: '执行厂务公开制度', value: 62 },
    { label: '执行职代会制度', value: 5 },
  ]),
});

const items = props.items;
function fmt(n?: number) { return (n ?? 0).toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.u-overview {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  align-items: center;
  justify-items: center;
}

.k {
  width: 100%;
  height: 164px;
  width: 168px;
  position: relative;
  display: grid;
  grid-template-rows: auto auto auto;
  align-content: center;
  justify-items: center;
  row-gap: 4px;
}

.k__bg {
  /* 背景矩形切图（1x/2x） */
  position: absolute;
  inset: 0;
  z-index: -1;
  display: block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.k:nth-child(1)>.k__bg {
  background-image: -webkit-image-set(url('../../images/dashboard/part1/1/矩形.png') 1x, url('../../images/dashboard/part1/1/矩形@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part1/1/矩形.png') 1x, url('../../images/dashboard/part1/1/矩形@2x.png') 2x);
}

.k:nth-child(2)>.k__bg {
  background-image: -webkit-image-set(url('../../images/dashboard/part1/2/矩形备份 4.png') 1x, url('../../images/dashboard/part1/2/矩形备份 4@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part1/2/矩形备份 4.png') 1x, url('../../images/dashboard/part1/2/矩形备份 4@2x.png') 2x);
}

.k:nth-child(3)>.k__bg {
  background-image: -webkit-image-set(url('../../images/dashboard/part1/3/矩形备份 5.png') 1x, url('../../images/dashboard/part1/3/矩形备份 5@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part1/3/矩形备份 5.png') 1x, url('../../images/dashboard/part1/3/矩形备份 5@2x.png') 2x);
}

.k__icon {
  width: 90px;
  height: 90px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.k:nth-child(1)>.k__icon {
  background-image: -webkit-image-set(url('../../images/dashboard/part1/4/编组 11.png') 1x, url('../../images/dashboard/part1/4/编组 11@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part1/4/编组 11.png') 1x, url('../../images/dashboard/part1/4/编组 11@2x.png') 2x);
}

.k:nth-child(2)>.k__icon {
  background-image: -webkit-image-set(url('../../images/dashboard/part1/5/编组 31.png') 1x, url('../../images/dashboard/part1/5/编组 31@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part1/5/编组 31.png') 1x, url('../../images/dashboard/part1/5/编组 31@2x.png') 2x);
}

.k:nth-child(3)>.k__icon {
  background-image: -webkit-image-set(url('../../images/dashboard/part1/6/编组 32.png') 1x, url('../../images/dashboard/part1/6/编组 32@2x.png') 2x);
  background-image: image-set(url('../../images/dashboard/part1/6/编组 32.png') 1x, url('../../images/dashboard/part1/6/编组 32@2x.png') 2x);
}

.k__num {
  font-size: 22px;
  font-weight: 800;
  color: #2c6eff;
  line-height: 1;
}

.k__unit {
  font-size: 12px;
  margin-left: 4px;
  font-weight: 700;
}

.k__label {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  text-align: center;
  white-space: nowrap;
}

/* 中间卡片（绿色）文字主色差异 */
.k:nth-child(2) .k__num {
  color: #25c56b;
}


.k:nth-child(3) .k__num {
  color: #1DAFE9;
}


</style>


