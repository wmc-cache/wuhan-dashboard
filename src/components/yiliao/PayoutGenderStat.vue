<template>
  <div class="payout-gender">
    <!-- 左上角标题贴图 -->
    <div class="title-img">
      <img :src="title1x" :srcset="title2x + ' 2x'" alt="给付性别统计" draggable="false" />
    </div>

    <div class="content">
      <!-- 女性（左） -->
      <div class="item female">
        <img class="icon" :src="female1x" :srcset="female2x + ' 2x'" alt="女性" draggable="false" />
        <div class="texts">
          <div class="value" :style="{ color: femaleColor }">
            <CountUpNumber :value="femaleCount" :duration="1500" />
          </div>
          <div class="label" :style="{ color: femaleColor }">女性</div>
        </div>
      </div>

      <!-- 男性（右） -->
      <div class="item male">
        <img class="icon" :src="male1x" :srcset="male2x + ' 2x'" alt="男性" draggable="false" />
        <div class="texts">
          <div class="value" :style="{ color: maleColor }">
            <CountUpNumber :value="maleCount" :duration="1500" />
          </div>
          <div class="label" :style="{ color: maleColor }">男性</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';
import title1x from '../../images/yiliao/part2/title/编组 21.png';
import title2x from '../../images/yiliao/part2/title/编组 21@2x.png';
import male1x from '../../images/yiliao/part2/icon1/编组 17.png';
import male2x from '../../images/yiliao/part2/icon1/编组 17@2x.png';
import female1x from '../../images/yiliao/part2/icon2/编组 18.png';
import female2x from '../../images/yiliao/part2/icon2/编组 18@2x.png';

interface Props { maleCount?: number; femaleCount?: number }
const props = withDefaults(defineProps<Props>(), { maleCount: 343889, femaleCount: 343889 });
const maleCount = computed(() => Number(props.maleCount || 0));
const femaleCount = computed(() => Number(props.femaleCount || 0));

const maleColor = '#2a6ff0';
const femaleColor = '#FFA36B';

</script>

<style scoped lang="scss">
.payout-gender { position: relative; width: 100%; height: 100%; padding: 18px 16px 12px; box-sizing: border-box; }
.title-img { position: absolute; left: 12px; top: 10px; }
.title-img img { display: block; width: 150px; height: auto; }

.content {
  position: absolute;
  inset: 34px 12px 12px 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  margin-top: 40px;
}
.item {
  display: grid;
  grid-template-columns: 150px auto;
  align-items: center;
  justify-content: start;
}

.icon {
  width: 150px;
  height: auto;
  object-fit: contain;
}

.texts {
  display: grid;
  align-content: center;
  justify-content: center;
  row-gap: 10px;
}

.value {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 1px;
}

.label {
  font-size: 18px;
  font-weight: 800;
  text-align: center;
}
</style>
