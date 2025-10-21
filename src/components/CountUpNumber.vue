<template>
  <span class="count-up-wrapper">
    <span
      ref="numberRef"
      :class="numberClass"
      :style="numberStyle"
    ></span>
    <span v-if="unit" :class="unitClass" :style="unitStyle">{{ unit }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { CountUp } from 'countup.js'

interface Props {
  value?: number | string
  unit?: string
  duration?: number
  easing?: boolean
  numberClass?: string
  unitClass?: string
  numberStyle?: any
  unitStyle?: any
  separator?: string
  decimal?: string
  decimalPlaces?: number
  autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  unit: '',
  duration: 1500,
  easing: true,
  numberClass: '',
  unitClass: '',
  numberStyle: undefined,
  unitStyle: undefined,
  separator: ',',
  decimal: '.',
  decimalPlaces: 0,
  autoStart: true
})

const numberRef = ref<HTMLElement>()
let countUp: CountUp | null = null
let hasAnimated = false // 确保只在首次加载时动画

// 格式化数字，保持与原项目一致的千位分隔符
function formatNumber(num: number | string): number {
  const n = Number(num)
  return Number.isFinite(n) ? n : 0
}

// 初始化 CountUp
function initCountUp() {
  if (!numberRef.value || hasAnimated) return

  const targetValue = formatNumber(props.value)

  const options = {
    startVal: 0,
    duration: props.duration / 1000, // CountUp 使用秒为单位
    useEasing: props.easing,
    useGrouping: true, // 启用千位分隔符
    separator: props.separator,
    decimal: props.decimal,
    decimalPlaces: props.decimalPlaces,
    // 使用 easeOutExpo 缓动函数（缓入缓出）
    easingFn: (t: number, b: number, c: number, d: number) => {
      return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    }
  }

  countUp = new CountUp(numberRef.value, targetValue, options)

  if (!countUp.error) {
    if (props.autoStart) {
      countUp.start()
      hasAnimated = true
    }
  } else {
    console.error('CountUp error:', countUp.error)
    // 如果 CountUp 失败，直接显示格式化后的数字
    if (numberRef.value) {
      const formattedValue = targetValue.toLocaleString('zh-CN')
      numberRef.value.textContent = formattedValue
    }
  }
}

// 手动启动动画的方法
function startAnimation() {
  if (countUp && !hasAnimated) {
    countUp.start()
    hasAnimated = true
  }
}

// 直接更新数字（不带动画）
function updateValue(newValue: number | string) {
  if (!numberRef.value) return

  const targetValue = formatNumber(newValue)
  const formattedValue = targetValue.toLocaleString('zh-CN')
  numberRef.value.textContent = formattedValue
}

// 暴露方法给父组件
defineExpose({
  startAnimation,
  updateValue
})

onMounted(() => {
  // 确保 DOM 渲染完成后再初始化
  nextTick(() => {
    initCountUp()
  })
})

// 监听 value 变化（后续数据更新直接切换，不再动画）
watch(() => props.value, (newValue) => {
  if (hasAnimated && numberRef.value) {
    // 已经动画过了，直接更新数字
    updateValue(newValue)
  }
})
</script>

<style scoped>
.count-up-wrapper {
  display: inline;
}
</style>
