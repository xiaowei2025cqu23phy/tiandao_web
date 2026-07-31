/**
 * 犯太岁（生肖流年）
 * 以年支为中心：值（本命年）、冲（六冲）、害（六害）、破（六破）、刑（三刑/自刑）。
 *  - 六冲：子午、丑未、寅申、卯酉、辰戌、巳亥
 *  - 六害：子未、丑午、寅巳、卯辰、申亥、酉戌
 *  - 六破：子酉、卯午、辰丑、未戌、寅亥、巳申
 *  - 相刑：寅巳申、丑戌未、子卯、辰午酉亥（自刑）
 */

import { GAN, ZHI } from './ganzhi';

export const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

export interface TaiSuiOffender {
  zhi: string;
  zodiac: string;
  relation: string; // 值/冲/害/破/刑太岁
  advice: string;
}

const RELATION_ADVICE: Record<string, string> = {
  '值太岁': '本命年坐太岁，运势起伏较大，宜守不宜攻，可穿红衣红绳、拜太岁化解。',
  '冲太岁': '冲为冲击，主变动奔波，注意口舌是非与意外，宜低调行事。',
  '害太岁': '害主暗伤，易遭小人算计，凡事多留心眼，防合作纠纷。',
  '破太岁': '破主破损，防破财与感情矛盾，谨慎投资，稳字当头。',
  '刑太岁': '刑主刑罚，注意健康与官非口舌，遵纪守法为上。',
};

const HAI: Array<[number, number]> = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
const PO: Array<[number, number]> = [[0, 9], [3, 6], [4, 1], [7, 10], [2, 11], [5, 8]];
// 刑：寅巳申 / 丑戌未 三刑（其余两者互刑）、子卯相刑（对方）、辰午酉亥自刑（自身）
const XING: Array<{ set: number[]; self: boolean }> = [
  { set: [2, 5, 8], self: false },  // 寅巳申
  { set: [1, 10, 7], self: false }, // 丑戌未
  { set: [0, 3], self: false },     // 子卯
  { set: [4], self: true },         // 辰自刑
  { set: [6], self: true },         // 午自刑
  { set: [9], self: true },         // 酉自刑
  { set: [11], self: true },        // 亥自刑
];

function pairOther(pairs: Array<[number, number]>, zhiIdx: number): number | null {
  for (const [a, b] of pairs) {
    if (a === zhiIdx) return b;
    if (b === zhiIdx) return a;
  }
  return null;
}

export interface TaiSuiResult {
  year: number;
  ganZhi: string;   // 如「丙午」
  zodiac: string;   // 值太岁生肖
  offenders: TaiSuiOffender[];
  note: string;
}

/** 某公历年份的犯太岁生肖 */
export function getTaiSui(year: number): TaiSuiResult {
  const ganIdx = ((year - 4) % 10 + 10) % 10;
  const zhiIdx = ((year - 4) % 12 + 12) % 12;
  const offenders: TaiSuiOffender[] = [];

  const push = (relation: string, zhi: number) => {
    offenders.push({
      zhi: ZHI[zhi],
      zodiac: ZODIAC[zhi],
      relation,
      advice: RELATION_ADVICE[relation],
    });
  };

  push('值太岁', zhiIdx);
  const chong = (zhiIdx + 6) % 12;
  push('冲太岁', chong);
  const hai = pairOther(HAI, zhiIdx);
  if (hai !== null) push('害太岁', hai);
  const po = pairOther(PO, zhiIdx);
  if (po !== null) push('破太岁', po);
  for (const { set, self } of XING) {
    if (set.includes(zhiIdx)) {
      if (self) {
        push('刑太岁', zhiIdx);
      } else {
        for (const z of set) {
          if (z !== zhiIdx) push('刑太岁', z);
        }
      }
    }
  }

  return {
    year,
    ganZhi: GAN[ganIdx] + ZHI[zhiIdx],
    zodiac: ZODIAC[zhiIdx],
    offenders,
    note: `太岁当头坐，无灾也有祸。${year} 年犯太岁生肖：${offenders.map(o => `${o.zodiac}（${o.relation.replace('太岁', '')}）`).join('、')}。传统习俗可在正月初八前后拜太岁、随身佩带太岁符或红绳以化解。`,
  };
}
