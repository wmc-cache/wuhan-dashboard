<template>
  <div class="wuhan-map" ref="root">
    <div ref="chartEl" class="chart"></div>

    <!-- 右下信息卡 -->
    <div
      v-if="showInfoCard && infoVisible && activeInfo"
      class="info-card"
      :style="{ left: infoPos.x + 'px', top: infoPos.y + 'px' }"
    >
      <div class="title">
        <span class="dot"></span>{{ activeInfo.name }}
      </div>
      <ul class="stats">
        <li>
          <span>工会组织数</span>
          <b>
            <CountUpNumber
              :value="activeInfo.orgCount"
              :duration="1500"
            />
          </b>
          <i>个</i>
        </li>
        <li>
          <span>工会会员数</span>
          <b>
            <CountUpNumber
              :value="activeInfo.memberCount"
              :duration="1500"
            />
          </b>
          <i>人</i>
        </li>
        <li>
          <span>组织单位数</span>
          <b>
            <CountUpNumber
              :value="activeInfo.unitCount"
              :duration="1500"
            />
          </b>
          <i>家</i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref, shallowRef, computed, watch } from 'vue';
import CountUpNumber from '../CountUpNumber.vue';
// 本地 geoJSON（武汉各区）
// 注意：文件较大，已作为 js 导出
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import wuhanGeo from '../../utils/wuh.js';

type DistrictName = string;

interface DistrictInfo {
  name: DistrictName;
  orgCount: number;
  memberCount: number;
  unitCount: number;
}

interface Props {
  dataByDistrict?: Record<DistrictName, DistrictInfo>;
  initialActive?: DistrictName;
  showNetwork?: boolean;
  // 可选：单独微调标签位置（像素偏移）与尺寸
  labelOffsetByName?: Record<DistrictName, [number, number]>;
  labelWidth?: number;
  labelHeight?: number;
  showInfoCard?: boolean;
  showLabels?: boolean;
  infoCardOffsetByName?: Record<DistrictName, [number, number]>;
}

const props = withDefaults(defineProps<Props>(), {
  // 默认用示例数据填充（可由父组件覆盖）
  dataByDistrict: () => ({
    '江夏区': { name: '江夏区', orgCount: 78, memberCount: 777, unitCount: 81 },
    '武昌区': { name: '武昌区', orgCount: 66, memberCount: 520, unitCount: 70 },
    '汉阳区': { name: '汉阳区', orgCount: 55, memberCount: 430, unitCount: 60 },
    '江岸区': { name: '江岸区', orgCount: 64, memberCount: 480, unitCount: 72 },
    '江汉区': { name: '江汉区', orgCount: 60, memberCount: 460, unitCount: 68 },
    '硚口区': { name: '硚口区', orgCount: 51, memberCount: 405, unitCount: 58 },
    '青山区': { name: '青山区', orgCount: 45, memberCount: 360, unitCount: 50 },
    '洪山区': { name: '洪山区', orgCount: 72, memberCount: 615, unitCount: 78 },
    '东西湖区': { name: '东西湖区', orgCount: 40, memberCount: 335, unitCount: 49 },
    '汉南区': { name: '汉南区', orgCount: 18, memberCount: 120, unitCount: 22 },
    '蔡甸区': { name: '蔡甸区', orgCount: 35, memberCount: 290, unitCount: 41 },
    '黄陂区': { name: '黄陂区', orgCount: 50, memberCount: 410, unitCount: 60 },
    '新洲区': { name: '新洲区', orgCount: 44, memberCount: 360, unitCount: 56 },
    '东湖新技术开发区': { name: '东湖新技术开发区', orgCount: 42, memberCount: 320, unitCount: 48 },
    '武汉经济技术开发区': { name: '武汉经济技术开发区', orgCount: 38, memberCount: 280, unitCount: 44 },
    '东湖生态旅游风景区': { name: '东湖生态旅游风景区', orgCount: 12, memberCount: 90, unitCount: 16 },
  }),
  initialActive: '江夏区',
  showNetwork: true,
  // 默认针对中心区域做一点点手动偏移，避免标签重叠（可被父组件覆盖）
  labelOffsetByName: () => ({
    // 市中心三镇及周边较为密集，适当错位一点点
    '江汉区': [-26, -8],
    '江岸区': [14, -30],
    '硚口区': [-44, 8],
    '汉阳区': [-34, 22],
    '武昌区': [16, -16],
    '青山区': [5, -8],
    '洪山区': [-36, 16],
    // 景区/开发区名称较长，也适当往右下错开
    '东湖生态旅游风景区': [62, 8],
    '东湖新技术开发区': [74, 16],
    '武汉经济技术开发区': [-10, 36],
  }),
  labelWidth: 72,
  labelHeight: 26,
  showInfoCard: true,
  showLabels: true,
  infoCardOffsetByName: () => ({})
});

