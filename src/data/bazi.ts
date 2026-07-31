import type { BaziResult, WuxingAnalysis } from '../types';
import {
  GAN,
  ZHI,
  GAN_WUXING,
  ZHI_WUXING,
  GAN_YINYANG,
  getDayPillar,
  getHourPillar,
  getYearPillarExact,
  getMonthPillarExact,
  getJieTimes,
} from './ganzhi';
import { solar2lunar } from './lunar';
import { correctSolarTime, trueSolarHour } from './solarTime';
import { buildDaYun, buildLiuNian, getTenGod } from './dayun';

export { getHourZhiIndex as getHourZhi } from './ganzhi';

// ════════════════════════════════════════════════════════
// 主计算函数
// ════════════════════════════════════════════════════════

export interface BaziOptions {
  minute?: number;      // 出生分钟 0-59
  longitude?: number;   // 出生地经度（东经正），默认 120（东八区标准时）
}

/** 出生时刻距最近「节」交节不足阈值时，提示查权威历法 */
function nearestJieWarning(
  year: number, month: number, day: number,
  hour: number, minute: number,
): string | undefined {
  const birth = Date.UTC(year, month - 1, day, hour, minute, 0) - 8 * 3600000;
  const candidates = [...getJieTimes(year - 1), ...getJieTimes(year), ...getJieTimes(year + 1)];
  let nearest = Infinity;
  let name = '';
  for (const t of candidates) {
    const dist = Math.abs(t.time - birth);
    if (dist < nearest) {
      nearest = dist;
      name = t.name;
    }
  }
  const minutes = nearest / 60000;
  if (minutes <= 20) {
    return `出生时刻距「${name}」交节仅约 ${Math.max(1, Math.round(minutes))} 分钟，处于节气时刻误差（约 ±8 分钟）与出生时间记录精度范围内；如需精确年柱/月柱，请对照天文台或权威万年历核实交节时刻。`;
  }
  return undefined;
}

export function calculateBazi(
  year: number, month: number, day: number,
  hour: number, gender: string = '男',
  options: BaziOptions = {},
): BaziResult {
  const longitude = options.longitude ?? 120;
  const minute = options.minute ?? 0;
  const solarTime = correctSolarTime(year, month, day, hour, minute, longitude);
  const effectiveHour = trueSolarHour(year, month, day, hour, minute, longitude);

  // 年柱/月柱：以精确立春/交节时刻为界（出生墙钟按东八区解释）
  const yearPillar = getYearPillarExact(year, month, day, hour, minute);
  const monthPillar = getMonthPillarExact(yearPillar.ganIndex, year, month, day, hour, minute);
  // 日柱（1900-01-01 甲戌日锚点，精确）
  const dayPillar = getDayPillar(year, month, day);
  // 时柱（五鼠遁，用真太阳时）
  const hourPillar = getHourPillar(dayPillar.ganIndex, effectiveHour);

  const lunar = solar2lunar(year, month, day);
  const boundaryWarning = nearestJieWarning(year, month, day, hour, minute);
  const { qiYun, steps } = buildDaYun(
    year, month, day, gender,
    yearPillar.ganIndex, monthPillar, dayPillar.ganIndex,
    10, undefined, hour, minute,
  );
  const liuNian = buildLiuNian(dayPillar.ganIndex, new Date().getFullYear(), 10);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    tenGods: [
      getTenGod(dayPillar.ganIndex, yearPillar.ganIndex),
      getTenGod(dayPillar.ganIndex, monthPillar.ganIndex),
      '日主',
      getTenGod(dayPillar.ganIndex, hourPillar.ganIndex),
    ],
    birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    birthHour: hour,
    lunarDate: `${lunar.label}（农历${lunar.year}年）`,
    gender,
    longitude,
    solarTime,
    boundaryWarning,
    daYun: { qiYun, steps },
    liuNian,
  };
}

// ════════════════════════════════════════════════════════
// 五行分析
// ════════════════════════════════════════════════════════

export function analyzeWuxing(bazi: BaziResult): WuxingAnalysis {
  const counts: WuxingAnalysis = { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };

  for (const pillar of [bazi.year, bazi.month, bazi.day, bazi.hour]) {
    const gw = GAN_WUXING[pillar.gan];
    const zw = ZHI_WUXING[pillar.zhi];
    if (gw) counts[gw as keyof WuxingAnalysis]++;
    if (zw) counts[zw as keyof WuxingAnalysis]++;
  }

  return counts;
}

export function wuxingLabel(key: string): string {
  const map: Record<string, string> = { metal: '金', wood: '木', water: '水', fire: '火', earth: '土' };
  return map[key] || key;
}

export function wuxingComment(counts: WuxingAnalysis): string {
  const maxEl = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const minEl = Object.entries(counts).sort((a, b) => a[1] - b[1])[0];
  const label = wuxingLabel(maxEl[0]);
  const weak = wuxingLabel(minEl[0]);
  return `${label}旺${weak}弱，八字${counts.metal + counts.wood + counts.water + counts.fire + counts.earth}/8 行。日主${label}性之人，需${weak}来补益平衡。`;
}

// ════════════════════════════════════════════════════════
// 简单日柱评语
// ════════════════════════════════════════════════════════

export function dayMasterComment(bazi: BaziResult): string {
  const gan = bazi.day.gan;
  const yinYang = GAN_YINYANG[gan];
  const wx = wuxingLabel(GAN_WUXING[gan]);
  const comments: Record<string, string> = {
    '甲': '甲木参天，脱胎要火。甲木为阳木，如参天大树，正直仁德，有领导力。',
    '乙': '乙木虽柔，刲羊解牛。乙木为阴木，如藤萝花草，柔韧灵活，善交际。',
    '丙': '丙火猛烈，欺霜侮雪。丙火为阳火，如太阳之光，热情开朗，光明磊落。',
    '丁': '丁火柔中，内性昭融。丁火为阴火，如灯烛之光，内敛温和，心思细腻。',
    '戊': '戊土固重，既中且正。戊土为阳土，如城墙厚土，稳重诚信，包容大度。',
    '己': '己土卑湿，中正蓄藏。己土为阴土，如田园之土，谦逊务实，滋养万物。',
    '庚': '庚金带煞，刚健为最。庚金为阳金，如刀剑之金，刚毅果断，不畏艰难。',
    '辛': '辛金软弱，温润而清。辛金为阴金，如珠玉之金，精致优雅，追求完美。',
    '壬': '壬水通河，能泄金气。壬水为阳水，如江河之水，豁达奔放，智慧流通。',
    '癸': '癸水至弱，达于天津。癸水为阴水，如雨露之水，细腻敏感，润物无声。',
  };
  return comments[gan] || `${gan}日主，${wx}性${yinYang}。`;
}

// ════════════════════════════════════════════════════════
// 十天干十二地支查询表
// ════════════════════════════════════════════════════════

export const GAN_LIST = GAN.map((g, i) => ({ name: g, index: i, wuxing: GAN_WUXING[g], yinyang: GAN_YINYANG[g] }));
export const ZHI_LIST = ZHI.map((z, i) => ({ name: z, index: i, wuxing: ZHI_WUXING[z] }));
