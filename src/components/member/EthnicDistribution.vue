<template>
  <div class="ethnic-distribution">
    <RingPie
      :data="items"
      :center="seriesCenter"
      :radius="['48%', '72%']"
      gap-color="rgba(242,247,255,0.95)"
      :border-width="6"
      :emphasis-scale="18"
      enable-pagination
      :page-size="6"
      :initial-active-index="0"
    >
      <!-- 中心图例：按设计稿将位图放在环中心位置 -->
      <template #center>
        <img
          class="legend-img"
          :src="legend1x"
          :srcset="legend2x + ' 2x'"
          alt="民族分布图例"
          draggable="false"
        />
      </template>
    </RingPie>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RingPie from '../RingPie.vue';

// 中心位图（1x/2x）
import legend1x from '../../images/distribution-legend/位图.png';
import legend2x from '../../images/distribution-legend/位图@2x.png';

interface Item { name: string; value: number; color?: string }

interface Props { items?: Item[] }

const props = withDefaults(defineProps<Props>(), {
  // 参考示例数据，可由父组件以 props 覆盖
  items: () => [
    { name: '汉族',     value: 865432, color: '#6F85FF' },
    { name: '其他民族', value: 102500,  color: '#D8D6D2' }
  ]
});

const items = props.items; // 仅读取，不在本地修改

// 调整环形图中心位置，让右侧有足够空间显示图例
const seriesCenter = ref<[string, string]>(['38%', '52%']);
</script>

<style scoped lang="scss">
.ethnic-distribution {
  position: relative;
  height: 100%;
}

/* 中心图例大小根据容器高度适配，避免超出环形内径 */
.legend-img {
  width: 58px;
  height: auto;
  opacity: 0.95;
  user-select: none;
}
</style>

