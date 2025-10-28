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

        <!-- 统计 Tabs（参考会员详情） -->
        <div class="tabs">
          <button class="tab" :class="{ active: tab==='province' }" @click="tab='province'">组织会员</button>
          <button class="tab" :class="{ active: tab==='medical' }" @click="tab='medical'">医疗互助</button>
          <button class="tab" :class="{ active: tab==='relief' }" @click="tab='relief'">困难救助</button>
          <button class="tab" :class="{ active: tab==='assistance' }" @click="tab='assistance'">困难帮扶</button>
          <button class="tab" :class="{ active: tab==='model' }" @click="tab='model'">组织劳模</button>
          <button class="tab" :class="{ active: tab==='refund' }" @click="tab='refund'">经费返还</button>
        </div>

        <!-- 省总会员 -->
        <template v-if="tab==='province'">
          <div class="card">
            <template v-if="!provinceEmpty">
              <ul class="info">
                <li v-for="(r, i) in rowsProvince" :key="i" class="info__row">
                  <span class="lab">{{ r[0] }}</span><span class="val">{{ r[1] }}</span>
                  <span class="lab">{{ r[2] }}</span><span class="val">{{ r[3] }}</span>
                </li>
              </ul>
            </template>
            <p v-else class="empty-tip">暂无组织会员数据</p>
          </div>
        </template>

        <!-- 医疗互助 -->
        <template v-else-if="tab==='medical'">
          <div class="card">
            <template v-if="!medicalEmpty">
              <ul class="info">
                <li v-for="(r, i) in rowsMedical" :key="i" class="info__row">
                  <span class="lab">{{ r[0] }}</span><span class="val">{{ r[1] }}</span>
                  <span class="lab">{{ r[2] }}</span><span class="val">{{ r[3] }}</span>
                </li>
              </ul>
            </template>
            <p v-else class="empty-tip">暂无医疗互助数据</p>
          </div>
        </template>

        <!-- 困难救助 -->
        <template v-else-if="tab==='relief'">
          <div class="card">
            <template v-if="!reliefEmpty">
              <ul class="info">
                <li v-for="(r, i) in rowsRelief" :key="i" class="info__row">
                  <span class="lab">{{ r[0] }}</span><span class="val">{{ r[1] }}</span>
                  <span class="lab">{{ r[2] }}</span><span class="val">{{ r[3] }}</span>
                </li>
              </ul>
            </template>
            <p v-else class="empty-tip">暂无困难救助数据</p>
          </div>
        </template>

        <!-- 困难帮扶 -->
        <template v-else-if="tab==='assistance'">
          <div class="card">
            <template v-if="!assistEmpty">
              <ul class="info">
                <li v-for="(r, i) in rowsAssistance" :key="i" class="info__row">
                  <span class="lab">{{ r[0] }}</span><span class="val">{{ r[1] }}</span>
                  <span class="lab">{{ r[2] }}</span><span class="val">{{ r[3] }}</span>
                </li>
              </ul>
            </template>
            <p v-else class="empty-tip">暂无困难帮扶数据</p>
          </div>
        </template>

        <!-- 劳模信息（统计） -->
        <template v-else-if="tab==='model'">
          <div class="card">
            <template v-if="!modelEmpty">
              <ul class="info">
                <li v-for="(r, i) in rowsModel" :key="i" class="info__row">
                  <span class="lab">{{ r[0] }}</span><span class="val">{{ r[1] }}</span>
                  <span class="lab">{{ r[2] }}</span><span class="val">{{ r[3] }}</span>
                </li>
              </ul>
            </template>
            <p v-else class="empty-tip">暂无组织劳模数据</p>
          </div>
        </template>

        <!-- 经费返还 -->
        <template v-else>
          <div class="card">
            <template v-if="!refundEmpty">
              <ul class="info">
                <li v-for="(r, i) in rowsRefund" :key="i" class="info__row">
                  <span class="lab">{{ r[0] }}</span><span class="val">{{ r[1] }}</span>
                  <span class="lab">{{ r[2] }}</span><span class="val">{{ r[3] }}</span>
                </li>
              </ul>
            </template>
            <p v-else class="empty-tip">暂无经费返还数据</p>
          </div>
        </template>
      </section>
      <div v-if="loading" class="udlg__loading">加载中...</div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import title1x from '../images/dialog-module/title/小标题.png';
