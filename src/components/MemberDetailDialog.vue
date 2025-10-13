<template>
  <teleport to="body">
    <div v-if="modelValue" class="mdlg-wrap">
      <div class="mdlg__mask" @click="close" aria-hidden="true"></div>
      <div class="mdlg" role="dialog" aria-modal="true">
        <header class="mdlg__head">
          <!-- 标题与关闭都在白框外 -->
          <div class="mdlg__badge">
            <div class="mdlg__title-wrap">
              <img class="mdlg__title-img" :src="title1x" :srcset="`${title1x} 1x, ${title2x} 2x`" alt="会员详情" />
              <span class="mdlg__title">{{ title }}</span>
            </div>
          </div>
          <button class="mdlg__close" aria-label="关闭" @click="close"></button>
        </header>

        <section class="mdlg__body">
          <!-- 基本信息 -->
          <h3 class="mdlg__sub">
            <span class="mdlg__sub-bg"><span class="mdlg__sub-text">基本信息</span></span>
          </h3>

          <ul class="info">
            <li class="info__row">
              <span class="lab">会员姓名</span><span class="val">{{ d.name || '-' }}</span>
              <span class="lab">所属工会</span><span class="val">{{ d.union || '-' }}</span>
            </li>
            <li class="info__row">
              <span class="lab">性别</span><span class="val">{{ d.gender || '-' }}</span>
              <span class="lab">年龄</span><span class="val">{{ d.age ?? '-' }}</span>
            </li>
            <li class="info__row">
              <span class="lab">入会时间</span><span class="val">{{ d.joinAt || '-' }}</span>
              <span class="lab">工作单位</span><span class="val">{{ d.company || '-' }}</span>
            </li>
            <li class="info__row">
              <span class="lab">职务</span><span class="val">{{ d.duty || '-' }}</span>
              <span class="lab">联系方式</span><span class="val">{{ d.phone || '-' }}</span>
            </li>
            <li class="info__row">
              <span class="lab">政治面貌</span><span class="val">{{ d.politics || '-' }}</span>
              <span class="lab">学历</span><span class="val">{{ d.education || '-' }}</span>
            </li>
          </ul>

          <!-- 医疗互助/劳模信息 tabs（视觉占位） -->
          <div class="tabs">
            <button class="tab" :class="{active: tab==='med'}" @click="tab='med'">医疗互助</button>
            <button class="tab" :class="{active: tab==='laomo'}" @click="tab='laomo'">劳模信息</button>
          </div>

          <template v-if="tab==='med'">
            <!-- 年份子 tabs -->
            <div class="years">
              <button v-for="y in years" :key="y" class="year" :class="{active: y===curYear}" @click="curYear=y">{{ y }}年</button>
            </div>

            <div class="med-grid">
              <!-- 左：互助参保信息 -->
              <div class="card">
                <ul class="info info--flat">
                  <li class="info__row"><span class="lab">代理工会名称</span><span class="val">{{ medInfo.agency || '-' }}</span></li>
                  <li class="info__row"><span class="lab">单位名称</span><span class="val">{{ medInfo.company || '-' }}</span></li>
                  <li class="info__row"><span class="lab">保期开始时间</span><span class="val">{{ medInfo.startAt || '-' }}</span></li>
                  <li class="info__row"><span class="lab">保期结束时间</span><span class="val">{{ medInfo.endAt || '-' }}</span></li>
                </ul>
              </div>
              <!-- 右：参加情况表 -->
              <div class="card">
                <table class="table">
                  <thead>
                    <tr><th>参加类型</th><th>参加份数</th><th>每份金额</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(r,i) in medPlans" :key="i"><td>{{ r.type }}</td><td>{{ r.count }}</td><td>{{ r.money }}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 底部：互助给付明细 -->
            <div class="card">
              <table class="table">
                <thead>
                  <tr><th>给付类型</th><th>疾病名称</th><th>互助开始时间</th><th>互助结束时间</th><th>费用</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(r,i) in medClaims" :key="i"><td>{{ r.payType }}</td><td>{{ r.disease }}</td><td>{{ r.startAt }}</td><td>{{ r.endAt }}</td><td>{{ r.fee }}</td></tr>
                </tbody>
              </table>
            </div>
          </template>

          <template v-else>
            <div class="card empty-card">暂未配置劳模信息</div>
          </template>
        </section>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import title1x from '../images/dialog-module/title/小标题.png';
