import type { BaziPillar } from '../types';

// ════════════════════════════════════════════════════════
// 天干地支基础数据（供八字 / 黄历共用，保证口径一致）
// ════════════════════════════════════════════════════════

export const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const GAN_WUXING: Record<string, string> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

export const ZHI_WUXING: Record<string, string> = {
  '子': 'water', '丑': 'earth',
  '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire',
  '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '戌': 'earth', '亥': 'water',
};

export const GAN_YINYANG: Record<string, string> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴',
};

// 十二时辰对应地支（以 0-23 小时为索引）
const HOUR_ZHI = ['子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳', '午',
                  '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥', '子'];

// 二十四节气之「节」（近似固定日期，用于月柱；与标准历法可能相差 1 天）
interface SolarTerm {
  month: number;  // 1-12
  day: number;    // 1-31
  branch: number; // 该节气对应的月支序号（0-11）
  name: string;
}

export const SOLAR_TERMS: SolarTerm[] = [
  { month: 1, day: 6, branch: 1, name: '小寒' },   // 丑月
  { month: 2, day: 4, branch: 2, name: '立春' },   // 寅月
  { month: 3, day: 6, branch: 3, name: '惊蛰' },   // 卯月
  { month: 4, day: 5, branch: 4, name: '清明' },   // 辰月
  { month: 5, day: 6, branch: 5, name: '立夏' },   // 巳月
  { month: 6, day: 6, branch: 6, name: '芒种' },   // 午月
  { month: 7, day: 7, branch: 7, name: '小暑' },   // 未月
  { month: 8, day: 8, branch: 8, name: '立秋' },   // 申月
  { month: 9, day: 8, branch: 9, name: '白露' },   // 酉月
  { month: 10, day: 8, branch: 10, name: '寒露' }, // 戌月
  { month: 11, day: 7, branch: 11, name: '立冬' }, // 亥月
  { month: 12, day: 7, branch: 0, name: '大雪' },  // 子月
];

export function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/** 从 1900-01-01 起的天数（1900-01-01 为 0） */
export function daysFrom1900(year: number, month: number, day: number): number {
  let days = 0;
  for (let y = 1900; y < year; y++) days += isLeap(y) ? 366 : 365;
  const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeap(year)) monthDays[2] = 29;
  for (let m = 1; m < month; m++) days += monthDays[m];
  return days + day - 1;
}

/** 当前处于哪个「节」之后（数组按时间升序；小寒前属于大雪后的子月） */
function getSolarTermIndex(month: number, day: number): number {
  let idx = -1;
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const term = SOLAR_TERMS[i];
    if (month > term.month || (month === term.month && day >= term.day)) idx = i;
    else break;
  }
  return idx === -1 ? SOLAR_TERMS.length - 1 : idx;
}

/** 月支（基于节气，近似）：寅=2 ... 丑=1 */
export function getMonthBranchIndex(month: number, day: number): number {
  const i = getSolarTermIndex(month, day);
  return SOLAR_TERMS[i].branch;
}

/** 当前节气名称（如「小暑」） */
export function getSolarTermName(month: number, day: number): string {
  return SOLAR_TERMS[getSolarTermIndex(month, day)].name;
}

/** 时辰地支序号（0-11） */
export function getHourZhiIndex(hour: number): number {
  return ZHI.indexOf(HOUR_ZHI[Math.max(0, Math.min(23, Math.floor(hour)))]);
}

/** 日柱：以 1900-01-01（甲戌日）为锚点，精确推算 */
export function getDayPillar(year: number, month: number, day: number): BaziPillar {
  const diff = daysFrom1900(year, month, day);
  const ganIdx = diff % 10;
  const zhiIdx = (10 + diff) % 12;
  return { gan: GAN[ganIdx], zhi: ZHI[zhiIdx], ganIndex: ganIdx, zhiIndex: zhiIdx };
}

/** 年柱：以立春为界（立春前按上一年计） */
export function getYearPillar(year: number, month: number, day: number): BaziPillar {
  const lichun = SOLAR_TERMS.find(t => t.name === '立春')!;
  const effectiveYear = (month < lichun.month || (month === lichun.month && day < lichun.day))
    ? year - 1
    : year;
  const ganIdx = ((effectiveYear - 4) % 10 + 10) % 10;
  const zhiIdx = ((effectiveYear - 4) % 12 + 12) % 12;
  return { gan: GAN[ganIdx], zhi: ZHI[zhiIdx], ganIndex: ganIdx, zhiIndex: zhiIdx };
}

/** 月柱：五虎遁（甲己之年丙作首...） */
export function getMonthPillar(yearGanIndex: number, month: number, day: number): BaziPillar {
  const zhiIdx = getMonthBranchIndex(month, day);
  const ganIdx = (yearGanIndex % 5 * 2 + 2 + (zhiIdx - 2 + 12) % 12) % 10;
  return { gan: GAN[ganIdx], zhi: ZHI[zhiIdx], ganIndex: ganIdx, zhiIndex: zhiIdx };
}

/** 时柱：五鼠遁（甲己还加甲...） */
export function getHourPillar(dayGanIndex: number, hour: number): BaziPillar {
  const zhiIdx = getHourZhiIndex(hour);
  const ganIdx = (dayGanIndex * 2 + zhiIdx) % 10;
  return { gan: GAN[ganIdx], zhi: ZHI[zhiIdx], ganIndex: ganIdx, zhiIndex: zhiIdx };
}

export function pillarLabel(p: BaziPillar): string {
  return `${p.gan}${p.zhi}`;
}
