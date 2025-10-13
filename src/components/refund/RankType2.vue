<template>
  <div class="rank-type2" :style="rootVars">
    <div class="header">
      <i class="title-img" v-if="isShowTitleImg" :style="titleStyle" :src="props.titleImg1x"
        aria-hidden="true" />
      <i v-if="showMore" class="more-img" role="button" aria-label="查看更多" @click="$emit('more')" />
    </div>

    <ul class="list">
      <li v-for="(it, i) in rows" :key="it.name + i" class="row">
        <i class="medal" :class="'medal--' + (i + 1)" aria-hidden="true" />
        <span class="name" :title="it.name">{{ it.name }}</span>
        <SegmentedBar class="bar" mode="smooth" :percent="percent(it.value)" :color="barColor" :width="barWidth"
          :height="10" :radius="5" />

        <span class="val">{{ money(it.value) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SegmentedBar from '../SegmentedBar.vue';
import titleImg1x from '../../images/refund/title4/编组 21.png';
import titleImg2x from '../../images/refund/title4/编组 21@2x.png';


interface Item { name: string; value: number }
interface Props {
  items: Item[];
  maxRows?: number;
  barColor?: string;
  titleImg1x?: string;
  titleImg2x?: string;
  imgWidth?: number;     // 标题图片宽度（px），默认 293
  rowHeight?: number;   // 行高（像素），控制列表每行高度
  showMore?: boolean;   // 是否显示“查看更多”按钮
  widthPercent?: number; // 容器宽度（百分比），默认 90
  center?: boolean;      // 是否水平居中
  isShowTitleImg?: boolean; // 是否显示标题图片
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  maxRows: 5,
  barColor: '#F59E0B',
  titleImg1x,
  titleImg2x,
  imgWidth: 151,
  rowHeight: 46,
  showMore: true,
  widthPercent: 100,
  center: true,
  isShowTitleImg: true,
});

const rows = computed(() => props.items.slice(0, props.maxRows));
const maxV = computed(() => Math.max(1, ...rows.value.map(r => r.value || 0)));
const barWidth = 70; // 留出右侧“名称”列空间
function percent(v: number) { return Math.max(0, Math.min(1, v / maxV.value)); }
function money(v: number) { return Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 3, useGrouping: false }) + '万元'; }

// 根节点样式：行高 + 宽度 + 居中
const rootVars = computed(() => {
  const st: Record<string, string> = { ['--row-h']: (props.rowHeight || 46) + 'px' } as any;
  if (props.widthPercent && props.widthPercent > 0) st.width = props.widthPercent + '%';
  if (props.center) st.margin = '0 auto';
  return st as any;
});
const showMore = computed(() => !!props.showMore);

// 标题切图 + 可配置宽度
const titleStyle = computed(() => {
  if (props.titleImg2x) {
    const v = `-webkit-image-set(url(${props.titleImg1x}) 1x, url(${props.titleImg2x}) 2x)`;
    return { backgroundImage: v as unknown as string, width: props.imgWidth + 'px' };
  }
  return { backgroundImage: `url(${props.titleImg1x})`, width: props.imgWidth + 'px' } as any;
});
</script>

<style scoped lang="scss">
.rank-type2 {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.title-img,
.more-img {
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.title-img {
  width: 151px;
  height: 35px;
  background-image: -webkit-image-set(url('../../images/refund/title4/编组 21.png') 1x, url('../../images/refund/title4/编组 21@2x.png') 2x);
  background-image: image-set(url('../../images/refund/title4/编组 21.png') 1x, url('../../images/refund/title4/编组 21@2x.png') 2x);
}

.more-img {
  width: 59px;
  height: 13px;
  cursor: pointer;
  background-image: -webkit-image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x);
  background-image: image-set(url('../../images/refund/see-all/查看更多.png') 1x, url('../../images/refund/see-all/查看更多@2x.png') 2x);
}

.list {
  list-style: none;
  margin: 0;
  padding: 2px 6px 2px 2px;
  display: grid;
  row-gap: 5px;
}

.row {
  position: relative;
  display: grid;
  grid-template-columns: 34px 1.2fr auto 1fr auto;
  align-items: center;
  column-gap: 12px;
  min-height: var(--row-h, 46px);
  height: var(--row-h, auto);
  background: rgba(174, 203, 255, 0.23);
  border: 1px solid #6DA1FB;
  padding: 5px 10px;
}

/* 名次圆形徽章（1~5） */
.medal {
  width: 28px;
  height: 28px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.medal--1 {
  background-image: -webkit-image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x);
  background-image: image-set(url('../../images/refund/rank-type2/1/位图.png') 1x, url('../../images/refund/rank-type2/1/位图@2x.png') 2x);
}

.medal--2 {
  background-image: -webkit-image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x);
  background-image: image-set(url('../../images/refund/rank-type2/2/位图.png') 1x, url('../../images/refund/rank-type2/2/位图@2x.png') 2x);
}

.medal--3 {
  background-image: -webkit-image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x);
  background-image: image-set(url('../../images/refund/rank-type2/3/位图.png') 1x, url('../../images/refund/rank-type2/3/位图@2x.png') 2x);
}

.medal--4 {
  background-image: -webkit-image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x);
  background-image: image-set(url('../../images/refund/rank-type2/4/编组 20.png') 1x, url('../../images/refund/rank-type2/4/编组 20@2x.png') 2x);
}

.medal--5 {
  background-image: -webkit-image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x);
  background-image: image-set(url('../../images/refund/rank-type2/5/编组 19.png') 1x, url('../../images/refund/rank-type2/5/编组 19@2x.png') 2x);
}

.name {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name--right {
  color: #2a6ff0;
  font-weight: 800;
  font-size: 18px;
  justify-self: start;
}

.bar {
  justify-self: start;
}

.val {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
  text-align: right;
}
</style>
