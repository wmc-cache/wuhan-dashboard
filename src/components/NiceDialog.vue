<template>
  <teleport to="body">
    <transition name="dlg-fade">
      <div
        v-if="modelValue"
        ref="panel"
        class="nice-dlg"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
      >
        <header class="nice-dlg__head">
          <div class="nice-dlg__badge">
            <!-- 背景是 dialog 标题背景图；内部这一层是“文字边框图” -->
            <span class="nice-dlg__title-frame">
              <span class="nice-dlg__title">{{ title }}</span>
            </span>
          </div>
          <button class="nice-dlg__close" @click="close" aria-label="关闭"></button>
        </header>

        <section class="nice-dlg__body">
          <slot />
        </section>
      </div>
    </transition>
  </teleport>
  
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick, computed } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  width?: number; // px
  // 定位：可传入鼠标坐标，弹框会跟随点击位置显示
  x?: number | null;
  y?: number | null;
  offsetX?: number; // 与点击点的水平偏移
  offsetY?: number; // 与点击点的垂直偏移
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  width: 420,
  x: null,
  y: null,
  offsetX: 12,
  offsetY: 12,
});

const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

function close() { emit('update:modelValue', false); }

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close();
}
onMounted(() => document.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));

// 跟随点击位置定位
const panel = ref<HTMLElement | null>(null);
const pos = ref<{ left: number; top: number } | null>(null);

function updatePos() {
  if (props.x == null || props.y == null) { pos.value = null; return; }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = props.width;
  const h = panel.value?.offsetHeight || 0;
  let left = (props.x as number) + props.offsetX;
  let top = (props.y as number) + props.offsetY;
  // 视口边界避让
  if (left + w + 8 > vw) left = Math.max(8, vw - w - 8);
  if (h) {
    if (top + h + 8 > vh) top = Math.max(8, vh - h - 8);
  } else {
    // 未知高度时先不处理，等下一帧有高度后再修正
  }
  pos.value = { left, top };
}

watch(() => [props.x, props.y, props.modelValue], async () => {
  if (!props.modelValue) return;
  await nextTick();
  updatePos();
});
onMounted(() => window.addEventListener('resize', updatePos));
onBeforeUnmount(() => window.removeEventListener('resize', updatePos));

const panelStyle = computed(() => {
  const base: Record<string, string> = { width: props.width + 'px' } as any;
  if (pos.value) {
    base.position = 'fixed';
    base.left = pos.value.left + 'px';
    base.top = pos.value.top + 'px';
    base.transform = 'none';
  } else {
    base.position = 'fixed';
    base.left = '50%';
    base.top = '50%';
    base.transform = 'translate(-50%, -50%)';
  }
  return base;
});
</script>

<style scoped lang="scss">
/* 弹框主体：浅蓝玻璃面板 */
.nice-dlg {
  position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
  z-index: 1000; /* 高于页面组件 */
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(239,248,255,0.96), rgba(222,239,255,0.92));
  box-shadow: 0 18px 40px rgba(40,100,200,0.20), inset 0 0 30px rgba(120,170,255,0.10);
  /* 顶部给标题条让位，左右不留内边距，避免标题 bg 两侧出现空白 */
  padding: 62px 0 0px;
  overflow: hidden; /* 裁切边框发光 */
}

/* 头部：渐变条，中心徽章承载标题，右上角关闭按钮 */
.nice-dlg__head {
  position: absolute; left: 0; right: 0; top: 0;
  height: 62px; /* 让 bg 覆盖整个标题条（与截图红框一致） */
  display: grid; grid-template-columns: 1fr auto; align-items: center;
  padding: 10px 10px 0 10px;
  border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden;
  /* 底层用线性渐变打底，保证两侧没有透明空白 */
  background: linear-gradient(180deg, rgba(120,175,255,0.42), rgba(95,150,245,0.16));
}

/* 顶部标题条的贴图：放到 ::before，并做横向 overscan，掩盖切图两侧的透明留白 */
.nice-dlg__head::before {
  content: '';
  position: absolute; top: 0; bottom: 0; left: -16px; right: -16px; /* overscan 16px */
  background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
  background-image: -webkit-image-set(
    url('../images/dialog/bg/编组 106.png') 1x,
    url('../images/dialog/bg/编组 106@2x.png') 2x
  );
  background-image: image-set(
    url('../images/dialog/bg/编组 106.png') 1x,
    url('../images/dialog/bg/编组 106@2x.png') 2x
  );
  pointer-events: none; /* 不挡住关闭按钮 */
}

/* 居中标题徽章（使用切图） */
/* 绝对居中标题徽章，不受关闭按钮影响 */
.nice-dlg__badge { position: absolute; left: 50%; top: 10px; transform: translateX(-50%); height: 42px; display: grid; place-items: center; z-index: 1; }

/* 文字边框图（放在标题文字的下层作为装饰） */
.nice-dlg__title-frame {
  display: inline-grid; place-items: center;
  width: 255px; height: 42px; /* 固定为 255 x 42（设计要求） */
  background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
  background-image: -webkit-image-set(
    url('../images/dialog/border/编组 7备份 7.png') 1x,
    url('../images/dialog/border/编组 7备份 7@2x.png') 2x
  );
  background-image: image-set(
    url('../images/dialog/border/编组 7备份 7.png') 1x,
    url('../images/dialog/border/编组 7备份 7@2x.png') 2x
  );
}

.nice-dlg__title { color: #e9f3ff; text-shadow: 0 2px 0 rgba(0,0,0,0.18); font-weight: 900; letter-spacing: 1px; white-space: nowrap; max-width: 92%; overflow: hidden; text-overflow: ellipsis; font-size: 18px; }

.nice-dlg__close {
  justify-self: end;
    align-self: center;
    /* 垂直居中关闭按钮 */
    margin-top: -15px;
  width: 18px; height: 18px; border: 0; background: transparent; cursor: pointer;
  background-repeat: no-repeat; background-position: center; background-size: 100% 100%;
  background-image: -webkit-image-set(
    url('../images/dialog/close/编组 30.png') 1x,
    url('../images/dialog/close/编组 30@2x.png') 2x
  );
  background-image: image-set(
    url('../images/dialog/close/编组 30.png') 1x,
    url('../images/dialog/close/编组 30@2x.png') 2x
  );
  position: relative; z-index: 1;
}
.nice-dlg__close:hover { filter: brightness(1.1); }

.nice-dlg__body {
  max-height: 72vh;
  overflow: auto;
  padding: 0;
}

/* 进场/退场动画 */
.dlg-fade-enter-active, .dlg-fade-leave-active { transition: opacity .18s ease; }
.dlg-fade-enter-from, .dlg-fade-leave-to { opacity: 0; }
</style>