import title2x from '../images/dialog-module/title/小标题@2x.png';

interface MedPlan { type: string; count: string | number; money: string }
interface MedClaim { payType: string; disease: string; startAt: string; endAt: string; fee: string }
interface MedInfo { agency?: string; company?: string; startAt?: string; endAt?: string }

export interface MemberDetail {
  name?: string; gender?: string; joinAt?: string; duty?: string; politics?: string;
  union?: string; age?: number | string; company?: string; phone?: string; education?: string;
  medInfo?: MedInfo; medPlans?: MedPlan[]; medClaims?: MedClaim[]; years?: (string|number)[];
}

interface Props { modelValue: boolean; title?: string; width?: number; data?: MemberDetail }
const props = withDefaults(defineProps<Props>(), { title: '会员详情', width: 1080, data: () => ({}) });
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();
function close() { emit('update:modelValue', false); }

const d = computed(() => props.data || {});

// Tabs
const tab = ref<'med' | 'laomo'>('med');
const years = computed<(string|number)[]>(() => (d.value.years && d.value.years.length ? d.value.years : [2024, 2023, 2022, 2021]));
const curYear = ref(years.value[0]);
const medInfo = computed<MedInfo>(() => d.value.medInfo || { agency: '武钢集团有限公司工会', company: '武汉钢铁集团物流有限公司', startAt: '2024/01/01', endAt: '2024/12/31' });
const medPlans = computed<MedPlan[]>(() => d.value.medPlans || [
  { type: '住院', count: '1份', money: '2,000元' },
  { type: '综合', count: '1份', money: '2,000元' },
  { type: '重疾', count: '1份', money: '2,000元' },
]);
const medClaims = computed<MedClaim[]>(() => d.value.medClaims || [
  { payType: '综合', disease: '佔位', startAt: '2024/01/02', endAt: '2024/01/02', fee: '2,000元' },
  { payType: '综合', disease: '佔位', startAt: '2024/01/02', endAt: '2024/01/02', fee: '2,000元' },
  { payType: '重疾', disease: '佔位', startAt: '2024/01/02', endAt: '2024/01/02', fee: '2,000元' },
]);
</script>

