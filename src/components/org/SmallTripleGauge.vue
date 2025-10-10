<template>
  <div class="small3-ring">
    <div class="ring-wrap">
      <img class="ring" :src="ring1x" :srcset="ring2x + ' 2x'" alt="ring" draggable="false" />
      <div class="center">
        <div class="num">{{ fmt(total) }}<span class="arrow" aria-hidden="true">个</span></div>
      </div>
    </div>
    <img class="footer-img" :src="footer1x" :srcset="footer2x + ' 2x'" alt="小三级工会总数" draggable="false" />
  </div>
</template>

<script setup lang="ts">
interface Props { total?: number }
const props = withDefaults(defineProps<Props>(), { total: 6329 });

import ring1x from '../../images/org-v2/ring/编组 9.png';
import ring2x from '../../images/org-v2/ring/编组 9@2x.png';
import footer1x from '../../images/org-v2/小三级工会总数/小三级工会总数.png';
import footer2x from '../../images/org-v2/小三级工会总数/小三级工会总数@2x.png';

function fmt(n?: number) { return (n ?? 0).toLocaleString('zh-CN'); }
</script>

<style scoped lang="scss">
.small3-ring {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto;
  justify-items: center;
  align-items: center;
}

.ring-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.ring {
  width: 154px;
  height: 154px;
}

.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  place-items: center;
  text-align: center;
}

.num {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 1px;
  background: linear-gradient(180deg, #6FA7FF 0%, #1A65FF 90%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 4px 9px rgba(30, 100, 220, 0.18);
}

.arrow {
  display: inline-block;
  margin-left: 2px;
  color: #6FA7FF;
  font-size: 16px;
  transform: translateY(0px);
}

.footer-img {
  height: 17px;
  width: 142px;
}
</style>