import title2x from '../images/dialog-module/title/小标题@2x.png';
import { apiGet, apiPostForm } from '../utils/api';
import { getDict, labelOf } from '../utils/dict';

interface Props {
  modelValue: boolean;
  title?: string;
  width?: number; // px
  // 明细数据；字段尽量贴近截图语义
  data?: Partial<UnionDetail>;
  // 新接口需要 union id + type；外部传入 id
  unionId?: string | number;
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
  // 新增：组织统计信息
  unionStats?: {
    provinceStatisticsVo?: { nextUnion?: number; nextThreeUnion?: number; member?: number; newMember?: number; threeMember?: number } | null;
    modelWorkerStatisticsVo?: { workers?: number; countryWorkers?: number; provinceWorkers?: number; cityWorkers?: number; helps?: number; helpAmounts?: number } | null;
    medicalStatisticsVo?: { totalAmount?: number; people?: number; payAmount?: number; payPeople?: number; joinAmount?: number; joinPeople?: number } | null;
    assistanceStatisticsVo?: { family?: number; people?: number; help?: number; helpAmount?: number } | null;
    reliefStatisticsVo?: { amount?: number; helps?: number; four?: number; temporary?: number | null } | null;
    refundOfFundsStatisticsVo?: { zje?: number; szje?: number; qycyje?: number; dsje?: number; xsje?: number; jcje?: number; sxf?: number } | null;
  } | null;
}

// 顶部“基本信息”也从 /business/union/detail 拉取
const baseLocal = ref<Partial<UnionDetail>>({});
const base = computed<Partial<UnionDetail>>(() => ({ ...(props.data || {}), ...(baseLocal.value || {}) }));

