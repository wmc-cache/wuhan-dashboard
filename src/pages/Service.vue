<template>
  <main class="more__grid">
    <section class="mod">
      <h3 class="mod__title">服务大厅（模拟）</h3>
      <div class="mod__body">
        <div class="service-list">
          <button v-for="s in services" :key="s.code" class="svc" type="button">
            <i class="dot" aria-hidden="true"></i>
            <span class="label">{{ s.name }}</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 假数据：常用服务入口
const services = [
  { code: 'consult', name: '在线咨询' },
  { code: 'help', name: '困难帮扶申报' },
  { code: 'train', name: '技能培训报名' },
  { code: 'med', name: '医疗互助查询' },
  { code: 'union', name: '建会指导预约' }
];
</script>

<style scoped lang="scss">
.more__grid { height: 970px; padding: 0 20px 20px; display: grid; }
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.service-list { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 12px; }
.svc { display: inline-grid; place-items: center; row-gap: 8px; padding: 16px 10px; border-radius: 10px; border: 1px solid rgba(120,170,255,.25); background: rgba(255,255,255,.78); color: #2a6ff0; font-weight: 800; cursor: pointer; }
.svc:hover { background: rgba(88,151,255,.08); }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #2a6ff0; box-shadow: 0 0 0 4px rgba(42,111,240,.12); }
</style>
