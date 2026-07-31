/**
 * 六爻纳甲排盘：六神、纳甲、六亲、世应、伏神
 *
 * 六神以日干起：甲乙青龙、丙丁朱雀、戊勾陈、己腾蛇、庚辛白虎、壬癸玄武，自初爻顺排。
 * 伏神：本卦与所属八宫「本宫卦」爻性不同处，伏本宫卦之干支六亲（飞神为当位之爻）。
 */

import type { Hexagram } from '../types';
import { augmentHexagram } from './nayin';
import { getHexagramByNumber } from './hexagrams';

export const LIUSHEN = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];

// 日干 → 六神起位
const LIUSHEN_START: Record<number, number> = {
  0: 0, 1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 4, 7: 4, 8: 5, 9: 5,
};

// 八宫 → 本宫卦（首卦）卦号
const PALACE_HEAD: Record<string, number> = {
  '乾宫': 1, '兑宫': 58, '离宫': 30, '震宫': 51,
  '巽宫': 57, '坎宫': 29, '艮宫': 52, '坤宫': 2,
};

export interface LiuYaoRow {
  position: number;        // 1-6，初至上
  liuShen: string;         // 六神
  nayin: string;           // 纳甲干支（飞神）
  sixRelative: string;     // 六亲（飞神）
  isHost: boolean;
  isGuest: boolean;
  isYang: boolean;
  fuShen?: { nayin: string; sixRelative: string }; // 伏神
}

/** 六爻盘面（自下而上 6 爻） */
export function buildLiuYaoChart(hexagram: Hexagram, dayGanIndex: number): LiuYaoRow[] {
  const h = augmentHexagram(hexagram);
  const head = h.palace ? getHexagramByNumber(PALACE_HEAD[h.palace]) : undefined;
  const headAug = head ? augmentHexagram(head) : undefined;
  const start = LIUSHEN_START[dayGanIndex] ?? 0;

  return h.yaoLines.map((yl, i) => {
    const row: LiuYaoRow = {
      position: i + 1,
      liuShen: LIUSHEN[(start + i) % 6],
      nayin: yl.nayin || '',
      sixRelative: yl.sixRelative || '',
      isHost: !!yl.isHost,
      isGuest: !!yl.isGuest,
      isYang: h.binary[i] === '1',
    };
    // 伏神：本卦与宫卦爻性不同处
    if (headAug && headAug.binary[i] !== h.binary[i]) {
      const f = headAug.yaoLines[i];
      row.fuShen = { nayin: f.nayin || '', sixRelative: f.sixRelative || '' };
    }
    return row;
  });
}

/** 日干 → 六神起位名（供展示） */
export function liuShenStartName(dayGanIndex: number): string {
  return LIUSHEN[LIUSHEN_START[dayGanIndex] ?? 0];
}