// 组装二维行数组：[左label, 左值, 右label, 右值]
const rows = computed<Array<[string, any, string, any]>>(() => {
  const d = base.value || {};
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
// 数字友好显示：千分位；空值为 -
function n(v: unknown): string {
  if (v == null || v === '') return '-';
  const num = Number(v);
  if (!Number.isFinite(num)) return String(v);
  return num.toLocaleString('zh-CN');
}
function money(v: unknown): string {
  const s = n(v);
  return s === '-' ? '-' : `${s} 元`;
}
// Tabs
type UTab = 'province' | 'medical' | 'relief' | 'assistance' | 'model' | 'refund';
const tab = ref<UTab>('province');

// 运行时从 /business/union/detail 拉具体 tab 数据；若外层已传入 unionStats，则用作兜底
const extProvince = ref<any>(null);
const extMedical = ref<any>(null);
const extAssist = ref<any>(null);
const extRelief = ref<any>(null);
const extRefund = ref<any>(null);
const extModel = ref<any>(null);

const stats = computed(() => props.data?.unionStats || null);
const province = computed(() => extProvince.value ?? stats.value?.provinceStatisticsVo ?? null);
const medical = computed(() => extMedical.value ?? stats.value?.medicalStatisticsVo ?? null);
const assist = computed(() => extAssist.value ?? stats.value?.assistanceStatisticsVo ?? null);
const relief = computed(() => extRelief.value ?? stats.value?.reliefStatisticsVo ?? null);
const refund = computed(() => extRefund.value ?? stats.value?.refundOfFundsStatisticsVo ?? null);
const model = computed(() => extModel.value ?? stats.value?.modelWorkerStatisticsVo ?? null);

// 空判断
function emptyObj(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return true;
  return Object.values(obj).every((v) => v == null || v === '' || (typeof v === 'number' && !Number.isFinite(v)));
}
const provinceEmpty = computed(() => emptyObj(province.value));
const medicalEmpty = computed(() => emptyObj(medical.value));
const assistEmpty = computed(() => emptyObj(assist.value));
const reliefEmpty = computed(() => emptyObj(relief.value));
const refundEmpty = computed(() => emptyObj(refund.value));
const modelEmpty = computed(() => emptyObj(model.value));

// 拉取逻辑：/business/union/detail?id=<id>&type=<code>
const loading = ref(false);
const loaded: Record<UTab, boolean> = { province: false, medical: false, relief: false, assistance: false, model: false, refund: false };
function typeOfTab(t: UTab): number { return t === 'province' ? 0 : t === 'medical' ? 1 : t === 'relief' ? 2 : t === 'assistance' ? 3 : t === 'model' ? 4 : 5; }

async function fetchTab(t: UTab) {
  const fullName = (props.data as any)?.fullname || (props as any)?.unionName;
  const id = props.unionId ?? (props.data as any)?.id ?? (props.data as any)?.unionId ?? (props.data as any)?.sourceId;
  if (!fullName && !id) return; // 无关键检索字段不请求
  if (loaded[t]) return;
  try {
    loading.value = true;
    const type = typeOfTab(t);
    // 按新约定优先传 fullName；兜底传 id 兼容旧实现
    const qs = new URLSearchParams();
    if (fullName) qs.set('fullName', String(fullName));
    else if (id != null) qs.set('id', String(id));
    qs.set('type', String(type));
    let resp: any = await apiGet<any>(`/business/union/detail?${qs.toString()}`).catch(() => null);
    if (!resp) {
      const body: Record<string, any> = { type } as any;
      if (fullName) body.fullName = fullName; else if (id != null) body.id = id;
      resp = await apiPostForm<any>('/business/union/detail', body).catch(() => null);
    }
    const data = resp?.data ?? resp; // 允许 data 或直接对象
    const ustat = data?.unionStatisticsVo; // 兼容返回整条 union 详情
    const pick = (k: string) => (ustat && ustat[k]) || data?.[k] || data;
    // 根据类型落位（优先从 unionStatisticsVo 取；再取同名 *_Vo；最后兜底 data 本身）
    if (t === 'province') extProvince.value = pick('provinceStatisticsVo') || null;
    else if (t === 'medical') extMedical.value = pick('medicalStatisticsVo') || null;
    else if (t === 'relief') extRelief.value = pick('reliefStatisticsVo') || null;
    else if (t === 'assistance') extAssist.value = pick('assistanceStatisticsVo') || null;
    else if (t === 'model') extModel.value = pick('modelWorkerStatisticsVo') || null;
    else if (t === 'refund') extRefund.value = pick('refundOfFundsStatisticsVo') || null;
    loaded[t] = true;
  } finally {
    loading.value = false;
  }
}

// 拉取“基本信息”（无 type，返回整条 union）
async function fetchBase() {
  const fullName = (props.data as any)?.fullname || (props as any)?.unionName;
  const id = props.unionId ?? (props.data as any)?.id ?? (props.data as any)?.unionId ?? (props.data as any)?.sourceId;
  if (!fullName && !id) return;
  // 预加载字典，避免显示 code
  await getDict('sys_wuhan_quyu').catch(() => void 0);
  const inds = await getDict('unitIndustry').catch(() => [] as any);
  if (!inds?.length) await getDict('unitlndustry').catch(() => void 0);
  try {
    loading.value = true;
    const qs = new URLSearchParams();
    if (fullName) qs.set('fullName', String(fullName)); else if (id != null) qs.set('id', String(id));
    let resp: any = await apiGet<any>(`/business/union/detail?${qs.toString()}`).catch(() => null);
    if (!resp) resp = await apiPostForm<any>('/business/union/detail', Object.fromEntries(qs.entries())).catch(() => null);
    const d = (resp?.data ?? resp) || {};
    baseLocal.value = {
      fullname: d.fullname ?? base.value.fullname,
      unitDistrictSuffix: (() => {
        const val = d.unitDistrictSuffix ?? d.orgDistrict ?? d.district ?? d.area ?? d.region;
        return labelOf('sys_wuhan_quyu', val, String(val ?? ''));
      })(),
      unitIndustry: labelOf('unitIndustry', d.unitIndustry, String(d.unitIndustry ?? '')),
      establishDate: d.establishDate || d.createunionDate,
      memberCount: d.memberCount ?? d.membership ?? base.value.memberCount,
      linkMan: d.linkMan ?? base.value.linkMan,
      linkPhone: d.linkPhone ?? d.chairmanMobile ?? d.unitTel ?? base.value.linkPhone,
      chair: d.chair ?? d.chairmanName ?? d.chairman ?? base.value.chair,
      viceChair: d.viceResident ?? base.value.viceChair,
      parentUnionName: d.pName ?? d.parentUnionName ?? base.value.parentUnionName,
      legalDuty: d.legalDuty ?? '工会主席',
      isOpenSystem: formatBoolToBool(d.executeEnterprises ?? d.isConsult),
      isWorkerCongress: formatBoolToBool(d.workersCongress),
      childOrgCount: d.orgCount ?? base.value.childOrgCount,
    } as Partial<UnionDetail>;
  } finally {
    loading.value = false;
  }
}

function formatBoolToBool(v: any): boolean {
  if (v == null || v === '') return false;
  const s = String(v).trim().toLowerCase();
  if (s === '1' || s === 'true' || s === '是' || s === 'y' || s === 'yes') return true;
  if (s === '0' || s === 'false' || s === '否' || s === 'n' || s === 'no') return false;
  const n = Number(v);
  if (Number.isFinite(n)) return n === 1;
  return false;
}

// 将统计转成四列一行的展示结构：[l1, v1, l2, v2]
type Row4 = [string, string, string, string];
const rowsProvince = computed<Row4[]>(() => {
  const p = province.value || {} as any;
  return [
    ['下辖工会', n(p.nextUnion), '下辖小三级工会个数', n(p.nextThreeUnion)],
    ['会员个数', n(p.member), '新业态劳动者个数', n(p.newMember)],
    ['下辖小三级工会会员', n(p.threeMember), '', ''],
  ];
});
const rowsMedical = computed<Row4[]>(() => {
  const m = medical.value || {} as any;
  return [
    ['总金额', money(m.totalAmount), '总人次', n(m.people)],
    ['给付金额', money(m.payAmount), '给付人次', n(m.payPeople)],
    ['参加金额', money(m.joinAmount), '参加人次', n(m.joinPeople)],
  ];
});
const rowsAssistance = computed<Row4[]>(() => {
  const a = assist.value || {} as any;
  return [
    ['帮扶家庭个数', n(a.family), '帮扶惠及人数', n(a.people)],
    ['帮扶次数', n(a.help), '帮扶金额', money(a.helpAmount)],
  ];
});
const rowsRelief = computed<Row4[]>(() => {
  const r = relief.value || {} as any;
  return [
    ['救助金额', money(r.amount), '救助人次', n(r.helps)],
    ['四类金额', money(r.four), '临时救助金额', money(r.temporary)],
  ];
});
const rowsModel = computed<Row4[]>(() => {
  const m = model.value || {} as any;
  return [
    ['劳模总数', n(m.workers), '国家级劳模个数', n(m.countryWorkers)],
    ['省级劳模个数', n(m.provinceWorkers), '市级劳模个数', n(m.cityWorkers)],
    ['补助申请总人次', n(m.helps), '补助申请总金额', money(m.helpAmounts)],
  ];
});
const rowsRefund = computed<Row4[]>(() => {
  const r = refund.value || {} as any;
  return [
    ['代收金额', money(r.zje), '省总金额', money(r.szje)],
    ['企业产业金额', money(r.qycyje), '市州金额', money(r.dsje)],
    ['县区金额', money(r.xsje), '基层金额', money(r.jcje)],
    ['手续费', money(r.sxf), '', ''],
  ];
});

// 监听打开与 tab 切换，按需拉取
// 当弹框首次以“已打开”的状态挂载（例如父组件先设置为 true 再渲染）时，
// 普通 watch 不会触发一次，这里加 immediate: true 以保证首帧就去拉接口。
watch(
  () => props.modelValue,
  async (v) => {
    if (!v) return;
    await fetchBase();
    await fetchTab(tab.value);
  },
  { immediate: true }
);

watch(tab, async (t) => {
  if (!props.modelValue) return;
  await fetchTab(t);
});
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
  /* 与会员详情统一：限定高度，主体滚动 */
  max-height: 85vh;
  display: grid;
  grid-template-rows: 0 1fr; /* 头部占 0，高度给 body */
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

.udlg__body { padding: 12px; position: relative; overflow: auto; }

.udlg__sub { margin: 0 0 10px; font-size: 0; }
.udlg__sub-bg { display: inline-grid; place-items: center; height: 36px; min-width: 130px; padding: 0 14px; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; 
  /* 使用新的“标题背景”贴图（1x/2x）：src/images/dialog-module/titlebg */
  background-image: -webkit-image-set(url('../images/dialog-module/titlebg/矩形备份 15.png') 1x, url('../images/dialog-module/titlebg/矩形备份 15@2x.png') 2x);
  background-image: image-set(url('../images/dialog-module/titlebg/矩形备份 15.png') 1x, url('../images/dialog-module/titlebg/矩形备份 15@2x.png') 2x);
}
.udlg__sub-text { font-size: 16px; font-weight: 800; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,.25);margin-bottom: 5px; }

/* 明细表 */
.info { list-style: none; margin: 0; padding: 0; border: 1px solid rgba(80, 140, 230, .35); border-radius: 6px; overflow: hidden; background: #fff; }
.info__row { position: relative; display: grid; grid-template-columns: 170px 1fr 170px 1fr; column-gap: 0; min-height: 56px; align-items: center; }
/* 更接近截图的淡蓝条纹 */
.info__row:nth-child(odd) { background: rgba(87, 151, 255, .12); }
.info__row:nth-child(even) { background: rgba(87, 151, 255, .22); }
.info__row::before { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(60, 120, 220, .35); }

.lab { padding: 14px 16px; color: #333; font-weight: 800; white-space: nowrap; }
.val { padding: 14px 16px; color: #333; font-weight: 700; }

/* 次级信息样式与会员详情保持一致 */
.info--flat .info__row { grid-template-columns: 180px 1fr; min-height: 44px; }
.info--flat .info__row::before { display: none; }

/* tabs */
.tabs { display: flex; gap: 6px; margin: 12px 0 6px; }
.tab { position: relative; padding: 4px 10px; border: 1px solid rgba(80,140,230,.35); border-radius: 6px; background: rgba(255,255,255,.9); color: #2a6ff0; font-weight: 800; cursor: pointer; font-size: 12px; }
.tab.active { background: linear-gradient(180deg, rgba(120,175,255,.35), rgba(120,175,255,.18)); box-shadow: inset 0 0 8px rgba(120,175,255,.25); }

.card { border-radius: 6px; background: rgba(255,255,255,.95); overflow: hidden; }
.empty-tip { margin: 0; padding: 24px 0; text-align: center; color: #2a6ff0; font-weight: 800; font-size: 13px; letter-spacing: 1px; }

/* simple overlay for loading */
.udlg__body { position: relative; }
.udlg__loading { position: absolute; inset: 12px; background: rgba(255,255,255,.55); display: grid; place-items: center; z-index: 10; border-radius: 6px; }
</style>
