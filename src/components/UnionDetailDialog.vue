<template>
  <teleport to="body">
    <div v-if="modelValue" class="udlg-wrap">
      <div class="udlg__mask" @click="close" aria-hidden="true"></div>
      <div class="udlg" role="dialog" aria-modal="true">
        <header class="udlg__head">
          <div class="udlg__badge">
            <div class="udlg__title-wrap">
              <img class="udlg__title-img" :src="title1x" :srcset="`${title1x} 1x, ${title2x} 2x`" alt="标题" />
              <span class="udlg__title">{{ title }}</span>
            </div>
          </div>
          <button class="udlg__close" aria-label="关闭" @click="close"></button>
        </header>

      <section class="udlg__body">
        <h3 class="udlg__sub">
          <span class="udlg__sub-bg">
            <span class="udlg__sub-text">基本信息</span>
          </span>
        </h3>

        <ul class="info">
          <li v-for="(row, i) in rows" :key="i" class="info__row">
            <span class="lab">{{ row[0] }}</span>
            <span class="val" :title="format(row[1])">{{ format(row[1]) }}</span>
            <span class="lab">{{ row[2] }}</span>
            <span class="val" :title="format(row[3])">{{ format(row[3]) }}</span>
          </li>
        </ul>
      </section>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import title1x from '../images/dialog-module/title/小标题.png';
import title2x from '../images/dialog-module/title/小标题@2x.png';

interface Props {
  modelValue: boolean;
  title?: string;
  width?: number; // px
  // 明细数据；字段尽量贴近截图语义
  data?: Partial<UnionDetail>;
}

const props = withDefaults(defineProps<Props>(), { title: '工会详情', width: 1080, data: () => ({}) });
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();
function close() { emit('update:modelValue', false); }

export interface UnionDetail {
  fullname: string;
  unitDistrictSuffix?: string;
  unitIndustry?: string;
  establishDate?: string;
  memberCount?: number | string;
  linkMan?: string;
  linkPhone?: string;
  chair?: string;
  viceChair?: string;
  parentUnionName?: string;
  legalDuty?: string; // 法定代表人职务
  isOpenSystem?: boolean | string; // 是否执行厂务公开制度
  isWorkerCongress?: boolean | string; // 是否执行职代会制度
  childOrgCount?: number | string; // 子级组织个数
}

// 组装二维行数组：[左label, 左值, 右label, 右值]
const rows = computed<Array<[string, any, string, any]>>(() => {
  const d = props.data || {};
  return [
    ['工会名称', d.fullname, '所属区域', d.unitDistrictSuffix],
    ['行业类别', d.unitIndustry ?? '-', '成立时间', d.establishDate],
    ['会员人数', d.memberCount, '联系人', d.linkMan],
    ['联系电话', d.linkPhone, '工会主席', d.chair],
    ['工会副主席', d.viceChair, '上一级工会名称', d.parentUnionName],
    ['法定代表人工会职务', d.legalDuty, '是否执行厂务公开制度', d.isOpenSystem],
    ['是否执行职代会制度', d.isWorkerCongress, '子级的组织个数', d.childOrgCount],
  ];
});

function format(v: any): string {
  if (v === true) return '是';
  if (v === false) return '否';
  if (v == null || v === '') return '-';
  return String(v);
}
// 允许 ESC 关闭
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }
if (typeof window !== 'undefined') window.addEventListener('keydown', onKey);
// 清理
if (typeof window !== 'undefined') {
  // vite 热更新多次注册问题不大，这里简单保护：无操作
}
</script>

<style scoped lang="scss">
.udlg-wrap { position: fixed; inset: 0; z-index: 1000; }
/* 更深的黑色蒙版（还原截图的压暗背景效果） */
.udlg__mask { position: absolute; inset: 0; background: rgba(0, 0, 0, .58); }
.udlg {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: v-bind('props.width + "px"');
  background: linear-gradient(180deg, #f7fbff, #f1f7ff);
  border: 1px solid rgba(60, 120, 220, .35);
  border-radius: 10px;
  box-shadow: 0 18px 48px rgba(30, 70, 160, .28);
  color: #333;
  z-index: 1000;
  /* 需要让标题牌与关闭按钮可以“溢出”显示在白框外 */
  overflow: visible;
}

/* 头部：不占空间，仅承载标题牌与关闭按钮（标题牌悬浮到框体上方） */
.udlg__head { position: relative; height: 0; }
.udlg__badge { position: absolute; left: 50%; top: -58px; transform: translateX(-50%); height: 42px; display: grid; place-items: center; color: #eaf2ff; font-weight: 900; letter-spacing: 1px; text-shadow: 0 2px 0 rgba(0,0,0,.16); z-index: 2; }
/* 使用你提供的标题背景切图（338x41，1x/2x），用 <img> 确保资源路径正确且不被 CSS 覆盖 */
.udlg__title-wrap { position: relative; width: 338px; height: 41px; display: grid; place-items: center; }
.udlg__title-img { display: block; width: 100%; height: 100%; }
.udlg__title {
  position: absolute;
  /* 精确几何居中，避免受字体行高影响 */
  left: calc(50% + var(--title-nudge-x, 0px));
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.22);
  font-weight: 900;
  letter-spacing: 1px;
  white-space: nowrap;
  max-width: 92%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
}

.udlg__close { position: absolute; right: -18px; top: -18px; width: 18px; height: 18px; background: transparent; border: 0; cursor: pointer; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; filter: drop-shadow(0 1px 1px rgba(0,0,0,.25)); z-index: 3;
  background-image: -webkit-image-set(url('../images/dialog-module/close/关闭实心.png') 1x, url('../images/dialog-module/close/关闭实心@2x.png') 2x);
  background-image: image-set(url('../images/dialog-module/close/关闭实心.png') 1x, url('../images/dialog-module/close/关闭实心@2x.png') 2x);
}
.udlg__close:hover { filter: brightness(1.1) drop-shadow(0 1px 1px rgba(0,0,0,.35)); }

.udlg__body { padding: 20px 20px 22px; }

.udlg__sub { margin: 0 0 10px; font-size: 0; }
.udlg__sub-bg { display: inline-grid; place-items: center; height: 36px; min-width: 130px; padding: 0 14px; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; 
  background-image: -webkit-image-set(url('../images/dialog-module/title/小标题.png') 1x, url('../images/dialog-module/title/小标题@2x.png') 2x);
  background-image: image-set(url('../images/dialog-module/title/小标题.png') 1x, url('../images/dialog-module/title/小标题@2x.png') 2x);
}
.udlg__sub-text { font-size: 16px; font-weight: 800; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,.25); }

/* 明细表 */
.info { list-style: none; margin: 0; padding: 0; border: 1px solid rgba(80, 140, 230, .35); border-radius: 6px; overflow: hidden; background: #fff; }
.info__row { position: relative; display: grid; grid-template-columns: 160px 1fr 160px 1fr; column-gap: 0; min-height: 56px; align-items: center; }
/* 更接近截图的淡蓝条纹 */
.info__row:nth-child(odd) { background: rgba(87, 151, 255, .12); }
.info__row:nth-child(even) { background: rgba(87, 151, 255, .22); }
.info__row::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(60, 120, 220, .35); }

.lab { padding: 14px 16px; color: #2a6ff0; font-weight: 800; }
.val { padding: 14px 16px; color: #333; font-weight: 700; }
</style>
