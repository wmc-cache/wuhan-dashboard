<template>
  <main class="aidv2__grid">
    <!-- 左列：50% / 50% -->
    <div class="col col--l">
      <!-- 左上：还原的卡片+柱体组合 -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-1" aria-hidden="true"></span></div>
        <div class="mod__body">
          <div class="aid2-left">
            <div class="aid2-left__pillarwrap">
              <div class="aid2-left__pillar" aria-hidden="true"></div>
              <!-- 动态百分比文本（居中到每段圆柱） -->
              <ul class="aid2-left__pcts">
                <li v-for="(p, i) in leftPercents" :key="i" class="pct" :style="{ top: leftPctPos[i] }">{{ p }}</li>
              </ul>
            </div>
            <ul class="aid2-left__list">
              <li v-for="(it, i) in leftItems" :key="i" class="aid2-left__item" :style="{ '--dot': it.color } as any">
                <span class="dot" />
                <span class="label">{{ it.name }}</span>
                <span class="val"><b>{{ it.value }}</b><i>人</i></span>
              </li>
            </ul>
          </div>
        </div>
        <button class="see-btn" type="button" title="查看更多" @click="onSee('poorType')"></button>
      </section>

      <!-- 左下：档案类别（使用 HonorRingsChart 实现环图） -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-3" aria-hidden="true"></span></div>
        <div class="mod__body mod__body--full">
          <!-- 饼图整体缩小到 86% 以贴近效果图占比 -->
          <HonorRingsChart :items="archiveItems" center-text="档案分类" :center="['50%','56%']" :gap-deg="10"
            :base-start="20" :sweep-angle="260" :scale="0.86" />
        </div>
        <button class="see-btn" type="button" title="查看更多" @click="onSee('archive')"></button>
      </section>
    </div>

    <!-- 中列：60% / 40% -->
    <div class="col col--c">
      <!-- 中部：还原“总数+中心插画” -->
      <section class="">
        <div class="mod__body mod__body--full">
          <div class="aid2-center">
            <div class="aid2-center__counter">
              <ul class="digits" aria-label="总数">
                <li v-for="(d, i) in counterDigits" :key="i">{{ d }}</li>
              </ul>
              <div style="margin-top: 50px;" class="delta-row" aria-label="环比">
                <span class="delta-text">比上周新增 <b class="num">{{ lastMonthAdd }}</b> 人</span>
                <span class="delta-bar"><i :style="{ width: Math.round(deltaPercent * 100) + '%' }"></i></span>
              </div>
            </div>
            <div class="aid2-center__illus" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <!-- 中下：致困原因柱状图（使用 StripedBarChart） -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-4" aria-hidden="true"></span></div>
        <div class="mod__body mod__body--full">
          <StripedBarChart :categories="causeCats" :values="causeVals" y-unit="人次"
            :yMax="yMax" :gridLeft="64" :gridRight="20" :gridTop="48" :gridBottom="40" :barWidth="40" :stripeWidth="28"
            :stripeHeight="14" :stripeGap="2" :showLabels="false" :enableTooltip="true" stripeColor="#6EA8FF"
            axisColor="rgba(67,127,255,0.35)" textColor="rgba(25, 90, 200, 0.95)"
            gridLineColor="rgba(67,127,255,0.22)" />
        </div>
        <button class="see-btn" type="button" title="查看更多" @click="onSee('cause')"></button>
      </section>
    </div>

    <!-- 右列：50% / 50% -->
    <div class="col col--r">
      <!-- 右上：还原“性别头像 + 年龄分布堆叠条形” -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-2" aria-hidden="true"></span></div>
        <div class="mod__body">
          <div class="aid2-right">
            <div class="aid2-right__badges">
              <div class="badge-box">
                <div class="badge-num">{{ maleTotal }}人</div>
                <span class="badge badge--male" aria-hidden="true"></span>
              </div>
              <div class="badge-box">
                <div class="badge-num">{{ femaleTotal }}人</div>
                <span class="badge badge--female" aria-hidden="true"></span>
              </div>
            </div>
            <HorizontalGenderStack class="aid2-right__chart" :labels="ageLabels" :male="male" :female="female"
              :min-total="90" :step="15" unit-text="人" :grid-left="74" :grid-right="26" :grid-top="24"
              :grid-bottom="36" :bar-width="12" />
          </div>
        </div>
        <button class="see-btn" type="button" title="查看更多" @click="onSee('age')"></button>
      </section>

      <!-- 右下：覆盖类别指标占位（竖排 3 个） -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-5" aria-hidden="true"></span></div>
        <div class="mod__body mod__body--full">
          <CoverageRings :items="coverageItems" />
        </div>
        <button class="see-btn" type="button" title="查看更多" @click="onSee('fileType')"></button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import HonorRingsChart from '../components/HonorRingsChart.vue';
