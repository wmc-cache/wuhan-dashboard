<template>
  <header class="hd">
    <!-- 顶部贯穿细蓝条 -->
    <div class="hd__baseline" />

    <!-- 左侧分组 -->
    <nav class="nav nav--left">
      <a class="tab tab--active"><span>首页</span></a>
      <a class="tab">工会组织</a>
      <a class="tab">工会会员</a>
    </nav>

    <!-- 中间大标题 -->
    <div class="title">
      <div class="title__cap"></div>
      <div class="title__cap-outline"></div>
      <div class="title__arrow"></div>
      <h1 class="title__text">武汉市总工会数据驾驶舱</h1>
    </div>

    <!-- 右侧分组 -->
    <nav class="nav nav--right">
      <a class="tab">劳模信息</a>
      <a class="tab">医疗互助</a>
      <a class="tab tab--more">更多 <i class="caret"/></a>
    </nav>
  </header>
</template>

<script setup lang="ts">
// purely presentational
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
  padding: 0 24px;
  position: relative;
  /* 顶部标题使用整幅图片 */
    background-position: center top;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('../images/top/top.png');
    background-image: -webkit-image-set(url('../images/top/top.png') 1x,
        url('../images/top/top@2x.png') 2x);
    background-image: image-set(url('../images/top/top.png') 1x,
        url('../images/top/top@2x.png') 2x);
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
.nav { display: flex; gap: 26px; align-items: center; z-index: 1; padding-top: 4px; }
/* 右侧菜单靠右对齐，保证与左侧对称 */
.nav--right { justify-content: flex-end; }






.tab--more .caret {
  display: inline-block; margin-left: 6px; width: 0; height: 0;
  border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #d9e8ff;
}

.nav--left, .nav--right { position: relative; padding-inline: 16px; }
.nav--left::before { clip-path: polygon(0 0, calc(100% - 78px) 0, calc(100% - 40px) 100%, 0 100%); }
.nav--right::before { clip-path: polygon(78px 0, 100% 0, 100% 100%, 40px 100%); }



@media (max-width: 1680px) {
  .title__text { font-size: 36px; letter-spacing: 4px; }
  .tab { min-width: 112px; height: 40px; line-height: 40px; }
}
</style>
