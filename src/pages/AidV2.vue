<template>
  <main class="aidv2__grid">
    <!-- 左列：50% / 50% -->
    <div class="col col--l">
      <!-- 左上：还原的卡片+柱体组合 -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-1" aria-hidden="true"></span></div>
        <div class="mod__body">
          <div class="aid2-left">
            <div class="aid2-left__pillar" aria-hidden="true"></div>
            <ul class="aid2-left__list">
              <li v-for="(it, i) in leftItems" :key="i" class="aid2-left__item" :style="{ '--dot': it.color } as any">
                <span class="dot" />
                <span class="label">{{ it.name }}</span>
                <span class="val"><b>{{ it.value }}</b><i>人</i></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 左下：档案类别（使用 HonorRingsChart 实现环图） -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-3" aria-hidden="true"></span></div>
        <div class="mod__body mod__body--full">
          <HonorRingsChart :items="archiveItems" center-text="档案分类" :center="['50%','56%']" :gap-deg="10"
            :base-start="20" :sweep-angle="260" />
        </div>
      </section>
    </div>

    <!-- 中列：60% / 40% -->
    <div class="col col--c">
      <!-- 中部：还原“总数+中心插画” -->
      <section class="mod--tall">
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
            :yMax="1200" :gridLeft="64" :gridRight="20" :gridTop="48" :gridBottom="40" :barWidth="40" :stripeWidth="28"
            :stripeHeight="14" :stripeGap="2" :showLabels="false" :enableTooltip="true" stripeColor="#6EA8FF"
            axisColor="rgba(67,127,255,0.35)" textColor="rgba(25, 90, 200, 0.95)"
            gridLineColor="rgba(67,127,255,0.22)" />
        </div>
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
              :min-total="90" :step="15" unit-text="万人" :grid-left="74" :grid-right="26" :grid-top="24"
              :grid-bottom="36" :bar-width="12" />
          </div>
        </div>
      </section>

      <!-- 右下：覆盖类别指标占位（竖排 3 个） -->
      <section class="mod">
        <div class="mod__head"><span class="title-img title-img--aid2-5" aria-hidden="true"></span></div>
        <div class="mod__body mod__body--full">
          <CoverageRings :items="coverageItems" />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import HonorRingsChart from '../components/HonorRingsChart.vue';
import StripedBarChart from '../components/StripedBarChart.vue';
import HorizontalGenderStack from '../components/HorizontalGenderStack.vue';
import CoverageRings from '../components/aid/CoverageRings.vue';

// 档案类别环图数据（示例）
const archiveItems = [
  { name: '存量档案', value: 234546, color: '#FDB94E' },
  { name: '增量档案', value: 47885, color: '#4E8FFF' },
  { name: '返回档案', value: 47885, color: '#6FD9C9' }
];

// 致困原因柱状图
const causeCats = ['本人失业', '供养直系亲属负担', '本人疾病', '家属疾病'];
const causeVals = [1080, 720, 860, 1180];

// 右上“年龄分布（男女堆叠）”示例数据
const ageLabels = ['80岁以上', '60-80岁', '40-60岁', '20-40岁', '20岁以下'];
const male = [6, 20, 42, 18, 4];
const female = [8, 26, 48, 28, 7];

// 中部计数器（假数据）
const total = 111211; // 总数（假数据）
const lastMonthAdd = 10; // 本月新增（假数据）
// 将数字填充为 6 位，便于与底图 6 个盒子对齐
const counterDigits = Array.from(String(total).padStart(6, '0'));

// 左上三项文案 + 数值（假数据）
const leftItems = [
  { name: '深度困难', value: 500, color: '#2a6ff0' },
  { name: '相对困难', value: 100, color: '#27b87a' },
  { name: '意外致困', value: 50, color: '#f6a03a' }
];

// 右上男女总数（假数据）
const maleTotal = 5237;
const femaleTotal = 5237;

// 环比进度条占比（0~1），仅用于装饰
const deltaPercent = 0.58;