import StripedBarChart from '../components/StripedBarChart.vue';
import HorizontalGenderStack from '../components/HorizontalGenderStack.vue';
import CoverageRings from '../components/aid/CoverageRings.vue';
import { apiGet } from '../utils/api';
import { useRouter } from 'vue-router';

// 颜色映射（与视觉保持统一）
const colors: Record<string, string> = {
  '深度困难': '#2a6ff0',
  '相对困难': '#27b87a',
  '意外致困': '#f6a03a',
  '存量档案': '#FDB94E',
  '增量档案': '#4E8FFF',
  '返困档案': '#6FD9C9',
  '城镇困难职工': '#4E8FFF',
  '困难农民工': '#27b87a',
};

// 左上：帮扶职工档案类型
const leftItems = ref<Array<{ name: string; value: number; color: string }>>([]);
// 百分比文本 & 位置（相对柱体高度）
const leftPercents = computed(() => {
  const sum = leftItems.value.reduce((s, d) => s + d.value, 0) || 1;
  return leftItems.value.map(d => (d.value / sum * 100).toFixed(2) + '%');
});
const leftPctPos = computed(() => {
  const sum = leftItems.value.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  return leftItems.value.map(d => {
    const mid = acc + d.value / sum / 2; // 0~1 中点
    acc += d.value / sum;
    return `calc(${(mid * 100).toFixed(2)}% - 9%)`;
  });
});

// 左下：档案类别环图
const archiveItems = ref<Array<{ name: string; value: number; color: string }>>([]);

// 中下：致困原因
const causeCats = ref<string[]>([]);
const causeVals = ref<number[]>([]);
const yMax = ref<number>(0);

// 中部计数器
const total = ref<number>(0);
const lastMonthAdd = ref<number>(0);
const counterDigits = computed(() => Array.from(String(total.value).padStart(6, '0')));
const deltaPercent = computed(() => {
  const all = total.value || 1;
  return Math.min(1, Math.max(0, lastMonthAdd.value / all));
});

// 右上：年龄分布
const ageLabels = ref<string[]>([]);
const male = ref<number[]>([]);
const female = ref<number[]>([]);
const maleTotal = ref<number>(0);
const femaleTotal = ref<number>(0);

// 右下：覆盖类别（困难类别）
const coverageItems = ref<Array<{ percent: number; value: number; label: string; color: string }>>([]);

