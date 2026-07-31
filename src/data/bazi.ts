import type { BaziResult, WuxingAnalysis } from '../types';
import {
  GAN,
  ZHI,
  GAN_WUXING,
  ZHI_WUXING,
  GAN_YINYANG,
  getYearPillar,
  getMonthPillar,
  getDayPillar,
  getHourPillar,
  daysFrom1900,
} from './ganzhi';

export { getHourZhiIndex as getHourZhi } from './ganzhi';

// ════════════════════════════════════════════════════════
// 主计算函数
// ════════════════════════════════════════════════════════

export function calculateBazi(
  year: number, month: number, day: number,
  hour: number, gender: string = '男',
): BaziResult {
  // 年柱（以立春为界）
  const yearPillar = getYearPillar(year, month, day);
  // 月柱（五虎遁 + 节气定月支）
  const monthPillar = getMonthPillar(yearPillar.ganIndex, month, day);
  // 日柱（1900-01-01 甲戌日锚点，精确）
  const dayPillar = getDayPillar(year, month, day);
  // 时柱（五鼠遁）
  const hourPillar = getHourPillar(dayPillar.ganIndex, hour);

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    birthHour: hour,
    lunarDate: approximateLunar(year, month, day),
    gender,
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
// 简略农历（近似）
// ════════════════════════════════════════════════════════

function approximateLunar(year: number, month: number, day: number): string {
  // 精确农历需查表，这里给出参考说明
  const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '冬月', '腊月'];
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  // 简略偏移（实际需精确查表，此处给近似）
  const offsetDays = daysFrom1900(year, month, day);
  const lunarDayIdx = (offsetDays + 2) % 30; // 粗略近似
  const lunarMonthIdx = ((offsetDays / 30) | 0) % 12;

  return `${lunarMonths[lunarMonthIdx]}${lunarDays[lunarDayIdx]}（近似）`;
}

// ════════════════════════════════════════════════════════
// 十天干十二地支查询表
// ════════════════════════════════════════════════════════

export const GAN_LIST = GAN.map((g, i) => ({ name: g, index: i, wuxing: GAN_WUXING[g], yinyang: GAN_YINYANG[g] }));
export const ZHI_LIST = ZHI.map((z, i) => ({ name: z, index: i, wuxing: ZHI_WUXING[z] }));
