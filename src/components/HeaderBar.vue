<template>
  <header class="hd">
    <!-- 左侧分组（文字替换为图片） -->
    <nav class="nav nav--left">
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'dashboard' }" aria-label="首页"
        :aria-current="activeTab === 'dashboard' ? 'page' : undefined" :to="{ name: 'dashboard' }">
        <span class="tab__img tab__img--home" aria-hidden="true"></span>
      </RouterLink>
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'org' }" aria-label="工会组织"
        :aria-current="activeTab === 'org' ? 'page' : undefined" :to="{ name: 'org' }">
        <span class="tab__img tab__img--org" aria-hidden="true"></span>
      </RouterLink>
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'member' }" aria-label="工会会员"
        :aria-current="activeTab === 'member' ? 'page' : undefined" :to="{ name: 'member' }">
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
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'laomo' }" aria-label="劳模信息"
        :aria-current="activeTab === 'laomo' ? 'page' : undefined" :to="{ name: 'laomo' }">
        <span class="tab__img tab__img--laomo" aria-hidden="true"></span>
      </RouterLink>
      <RouterLink class="tab" :class="{ 'tab--active': activeTab === 'yiliao' }" aria-label="医疗互助"
        :aria-current="activeTab === 'yiliao' ? 'page' : undefined" :to="{ name: 'yiliao' }">
        <span class="tab__img tab__img--yiliao" aria-hidden="true"></span>
      </RouterLink>
      <a class="tab tab--more" aria-label="更多" :class="{ 'tab--active': isMoreActive }"
        :aria-expanded="moreOpen ? 'true' : 'false'" @click.prevent="toggleMore">
        <span v-if="moreDisplayLabel === '更多'" class="tab__img tab__img--more" aria-hidden="true"></span>
        <!-- 当选择“更多”中的某一项后，使用对应的图片文案替换文字 -->
        <span v-else class="tab__img" :class="moreImgClass" aria-hidden="true"></span>
        <i class="caret" />
      </a>
      <!-- 下拉菜单：模拟数据，点击切换不同页面 -->
      <div v-if="moreOpen" class="more-menu" role="menu">
        <RouterLink v-for="m in moreMenus" :key="m.name" class="more-item" role="menuitem" :to="{ name: m.name }"
          @click="closeMore">{{ m.label }}</RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

type TabId = 'dashboard' | 'org' | 'member' | 'laomo' | 'yiliao';
const route = useRoute();
const activeTab = computed<TabId>(() => (route.name as TabId) || 'dashboard');

// “更多”下拉的真实条目
// 新增：职工帮扶（指向我们新增的 AidV2 页面）
const moreMenus = [
  { label: '职工帮扶', name: 'aid-v2' },
  { label: '困难救助', name: 'aid' },
  { label: '经费返还', name: 'refund' }
] as const;

const moreOpen = ref(false);
function toggleMore() { moreOpen.value = !moreOpen.value; }
function closeMore() { moreOpen.value = false; }

function onDocClick(e: MouseEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return;
  if (!t.closest('.tab--more') && !t.closest('.more-menu')) closeMore();
}
// “更多”tab 的高亮与显示文本：当路由命中下拉列表时，高亮并把文案替换为所选菜单名
const isMoreActive = computed(() => moreMenus.some(m => m.name === (route.name as string)));
const moreDisplayLabel = computed(() => {
  const cur = moreMenus.find(m => m.name === (route.name as string));
  return cur ? cur.label : '更多';
});
// 选择后用于显示在“更多”tab上的图片 class
const moreImgClass = computed(() => {
  const cur = moreMenus.find(m => m.name === (route.name as string));
  if (!cur) return '';
  if (cur.name === 'aid-v2') return 'tab__img--worker-aid';
  if (cur.name === 'aid') return 'tab__img--aid';
  return 'tab__img--refund';
});
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<style scoped lang="scss">
.hd {
  height: 110px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0;
  position: relative;
}

.title { position: relative; height: 88px; display: grid; place-items: center; z-index: 1; }
.title__text { display: none; }