async function loadAll() {
  // 并行请求
  const [poorType, helpOutType, fileTypeName, poorCause, ages, allNum] = await Promise.all([
    apiGet<any>('/difficultAssistance/poorType').catch(() => null),
    apiGet<any>('/difficultAssistance/helpOutType').catch(() => null),
    apiGet<any>('/difficultAssistance/fileTypeName').catch(() => null),
    apiGet<any>('/difficultAssistance/poorCause').catch(() => null),
    apiGet<any>('/difficultAssistance/age').catch(() => null),
    apiGet<any>('/difficultAssistance/allNum').catch(() => null),
  ]);

  // 左上三项：档案类型
  if (Array.isArray(poorType)) {
    // 按目标顺序：深度困难 -> 相对困难 -> 意外致困
    const order = ['深度困难', '相对困难', '意外致困'];
    const mapped = poorType.map((it: any) => ({ name: String(it.name), value: Number(it.value) || 0, color: colors[it.name] || '#4E8FFF' }));
    mapped.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
    leftItems.value = mapped;
  }

  // 左下：档案类别
  if (Array.isArray(helpOutType)) {
    archiveItems.value = helpOutType.map((it: any) => ({ name: String(it.name), value: Number(it.value) || 0, color: colors[it.name] || '#4E8FFF' }));
  }

  // 中下：致困原因
  if (poorCause) {
    const d = poorCause;
    causeCats.value = Array.isArray(d.categories) ? d.categories.map((s: any) => String(s)) : [];
    causeVals.value = Array.isArray(d.values) ? d.values.map((n: any) => Number(n) || 0) : [];
    yMax.value = Number(d.ymax) || Math.max(0, ...causeVals.value);
  }

  // 右上：年龄分布
  if (ages) {
    const d = ages;
    maleTotal.value = Number(d.manSum) || 0;
    femaleTotal.value = Number(d.womanSum) || 0;
    ageLabels.value = Array.isArray(d.ageName) ? d.ageName.map((s: any) => String(s)) : [];
    male.value = Array.isArray(d.man) ? d.man.map((n: any) => Number(n) || 0) : [];
    female.value = Array.isArray(d.woman) ? d.woman.map((n: any) => Number(n) || 0) : [];
  }

  // 中部计数器
  if (allNum) {
    total.value = Number(allNum.allNum) || 0;
    lastMonthAdd.value = Number(allNum.addNum) || 0;
  }

  // 右下：困难类别（覆盖环）
  if (Array.isArray(fileTypeName)) {
    coverageItems.value = fileTypeName.map((it: any) => ({
      percent: Number(String(it.region || '').replace(/%$/, '')) || 0,
      value: Number(it.value) || 0,
      label: String(it.name),
      color: colors[it.name] || '#4E8FFF',
    }));
  }
}

const router = useRouter();
onMounted(() => { loadAll().catch(() => void 0); });

function onSee(which: string) {
  // 跳转到“职工帮扶列表”新页面
  try { router.push({ name: 'aid-list' }); } catch {}
}
</script>

<style scoped lang="scss">
.aidv2__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 1fr; /* 三列同高 */
  /* 与 MemberV2 保持一致：主网格 gap 为 0，
     由模块外框的负内边距来“吃掉”边缘，视觉更紧凑 */
  gap: 0;
}

/* 三列容器：左右 50/50；中列 60/40。这样六个模块高度按 50% | 60% | 50% 及 50% | 40% | 50% 排列 */
.col { display: grid; grid-template-rows: 1fr 1fr; row-gap: 0; min-height: 0; height: 100%; }
.col--c { grid-template-rows: 6fr 4fr; }

/* 模块外框与 Refund 一致（高模块也继承相同基线样式） */
.mod, .mod--tall { position: relative; border: none; border-radius: 10px; background: none; padding: 18px; display: grid; grid-template-rows: auto 1fr; height: 100%; min-height: 0; box-sizing: border-box; }
/* 关键：外框切图向外扩 8px，覆盖主网格/列间距，
   做法与 MemberV2 一致，从而减少视觉缝隙 */
.mod::before, .mod--tall::before { content: ''; position: absolute; left: -8px; right: -8px; top: -8px; bottom: -8px; background-repeat: no-repeat; background-size: 100% 100%; pointer-events: none; z-index: -1; }
.mod::before { background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); }
.mod--tall::before { background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); }

