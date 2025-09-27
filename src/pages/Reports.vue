<template>
  <main class="more__grid">
    <section class="mod">
      <h3 class="mod__title">数据报表（模拟）</h3>
      <div class="mod__body">
        <div class="cards">
          <div v-for="k in kpis" :key="k.name" class="card">
            <div class="num">{{ k.value }}</div>
            <div class="name">{{ k.name }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 假数据：关键指标卡片
const kpis = [
  { name: '当月新增工会', value: 36 },
  { name: '当月新增会员', value: 1897 },
  { name: '重点企业覆盖率', value: '92%' },
  { name: '活动开展次数', value: 128 }
];
</script>

<style scoped lang="scss">
.more__grid { height: 980px; padding: 0 20px 20px; display: grid; }
.mod { border: 2px dashed rgba(88,151,255,.8); border-radius: 10px; background: rgba(255,255,255,.45); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 12px; }
.card { background: rgba(255,255,255,.78); border: 1px solid rgba(120,170,255,.25); border-radius: 10px; padding: 16px; text-align: center; }
.num { font-size: 28px; font-weight: 800; color: #2a6ff0; }
.name { margin-top: 6px; color: rgba(0,0,0,.55); font-weight: 700; }
</style>

