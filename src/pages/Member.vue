<template>
  <main class="member__grid">
    <!-- 顶部三块 -->
    <section class="mod" style="grid-area: tl;">
      <!-- 图片标题：会员性别分布统计（1/7） -->
      <span class="title-img title-img--member-1" aria-hidden="true"></span>
      <div class="mod__body">
        <GenderDistribution />
      </div>
    </section>

    <section  style="grid-area: tc;">
      <div class="mod__body">
        <SearchTodayTotal />
      </div>
    </section>

    <section class="mod" style="grid-area: tr;">
      <!-- 图片标题：会员民族分布统计（3/7） -->
      <span class="title-img title-img--member-2" aria-hidden="true"></span>
      <div class="mod__body">
        <EthnicDistribution />
      </div>
    </section>

    <!-- 中部三块 -->
    <section class="mod" style="grid-area: ml;">
      <!-- 图片标题：会员年龄分布统计（4/7） -->
      <span class="title-img title-img--member-3" aria-hidden="true"></span>
      <div class="mod__body">
        <AgeDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: mc;">
      <!-- 图片标题：年入会数统计（5/7） -->
      <span class="title-img title-img--member-7" aria-hidden="true"></span>
      <div class="mod__body">
        <YearJoin :initial-year="2023" />
      </div>
    </section>

    <section class="mod" style="grid-area: mr;">
      <!-- 图片标题：会员类型统计（6/7） -->
      <span class="title-img title-img--member-4" aria-hidden="true"></span>
      <div class="mod__body">
        <MemberType />
      </div>
    </section>

    <!-- 底部：左通栏 + 右表格 -->
    <section class="mod mod--wide" style="grid-area: bl;">
      <!-- 图片标题：会员区域分布（7/7） -->
      <span class="title-img title-img--member-5" aria-hidden="true"></span>
      <div class="mod__body">
        <RegionDistribution />
      </div>
    </section>

    <section class="mod" style="grid-area: br;">
      <div class="mod__body">
        <MemberNew />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import YearJoin from '../components/member/YearJoin.vue';
import MemberType from '../components/member/MemberType.vue';
import AgeDistribution from '../components/member/AgeDistribution.vue';
import EthnicDistribution from '../components/member/EthnicDistribution.vue';
import RegionDistribution from '../components/member/RegionDistribution.vue';
import MemberNew from '../components/member/MemberNew.vue';
import GenderDistribution from '../components/member/GenderDistribution.vue';
import SearchTodayTotal from '../components/member/SearchTodayTotal.vue';

</script>

<style scoped lang="scss">
/* 页面 3 列栅格：左右 540，中间自适应；行高对齐原型 */
.member__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 220px 360px 1fr;
  /* 顶 220，中 360，底自适应 */
  grid-template-areas:
    'tl tc tr'
    'ml mc mr'
    'bl bl br';
  /* 模块间距统一为 10px */
  gap: 10px;
}

/* 模块通用外观：去掉虚线框，保留圆角与背景 */
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod--tall::before { background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); }
.mod--wide::before { background-image: -webkit-image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-width/矩形.png') 1x, url('../images/module-broder-width/矩形@2x.png') 2x); }

.mod__title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2a6ff0;
}

.mod__body {
  display: grid;
  place-items: stretch;
  color: rgba(34, 110, 230, 0.8);
  font-size: 18px;
}
.mod__body > * { min-width: 0; min-height: 0; }

/* 图片标题（替换文字标题） */
.mod > .title-img { display: inline-block; margin-bottom: 8px; }
.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }

/* 会员页标题切图（按版块顺序 1~7） */
/* 1 顶左：会员性别分布统计 191x35 */
.title-img--member-1 { width: 191px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/1/编组 21.png') 1x, url('../images/member/font-title/1/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/1/编组 21.png') 1x, url('../images/member/font-title/1/编组 21@2x.png') 2x); }

.title-img--member-2 { width: 191px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/2/编组 21.png') 1x, url('../images/member/font-title/2/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/2/编组 21.png') 1x, url('../images/member/font-title/2/编组 21@2x.png') 2x); }
/* 3 顶右：会员民族分布统计 191x35 */
.title-img--member-3 { width: 191px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/3/编组 21.png') 1x, url('../images/member/font-title/3/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/3/编组 21.png') 1x, url('../images/member/font-title/3/编组 21@2x.png') 2x); }
/* 4 中左：会员年龄分布统计 151x35 */
.title-img--member-4 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/4/编组 21.png') 1x, url('../images/member/font-title/4/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/4/编组 21.png') 1x, url('../images/member/font-title/4/编组 21@2x.png') 2x); }
/* 5 中中：年入会数统计 151x35 */
.title-img--member-5 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/5/编组 21.png') 1x, url('../images/member/font-title/5/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/5/编组 21.png') 1x, url('../images/member/font-title/5/编组 21@2x.png') 2x); }
/* 6 中右：会员类型统计 110x35 */
.title-img--member-6 { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/6/编组 21.png') 1x, url('../images/member/font-title/6/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/6/编组 21.png') 1x, url('../images/member/font-title/6/编组 21@2x.png') 2x); }
/* 7 底左：会员区域分布 151x35 */
.title-img--member-7 { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/member/font-title/7/编组 21.png') 1x, url('../images/member/font-title/7/编组 21@2x.png') 2x); background-image: image-set(url('../images/member/font-title/7/编组 21.png') 1x, url('../images/member/font-title/7/编组 21@2x.png') 2x); }
</style>