const root = ref<HTMLDivElement | null>(null);
const chartEl = ref<HTMLDivElement | null>(null);
const chart = shallowRef<echarts.ECharts | null>(null);
const active = ref<DistrictName>(props.initialActive);
// 信息卡显示开关：默认不显示，点击地图或标签后显示
const infoVisible = ref(false);
const infoPos = ref({ x: 16, y: 16 });
const autoIndex = ref(0);
let autoTimer: ReturnType<typeof setInterval> | null = null;
let resumeTimer: ReturnType<typeof setTimeout> | null = null;
const AUTO_PLAY_INTERVAL = 5000;

function placeInfoAtPixel(px: [number, number]) {
  const el = root.value; if (!el) return;
  const w = el.clientWidth || 0; const h = el.clientHeight || 0;
  // 弹框背景切图尺寸（map-tip/编组 14备份 7.png 1x: 279x161）
  const CARD_W = 279; const CARD_H = 161; const GAP = 12; const PAD = 8;
  const EXTRA_RIGHT = 240; const EXTRA_BOTTOM = 120;
  let x = (px?.[0] ?? 0) + GAP; let y = (px?.[1] ?? 0) + GAP;
  x = Math.min(Math.max(PAD, x), Math.max(PAD, w - CARD_W - PAD + EXTRA_RIGHT));
  y = Math.min(Math.max(PAD, y), Math.max(PAD, h - CARD_H - PAD + EXTRA_BOTTOM));
  infoPos.value = { x: x-12, y: y-28};
}

const featureCenters: Record<DistrictName, [number, number]> = {};
const featureNames: DistrictName[] = [];
function isLngLat(pt: any): pt is [number, number] {
  return Array.isArray(pt) && pt.length === 2 &&
    typeof pt[0] === 'number' && typeof pt[1] === 'number' &&
    pt[0] > 100 && pt[0] < 130 && pt[1] > 20 && pt[1] < 40;
}

function getOrderedNames(): DistrictName[] {
  return featureNames.filter((n): n is DistrictName => typeof n === 'string' && n.length > 0);
}

function ensureAutoIndex(name: DistrictName | undefined) {
  if (!name) return;
  const idx = getOrderedNames().indexOf(name);
  if (idx >= 0) autoIndex.value = idx;
}

function stopAutoLoop() {
  if (autoTimer != null) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  if (resumeTimer != null) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }
}

function scheduleAutoResume(delay = AUTO_PLAY_INTERVAL) {
  if (resumeTimer != null) {
    clearTimeout(resumeTimer);
    resumeTimer = null;
  }
  resumeTimer = setTimeout(() => {
    resumeTimer = null;
    startAutoLoop();
  }, delay);
}

function startAutoLoop() {
  stopAutoLoop();
  const names = getOrderedNames();
  if (!names.length) return;
  ensureAutoIndex(active.value || names[0]);
  autoTimer = setInterval(() => {
    const list = getOrderedNames();
    if (!list.length) return;
    autoIndex.value = (autoIndex.value + 1) % list.length;
    const nextName = list[autoIndex.value];
    if (nextName) selectDistrict(nextName);
  }, AUTO_PLAY_INTERVAL);
}

