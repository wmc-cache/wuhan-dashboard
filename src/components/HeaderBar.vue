<template>
  <header class="hd">

    <!-- 左侧分组（文字替换为图片） -->
    <nav class="nav nav--left">
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'home' }" aria-label="首页" :aria-current="activeTab === 'home' ? 'page' : undefined" :to="{ name: 'home' }">
        <span class="tab__img tab__img--home" aria-hidden="true"></span>
      </RouterLink>
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'org' }" aria-label="工会组织" :aria-current="activeTab === 'org' ? 'page' : undefined" :to="{ name: 'org' }">
        <span class="tab__img tab__img--org" aria-hidden="true"></span>
      </RouterLink>
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'member' }" aria-label="工会会员" :aria-current="activeTab === 'member' ? 'page' : undefined" :to="{ name: 'member' }">
        <span class="tab__img tab__img--member" aria-hidden="true"></span>
      </RouterLink>
    </nav>

    <!-- 中间大标题 -->
    <div class="title">
      <div class="title__cap"></div>
      <div class="title__cap-outline"></div>
      <div class="title__arrow"></div>
      <h1 class="title__text">武汉市总工会数据驾驶舱</h1>
    </div>

    <!-- 右侧分组（文字替换为图片） -->
    <nav class="nav nav--right">
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'laomo' }" aria-label="劳模信息" :aria-current="activeTab === 'laomo' ? 'page' : undefined" :to="{ name: 'laomo' }">
        <span class="tab__img tab__img--laomo" aria-hidden="true"></span>
      </RouterLink>
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'yiliao' }" aria-label="医疗互助" :aria-current="activeTab === 'yiliao' ? 'page' : undefined" :to="{ name: 'yiliao' }">
        <span class="tab__img tab__img--yiliao" aria-hidden="true"></span>
      </RouterLink>
      <a class="tab tab--more" aria-label="更多">
        <span class="tab__img tab__img--more" aria-hidden="true"></span>
        <i class="caret" />
      </a>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// 当前激活的 tab id（与路由 name 对应）
type TabId = 'home' | 'org' | 'member' | 'laomo' | 'yiliao';
const route = useRoute();
const activeTab = computed<TabId>(() => (route.name as TabId) || 'home');
</script>

<style scoped lang="scss">
$blue-s: #2a6ff0;
$blue-e: #4298ff;
$blue-deep: #1662e8;
$orange-s: #ff9e3c;
$orange-e: #ff7a33;
$glow: rgba(61,127,255,0.35);

.hd {
  height: 110px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  /* 顶部横幅已移至 ScaleBox 全屏容器绘制，这里去掉背景与左右留白 */
  padding: 0;
  position: relative;
}
  
  .hd__baseline {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 72px;
    height: 16px;
    border-radius: 8px;
    z-index: 0;
  }
  
  /* 中间标题 */
  .title {
    position: relative;
    height: 88px;
    display: grid;
    place-items: center;
    z-index: 1;
  }
  
  /* 隐藏文字标题，改用背景图片展示 */
  .title__text {
    display: none;
  }

/* 左右导航 */
.nav {
  display: flex;
  /* 根据整体缩放自动缩小间距，但不小于 12px，避免极小缩放时拥挤 */
  gap: max(12px, calc(26px * var(--sb-scale, 1)));
  align-items: center;
  z-index: 1;
  padding-top: 4px;
}
/* 顶部菜单字体：统一白色 + 深色描边与阴影，保证在浅色底纹上可读 */
.nav .tab,
.nav .tab:link,
.nav .tab:visited {
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 20px;
  text-decoration: none;
  -webkit-text-stroke: 0.35px rgba(10, 60, 140, 0.6);
  text-shadow: 0 1px 2px rgba(0,0,0,0.35), 0 0 6px rgba(30, 100, 220, 0.25);
}
.nav .tab {
  position: relative; /* needed for active bg */
  z-index: 0; /* create stacking context for ::before */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px; /* 与左右菜单底纹高度一致，便于居中 */
  /* 给每个按钮一个不小于高亮底纹的最小宽度，防止极小缩放下视觉重叠 */
  min-width: 150px;
  cursor: pointer;
}
.nav .tab:hover { color: #fff; opacity: 0.96; }
.tab--active { color: #fff; }
/* 激活态：使用 active-tab 图做底纹背景 */
.tab--active::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 150px; /* 1x 尺寸 */
  height: 60px; /* 1x 尺寸 */
  background-repeat: no-repeat;
  background-size: contain;
  background-image: -webkit-image-set(
    url('../images/active-tab/1x.png') 1x,
    url('../images/active-tab/2x.png') 2x
  );
  background-image: image-set(
    url('../images/active-tab/1x.png') 1x,
    url('../images/active-tab/2x.png') 2x
  );
  pointer-events: none;
  z-index: -1; /* stay behind text/icon */
}
/* 右侧菜单靠右对齐，保证与左侧对称 */
.nav--right { justify-content: flex-end; }






.tab--more .caret {
  display: inline-block; margin-left: 6px; width: 0; height: 0;
  border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #fff;
  filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35));
}

