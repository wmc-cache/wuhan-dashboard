<template>
  <div class="search-total">
    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="input-wrap">
        <img class="icon-search" :src="search1x" :srcset="search2x + ' 2x'" alt="搜索" draggable="false" />
        <input class="input" type="text" :placeholder="placeholder" :value="modelValue" @input="onInput"
          @keyup.enter="onSearch" />
      </div>
      <button class="btn" @click="onSearch">搜索</button>
    </div>

    <!-- 标题 -->
    <div class="title">截至今日会员总数为：</div>

    <!-- 数字翻牌（使用切图作为背景） -->
    <div class="digits" role="group" aria-label="今日会员总数">
      <div v-for="(d, i) in paddedDigits" :key="i" class="digit">
        <span class="text">{{ d }}</span>
      </div>
    </div>

    <!-- 辅助信息：环比/进度条 -->
    <div class="meta">
      <div class="incr">
        <span class="arrow-up" aria-hidden="true"></span>
        比上周新增 <span class="num">{{ weeklyIncrease }}</span> 人
      </div>
      <div class="progress">
        <div class="bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 搜索 + 今日会员总数组件
// - 上方搜索条（输入 + 按钮）
// - 中部数字翻牌（每位使用数字背景切图）
// - 下方“比上周新增”与进度条

import { computed } from 'vue';
// 搜索图标切图（临时使用该目录中的切图；如有单独放大镜图标，可替换为对应文件名）
import search1x from '../../images/search/搜索.png';
import search2x from '../../images/search/搜索@2x.png';

interface Props {
  modelValue?: string;          // 搜索关键字（v-model）
  placeholder?: string;         // 输入占位
  todayTotal?: number | string; // 当日会员总数
  padLength?: number;           // 位数，不足前补 0
  weeklyIncrease?: number;      // 上周新增人数
  progress?: number;            // 进度条百分比
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入搜索内容',
  todayTotal: 111211,
  padLength: 6,
  weeklyIncrease: 10,
  progress: 68
});

const emit = defineEmits<{
  (e: 'search', keyword: string): void;
  (e: 'update:modelValue', value: string): void;
}>();

const paddedDigits = computed(() => {
  const s = String(props.todayTotal ?? '').replace(/[^0-9]/g, '');
  const pad = Math.max(props.padLength, s.length);
  return s.padStart(pad, '0').split('');
});

function onSearch() { emit('search', props.modelValue); }
function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>

<style scoped lang="scss">
.search-total {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  row-gap: 6px;
}

/* 搜索条 */
.search-bar {
  display: grid;
  grid-template-columns: 1fr 140px;
  column-gap: 16px;
  align-items: center;
}

.input-wrap {
  position: relative;
  display: grid;
}

.icon-search {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}

.input {
  height: 44px;
  padding: 0 14px 0 44px; /* 让出放大镜空间 */
  border-radius: 12px;
  border: 2px solid rgba(90,160,255,0.8);
  background: rgba(255,255,255,0.75);
  color: #2a6ff0;
  font-size: 16px;
  outline: none;
}
.input::placeholder { color: rgba(42,111,240,0.6); }

.btn {
  height: 44px;
  border-radius: 12px;
  border: 2px solid rgba(90,160,255,0.9);
  background: rgba(255,255,255,0.9);
  color: #2a6ff0;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
}

/* 标题 */
.title {
  margin-top: 2px;
  font-size: 16px;
  font-weight: 900;
  color: rgba(42,111,240,0.9);
  letter-spacing: 2px;
}

/* 数字翻牌 */
.digits {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 15px;
    /* 更紧凑 */
    padding: 4px 0 0;
  }
  
  .digit {
    width: 54px;
      /* 缩小数字牌尺寸 */
      height: 74px;
      display: grid;
      place-items: center;
      background-image: -webkit-image-set(url('../../images/member/font-bg/ico／数字bg备份 6.png') 1x,
            url('../../images/member/font-bg/ico／数字bg备份 6@2x.png') 2x);
        background-image: image-set(url('../../images/member/font-bg/ico／数字bg备份 6.png') 1x,
            url('../../images/member/font-bg/ico／数字bg备份 6@2x.png') 2x);
        background-size: 100% 100%;
        border-radius: 8px;
        box-shadow: 0 6px 14px rgba(45, 110, 255, 0.10);
        }
        
        .digit .text {
          font-size: 54px;
            /* 同步缩小字体 */
            font-weight: 800;
            color: #2a6ff0;
            line-height: 1;
          }
          
          /* 辅助信息 */
          .meta {
            margin-top: 2px;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            column-gap: 16px;
          }
          
          .incr {
            color: #2a6ff0;
            font-size: 18px;
            font-weight: 800;
          }
          
          .incr .num {
            color: #FFA36B;
            margin: 0 4px;
          }
          
          .arrow-up {
            display: inline-block;
              width: 0;
              height: 0;
              margin-right: 8px;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 10px solid #FFA36B;
              transform: translateY(-1px);
            }
            
            .progress {
              position: relative;
                height: 12px;
                border-radius: 8px;
                background: rgba(90, 160, 255, 0.25);
              }
              
              .bar {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                border-radius: 8px;
                background: linear-gradient(90deg, #FFA36B 0%, rgba(255, 163, 107, 0.55) 100%);
              }
          
</style>