function selectDistrict(name: DistrictName, opts: { silent?: boolean } = {}) {
  if (!name) return;
  const prev = active.value;
  active.value = name;
  ensureAutoIndex(name);

  if (chart.value) {
    try {
      if (prev) {
        chart.value.dispatchAction({ type: 'mapUnSelect', seriesName: 'wuhan', name: prev });
      }
      chart.value.dispatchAction({ type: 'mapSelect', seriesName: 'wuhan', name });
    } catch { /* ignore */ }
  }
  setTimeout(drawLabels, 0);

  if (props.showInfoCard) {
    infoVisible.value = true;
    const center = featureCenters[name];
    const centerPx = (center && chart.value)
      ? (chart.value.convertToPixel({ geoIndex: 0 }, center) as number[])
      : [16, 16];
    const offset = props.infoCardOffsetByName?.[name] || [0, 0];
    const anchor = [
      (centerPx?.[0] ?? 0) + (offset?.[0] ?? 0),
      (centerPx?.[1] ?? 0) + (offset?.[1] ?? 0)
    ] as [number, number];
    placeInfoAtPixel(anchor);
  } else {
    infoVisible.value = false;
  }

  if (!opts.silent) {
    const info = props.dataByDistrict[name] || { name, orgCount: 0, memberCount: 0, unitCount: 0 };
    emit('select-change', name, info);
  }
}

function centroidOfFirstRing(geom: any): [number, number] | null {
  try {
    let ring: any = geom?.coordinates;
    if (!Array.isArray(ring)) return null;
    // 兼容 Polygon/MultiPolygon：取第一环
    while (Array.isArray(ring) && Array.isArray(ring[0]) && Array.isArray(ring[0][0]) && typeof ring[0][0][0] !== 'number') {
      ring = ring[0];
    }
    ring = ring?.[0] || ring; // 有些结构多一层
    if (!Array.isArray(ring) || ring.length < 3) return null;
    const pts = ring as [number, number][];
    // 使用多边形重心（Shoelace）
    let area = 0, cx = 0, cy = 0; const n = pts.length;
    for (let i = 0; i < n; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % n];
      const f = x0 * y1 - x1 * y0;
      area += f; cx += (x0 + x1) * f; cy += (y0 + y1) * f;
    }
    area *= 0.5;
    if (Math.abs(area) < 1e-6) {
      const s = pts.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
      return [s[0] / pts.length, s[1] / pts.length];
    }
    return [cx / (6 * area), cy / (6 * area)];
  } catch { return null; }
}

try {
  const feats = (wuhanGeo.features || []) as any[];
  feats.forEach((f) => {
    const n: DistrictName = f.properties?.name;
    featureNames.push(n);
    const cStr = f.properties?.center as string | undefined;
    let c: [number, number] | null = null;
    if (cStr) {
      try { const arr = JSON.parse(cStr); c = [Number(arr[0]), Number(arr[1])] as any; } catch { c = null; }
    }
    if (!isLngLat(c)) {
      const cen = centroidOfFirstRing(f.geometry);
      if (cen && isLngLat(cen)) c = cen;
    }
    if (c && isLngLat(c)) featureCenters[n] = c as [number, number];
  });
} catch {}

const activeInfo = computed(() => props.dataByDistrict[active.value] || { name: active.value, orgCount: 0, memberCount: 0, unitCount: 0 });

const emit = defineEmits<{
  (e: 'select-change', name: string, info: DistrictInfo): void
}>();

function register() {
  // 使用官方 API 判断是否已注册，避免往 echarts 对象挂私有属性（某些构建下该对象是不可扩展的）
  try {
    const exist = (echarts as any).getMap?.('wuhan');
    if (!exist) echarts.registerMap('wuhan', wuhanGeo as any);
  } catch {}
}