// 右下：覆盖类别三项（假数据）
const coverageItems = [
  { percent: 80, value: 2347, label: '城镇困难职工', color: '#4E8FFF' },
  { percent: 80, value: 2347, label: '困难农民工', color: '#27b87a' },
  { percent: 80, value: 2347, label: '职工涵盖', color: '#f6a03a' },
];
</script>

<style scoped lang="scss">
.aidv2__grid {
  height: 970px; /* 1080 - 110 */
  padding: 0 20px 20px;
  display: grid;
  grid-template-columns: 540px 1fr 540px;
  grid-template-rows: 1fr; /* 三列同高 */
  gap: 8px; /* 列间距稍微缩小 */
}

/* 三列容器：左/右为 50/50；中为 60/40。使用列内网格保证同列上下绝对等高 */
.col { display: grid; grid-template-rows: 1fr 1fr; row-gap: 10px; min-height: 0; height: 100%; }
/* 左/右列采用 flex 明确 50/50，彻底规避任何百分比/跨行带来的误差 */
.col--l, .col--r { display: flex; flex-direction: column; gap: 8px; }
.col--l > .mod, .col--r > .mod { flex: 1 0 0; min-height: 0; }
.col--c { grid-template-rows: 6fr 4fr; }

/* 模块外框与 Refund 一致 */
.mod { position: relative; border: none; border-radius: 10px; background: none; padding: 24px; display: grid; grid-template-rows: auto 1fr; height: 100%; min-height: 0; box-sizing: border-box; }
.mod::before { content: ''; position: absolute; left: 0; right: 0; top: 0; bottom: 0; background-repeat: no-repeat; background-size: 100% 100%; background-image: -webkit-image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder/矩形.png') 1x, url('../images/module-broder/矩形@2x.png') 2x); pointer-events: none; z-index: -1; }
.mod--tall::before { background-image: -webkit-image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); background-image: image-set(url('../images/module-broder-height/矩形.png') 1x, url('../images/module-broder-height/矩形@2x.png') 2x); }

.mod__title { margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #2a6ff0; letter-spacing: 1px; }
.mod__body { overflow: hidden; display: grid; min-height: 0; }

/* 统一标题切图样式 */
.title-img { display: inline-block; height: 35px; background-repeat: no-repeat; background-size: 100% 100%; margin: 0 0 10px; }
.title-img--aid2-1 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/1/编组 21.png') 1x, url('../images/aid2/title/1/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/1/编组 21.png') 1x, url('../images/aid2/title/1/编组 21@2x.png') 2x); }
.title-img--aid2-2 { width: 254px; background-image: -webkit-image-set(url('../images/aid2/title/2/编组 21.png') 1x, url('../images/aid2/title/2/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/2/编组 21.png') 1x, url('../images/aid2/title/2/编组 21@2x.png') 2x); }
.title-img--aid2-3 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/3/编组 21.png') 1x, url('../images/aid2/title/3/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/3/编组 21.png') 1x, url('../images/aid2/title/3/编组 21@2x.png') 2x); }
.title-img--aid2-4 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/4/编组 21.png') 1x, url('../images/aid2/title/4/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/4/编组 21.png') 1x, url('../images/aid2/title/4/编组 21@2x.png') 2x); }
.title-img--aid2-5 { width: 191px; background-image: -webkit-image-set(url('../images/aid2/title/5/编组 21.png') 1x, url('../images/aid2/title/5/编组 21@2x.png') 2x); background-image: image-set(url('../images/aid2/title/5/编组 21.png') 1x, url('../images/aid2/title/5/编组 21@2x.png') 2x); }

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
.aid2-left__pillar { align-self: stretch; background-repeat: no-repeat; background-position: left center; background-size: contain; background-image: -webkit-image-set(url('../images/aid2/part1/1/编组 23.png') 1x, url('../images/aid2/part1/1/编组 23@2x.png') 2x); background-image: image-set(url('../images/aid2/part1/1/编组 23.png') 1x, url('../images/aid2/part1/1/编组 23@2x.png') 2x); }
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
.digits { display: flex; align-items: flex-end; justify-content: center; gap: 22px; transform: translateY(30px); }
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