.mod__title { margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #2a6ff0; letter-spacing: 1px; }
.mod__body { overflow: hidden; display: grid; min-height: 0; }
/* 统一给标题容器一点内边距，让切图与标题不要贴边（与其它页面观感一致） */
.mod__head { padding: 6px 0 0 10px; }

/* 统一标题切图样式 */
.title-img { display: inline-block; height: 35px; background-repeat: no-repeat; background-size: 100% 100%; margin: 0 0 6px; }
.title-img--aid2-1 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/1/编组 21.png') 1x, url('../images/aid2/title/1/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/1/编组 21.png') 1x, url('../images/aid2/title/1/编组 21@2x.png') 2x); }
.title-img--aid2-2 { width: 254px; background-image: -webkit-image-set(url('../images/aid2/title/2/编组 21.png') 1x, url('../images/aid2/title/2/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/2/编组 21.png') 1x, url('../images/aid2/title/2/编组 21@2x.png') 2x); }
.title-img--aid2-3 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/3/编组 21.png') 1x, url('../images/aid2/title/3/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/3/编组 21.png') 1x, url('../images/aid2/title/3/编组 21@2x.png') 2x); }
.title-img--aid2-4 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/4/编组 21.png') 1x, url('../images/aid2/title/4/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/4/编组 21.png') 1x, url('../images/aid2/title/4/编组 21@2x.png') 2x); }
.title-img--aid2-5 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/5/编组 21.png') 1x, url('../images/aid2/title/5/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/5/编组 21.png') 1x, url('../images/aid2/title/5/编组 21@2x.png') 2x); }

/* 查看更多按钮（右上角） */
.see-btn { position: absolute; top: 30px; right: 25px; width: 59px; height: 13px; cursor: pointer; border: 0; padding: 0; background: transparent; background-repeat: no-repeat; background-size: 100% 100%;
  background-image: -webkit-image-set(url('../images/aid2/see/查看更多备份 2.png') 1x, url('../images/aid2/see/查看更多备份 2@2x.png') 2x);
  background-image: image-set(url('../images/aid2/see/查看更多备份 2.png') 1x, url('../images/aid2/see/查看更多备份 2@2x.png') 2x);
}

/* 占位图形：用中性颜色 + 虚线边框表达结构 */
.ph { border: 2px dashed rgba(0, 120, 255, .35); border-radius: 10px; background: rgba(80, 150, 255, .06); }
.ph--bars { height: 100%; }
.ph--hbars { height: 100%; }
.ph--columns { height: 100%; }
.ph--donut { height: 100%; border-radius: 50%; }
.ph--counter { align-self: start; justify-self: center; margin-top: 4px; padding: 8px 12px; border-radius: 8px; font-weight: 900; color: #2a6ff0; border: 2px dashed rgba(0, 120, 255, .35); }
.ph--center-illust { align-self: center; justify-self: center; width: 72%; aspect-ratio: 1 / .62; }
.ph--ring { height: 96px; border-radius: 50%; }

.ph-list { height: 100%; display: grid; align-content: space-evenly; justify-items: center; row-gap: 10px; }

/* --- Aid2: 左上模块（柱体 + 右侧 3 条卡片） --- */
.aid2-left { height: 100%; display: grid; grid-template-columns: 128px 1fr; column-gap: 16px; align-items: center; }
.aid2-left__pillarwrap { position: relative; align-self: stretch; }
.aid2-left__pillar { position: absolute; inset: 0; background-repeat: no-repeat; background-position: left center; background-size: contain; background-image: -webkit-image-set(url('../images/aid2/part1/1/编组 23.png') 1x, url('../images/aid2/part1/1/编组 23@2x.png') 2x); background-image: image-set(url('../images/aid2/part1/1/编组 23.png') 1x, url('../images/aid2/part1/1/编组 23@2x.png') 2x); }
.aid2-left__pcts { position: absolute; left: 0; right: 0; top: 8%; bottom: 10%; list-style: none; margin: 0; padding: 0; }
.aid2-left__pcts .pct { position: absolute; left: 42%; transform: translate(-50%, -40%); color: #fff; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,.25); }
.aid2-left__list { list-style: none; margin: 0; padding: 0; display: grid; row-gap: 14px; }
.aid2-left__item { height: 72px; border-radius: 8px; background-repeat: no-repeat; background-size: 100% 100%; background-position: center; background-image: -webkit-image-set(url('../images/aid2/part1/2/矩形.png') 1x, url('../images/aid2/part1/2/矩形@2x.png') 2x); background-image: image-set(url('../images/aid2/part1/2/矩形.png') 1x, url('../images/aid2/part1/2/矩形@2x.png') 2x); display: grid; grid-template-columns: 18px 1fr auto; align-items: center; column-gap: 10px; padding: 0 16px; }
.aid2-left__item .dot { width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 0 3px rgba(255,255,255,.7) inset; background: var(--dot); }
.aid2-left__item .label { font-weight: 800; color: #2a6ff0; letter-spacing: .5px; }
.aid2-left__item .val { justify-self: end; font-weight: 900; color: #2a6ff0; }
.aid2-left__item .val b { font-size: 18px; }
.aid2-left__item .val i { font-style: normal; margin-left: 2px; opacity: .9; }

/* --- Aid2: 中部高模块（数字计数 + 中心插画） --- */
.aid2-center { height: 100%; display: grid; grid-template-rows: 180px 1fr; align-content: start; justify-items: center; row-gap: 22px; }
/* 参考 MemberV2 的数字牌风格 */
.aid2-center__counter {
  width: min(92%, 540px);
  height: 150px;
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: center;
  justify-items: center;
  padding-top: 8px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  background-image: -webkit-image-set(
    url('../images/member-v2/num-bg/bg.png') 1x,
    url('../images/member-v2/num-bg/bg@2x.png') 2x
  );
  background-image: image-set(
    url('../images/member-v2/num-bg/bg.png') 1x,
    url('../images/member-v2/num-bg/bg@2x.png') 2x
  );
  filter: drop-shadow(0 6px 16px rgba(45,110,255,0.10));
}
/* 让数字整体稍微左移，贴近效果图位置（向左 12px） */
.digits { display: flex; align-items: flex-end; justify-content: center; gap: 22px; transform: translate(-20px, 30px); }
.digits li {
  list-style: none;
  width: 54px; height: 74px; border-radius: 8px; box-shadow: 0 6px 14px rgba(45,110,255,0.10);
  display: grid; place-items: center;
  background-image: -webkit-image-set(url('../images/member-v2/num/ico／数字bg备份 6.png') 1x, url('../images/member-v2/num/ico／数字bg备份 6@2x.png') 2x);
  background-image: image-set(url('../images/member-v2/num/ico／数字bg备份 6.png') 1x, url('../images/member-v2/num/ico／数字bg备份 6@2x.png') 2x);
  background-size: 100% 100%;
  font-weight: 800; font-size: 54px; color: #2a6ff0; line-height: 1;
}
.delta-row { width: 86%; display: grid; grid-template-columns: auto 1fr; align-items: center; column-gap: 14px; margin: 12px 0 0; }
.delta-text { font-size: 16px; color: #2a6ff0; font-weight: 800; }
.delta-text .num { color: #FFA36B; margin: 0 4px; }
.delta-bar { height: 12px; background: rgba(90,160,255,0.25); border-radius: 8px; overflow: hidden; }
.delta-bar i { display: block; height: 100%; background: linear-gradient(90deg, #FFA36B 0%, rgba(255,163,107,0.55) 100%); border-radius: 8px; }
.aid2-center__illus { width: min(86%, 500px); height: 298px; background-repeat: no-repeat; background-size: contain; background-position: center; background-image: -webkit-image-set(url('../images/aid2/part2/2/编组 9.png') 1x, url('../images/aid2/part2/2/编组 9@2x.png') 2x); background-image: image-set(url('../images/aid2/part2/2/编组 9.png') 1x, url('../images/aid2/part2/2/编组 9@2x.png') 2x); }

/* --- Aid2: 右上模块（男女头像 + 年龄堆叠条形） --- */
.aid2-right { height: 100%; display: grid; grid-template-rows: auto 1fr; row-gap: 4px; }
.aid2-right__badges { display: grid; grid-auto-flow: column; column-gap: 18px; justify-content: start; align-items: center; padding-left: 6px; }
.badge-box { display: grid; justify-items: center; row-gap: 6px; }
.badge-num { font-weight: 900; color: #2a6ff0; }
.badge { display: inline-block; width: 194px; height: 92px; background-repeat: no-repeat; background-size: 100% 100%; }
.badge--male { background-image: -webkit-image-set(url('../images/aid2/part3/1/编组 22.png') 1x, url('../images/aid2/part3/1/编组 22@2x.png') 2x); background-image: image-set(url('../images/aid2/part3/1/编组 22.png') 1x, url('../images/aid2/part3/1/编组 22@2x.png') 2x); }
.badge--female { background-image: -webkit-image-set(url('../images/aid2/part3/2/编组 22备份 2.png') 1x, url('../images/aid2/part3/2/编组 22备份 2@2x.png') 2x); background-image: image-set(url('../images/aid2/part3/2/编组 22备份 2.png') 1x, url('../images/aid2/part3/2/编组 22备份 2@2x.png') 2x); }
.aid2-right__chart { height: 100%; }
</style>
