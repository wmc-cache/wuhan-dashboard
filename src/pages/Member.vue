<template>
  <main class="dash__main">
    <section class="col col--center">
      <div class="panel panel--blank h860">工会会员（空白页）</div>
    </section>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.dash__main { display: grid; grid-template-columns: 1fr; gap: 20px; padding: 0 20px 20px; height: 980px; }
.col { display: grid; grid-template-rows: 860px; }
.panel { background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(236,245,255,0.85)); border: 1px solid rgba(67,127,255,0.25); border-radius: 12px; box-shadow: 0 10px 30px rgba(45,110,255,0.12), inset 0 1px 0 rgba(255,255,255,0.7); padding: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #366ad8; letter-spacing: 2px; }
.panel--blank { background: radial-gradient(70% 70% at 50% 40%, #f6f9ff 0%, #edf3ff 100%); }
.h860 { height: 860px; }
</style>
