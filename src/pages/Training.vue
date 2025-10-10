<template>
  <main class="more__grid">
    <section class="mod">
      <h3 class="mod__title">学习培训（模拟）</h3>
      <div class="mod__body">
        <table class="tbl">
          <thead>
            <tr><th>课程名称</th><th>开课时间</th><th>时长</th><th>讲师</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in courses" :key="c.id">
              <td>{{ c.name }}</td>
              <td>{{ c.time }}</td>
              <td>{{ c.duration }}</td>
              <td>{{ c.teacher }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// 假数据：近期培训课程
const courses = [
  { id: 1, name: '劳动合同与用工合规', time: '2025-10-12 09:00', duration: '2h', teacher: '张老师' },
  { id: 2, name: '基层工会经费管理', time: '2025-10-20 14:00', duration: '1.5h', teacher: '王老师' },
  { id: 3, name: '工会数字化应用实践', time: '2025-11-02 19:00', duration: '2h', teacher: '李老师' },
  { id: 4, name: '班组长领导力提升', time: '2025-11-10 15:00', duration: '3h', teacher: '周老师' }
];
</script>

<style scoped lang="scss">
.more__grid { height: 970px; padding: 0 20px 20px; display: grid; }
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; }
.mod::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod__title { margin: 0 0 10px; font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #2a6ff0; }
.mod__body { overflow: auto; }
.tbl { width: 100%; border-collapse: collapse; }
.tbl th, .tbl td { padding: 10px 12px; border-bottom: 1px solid rgba(120,170,255,.25); text-align: left; }
.tbl th { color: rgba(0,0,0,.55); font-weight: 700; }
.tbl td { color: #2a6ff0; font-weight: 700; }
</style>
