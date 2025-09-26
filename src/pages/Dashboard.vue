<template>
  <main class="dash__main">
    <section class="col col--left">
      <div class="panel h180">
        <span class="title-img title-img--org-total" aria-hidden="true"></span>
        <OrgTotal />
      </div>
      <div class="panel h360">
        <span class="title-img title-img--industry" aria-hidden="true"></span>
        <OrgIndustry />
      </div>
      <div class="panel h300">
        <OrgNew />
      </div>
    </section>

    <section class="col col--center">
      <div class="panel panel--map h860">
        <WuhanMap :show-network="false" />
      </div>
    </section>

    <section class="col col--right">
      <div class="panel h180">
        <span class="title-img title-img--member-total" aria-hidden="true"></span>
        <MemberTotal />
      </div>
      <div class="panel h360">
        <span class="title-img title-img--member-xinyetai" aria-hidden="true"></span>
        <MemberNewBiz />
      </div>
      <div class="panel h300">
        <!-- <span class="title-img title-img--member-new" aria-hidden="true"></span> -->
        <MemberNew />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import OrgTotal from '../components/dashboard/OrgTotal.vue';
import OrgIndustry from '../components/dashboard/OrgIndustry.vue';
import OrgNew from '../components/dashboard/OrgNew.vue';
import WuhanMap from '../components/dashboard/WuhanMap.vue';
import MemberTotal from '../components/dashboard/MemberTotal.vue';
import MemberNewBiz from '../components/dashboard/MemberNewBiz.vue';
import MemberNew from '../components/dashboard/MemberNew.vue';
</script>

<style scoped lang="scss">
.dash__main {
  display: grid;
  grid-template-columns: 540px 1fr 540px; /* 左右固定，中间地图自适应 */
  gap: 20px;
  padding: 0 20px 20px;
  height: 980px;
}
.col {
  display: grid;
  gap: 20px;
}

.col--left {
  /* 左列：第一行再减少25px (239px->214px)，最后一行再增加50px (414px->464px) */
  grid-template-rows: 214px 1fr 464px;
}

.col--right {
  /* 右列：第一行再减少25px (239px->214px)，最后一行再增加50px (414px->464px) */
  grid-template-rows: 214px 1fr 464px;
}
.col--center { grid-template-rows: 860px; }
.panel {
  /* 去掉模块背景面板，仅保留内边距与布局 */
    background: none;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 16px;
  }
  
  .panel--map {
    background: none;
  }
.panel > .title-img { display: inline-block; margin-bottom: 8px; }
.h180 { height: 180px; }
.h300 { height: 300px; }
.h360 { height: 360px; }
.h860 { height: 860px; }

/* 首页模块标题使用切图（1x/2x 自适配） */
.title-img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; }
/* 左列：工会组织总数（公会组织总数） 151x35 */
.title-img--org-total { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会组织总数/编组 21备份.png') 1x, url('../images/home-title/公会组织总数/编组 21备份@2x.png') 2x); background-image: image-set(url('../images/home-title/公会组织总数/编组 21备份.png') 1x, url('../images/home-title/公会组织总数/编组 21备份@2x.png') 2x); }
/* 左列：工会行业分布（公会行页分布） 151x35 */
.title-img--industry { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会行页分布/编组 17.png') 1x, url('../images/home-title/公会行页分布/编组 17@2x.png') 2x); background-image: image-set(url('../images/home-title/公会行页分布/编组 17.png') 1x, url('../images/home-title/公会行页分布/编组 17@2x.png') 2x); }
/* 左列：新增工会（新增公会） 110x35 */
.title-img--org-new { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x); background-image: image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x); }
/* 右列：工会会员总数（公会会员总数） 151x35 */
.title-img--member-total { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会会员总数/编组 21.png') 1x, url('../images/home-title/公会会员总数/编组 21@2x.png') 2x); background-image: image-set(url('../images/home-title/公会会员总数/编组 21.png') 1x, url('../images/home-title/公会会员总数/编组 21@2x.png') 2x); }
/* 右列：工会会员新增 → 使用“公会会员新业态分布”切图 212x35 */
.title-img--member-xinyetai { width: 212px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会会员新业态分布/编组 22.png') 1x, url('../images/home-title/公会会员新业态分布/编组 22@2x.png') 2x); background-image: image-set(url('../images/home-title/公会会员新业态分布/编组 22.png') 1x, url('../images/home-title/公会会员新业态分布/编组 22@2x.png') 2x); }
/* 右列：新增会员 110x35 */
.title-img--member-new { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/新增会员/编组 25.png') 1x, url('../images/home-title/新增会员/编组 25@2x.png') 2x); background-image: image-set(url('../images/home-title/新增会员/编组 25.png') 1x, url('../images/home-title/新增会员/编组 25@2x.png') 2x); }
</style>