.nav { display: flex; gap: max(12px, calc(26px * var(--sb-scale, 1))); align-items: center; z-index: 1; padding-top: 4px; }
.nav .tab, .nav .tab:link, .nav .tab:visited { color: #fff; font-weight: 600; letter-spacing: 0.5px; font-size: 20px; text-decoration: none; -webkit-text-stroke: 0.35px rgba(10,60,140,.6); text-shadow: 0 1px 2px rgba(0,0,0,.35), 0 0 6px rgba(30,100,220,.25); }
.nav .tab { position: relative; z-index: 0; display: inline-flex; align-items: center; justify-content: center; height: 40px; min-width: 150px; cursor: pointer; }
.nav .tab:hover { opacity: .96; }
.tab--active { color: #fff; }
.tab--active::before { content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 150px; height: 60px; background-repeat: no-repeat; background-size: contain; background-image: -webkit-image-set(url('../images/active-tab/1x.png') 1x, url('../images/active-tab/2x.png') 2x); background-image: image-set(url('../images/active-tab/1x.png') 1x, url('../images/active-tab/2x.png') 2x); pointer-events: none; z-index: -1; }
.nav--right { justify-content: flex-end; position: relative; }

/* 左右菜单底纹背景（随缩放） */
.nav--left,
.nav--right { position: relative; padding-inline: 0; z-index: 1; }
.nav--left::before,
.nav--right::before { content: ""; position: absolute; top: 50%; transform: translateY(-50%); width: 482px; height: 40px; background-repeat: no-repeat; background-size: contain; pointer-events: none; z-index: -1; }
.nav--left::before {
  left: 0;
  background-image: -webkit-image-set(url('../images/left-menu-bg/1x.png') 1x, url('../images/left-menu-bg/2x.png') 2x);
  background-image: image-set(url('../images/left-menu-bg/1x.png') 1x, url('../images/left-menu-bg/2x.png') 2x);
}
.nav--right::before {
  right: 0;
  background-image: -webkit-image-set(url('../images/right-menu-bg/1x.png') 1x, url('../images/right-menu-bg/2x.png') 2x);
  background-image: image-set(url('../images/right-menu-bg/1x.png') 1x, url('../images/right-menu-bg/2x.png') 2x);
}

.tab--more .caret { display: inline-block; margin-left: 6px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #fff; filter: drop-shadow(0 1px 1px rgba(0,0,0,.35)); }

.tab__img { display: inline-block; background-repeat: no-repeat; background-size: 100% 100%; vertical-align: middle; }
/* 文本态（当下拉选择后，用文字替换“更多”贴合选中项） */
.tab__label { display: inline-block; line-height: 16px; font-weight: 600; }
.tab__img--home { width: 42px; height: 22px; background-image: -webkit-image-set(url('../images/font/首页/首页.png') 1x, url('../images/font/首页/首页@2x.png') 2x); background-image: image-set(url('../images/font/首页/首页.png') 1x, url('../images/font/首页/首页@2x.png') 2x); }
.tab__img--org { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/font/工会组织/工会组织.png') 1x, url('../images/font/工会组织/工会组织@2x.png') 2x); background-image: image-set(url('../images/font/工会组织/工会组织.png') 1x, url('../images/font/工会组织/工会组织@2x.png') 2x); }
.tab__img--member { width: 73px; height: 16px; background-image: -webkit-image-set(url('../images/font/工会会员/工会会员.png') 1x, url('../images/font/工会会员/工会会员@2x.png') 2x); background-image: image-set(url('../images/font/工会会员/工会会员.png') 1x, url('../images/font/工会会员/工会会员@2x.png') 2x); }
.tab__img--laomo { width: 73px; height: 16px; background-image: -webkit-image-set(url('../images/font/劳模信息/劳模信息.png') 1x, url('../images/font/劳模信息/劳模信息@2x.png') 2x); background-image: image-set(url('../images/font/劳模信息/劳模信息.png') 1x, url('../images/font/劳模信息/劳模信息@2x.png') 2x); }
.tab__img--yiliao { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/font/医疗互助/医疗互助.png') 1x, url('../images/font/医疗互助/医疗互助@2x.png') 2x); background-image: image-set(url('../images/font/医疗互助/医疗互助.png') 1x, url('../images/font/医疗互助/医疗互助@2x.png') 2x); }
.tab__img--more { width: 37px; height: 16px; background-image: -webkit-image-set(url('../images/font/更多/更多.png') 1x, url('../images/font/更多/更多@2x.png') 2x); background-image: image-set(url('../images/font/更多/更多.png') 1x, url('../images/font/更多/更多@2x.png') 2x); }
/* “更多”被替换为两种具体图片态 */
.tab__img--aid { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/more-menu/困难救助/困难救助.png') 1x, url('../images/more-menu/困难救助/困难救助@2x.png') 2x); background-image: image-set(url('../images/more-menu/困难救助/困难救助.png') 1x, url('../images/more-menu/困难救助/困难救助@2x.png') 2x); }
.tab__img--refund { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/more-menu/经费返还/经费返还.png') 1x, url('../images/more-menu/经费返还/经费返还@2x.png') 2x); background-image: image-set(url('../images/more-menu/经费返还/经费返还.png') 1x, url('../images/more-menu/经费返还/经费返还@2x.png') 2x); }
/* 新增：职工帮扶（使用 font/职工帮扶 的图片） */
.tab__img--worker-aid { width: 74px; height: 16px; background-image: -webkit-image-set(url('../images/font/职工帮扶/职工帮扶.png') 1x, url('../images/font/职工帮扶/职工帮扶@2x.png') 2x); background-image: image-set(url('../images/font/职工帮扶/职工帮扶.png') 1x, url('../images/font/职工帮扶/职工帮扶@2x.png') 2x); }

/* 下拉菜单 */
.more-menu { position: absolute; right: 0; top: 100%; margin-top: 8px; min-width: 160px; background: rgba(255,255,255,.96); box-shadow: 0 6px 20px rgba(20,80,200,.18); border: 1px solid rgba(120,170,255,.35); border-radius: 8px; padding: 6px; backdrop-filter: blur(6px); z-index: 10; }
.more-item { display: block; padding: 10px 12px; border-radius: 6px; color: #2a6ff0; font-weight: 700; text-decoration: none; }
.more-item:hover { background: rgba(88,151,255,.1); }


</style>
