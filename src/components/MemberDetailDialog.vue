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
            <button class="tab" :class="{active: tab==='org'}" @click="tab='org'">省总会员</button>
            <button class="tab" :class="{active: tab==='med'}" @click="tab='med'">医疗互助</button>
            <button class="tab" :class="{active: tab==='rescue'}" @click="tab='rescue'">困难救助</button>
            <button class="tab" :class="{active: tab==='help'}" @click="tab='help'">困难帮扶</button>
            <button class="tab" :class="{active: tab==='laomo'}" @click="tab='laomo'">劳模信息</button>
          </div>

          <!-- 省总会员（基础扩展） -->
          <template v-if="tab==='org'">
            <div class="card">
              <ul class="info info--flat">
                <li class="info__row"><span class="lab">入会时间</span><span class="val">{{ org.joinAt || '-' }}</span></li>
                <li class="info__row"><span class="lab">参加工作时间</span><span class="val">{{ org.joinWorkTime || '-' }}</span></li>
                <li class="info__row"><span class="lab">工会职务</span><span class="val">{{ org.unionJob || '-' }}</span></li>
                <li class="info__row"><span class="lab">政治面貌</span><span class="val">{{ org.political || '-' }}</span></li>
                <li class="info__row"><span class="lab">学历</span><span class="val">{{ org.education || '-' }}</span></li>
                <li class="info__row"><span class="lab">会员类型</span><span class="val">{{ org.memberType || '-' }}</span></li>
                <li class="info__row"><span class="lab">婚姻状况</span><span class="val">{{ org.marriage || '-' }}</span></li>
                <li class="info__row"><span class="lab">民族</span><span class="val">{{ org.nation || '-' }}</span></li>
                <li class="info__row"><span class="lab">籍贯</span><span class="val">{{ org.nativePlace || '-' }}</span></li>
                <li class="info__row"><span class="lab">会员卡号</span><span class="val">{{ org.memberCard || '-' }}</span></li>
              </ul>
            </div>
          </template>

          <!-- 医疗互助 -->
          <template v-else-if="tab==='med'">
            <!-- 年份子 tabs -->
            <div v-if="years.length" class="years">
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

          <!-- 困难救助 -->
          <template v-else-if="tab==='rescue'">
            <div class="card">
              <table class="table">
                <thead>
                  <tr><th>医院名称</th><th>疾病名称</th><th>疾病类型</th><th>出院时间</th><th>申请时间</th><th>救助金额</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(r,i) in rescueList" :key="i">
                    <td>{{ r.hospitalName || '-' }}</td>
                    <td>{{ r.diseaseType || '-' }}</td>
                    <td>{{ r.sign || '-' }}</td>
                    <td>{{ r.cyTime || '-' }}</td>
                    <td>{{ r.reportDate || '-' }}</td>
                    <td>{{ r.paymentsMoney || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- 困难帮扶 -->
          <template v-else-if="tab==='help'">
            <div class="card">
              <ul class="info info--flat">
                <li class="info__row"><span class="lab">审核工会</span><span class="val">{{ help.archive.auditOrg || '-' }}</span></li>
                <li class="info__row"><span class="lab">审核时间</span><span class="val">{{ help.archive.auditTime || '-' }}</span></li>
                <li class="info__row"><span class="lab">审核人</span><span class="val">{{ help.archive.auditUser || '-' }}</span></li>
                <li class="info__row"><span class="lab">建档时间</span><span class="val">{{ help.archive.createTime || '-' }}</span></li>
                <li class="info__row"><span class="lab">建档工会</span><span class="val">{{ help.archive.creatorOrg || '-' }}</span></li>
                <li class="info__row"><span class="lab">建档人</span><span class="val">{{ help.archive.creator || '-' }}</span></li>
                <li class="info__row"><span class="lab">困难类别</span><span class="val">{{ help.archive.poorTypeNew || '-' }}</span></li>
              </ul>
            </div>
            <div class="card" style="margin-top:8px;">
              <table class="table">
                <thead>
                  <tr><th>姓名</th><th>关系</th><th>性别</th><th>出生日期</th><th>健康状态</th><th>单位/学校</th><th>人员身份</th><th>月收入</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(r,i) in help.families" :key="i">
                    <td>{{ r.name || '-' }}</td>
                    <td>{{ r.kindred || '-' }}</td>
                    <td>{{ r.gender || '-' }}</td>
                    <td>{{ r.birthday || '-' }}</td>
                    <td>{{ r.health || '-' }}</td>
                    <td>{{ r.company || '-' }}</td>
                    <td>{{ r.personStatus || '-' }}</td>
                    <td>{{ r.earning || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card" style="margin-top:8px;">
              <table class="table">
                <thead>
                  <tr><th>上报单位</th><th>资金类型</th><th>帮扶日期</th><th>帮扶形式</th><th>帮扶措施</th><th>状态</th><th>联系方式</th><th>帮扶单位</th></tr>
                </thead>
                <tbody>
                  <tr v-for="(r,i) in help.helps" :key="i">
                    <td>{{ r.currentDept || '-' }}</td>
                    <td>{{ r.incomingType || '-' }}</td>
                    <td>{{ r.salvationDate || '-' }}</td>
                    <td>{{ r.salvationForm || '-' }}</td>
                    <td>{{ r.salvationMethod || '-' }}</td>
                    <td>{{ r.stateStr || '-' }}</td>
                    <td>{{ r.tel || '-' }}</td>
                    <td>{{ r.userDept || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card" style="margin-top:8px;">
              <ul class="info info--flat">
                <li class="info__row"><span class="lab">疾病类型</span><span class="val">{{ help.people.deformity || '-' }}</span></li>
                <li class="info__row"><span class="lab">月收入</span><span class="val">{{ help.people.earning || '-' }}</span></li>
                <li class="info__row"><span class="lab">健康</span><span class="val">{{ help.people.health || '-' }}</span></li>
                <li class="info__row"><span class="lab">住房</span><span class="val">{{ help.people.houseType || '-' }}</span></li>
                <li class="info__row"><span class="lab">帮扶原因</span><span class="val">{{ help.people.mainPoorType || '-' }}</span></li>
                <li class="info__row"><span class="lab">婚姻</span><span class="val">{{ help.people.marriage || '-' }}</span></li>
                <li class="info__row"><span class="lab">民族</span><span class="val">{{ help.people.nation || '-' }}</span></li>
                <li class="info__row"><span class="lab">政治面貌</span><span class="val">{{ help.people.party || '-' }}</span></li>
                <li class="info__row"><span class="lab">家庭人口数</span><span class="val">{{ help.people.personSum || '-' }}</span></li>
              </ul>
            </div>
          </template>

          <!-- 劳模信息 -->
          <template v-else>
            <div class="card">
              <ul class="info info--flat">
                <li class="info__row"><span class="lab">劳模等级</span><span class="val">{{ model.grade || '-' }}</span></li>
                <li class="info__row"><span class="lab">职务</span><span class="val">{{ model.post || '-' }}</span></li>
                <li class="info__row"><span class="lab">政治面貌</span><span class="val">{{ model.politicsStatus || '-' }}</span></li>
                <li class="info__row"><span class="lab">家庭住址</span><span class="val">{{ model.homeAddress || '-' }}</span></li>
                <li class="info__row"><span class="lab">所属街道工会</span><span class="val">{{ model.streetUnion || '-' }}</span></li>
                <li class="info__row"><span class="lab">获得市劳模时间</span><span class="val">{{ model.cityTime || '-' }}</span></li>
                <li class="info__row"><span class="lab">获省部劳模时间</span><span class="val">{{ model.provinceTime || '-' }}</span></li>
                <li class="info__row"><span class="lab">获全国劳模时间</span><span class="val">{{ model.nationwideTime || '-' }}</span></li>
                <li class="info__row"><span class="lab">获五一奖章时间</span><span class="val">{{ model.nationalMayDay || '-' }}</span></li>
              </ul>
            </div>
          </template>
        </section>
        <div v-if="loading" class="mdlg__loading">加载中...</div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import title1x from '../images/dialog-module/title/小标题.png';
import title2x from '../images/dialog-module/title/小标题@2x.png';
import { apiPostForm } from '../utils/api';
import { getDict, labelOf } from '../utils/dict';

interface MedPlan { type: string; count: string | number; money: string }
interface MedClaim { payType: string; disease: string; startAt: string; endAt: string; fee: string }
interface MedInfo { agency?: string; company?: string; startAt?: string; endAt?: string }

export interface MemberDetail {
  name?: string; gender?: string; joinAt?: string; duty?: string; politics?: string;
  union?: string; age?: number | string; company?: string; phone?: string; education?: string;
  medInfo?: MedInfo; medPlans?: MedPlan[]; medClaims?: MedClaim[]; years?: (string|number)[];
}

type DetailTab = 'org' | 'med' | 'rescue' | 'help' | 'laomo';
export type MemberDetailTab = DetailTab;
interface Props { modelValue: boolean; title?: string; width?: number; data?: MemberDetail; searchCode?: string; defaultTab?: DetailTab }
const props = withDefaults(defineProps<Props>(), { title: '会员详情', width: 1080, data: () => ({}), defaultTab: 'med' });
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();
function close() { emit('update:modelValue', false); }

const d = computed(() => props.data || {});

// Tabs
const tab = ref<DetailTab>(props.defaultTab || 'med');
const years = ref<(string|number)[]>([]);
const curYear = ref<number | undefined>(undefined);
const medInfo = ref<MedInfo>({ agency: '', company: '', startAt: '', endAt: '' });
const medPlans = ref<MedPlan[]>([]);
const medClaims = ref<MedClaim[]>([]);

// Remote detail loading
const loading = ref(false);

// 省总会员信息（基础扩展）
const org = ref<{ joinAt?: string; joinWorkTime?: string; unionJob?: string; political?: string; education?: string; memberType?: string; marriage?: string; nation?: string; nativePlace?: string; memberCard?: string }>({});

// 困难救助列表
const rescueList = ref<Array<{ hospitalName?: string; diseaseType?: string; sign?: string; cyTime?: string; reportDate?: string; paymentsMoney?: string }>>([]);

// 困难帮扶
const help = ref<{ archive: any; families: any[]; helps: any[]; people: any }>({ archive: {}, families: [], helps: [], people: {} });

// 劳模信息
const model = ref<any>({});

function normDate(s?: string): string {
  if (!s) return '';
  const d = String(s).replace(/[^0-9]/g, '');
  if (d.length === 8) return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
  return String(s);
}

async function fetchDetail(code: number) {
  if (!props.searchCode) return;
  try {
    loading.value = true;
    const resp: any = await apiPostForm<any>(`/business/member/allDetail`, { searchCode: props.searchCode, code }).catch(() => null);
    const raw = resp?.data ?? resp;
    const obj = Array.isArray(raw) ? raw[0] : raw;
    if (!obj) return;

    // 基础信息
    const base = obj.baseMember || {};
    (props.data as any).name = base.name ?? (props.data as any).name;
    (props.data as any).gender = labelOf('gender', base.gender, base.gender);
    (props.data as any).age = base.age ?? (props.data as any).age;
    (props.data as any).union = base.unionName ?? (props.data as any).union;
    (props.data as any).company = base.workUnit ?? (props.data as any).company;
    (props.data as any).phone = base.phone ?? (props.data as any).phone;

    // 省总扩展
    const bm = obj.businessMemberVo || {};
    if (bm) {
      (props.data as any).education = labelOf('education', bm.education, bm.education) || (props.data as any).education;
      (props.data as any).joinAt = normDate(bm.joinDate) || (props.data as any).joinAt;
      (props.data as any).duty = labelOf('memberPosition', bm.unionJob, bm.unionJob) || (props.data as any).duty;
      (props.data as any).politics = labelOf('politicalStatus', bm.politicalStatus, bm.politicalStatus) || (props.data as any).politics;
      org.value = {
        joinAt: (props.data as any).joinAt,
        joinWorkTime: normDate(bm.joinWorkTime),
        unionJob: (props.data as any).duty,
        political: (props.data as any).politics,
        education: (props.data as any).education,
        memberType: bm.memberType,
        marriage: bm.marriage,
        nation: bm.nation,
        nativePlace: bm.nativePlace,
        memberCard: bm.memberCard,
      };
    }

    // 医疗互助
    const mv = obj.medicalMemberVo || {};
    const yearKeys = Object.keys(mv).filter(k => /\d{4}年/.test(k));
    if (yearKeys.length) {
      const yrs = yearKeys.map(k => parseInt(k)).sort((a,b)=>b-a);
      years.value = yrs;
      if (!curYear.value || !yrs.includes(Number(curYear.value))) curYear.value = yrs[0];
      const y = mv[`${curYear.value}年`] || {};
      medInfo.value = { agency: y.unionName || '', company: y.unit || '', startAt: normDate(y.startTime), endAt: normDate(y.endTime) };
      const joins = Array.isArray(y.memberJoin) ? y.memberJoin : [];
      medPlans.value = joins.map((it: any) => ({ type: it.type, count: it.piece, money: String(it.bid ?? '') }));
      const pay = y.memberPay || {};
      medClaims.value = Object.keys(pay).length ? [{ payType: pay.type, disease: pay.illName, startAt: normDate(pay.startTime), endAt: normDate(pay.endTime), fee: String(pay.bid ?? '') }] : [];
    } else {
      years.value = [];
      curYear.value = undefined;
      medInfo.value = { agency: '', company: '', startAt: '', endAt: '' };
      medPlans.value = [];
      medClaims.value = [];
    }

    // 困难救助
    if (Array.isArray(obj.rescueDistressMemberVo)) {
      rescueList.value = obj.rescueDistressMemberVo.map((it: any) => ({
        hospitalName: it.hospitalName,
        diseaseType: it.diseaseType,
        sign: it.sign,
        cyTime: normDate(it.cyTime),
        reportDate: normDate(it.reportDate),
        paymentsMoney: it.paymentsMoney,
      }));
    } else rescueList.value = [];

    // 困难帮扶
    if (obj.knbfMemberVo) {
      const kv = obj.knbfMemberVo;
      // 兼容后端两种大小写命名：KnbfArchivesVo / knbfArchivesVo
      const arc = kv?.knbfArchivesVo || kv?.KnbfArchivesVo || {};
      help.value = {
        archive: {
          auditOrg: arc.auditOrg,
          auditTime: normDate(arc.auditTime),
          auditUser: arc.auditUser,
          // 建档时间/工会/人：优先备案(file*)，其次建档(create*/creator*)
          createTime: normDate(arc.fileTime || arc.createTime),
          creatorOrg: arc.fileOrg || arc.creatorOrg,
          creator: arc.fileUser || arc.creator,
          poorTypeNew: arc.poorTypeNew,
        },
        families: Array.isArray(kv?.knbfFamilyVoList) ? kv.knbfFamilyVoList : [],
        helps: Array.isArray(kv?.knbfHelpVoList) ? kv.knbfHelpVoList : [],
        people: kv?.knbfPeopleVo || {},
      } as any;
    } else {
      help.value = { archive: {}, families: [], helps: [], people: {} } as any;
    }

    // 劳模
    if (obj.modelWorkerDetailVo) {
      model.value = obj.modelWorkerDetailVo;
    } else model.value = {};
  } finally {
    loading.value = false;
  }
}

function tabCode(t: 'org'|'med'|'rescue'|'help'|'laomo'): number {
  return t === 'org' ? 3 : t === 'med' ? 4 : t === 'rescue' ? 5 : t === 'help' ? 6 : 7;
}

let suppressTabFetch = false;
watch(
  () => props.defaultTab,
  (val) => {
    if (!val || val === tab.value) return;
    tab.value = val;
  }
);

watch(() => props.modelValue, async (v) => {
  if (!v) return;
  if (!props.searchCode) return;
  await Promise.all([getDict('gender'), getDict('education'), getDict('memberPosition'), getDict('politicalStatus')]).catch(()=>void 0);
  const base = (props.defaultTab || 'med') as DetailTab;
  if (tab.value !== base) {
    suppressTabFetch = true;
    tab.value = base;
  }
  try {
    const code = tabCode((tab.value || base) as DetailTab);
    await fetchDetail(code);
  } finally {
    suppressTabFetch = false;
  }
});

watch(tab, async (t) => {
  if (!props.modelValue || !props.searchCode) return;
  if (suppressTabFetch) return;
  const code = tabCode(t as any);
  await fetchDetail(code);
});

watch(curYear, async (y) => {
  if (!props.modelValue || !props.searchCode) return;
  if (tab.value === 'med') await fetchDetail(4);
});
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
  /* 让主体可滚动：容器限定 80% 视口高度，内部 body 滚动 */
  max-height: 80vh;
  display: grid;
  grid-template-rows: 0 1fr; /* 头部占位为 0，高度全部给 body */
  overflow: visible; /* 允许标题牌溢出 */
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
.mdlg__body { padding: 12px; position: relative; overflow: auto; }

.mdlg__sub { margin: 0 0 10px; font-size: 0; }
.mdlg__sub-bg { display: inline-grid; place-items: center; height: 36px; min-width: 130px; padding: 0 14px; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; 
  /* 替换为新的“标题背景”贴图（1x/2x）：src/images/dialog-module/titlebg */
  background-image: -webkit-image-set(url('../images/dialog-module/titlebg/矩形备份 15.png') 1x, url('../images/dialog-module/titlebg/矩形备份 15@2x.png') 2x);
  background-image: image-set(url('../images/dialog-module/titlebg/矩形备份 15.png') 1x, url('../images/dialog-module/titlebg/矩形备份 15@2x.png') 2x);
}
.mdlg__sub-text { font-size: 14px; font-weight: 800; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.25);margin-bottom: 5px; }

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

/* simple overlay for loading */
.mdlg__body { position: relative; }
.mdlg__loading { position: absolute; inset: 0; background: rgba(255,255,255,.55); display: grid; place-items: center; z-index: 10; border-radius: 6px; }
</style>
