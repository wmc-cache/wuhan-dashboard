<template>
  <main class="org__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <img
        class="mod__title-img"
        src="../images/org/font-title/1/编组21.png"
        srcset="../images/org/font-title/1/编组21.png 1x, ../images/org/font-title/1/编组21@2x.png 2x"
        alt="工会总数"
      />
      <div class="mod__body">
        <OrgTotal :tile-width="60" :tile-height="54" :font-size="44" />
      </div>
    </section>

    <section style="grid-area: tc;">

      <div class="mod__body">
        <OrgSearchKpis />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <img
        class="mod__title-img"
        src="../images/org/font-title/4/编组21.png"
        srcset="../images/org/font-title/4/编组21.png 1x, ../images/org/font-title/4/编组21@2x.png 2x"
        alt="工会会员总数"
      />
      <div class="mod__body">
        <OrgMemberTotal />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <div class="mod__body">
        <OrgNew />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <img
        class="mod__title-img"
        src="../images/org/font-title/5/编组21.png"
        srcset="../images/org/font-title/5/编组21.png 1x, ../images/org/font-title/5/编组21@2x.png 2x"
        alt="年度工会创建数"
      />
      <div class="mod__body">
        <YearCreate :initial-year="2023" />
      </div>
    </section>

    <section class="mod mod--tall" style="grid-area: mr;">
      <img
        class="mod__title-img"
        src="../images/org/font-title/2/编组21.png"
        srcset="../images/org/font-title/2/编组21.png 1x, ../images/org/font-title/2/编组21@2x.png 2x"
        alt="工会会员数"
      />
      <div class="mod__body">
        <MemberCount :centerNudgePx="-100" />
      </div>
    </section>

    <!-- 底部通栏 -->
    <section class="mod mod--wide" style="grid-area: bl;">
      <img
        class="mod__title-img"
        src="../images/org/font-title/3/编组21.png"
        srcset="../images/org/font-title/3/编组21.png 1x, ../images/org/font-title/3/编组21@2x.png 2x"
        alt="工会区域分布"
      />
      <div class="mod__body">
        <OrgRegionDistribution />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 引入年度工会创建数图表与工会会员数
import YearCreate from '../components/org/YearCreate.vue';
import MemberCount from '../components/org/MemberCount.vue';
import OrgMemberTotal from '../components/org/MemberTotal.vue';
import OrgSearchKpis from '../components/org/SearchKpis.vue';
import OrgTotal from '../components/org/OrgTotal.vue';
import OrgNew from '../components/org/OrgNew.vue';
import OrgRegionDistribution from '../components/org/RegionDistribution.vue';
</script>

<style scoped lang="scss">
/* 页面 3 列栅格，参照原型占比：左右固定，中间自适应 */
.org__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px; /* 左右 540，中间自适应 */
  grid-template-rows: 220px 360px 1fr; /* 顶 220、中 360、下自适应 */
  /* 让右侧“工会会员数”跨两行，底部“工会区域分布”占据两列 */
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bl mr';
  /* 模块间距统一为 10px */
  gap: 15px;
  /* 标题图片统一大小，便于快速整体调节 */
  --title-img-h: 32px; /* 字体（标题）稍大一点 */
}

/* 模块通用卡片：去掉虚线边框，保留圆角与浅背景 */
.mod {
  position: relative;
  /* 使用切图作为模块边框+背景（替换原半透明背景） */
  border: none;
  border-radius: 10px;
  background: none;
  /* 让边框贴图向外“溢出”一点，避免内框占据过宽，造成视觉变窄 */
  padding: 18px;
  display: grid;
  grid-template-rows: auto 1fr;
}

.mod::before {
  content: '';
  position: absolute;
  left: -12px; right: -12px; top: -10px; bottom: -10px; /* overscan，向外扩 10~12px */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x);
  pointer-events: none;
  z-index: -1; /* 放在内容下方 */
}

/* 高模块：使用高比例边框贴图 */
.mod--tall::before {
  background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x);
}

/* 宽模块：使用宽比例边框贴图 */
.mod--wide::before {
  background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
  background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x);
}

.mod__title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2a6ff0;
}

.mod__title-img {
  /* Title image to replace text headings; keeps same spacing as .mod__title */
  display: block;
  height: var(--title-img-h);
  margin: 0 0 10px;
  object-fit: contain;
  /* Prevent blurriness on HiDPI; srcset provides 1x/2x */
}

.mod__body {
  display: grid;
  /* 让图表/组件横向拉伸，避免被居中挤窄 */
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
.mod__body > * { min-width: 0; min-height: 0; }
</style>
