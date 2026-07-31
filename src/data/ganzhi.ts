import type { BaziPillar } from '../types';
import { getSolarTermTime, getSolarTermTimes, TERM_NAMES_24 } from './astro';

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

// 十二「节」：决定月支（寅月从立春起，...，子月从大雪起）
const JIE_NAMES = ['小寒', '立春', '惊蛰', '清明', '立夏', '芒种', '小暑', '立秋', '白露', '寒露', '立冬', '大雪'];
const JIE_BRANCH: Record<string, number> = {
  小寒: 1, 立春: 2, 惊蛰: 3, 清明: 4, 立夏: 5, 芒种: 6,
  小暑: 7, 立秋: 8, 白露: 9, 寒露: 10, 立冬: 11, 大雪: 0,
};

/** 某公历年的 12 个「节」（UTC 毫秒时刻 + 对应月支） */
export function getJieTimes(year: number): Array<{ name: string; time: number; branch: number }> {
  return JIE_NAMES.map(name => ({
    name,
    time: getSolarTermTime(year, name).getTime(),
    branch: JIE_BRANCH[name],
  }));
}

/** 北京时间（UTC+8）墙钟 → UTC 毫秒时刻 */
function beijingToUtc(year: number, month: number, day: number, hour: number, minute: number): number {
  return Date.UTC(year, month - 1, day, hour, minute, 0) - 8 * 3600000;
}

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

/** 月支（以精确节气时刻为界，日期级：当天 23:59 后所处的月支） */
export function getMonthBranchIndex(year: number, month: number, day: number): number {
  return getMonthBranchIndexExact(year, month, day, 23, 59);
}

/** 月支（时刻级：以出生时刻与交节时刻比较） */
export function getMonthBranchIndexExact(
  year: number, month: number, day: number,
  hour: number = 12, minute: number = 0,
): number {
  const birth = beijingToUtc(year, month, day, hour, minute);
  const candidates = [...getJieTimes(year - 1), ...getJieTimes(year)].sort((a, b) => a.time - b.time);
  let branch = 0;
  for (const t of candidates) {
    if (t.time <= birth) branch = t.branch;
  }
  return branch;
}

/** 当前节气名（24 节气，日期级，与天文时刻一致） */
export function getSolarTermName(year: number, month: number, day: number): string {
  const endOfDay = beijingToUtc(year, month, day, 23, 59) + 59999;
  const candidates = [...getSolarTermTimes(year - 1), ...getSolarTermTimes(year)].sort(
    (a, b) => a.time.getTime() - b.time.getTime(),
  );
  let name = TERM_NAMES_24[TERM_NAMES_24.length - 1];
  for (const t of candidates) {
    if (t.time.getTime() <= endOfDay) name = t.name;
  }
  return name;
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

/** 年柱：以精确立春时刻为界（日期级：当天 23:59 后所处的干支年） */
export function getYearPillar(year: number, month: number, day: number): BaziPillar {
  return getYearPillarExact(year, month, day, 23, 59);
}

/** 年柱（时刻级：以出生时刻与立春时刻比较） */
export function getYearPillarExact(
  year: number, month: number, day: number,
  hour: number = 12, minute: number = 0,
): BaziPillar {
  const birth = beijingToUtc(year, month, day, hour, minute);
  const lichun = getSolarTermTime(year, '立春').getTime();
  const effectiveYear = birth >= lichun ? year : year - 1;
  const ganIdx = ((effectiveYear - 4) % 10 + 10) % 10;
  const zhiIdx = ((effectiveYear - 4) % 12 + 12) % 12;
  return { gan: GAN[ganIdx], zhi: ZHI[zhiIdx], ganIndex: ganIdx, zhiIndex: zhiIdx };
}

/** 月柱：五虎遁（甲己之年丙作首...） */
export function getMonthPillar(yearGanIndex: number, year: number, month: number, day: number): BaziPillar {
  const zhiIdx = getMonthBranchIndex(year, month, day);
  const ganIdx = (yearGanIndex % 5 * 2 + 2 + (zhiIdx - 2 + 12) % 12) % 10;
  return { gan: GAN[ganIdx], zhi: ZHI[zhiIdx], ganIndex: ganIdx, zhiIndex: zhiIdx };
}

/** 月柱（时刻级） */
export function getMonthPillarExact(
  yearGanIndex: number, year: number, month: number, day: number,
  hour: number = 12, minute: number = 0,
): BaziPillar {
  const zhiIdx = getMonthBranchIndexExact(year, month, day, hour, minute);
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
