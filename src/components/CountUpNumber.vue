<template>
  <span class="count-up-wrapper">
    <span
      ref="numberRef"
      :class="numberClass"
      :style="numberStyle"
    >{{ displayValue }}</span>
    <span v-if="unit" :class="unitClass" :style="unitStyle">{{ unit }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
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
const isAnimating = ref(false)
let countUp: CountUp | null = null

// 格式化数字，保持与原项目一致的千位分隔符
function formatNumber(num: number | string): number {
  const n = Number(num)
  return Number.isFinite(n) ? n : 0
}

// 显示值：动画时让 CountUp 控制，否则显示格式化的值
const displayValue = computed(() => {
  if (isAnimating.value) {
    return '' // CountUp 控制内容时，Vue 不显示任何内容
  }
  const targetValue = formatNumber(props.value)
  return targetValue.toLocaleString('zh-CN')
})

// 初始化 CountUp
function initCountUp() {
  if (!numberRef.value) return

  const targetValue = formatNumber(props.value)

  console.log('CountUpNumber: Initializing with value:', props.value, 'formatted:', targetValue)

  // 如果值为0，直接显示，不需要动画
  if (targetValue === 0) {
    console.log('CountUpNumber: Value is 0, skipping animation')
    isAnimating.value = false
    return
  }

  try {
    const options = {
      startVal: 0,
      duration: props.duration / 1000, // CountUp 使用秒为单位
      useEasing: props.easing,
      useGrouping: true, // 启用千位分隔符
      separator: props.separator,
      decimal: props.decimal,
      decimalPlaces: props.decimalPlaces,
    }

    countUp = new CountUp(numberRef.value, targetValue, options)

    if (!countUp.error) {
      if (props.autoStart) {
        isAnimating.value = true // 开始动画前设置状态
        countUp.start(() => {
          console.log('CountUpNumber: Animation completed for value:', targetValue)
          isAnimating.value = false // 动画完成后恢复状态
        })
      }
    } else {
      console.error('CountUp error:', countUp.error)
      isAnimating.value = false
    }
  } catch (error) {
    console.error('CountUp initialization failed:', error)
    isAnimating.value = false
  }
}

// 手动启动动画的方法
function startAnimation() {
  if (countUp) {
    isAnimating.value = true
    countUp.start(() => {
      isAnimating.value = false
    })
  }
}

// 直接更新数字（不带动画）
function updateValue(newValue: number | string) {
  console.log('CountUpNumber: Updating value to:', newValue)
  const targetValue = formatNumber(newValue)
  if (countUp) {
    countUp.update(targetValue)
  }
}

// 暴露方法给父组件
defineExpose({
  startAnimation,
  updateValue
})

onMounted(() => {
  console.log('CountUpNumber: Mounted with value:', props.value)
  nextTick(() => {
    initCountUp()
  })
})

// 监听 value 变化
watch(() => props.value, (newValue, oldValue) => {
  console.log('CountUpNumber: Value changed from', oldValue, 'to', newValue)
  if (numberRef.value && newValue !== oldValue) {
    const oldTargetValue = formatNumber(oldValue)
    const newTargetValue = formatNumber(newValue)

    // 如果从 0 变为非 0，重新启动完整动画
    if (oldTargetValue === 0 && newTargetValue > 0) {
      console.log('CountUpNumber: Starting fresh animation from 0 to', newTargetValue)
      initCountUp()
    }
    // 如果都不是 0，使用更新动画
    else if (newTargetValue > 0 && countUp) {
      console.log('CountUpNumber: Updating animation to', newTargetValue)
      isAnimating.value = true
      countUp.update(newTargetValue)
      // update 不会自动触发动画完成回调，所以需要手动重置状态
      setTimeout(() => {
        isAnimating.value = false
      }, props.duration)
    }
  }
})
</script>

<style scoped>
.count-up-wrapper {
  display: inline;
}
</style>
