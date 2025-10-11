<template>
  <main class="dash__main">
    <section class="col col--left">
      <div class="panel h360">
        <span class="title-img title-img--industry" aria-hidden="true"></span>

      </div>
      <div class="panel h180">
        <span class="title-img title-img--org-total" aria-hidden="true"></span>
        <OrgTotal />
      </div>
      <div class="panel h300">
        <OrgNew />
      </div>
    </section>

    <section class="col col--center">
      <div class="panel panel--map h860">
        <!-- 中央搜索：放在地图上方，点击跳到 Home 页面（复用 TopSearch） -->
        <div class="map-tools">
          <TopSearch v-model="keyword" v-model:category="selCat" @search="goToHome" />
        </div>
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
import TopSearch from '../components/TopSearch.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const selCat = ref<'org' | 'member'>('org');
const keyword = ref('');
function goToHome() { router.push({ path: '/home', query: { kw: keyword.value || '', cat: selCat.value } }); }
// GridTable 的“查看更多”已在组件内部处理跳转
</script>

<style scoped lang="scss">
.dash__main {
  display: grid;
  grid-template-columns: 540px 1fr 540px; /* 左右固定，中间地图自适应 */
  /* 模块间距统一为 10px */
  gap: 10px;
  padding: 0 20px 20px;
  /* 页面总高 = 1080 - 头部 110 = 970 */
  height: 970px;
}
.col {
  display: grid;
  /* 与主栅格一致 */
  gap: 10px;
}

.col--left {
  grid-template-rows: 1fr 244px 464px;
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
    /* 内边距统一为 18px */
    padding: 18px;
  }
  
  .panel--map {
    background: none;
    display: grid;
    grid-template-rows: auto 1fr;
    align-items: start;
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
.title-img--industry {
  width: 110px;
  height: 35px;
  background-image: -webkit-image-set(url('../images/org-v2/2/编组 21.png') 1x, url('../images/org-v2/2/编组 21@2x.png') 2x);
  background-image: image-set(url('../images/org-v2/2/编组 21.png') 1x, url('../images/org-v2/2/编组 21@2x.png') 2x);
}
/* 左列：新增工会（新增公会） 110x35 */
.title-img--org-new { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x); background-image: image-set(url('../images/home-title/新增公会/编组 18.png') 1x, url('../images/home-title/新增公会/编组 18@2x.png') 2x); }
/* 右列：工会会员总数（公会会员总数） 151x35 */
.title-img--member-total { width: 151px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会会员总数/编组 21.png') 1x, url('../images/home-title/公会会员总数/编组 21@2x.png') 2x); background-image: image-set(url('../images/home-title/公会会员总数/编组 21.png') 1x, url('../images/home-title/公会会员总数/编组 21@2x.png') 2x); }
/* 右列：工会会员新增 → 使用“公会会员新业态分布”切图 212x35 */
.title-img--member-xinyetai { width: 212px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/公会会员新业态分布/编组 22.png') 1x, url('../images/home-title/公会会员新业态分布/编组 22@2x.png') 2x); background-image: image-set(url('../images/home-title/公会会员新业态分布/编组 22.png') 1x, url('../images/home-title/公会会员新业态分布/编组 22@2x.png') 2x); }
/* 右列：新增会员 110x35 */
.title-img--member-new { width: 110px; height: 35px; background-image: -webkit-image-set(url('../images/home-title/新增会员/编组 25.png') 1x, url('../images/home-title/新增会员/编组 25@2x.png') 2x); background-image: image-set(url('../images/home-title/新增会员/编组 25.png') 1x, url('../images/home-title/新增会员/编组 25@2x.png') 2x); }

/* 中央搜索条容器：宽度与 Home 页相似并居中 */
.map-tools { max-width: 760px; margin: 0 auto 10px; width: 100%; }
</style>
