<template>
  <main class="aid__grid">
    <AidKpiRow style="grid-column: 1 / -1;" />
    <AidGenderAgePanel style="grid-column: 1 / span 2; grid-row: 2;" />
    <AidUnitRanking style="grid-area: mr;" />
    <AidTypePeople style="grid-area: bl;" />
    <AidTypeAmount style="grid-area: bc;" />
    <AidRecentList style="grid-area: br;" />
  </main>
</template>

<script setup lang="ts">
import AidKpiRow from '../components/aid/KpiRow.vue';
import AidGenderAgePanel from '../components/aid/GenderAgePanel.vue';
import AidUnitRanking from '../components/aid/UnitRanking.vue';
import AidTypePeople from '../components/aid/TypePeople.vue';
import AidTypeAmount from '../components/aid/TypeAmount.vue';
import AidRecentList from '../components/aid/RecentList.vue';
</script>

<style scoped lang="scss">
.aid__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  /* 让左、中两列等宽，右列保持 540px（与右侧榜单一致） */
  grid-template-columns: 1fr 1fr 540px;
  grid-template-rows: 120px 1fr 1fr;
  grid-template-areas:
    'kpi kpi kpi'
    'ml mc mr'
    'bl bc br';
  /* 模块间距统一为 10px */
  gap: 10px;
}
</style>
