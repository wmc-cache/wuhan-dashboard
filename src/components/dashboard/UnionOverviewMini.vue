<template>
  <div class="u-overview">
    <div v-for="(k, i) in items" :key="i" class="k">
      <i class="k__icon" aria-hidden="true" />
      <div class="k__num">{{ fmt(k.value) }}</div>
      <div class="k__label">{{ k.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 工会概况（三项）占位组件
// 还原原型：三列小卡片，图标缺失时用占位圆形
interface K { label: string; value: number }
interface Props { items?: K[] }
const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { label: '下辖工会', value: 5 },
    { label: '执行厂务公开制度', value: 62 },
    { label: '执行职代会制度', value: 55 },
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
  height: 86px;
  display: grid;
  grid-template-rows: auto auto auto;
  align-content: center;
  justify-items: center;
  row-gap: 4px;
  border: 1px dashed rgba(110, 161, 251, .6); /* 图片缺失时的占位边框 */
  background: rgba(174, 203, 255, 0.16);
}

.k__icon {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(180deg, #CFE2FF 0%, #81A9FF 100%);
  box-shadow: 0 0 0 4px rgba(255,255,255,.55) inset;
}
.k__num { font-size: 22px; font-weight: 800; color: #2c6eff; line-height: 1; }
.k__label { font-size: 14px; font-weight: 700; color: #2a6ff0; text-align: center; white-space: nowrap; }
</style>