function buildOption(): echarts.EChartsOption {
  const areaNormal = '#CFE2FF';
  const areaNormal2 = '#DDEBFF';
  const borderColor = '#5A9EFF';
  const selectedColor = '#1672FF';
  const mapLayout = { layoutCenter: ['50%', '53%'], layoutSize: '128%' };

  const selectedSet = new Set([active.value]);

  // map 数据（为实现选中，向每个区注入单独的 itemStyle 与 selected）
  const seriesData = featureNames.map((name) => ({
    name,
    value: props.dataByDistrict[name]?.orgCount ?? 0,
    selected: selectedSet.has(name)
  }));

  // 生成若干装饰折线（中心点之间的虚线）
  const linePairs: any[] = [];
  const centers = featureNames.map((n) => featureCenters[n]).filter(isLngLat);
  const step = Math.max(2, Math.floor(centers.length / 4));
  for (let i = 0; i < centers.length; i++) {
    const a = centers[i];
    const b = centers[(i + step) % centers.length];
    if (isLngLat(a) && isLngLat(b)) linePairs.push({ coords: [a, b] });
  }

  return {
    geo: {
      map: 'wuhan', roam: false, selectedMode: 'single',
      ...mapLayout,
      itemStyle: { areaColor: areaNormal, borderColor, borderWidth: 1 },
      emphasis: { itemStyle: { areaColor: areaNormal2 } },
      select: { itemStyle: { areaColor: selectedColor } },
      label: { show: false }
    },
    // 两层 map：阴影层 + 主层
    series: [
      // 阴影（稍微偏移制造立体感）
      {
        name: 'shadow', type: 'map', map: 'wuhan', geoIndex: 0, z: 1, silent: true,
        itemStyle: { areaColor: 'rgba(80,140,255,0.18)', borderColor: 'rgba(0,0,0,0)', shadowBlur: 24, shadowColor: 'rgba(30,90,200,0.35)', shadowOffsetX: 8, shadowOffsetY: 10 },
        emphasis: { disabled: true }
      },
      // 主图层
      {
        name: 'wuhan', type: 'map', map: 'wuhan', geoIndex: 0, z: 3,
        selectedMode: 'single',
        data: seriesData,
        itemStyle: { areaColor: areaNormal, borderColor, borderWidth: 1 },
        emphasis: {
          itemStyle: { areaColor: areaNormal2, borderColor: '#4E88FF' },
          label: { color: '#ffffff' }
        },
        select: {
          itemStyle: { areaColor: selectedColor, borderColor: '#0C5CE9', borderWidth: 1.2 },
          label: { color: '#ffffff' }
        },
        label: undefined
      },
      // 装饰虚线
      props.showNetwork ? {
        type: 'lines', coordinateSystem: 'geo', z: 2, silent: true,
        effect: undefined,
        lineStyle: { color: 'rgba(80,150,255,0.35)', width: 1, type: 'dashed' },
        data: linePairs
      } as any : undefined
    ].filter(Boolean) as any,
    graphic: []
  } as echarts.EChartsOption;
}

function drawLabels() {
  if (!chart.value) return;
  const graphics: echarts.GraphicComponentOption[] = [];
  const geoCoordSys = { geoIndex: 0 } as any;
  const showDecor = props.showLabels !== false;
  const makeLabel = (name: string) => {
    const center = featureCenters[name];
    if (!center) return;
    const [x, y] = chart.value!.convertToPixel(geoCoordSys, center) as number[];
    const w = props.labelWidth || 72;
    const h = props.labelHeight || (showDecor ? 26 : 20);
    const isActive = name === active.value;
    const off = props.labelOffsetByName?.[name] || [0, 0];
    const children: echarts.GraphicComponentOption[] = [];
    if (showDecor) {
      children.push(
        { type: 'rect', shape: { x: 0, y: 0, width: w, height: h, r: 6 }, style: { fill: isActive ? 'rgba(22,114,255,0.12)' : 'rgba(255,255,255,0.15)', stroke: '#5A9EFF', lineWidth: 1, lineDash: [5, 5] } },
        { type: 'polygon', shape: { points: [[w / 2 - 6, h], [w / 2 + 6, h], [w / 2, h + 8]] }, style: { fill: '#5A9EFF' } },
        { type: 'rect', shape: { x: w / 2 - 3, y: h + 8, width: 6, height: 10 }, style: { fill: isActive ? '#5A9EFF' : 'rgba(90,158,255,0.8)' } }
      );
    }
    children.push({
      type: 'text',
      style: {
        text: name,
        x: w / 2,
        y: showDecor ? h / 2 + 1 : h / 2,
        fill: isActive ? '#0C5CE9' : '#1f5eff',
        fontSize: 13,
        fontWeight: 800,
        align: 'center',
        verticalAlign: 'middle'
      }
    });
    graphics.push({
      type: 'group',
      x: x - w / 2 + off[0],
      y: y - (showDecor ? h + 18 : h / 2) + off[1],
      z: 5,
      silent: false,
      onclick: () => {
        stopAutoLoop();
        selectDistrict(name);
        scheduleAutoResume(2000);
      },
      children
    });
  };
  featureNames.forEach(makeLabel);
  chart.value.setOption({ graphic: graphics } as any, { replaceMerge: ['graphic'] });
}

