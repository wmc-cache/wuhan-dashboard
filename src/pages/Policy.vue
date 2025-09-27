<template>
  <main class="more__grid">
    <section class="mod">
      <h3 class="mod__title">政策法规（模拟）</h3>
      <div class="mod__body">
        <ul class="list">
          <li v-for="a in articles" :key="a.id">
            <span class="name">{{ a.title }}</span>
            <span class="meta">{{ a.date }}</span>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 假数据：最近政策 8 条
const articles = [
  { id: 1, title: '武汉市关于推动工会数字化建设的指导意见', date: '2025-04-12' },
  { id: 2, title: '关于开展职工技能提升专项行动的通知', date: '2025-03-30' },
  { id: 3, title: '企业民主管理实施细则（试行）', date: '2025-03-15' },
  { id: 4, title: '产业工人队伍建设改革三年行动计划', date: '2025-02-28' },
  { id: 5, title: '工会经费使用管理办法（修订稿）', date: '2025-02-06' },
  { id: 6, title: '加强劳动关系协调机制建设的若干措施', date: '2025-01-20' },
  { id: 7, title: '关于表彰先进基层工会的决定', date: '2024-12-30' },
  { id: 8, title: '一图读懂：职工医疗互助计划', date: '2024-12-12' }
];
</script>

<style scoped lang="scss">
.more__grid { height: 980px; padding: 0 20px 20px; display: grid; }
.mod { border: none; border-radius: 10px; background: rgba(235,241,247,.74); box-shadow: inset 0 0 40px rgba(120,170,255,.08); padding: 14px; display: grid; grid-template-rows: auto 1fr; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
.list { list-style: none; margin: 0; padding: 0; display: grid; row-gap: 12px; }
.list li { display: grid; grid-template-columns: 1fr auto; align-items: center; column-gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,.7); box-shadow: 0 1px 0 rgba(120,170,255,.25) inset; }
.name { color: #2a6ff0; font-weight: 700; }
.meta { color: rgba(0,0,0,.45); font-size: 12px; }
</style>
