/**
 * 神煞与十二长生（八字进阶）
 *
 * 神煞口诀（以日干 / 日支起）：
 *  - 天乙贵人：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，六辛逢马虎
 *  - 文昌贵人：甲巳乙午，丙戊申丁己酉，庚亥辛子，壬寅癸卯
 *  - 禄神：甲寅乙卯，丙戊巳丁己午，庚申辛酉，壬亥癸子
 *  - 羊刃：甲卯乙辰，丙戊午丁己未，庚酉辛戌，壬子癸丑
 *  - 桃花 / 驿马 / 华盖：按日支三合局（申子辰、寅午戌、巳酉丑、亥卯未）取
 */

import type { BaziPillar } from '../types';

export interface ShenSha {
  name: string;
  pillars: string[];   // 出现位置，如「月支」
  description: string;
}

const PILLAR_LABELS = ['年支', '月支', '日支', '时支'];

// 日干 → 天乙贵人地支（丑1 未7 / 子0 申8 / 亥11 酉9 / 卯3 巳5 / 午6 寅2）
const TIANYI: Record<number, number[]> = {
  0: [1, 7], 4: [1, 7], 6: [1, 7],
  1: [0, 8], 5: [0, 8],
  2: [11, 9], 3: [11, 9],
  8: [3, 5], 9: [3, 5],
  7: [6, 2],
};

// 日干 → 文昌贵人地支
const WENCHANG: Record<number, number> = {
  0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3,
};

// 日干 → 禄神地支
const LUSHEN: Record<number, number> = {
  0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0,
};

// 日干 → 羊刃地支
const YANGREN: Record<number, number> = {
  0: 3, 1: 4, 2: 6, 3: 7, 4: 6, 5: 7, 6: 9, 7: 10, 8: 0, 9: 1,
};

// 三合局：申子辰 / 寅午戌 / 巳酉丑 / 亥卯未 → 桃花、驿马、华盖
const SANHE: Array<{ group: number[]; taohua: number; yima: number; huagai: number }> = [
  { group: [8, 0, 4], taohua: 9, yima: 2, huagai: 4 },   // 申子辰
  { group: [2, 6, 10], taohua: 3, yima: 8, huagai: 10 }, // 寅午戌
  { group: [5, 9, 1], taohua: 6, yima: 11, huagai: 1 },  // 巳酉丑
  { group: [11, 3, 7], taohua: 0, yima: 5, huagai: 7 },  // 亥卯未
];

function findInPillars(pillars: BaziPillar[], targetZhi: number): string[] {
  const found: string[] = [];
  pillars.forEach((p, i) => {
    if (p.zhiIndex === targetZhi) found.push(PILLAR_LABELS[i]);
  });
  return found;
}

/** 八字神煞：以日干/日支起，扫描四柱地支 */
export function getShenSha(pillars: BaziPillar[]): ShenSha[] {
  if (pillars.length < 4) return [];
  const dayGan = pillars[2].ganIndex;
  const dayZhi = pillars[2].zhiIndex;
  const result: ShenSha[] = [];

  const push = (name: string, targetZhi: number, description: string) => {
    const at = findInPillars(pillars, targetZhi);
    if (at.length) result.push({ name, pillars: at, description });
  };

  const tianyi = TIANYI[dayGan];
  if (tianyi) {
    const at = [...tianyi.flatMap(z => findInPillars(pillars, z))];
    if (at.length) result.push({ name: '天乙贵人', pillars: at, description: '命中最吉之神，遇事有人相助，逢凶化吉。' });
  }
  push('文昌贵人', WENCHANG[dayGan], '主聪明好学，利考学文书，才华出众。');
  push('禄神', LUSHEN[dayGan], '主俸禄衣食，财禄安稳，得长辈扶持。');
  push('羊刃', YANGREN[dayGan], '主刚烈果决，性格强势，利武职竞争，注意冲动。');

  const group = SANHE.find(g => g.group.includes(dayZhi));
  if (group) {
    push('桃花', group.taohua, '主异性缘、人缘魅力，亦主艺术审美。');
    push('驿马', group.yima, '主动荡奔波，亦主出行、变动、晋升之机。');
    push('华盖', group.huagai, '主孤高聪慧，喜玄学艺术，有出世之思。');
  }

  return result;
}

// ═══ 十二长生 ═══

export const CHANGSHENG_STAGES = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

export const CHANGSHENG_DESC: Record<string, string> = {
  '长生': '如初生之木，生机萌发，万象更新。',
  '沐浴': '如婴儿洗浴，天真烂漫，亦主桃花风流。',
  '冠带': '如少年加冠，初具才学，渐入佳境。',
  '临官': '如出仕为官，事业有成，正当其位。',
  '帝旺': '如日中天，精力旺盛，旺极而思转。',
  '衰': '盛极而衰，精力渐减，宜守成养身。',
  '病': '生机受挫，不宜过劳，静养为佳。',
  '死': '生机沉寂，宜收敛休整，以待来日。',
  '墓': '如物入库，韬光养晦，蓄势待发。',
  '绝': '气绝归零，否极泰来，孕育新生之机。',
  '胎': '如受胎孕育，新机暗藏，静待萌发。',
  '养': '如养精蓄锐，渐复生机，宜积累。',
};

// 阳干长生位：甲亥、丙戊寅、庚巳、壬申；阴干：乙午、丁己酉、辛子、癸卯
const YANG_START: Record<number, number> = { 0: 11, 2: 2, 4: 2, 6: 5, 8: 8 };
const YIN_START: Record<number, number> = { 1: 6, 3: 9, 5: 9, 7: 0, 9: 3 };

/** 日干对某地支的十二长生状态 */
export function getChangsheng(dayGanIndex: number, zhiIndex: number): string {
  const forward = dayGanIndex % 2 === 0; // 阳干顺行，阴干逆行
  const start = forward ? YANG_START[dayGanIndex] : YIN_START[dayGanIndex];
  if (start === undefined) return '长生';
  const diff = forward ? zhiIndex - start : start - zhiIndex;
  return CHANGSHENG_STAGES[((diff % 12) + 12) % 12];
}
