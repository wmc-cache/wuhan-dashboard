<template>
  <div class="kpi-pair">
    <div class="card card--left">
      <div class="num" :class="leftGradient">
        {{ fmt(items[0]?.value) }}<span v-if="items[0]?.unit" class="unit">{{ items[0]?.unit }}</span>
      </div>
      <div class="label">{{ items[0]?.title }}</div>
    </div>
    <div class="card card--right">
      <div class="num" :class="rightGradient">
        {{ fmt(items[1]?.value) }}<span v-if="items[1]?.unit" class="unit">{{ items[1]?.unit }}</span>
      </div>
      <div class="label">{{ items[1]?.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页顶部双 KPI 卡片（与 Member/TopSearchKpis 的卡面视觉一致，不含搜索）
interface KItem { title: string; value: number | string; unit?: string }
interface Props { items?: [KItem, KItem] }
const props = withDefaults(defineProps<Props>(), {
  items: () => ([
    { title: '工会总数(个)', value: 18897, unit: '' },
    { title: '本年度新增工会(个)', value: 12597, unit: '' }
  ])
});

function fmt(v?: number | string) {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString('zh-CN') : String(v ?? '');
}

// 渐变类名，便于左右分别控制颜色（蓝/橙）
const leftGradient = 'num--blue';
const rightGradient = 'num--orange';
</script>

.style-debug { outline: 1px dashed transparent; }

<style scoped lang="scss">
/* 容器：顶部对齐、留少量上边距使其靠近导航条 */
.kpi-pair { display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; align-items: start; height: 100%; padding-top: 6px; }

/* 卡片整图背景（沿用 member-v2 资源） */
.card {
  position: relative;
  height: 133px; /* 高度固定 133px */
  aspect-ratio: 299 / 133; /* 按 299x133 的比例渲染背景 */
  display: grid;
  justify-items: start; /* 文案统一以左对齐，避免视觉漂移 */
  align-content: center;
  row-gap: 6px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding-left: 120px; /* 数字与标题整体右移 */
}
.card--left {
  background-image: -webkit-image-set(url('../../images/member-v2/1/编组 33.png') 1x, url('../../images/member-v2/1/编组 33@2x.png') 2x);
  background-image: image-set(url('../../images/member-v2/1/编组 33.png') 1x, url('../../images/member-v2/1/编组 33@2x.png') 2x);
  
}
.card--right {
  background-image: -webkit-image-set(url('../../images/member-v2/2/编组 40.png') 1x, url('../../images/member-v2/2/编组 40@2x.png') 2x);
  background-image: image-set(url('../../images/member-v2/2/编组 40.png') 1x, url('../../images/member-v2/2/编组 40@2x.png') 2x);
 
}

.num { position: relative; z-index: 1; font-size: 36px; font-weight: 900; letter-spacing: 1px; line-height: 1; text-shadow: 0 6px 14px rgba(45,110,255,0.12); white-space: nowrap;
 margin-top: -20px;
 
}
.num--blue { background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 88%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.num--orange { background: linear-gradient(180deg, #FFB37F 0%, #FE870B 90%); -webkit-background-clip: text; background-clip: text; color: transparent; text-shadow: 0 6px 14px rgba(255,140,20,0.18); }
.unit { margin-left: 6px; font-size: 20px; font-weight: 800; }
.label { position: relative; z-index: 1; margin-top: 4px; margin-left: -10px;font-size: 16px; font-weight: 800; color: #333; white-space: nowrap; }
</style>
