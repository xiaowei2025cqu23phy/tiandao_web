/**
 * 择日 — 以十二值日（建除）为主，叠加黄道黑道、月破、与月建六合/三合、冲肖。
 *
 * 十二值日：月建之日为「建」，依次除、满、平、定、执、破、危、成、收、开、闭；
 * 黄道六神（青龙、明堂、金匮、天德、玉堂、司命）对应的建/除/定/执/危/开日为黄道吉日。
 */

import { getDayPillar, getMonthBranchIndex } from './ganzhi';
import { solar2lunar, monthDays, leapDays } from './lunar';
import { ZODIAC } from './marriage';
import { zhiRelation } from './marriage';

export const JIANCHU = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

// 值日 → 黄黑道神名
export const ZHISHEN: Record<string, string> = {
  建: '青龙', 除: '明堂', 满: '天刑', 平: '朱雀', 定: '金匮', 执: '天德',
  破: '白虎', 危: '玉堂', 成: '天牢', 收: '玄武', 开: '司命', 闭: '勾陈',
};

const HUANGDAO = new Set(['建', '除', '定', '执', '危', '开']);

export interface ZeriaPurpose {
  id: string;
  name: string;
  desc: string;
  preferred: string[]; // 宜之值日
  avoid: string[];     // 忌之值日
}

export const PURPOSES: ZeriaPurpose[] = [
  { id: 'marry', name: '嫁娶', desc: '婚嫁迎娶', preferred: ['成', '定', '开'], avoid: ['破', '闭', '平', '收'] },
  { id: 'move', name: '入宅', desc: '乔迁新居', preferred: ['成', '开', '定'], avoid: ['破', '闭', '危'] },
  { id: 'open', name: '开业', desc: '开张开市', preferred: ['开', '定', '成'], avoid: ['破', '闭', '平'] },
  { id: 'travel', name: '出行', desc: '远行出门', preferred: ['开', '定', '成', '收'], avoid: ['破', '危', '闭'] },
  { id: 'build', name: '动土', desc: '破土动工', preferred: ['平', '定', '成'], avoid: ['破', '闭', '危'] },
];

export interface ZeriaDay {
  date: Date;
  dayPillar: string;
  lunarLabel: string;
  jianChu: string;
  shenName: string;
  isHuangDao: boolean;
  score: number;
  grade: '大吉' | '吉' | '平' | '忌';
  tags: string[];
  note: string;
}

/** 某月逐日择吉 */
export function pickDays(
  purposeId: string,
  year: number,
  month: number,
  zodiac?: string,
): ZeriaDay[] {
  const purpose = PURPOSES.find(p => p.id === purposeId) || PURPOSES[0];
  const zodiacIdx = zodiac ? ZODIAC.indexOf(zodiac) : -1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: ZeriaDay[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dp = getDayPillar(year, month, d);
    const monthZhi = getMonthBranchIndex(year, month, d);
    const v = ((dp.zhiIndex - monthZhi) % 12 + 12) % 12;
    const jc = JIANCHU[v];
    const isHuang = HUANGDAO.has(jc);
    const tags: string[] = [];
    let score = 60;

    if (isHuang) {
      score += 12;
      tags.push('黄道吉日');
    } else {
      score -= 12;
      tags.push('黑道日');
    }
    if (purpose.preferred.includes(jc)) {
      score += 18;
      tags.push(`宜${purpose.name}`);
    }
    if (purpose.avoid.includes(jc)) {
      score -= 35;
      tags.push(`忌${purpose.name}`);
    }
    if (dp.zhiIndex === (monthZhi + 6) % 12) {
      score -= 40;
      tags.push('月破');
    }
    const rel = zhiRelation(dp.zhiIndex, monthZhi);
    if (rel === '六合') {
      score += 10;
      tags.push('与月建六合');
    } else if (rel === '三合') {
      score += 8;
      tags.push('与月建三合');
    }
    if (zodiacIdx >= 0 && dp.zhiIndex === (zodiacIdx + 6) % 12) {
      score -= 30;
      tags.push(`冲${zodiac}`);
    }

    const lunar = solar2lunar(year, month, d);
    const lunarMonthDays = lunar.isLeap ? leapDays(lunar.year) : monthDays(lunar.year, lunar.month);
    const lunarLabel = lunar.day === lunarMonthDays ? `${lunar.label}（月末）` : lunar.label;

    score = Math.max(0, Math.min(100, score));
    const grade: ZeriaDay['grade'] = score >= 85 ? '大吉' : score >= 70 ? '吉' : score >= 55 ? '平' : '忌';
    const shen = ZHISHEN[jc];

    result.push({
      date: new Date(year, month - 1, d),
      dayPillar: `${dp.gan}${dp.zhi}`,
      lunarLabel,
      jianChu: jc,
      shenName: shen,
      isHuangDao: isHuang,
      score,
      grade,
      tags,
      note: `${dp.gan}${dp.zhi}日 · ${jc}日（${shen}）`,
    });
  }
  return result;
}