function init() {
  register();
  if (!chartEl.value) return;
  chart.value = echarts.init(chartEl.value);
  chart.value.setOption(buildOption());
  // 点击选中
  chart.value.on('click', { seriesType: 'map' }, (p: any) => {
    if (!p || !p.name) return;
    stopAutoLoop();
    selectDistrict(p.name);
    scheduleAutoResume(2000);
  });
  chart.value.on('mouseover', { seriesType: 'map' }, (p: any) => {
    if (!p || !p.name) return;
    stopAutoLoop();
    selectDistrict(p.name);
  });
  chart.value.on('mouseout', { seriesType: 'map' }, () => {
    scheduleAutoResume(2000);
  });

  // 点击空白处隐藏信息卡
  chart.value.getZr().on('click', (e: any) => {
    if (!e?.target) {
      infoVisible.value = false;
    }
  });
  chart.value.getZr().on('globalout', () => {
    scheduleAutoResume(1500);
  });
  // 初次绘制标签
  setTimeout(drawLabels, 0);
  setTimeout(() => {
    const names = getOrderedNames();
    const initial = (props.initialActive && names.includes(props.initialActive))
      ? props.initialActive
      : (active.value || names[0]);
    if (initial) {
      selectDistrict(initial);
    }
    startAutoLoop();
  }, 0);
}

onMounted(() => {
  init();
  // 尺寸变化时重绘
  const ro = new ResizeObserver(() => { chart.value?.resize(); setTimeout(drawLabels, 0); });
  if (root.value) ro.observe(root.value);
  (root as any)._ro = ro;
});

onBeforeUnmount(() => {
  const ro: ResizeObserver | undefined = (root as any)?._ro;
  if (ro && root.value) ro.unobserve(root.value);
  stopAutoLoop();
  if (chart.value) { chart.value.dispose(); chart.value = null; }
});

// 如果父组件覆盖 data 或初始选中，动态更新
watch(() => [props.dataByDistrict, props.showNetwork, props.labelOffsetByName, props.labelWidth, props.labelHeight, props.showLabels, props.infoCardOffsetByName], () => {
  if (!chart.value) return;
  chart.value.setOption(buildOption(), { notMerge: true });
  setTimeout(() => {
    drawLabels();
    if (active.value) selectDistrict(active.value, { silent: true });
  }, 0);
}, { deep: true });

watch(() => props.initialActive, (n) => {
  if (!n) return;
  if (!getOrderedNames().length) { active.value = n; return; }
  stopAutoLoop();
  setTimeout(() => {
    selectDistrict(n);
    startAutoLoop();
  }, 0);
});

watch(() => props.showInfoCard, (val) => {
  if (!val) {
    infoVisible.value = false;
  } else if (active.value) {
    setTimeout(() => selectDistrict(active.value, { silent: true }), 0);
  }
});
</script>

<style scoped lang="scss">
.wuhan-map { position: relative; height: 100%; }
.chart { position: absolute; inset: 0; }

/* 信息卡样式（右下角） */
.info-card {
  position: absolute; z-index: 10;
  width: 279px; height: 161px; /* 与 1x 切图匹配 */
  padding: 46px 14px 12px; /* 预留上部标题带区域 */
  background-image: -webkit-image-set(url('../../images/map-tip/编组 14备份 7.png') 1x, url('../../images/map-tip/编组 14备份 7@2x.png') 2x);
  background-image: image-set(url('../../images/map-tip/编组 14备份 7.png') 1x, url('../../images/map-tip/编组 14备份 7@2x.png') 2x);
  background-repeat: no-repeat; background-size: 100% 100%;
  border: none; box-shadow: none; backdrop-filter: none; border-radius: 0;
}
.info-card .title { display: flex; align-items: center; gap: 8px; color: #ffffff; font-weight: 900; font-size: 14px;
  
  background: transparent; border-radius: 0; padding: 0 6px; margin: -32px 0 0 80px; line-height: 32px;
}

.info-card .stats { list-style: none; margin: 0; padding: 0; }
.info-card .stats li { display: grid; grid-template-columns: 1fr auto auto; align-items: baseline; color: #ffffff;margin-left: 70px;padding: 6px 10px; }
.info-card .stats span { font-weight: 700; white-space: nowrap;}
.info-card .stats b { color: #ffffff; font-weight: 900; font-size: 14px; margin: 0 6px; text-shadow: 0 1px 2px rgba(0,0,0,0.15); }
.info-card .stats i { color: rgba(255,255,255,0.85); font-style: normal; }
</style>
