/**
 * 起卦法引擎 — 统一数字卦/时间卦/蓍草卦的计算逻辑
 *
 * 数字卦与时间卦遵循《梅花易数》：
 *  - 先天八卦数：乾一、兑二、离三、震四、巽五、坎六、艮七、坤八（余 0 视作 8）；
 *  - 第一个数/年月日之和为上卦，第二个数/年月日时之和为下卦；
 *  - 动爻数以 6 取余，余 0 取上爻。
 *
 * 蓍草卦遵循《周易·系辞上》大衍筮法：
 *  - 「大衍之数五十，其用四十有九」，三变成一爻，十八变成一卦；
 *  - 每爻四象概率：老阳 3/16、少阳 5/16、少阴 7/16、老阴 1/16。
 */

import type { LineType } from '../types';
import { ZHI, getYearPillar, getHourZhiIndex } from './ganzhi';
import { solar2lunar } from './lunar';

// 先天八卦数 1-8 → 三爻二进制（下→上）
export const XIAN_TIAN_BINS = [
  '111', // 1 乾 ☰
  '110', // 2 兑 ☱
  '101', // 3 离 ☲
  '100', // 4 震 ☳
  '011', // 5 巽 ☴
  '010', // 6 坎 ☵
  '001', // 7 艮 ☶
  '000', // 8 坤 ☷
];

/** 数 → 先天八卦二进制（余 0 视作 8） */
export function trigramByNumber(n: number): string {
  const r = Math.abs(Math.floor(n)) % 8;
  return XIAN_TIAN_BINS[r === 0 ? 7 : r - 1];
}

/** 数 → 动爻位置（0=初爻，5=上爻）；余 0 取上爻 */
export function movingLineIndex(n: number): number {
  const r = Math.abs(Math.floor(n)) % 6;
  return r === 0 ? 5 : r - 1;
}

/** 由卦象二进制（下→上）与动爻位置生成 LineType[] */
export function linesFromBinary(bin: string, moving: number): LineType[] {
  return bin.split('').map((ch, i) => {
    const isYang = ch === '1';
    if (i !== moving) return isYang ? 'yang' : 'yin';
    return isYang ? 'old_yang' : 'old_yin';
  });
}

/** 数字卦：上卦 = a，下卦 = b，动爻 = c */
export function numberCast(a: number, b: number, c: number): LineType[] {
  const upper = trigramByNumber(a);
  const lower = trigramByNumber(b);
  return linesFromBinary(lower + upper, movingLineIndex(c));
}

/**
 * 时间卦（梅花易数）：年支序数（子1…亥12）+ 农历月 + 农历日 为上卦；
 * 再加时支序数为下卦；总数为动爻。
 * 年支以立春为界（与八字引擎口径一致）；闰月按该月月数计（如闰四月按 4）。
 */
export function timeCast(date: Date): LineType[] {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();

  const yearZhiIndex = getYearPillar(y, m, d).zhiIndex;
  const yearNum = yearZhiIndex + 1;
  const lunar = solar2lunar(y, m, d);
  const monthNum = lunar.month;
  const dayNum = lunar.day;
  const hourNum = getHourZhiIndex(h) + 1;

  const base = yearNum + monthNum + dayNum;
  const upper = trigramByNumber(base);
  const lower = trigramByNumber(base + hourNum);
  return linesFromBinary(lower + upper, movingLineIndex(base + hourNum));
}

// ═══ 大衍筮法 ═══

/** 分而为二（保证两侧均非空，且右侧至少留一策以供挂一） */
function splitStalks(total: number): [number, number] {
  const left = 1 + Math.floor(Math.random() * (total - 2));
  return [left, total - left];
}

/** 一「变」：分二 → 挂一 → 揲四 → 归奇，返回本变取走的策数 */
function oneChange(remaining: number): number {
  const [left, right] = splitStalks(remaining);
  const rightAfter = right - 1; // 挂一以象三
  const lRem = left % 4 === 0 ? 4 : left % 4;
  const rRem = rightAfter % 4 === 0 ? 4 : rightAfter % 4;
  return lRem + rRem + 1; // 归奇于扐
}

/** 大衍筮法一爻：三变后以剩余策数 ÷ 4 得 6/7/8/9 */
export function yarrowLine(): LineType {
  return yarrowLineSteps().line;
}

/** 大衍筮法一爻的三变过程（供动画展示与测试） */
export function yarrowLineSteps(): {
  line: LineType;
  changes: { start: number; removed: number; end: number }[];
} {
  let remaining = 49;
  const changes: { start: number; removed: number; end: number }[] = [];
  for (let i = 0; i < 3; i++) {
    const removed = oneChange(remaining);
    changes.push({ start: remaining, removed, end: remaining - removed });
    remaining -= removed;
  }
  const value = remaining / 4;
  const line: LineType = value === 6 ? 'old_yin' : value === 9 ? 'old_yang' : value === 7 ? 'yang' : 'yin';
  return { line, changes };
}

/** 大衍筮法成卦：自下而上六爻 */
export function yarrowCast(): LineType[] {
  return Array.from({ length: 6 }, () => yarrowLine());
}

/** 时间卦的取数明细（供界面展示与测试） */
export function timeCastDetail(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const h = date.getHours();
  const yearZhiIndex = getYearPillar(y, m, d).zhiIndex;
  const lunar = solar2lunar(y, m, d);
  return {
    yearZhi: ZHI[yearZhiIndex],
    yearNum: yearZhiIndex + 1,
    lunarMonth: lunar.month,
    lunarDay: lunar.day,
    lunarLeap: lunar.isLeap,
    hourZhi: ZHI[getHourZhiIndex(h)],
    hourNum: getHourZhiIndex(h) + 1,
  };
}
