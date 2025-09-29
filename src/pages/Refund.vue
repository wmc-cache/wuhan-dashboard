<template>
  <main class="more__grid">
    <section class="mod">
      <h3 class="mod__title">经费返还</h3>
      <div class="mod__body">
        <div class="placeholder">
          <p class="title">页面内容待接入</p>
          <p class="desc">这里将展示经费返还相关数据与办理说明。</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 暂无业务逻辑，占位页面以便路由与导航联动
</script>

<style scoped lang="scss">
.more__grid { height: 980px; padding: 0 20px 20px; display: grid; }
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; display: grid; place-items: center; }
.placeholder { text-align: center; padding: 40px 20px; background: rgba(255,255,255,.7); border-radius: 12px; box-shadow: 0 1px 0 rgba(120,170,255,.25) inset; }
.placeholder .title { margin: 0 0 8px; font-weight: 800; font-size: 18px; color: #2a6ff0; }
.placeholder .desc { margin: 0; color: rgba(0,0,0,.55); }
</style>