.tab__img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; vertical-align: middle; }
/* 图片文字：根据 1x 实际尺寸定义，自动适配 2x */
.tab__img--home { width: 42px; height: 22px; background-image: -webkit-image-set(url('../images/font/首页/首页.png') 1x, url('../images/font/首页/首页@2x.png') 2x); background-image: image-set(url('../images/font/首页/首页.png') 1x, url('../images/font/首页/首页@2x.png') 2x); }
.tab__img--org { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/font/工会组织/工会组织.png') 1x, url('../images/font/工会组织/工会组织@2x.png') 2x); background-image: image-set(url('../images/font/工会组织/工会组织.png') 1x, url('../images/font/工会组织/工会组织@2x.png') 2x); }
.tab__img--member { width: 73px; height: 16px; background-image: -webkit-image-set(url('../images/font/工会会员/工会会员.png') 1x, url('../images/font/工会会员/工会会员@2x.png') 2x); background-image: image-set(url('../images/font/工会会员/工会会员.png') 1x, url('../images/font/工会会员/工会会员@2x.png') 2x); }
.tab__img--laomo { width: 73px; height: 16px; background-image: -webkit-image-set(url('../images/font/劳模信息/劳模信息.png') 1x, url('../images/font/劳模信息/劳模信息@2x.png') 2x); background-image: image-set(url('../images/font/劳模信息/劳模信息.png') 1x, url('../images/font/劳模信息/劳模信息@2x.png') 2x); }
.tab__img--yiliao { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/font/医疗互助/医疗互助.png') 1x, url('../images/font/医疗互助/医疗互助@2x.png') 2x); background-image: image-set(url('../images/font/医疗互助/医疗互助.png') 1x, url('../images/font/医疗互助/医疗互助@2x.png') 2x); }
.tab__img--more { width: 37px; height: 16px; background-image: -webkit-image-set(url('../images/font/更多/更多.png') 1x, url('../images/font/更多/更多@2x.png') 2x); background-image: image-set(url('../images/font/更多/更多.png') 1x, url('../images/font/更多/更多@2x.png') 2x); }

.nav--left,
.nav--right {
  position: relative;
  /* 贴边显示装饰背景，去掉默认内边距 */
  padding-inline: 0;
  z-index: 1;
  /* create stacking context so text sits above the bg pseudo-element */
}

/* 左/右菜单底纹背景（跟随舞台等比缩放） */
.nav--left::before,
.nav--right::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 482px;
  height: 40px;
  /* 设计尺寸，随 ScaleBox 一起等比缩放 */
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: none;
  z-index: -1;
    /* keep decorative bg behind the nav text */
}
.nav--left::before {
  left: 0;
  background-image: -webkit-image-set(
    url('../images/left-menu-bg/1x.png') 1x,
    url('../images/left-menu-bg/2x.png') 2x
  );
  background-image: image-set(
    url('../images/left-menu-bg/1x.png') 1x,
    url('../images/left-menu-bg/2x.png') 2x
  );
}
.nav--right::before {
  right: 0;
  background-image: -webkit-image-set(
    url('../images/right-menu-bg/1x.png') 1x,
    url('../images/right-menu-bg/2x.png') 2x
  );
  background-image: image-set(
    url('../images/right-menu-bg/1x.png') 1x,
    url('../images/right-menu-bg/2x.png') 2x
  );
}



@media (max-width: 1680px) {
  .title__text { font-size: 36px; letter-spacing: 4px; }
  /* 更窄视口时，适当缩小最小宽度，保证三项也能排下 */
  .tab { min-width: 120px; height: 40px; line-height: 40px; }
}
</style>