<style scoped lang="scss">
.mdlg-wrap { position: fixed; inset: 0; z-index: 1000; }
.mdlg__mask { position: absolute; inset: 0; background: rgba(0, 0, 0, .58); }
.mdlg {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: v-bind('props.width + "px"');
  background: linear-gradient(180deg, #f7fbff, #f1f7ff);
  border: 1px solid rgba(60, 120, 220, .35);
  border-radius: 10px;
  box-shadow: 0 18px 48px rgba(30, 70, 160, .28);
  color: #333;
  overflow: visible;
  /* 再整体缩一号 */
  font-size: 13px;
}
.mdlg__head { position: relative; height: 0; }
.mdlg__badge { position: absolute; left: 50%; top: -58px; transform: translateX(-50%); height: 42px; display: grid; place-items: center; z-index: 2; }
.mdlg__title-wrap { position: relative; width: 338px; height: 41px; display: grid; place-items: center; }
.mdlg__title-img { width: 100%; height: 100%; display: block; }
.mdlg__title { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 100%; text-align: center; color: #fff; font-weight: 900; letter-spacing: 1px; text-shadow: 0 1px 2px rgba(0,0,0,.25); font-size: 16px; white-space: nowrap; }
.mdlg__close { position: absolute; right: -18px; top: -18px; width: 18px; height: 18px; border: 0; background: transparent; cursor: pointer; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; z-index: 3; filter: drop-shadow(0 1px 1px rgba(0,0,0,.25));
  background-image: -webkit-image-set(url('../images/dialog-module/close/关闭实心.png') 1x, url('../images/dialog-module/close/关闭实心@2x.png') 2x);
  background-image: image-set(url('../images/dialog-module/close/关闭实心.png') 1x, url('../images/dialog-module/close/关闭实心@2x.png') 2x);
}
.mdlg__close:hover { filter: brightness(1.1) drop-shadow(0 1px 1px rgba(0,0,0,.35)); }
.mdlg__body { padding: 12px; }

.mdlg__sub { margin: 0 0 10px; font-size: 0; }
.mdlg__sub-bg { display: inline-grid; place-items: center; height: 36px; min-width: 130px; padding: 0 14px; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; 
  /* 替换为新的“标题背景”贴图（1x/2x）：src/images/dialog-module/titlebg */
  background-image: -webkit-image-set(url('../images/dialog-module/titlebg/矩形备份 15.png') 1x, url('../images/dialog-module/titlebg/矩形备份 15@2x.png') 2x);
  background-image: image-set(url('../images/dialog-module/titlebg/矩形备份 15.png') 1x, url('../images/dialog-module/titlebg/矩形备份 15@2x.png') 2x);
}
.mdlg__sub-text { font-size: 14px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.25); }

/* 通用 info 列表，与工会详情保持一致 */
.info { list-style: none; margin: 0 0 8px; padding: 0; border: 1px solid rgba(80, 140, 230, .35); border-radius: 6px; overflow: hidden; background: #fff; }
.info__row { position: relative; display: grid; grid-template-columns: 140px 1fr 140px 1fr; min-height: 38px; align-items: center; }
.info__row:nth-child(odd) { background: rgba(87, 151, 255, .12); }
.info__row:nth-child(even) { background: rgba(87, 151, 255, .22); }
.lab { padding: 6px 10px; color: #2a6ff0; font-weight: 800; font-size: 13px; }
.val { padding: 6px 10px; font-weight: 600; color: #333; font-size: 13px; }
.info--flat .info__row { grid-template-columns: 180px 1fr; }

/* tabs */
.tabs { display: flex; gap: 6px; margin: 2px 0 6px; }
.tab { position: relative; padding: 4px 10px; border: 1px solid rgba(80,140,230,.35); border-radius: 6px; background: rgba(255,255,255,.9); color: #2a6ff0; font-weight: 800; cursor: pointer; font-size: 12px; }
.tab.active { background: linear-gradient(180deg, rgba(120,175,255,.35), rgba(120,175,255,.18)); box-shadow: inset 0 0 8px rgba(120,175,255,.25); }

.years { display: flex; gap: 6px; margin: 0 0 6px; }
.year { padding: 4px 8px; border-radius: 12px; background: rgba(255,255,255,.9); border: 1px solid rgba(80,140,230,.35); color: #2a6ff0; font-weight: 800; cursor: pointer; font-size: 12px; }
.year.active { background: linear-gradient(180deg, rgba(120,175,255,.35), rgba(120,175,255,.18)); }

.med-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.card { border: 1px solid rgba(80,140,230,.35); border-radius: 6px; background: rgba(255,255,255,.95); overflow: hidden; }
.empty-card { display: grid; place-items: center; height: 160px; color: #2a6ff0; font-weight: 800; }

.table { width: 100%; border-collapse: collapse; }
.table { font-size: 13px; }
.table th, .table td { border-bottom: 1px solid rgba(80,140,230,.25); padding: 6px 10px; text-align: left; }
.table thead th { background: rgba(50,135,254,.18); color: #333; font-weight: 800; }
.table tbody td { font-weight: 600; }
.table tbody tr:nth-child(odd) { background: rgba(87,151,255,.12); }
.table tbody tr:nth-child(even) { background: rgba(87,151,255,.22); }
</style>
