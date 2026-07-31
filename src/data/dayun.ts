/**
 * 大运 / 流年 / 十神
 * 大运以月柱为起点，按年干阴阳 × 性别定顺逆（阳男阴女顺排，阴男阳女逆排），每步 10 年。
 * 起运岁数：出生到最近「节」的真实时间间隔（天）÷ 3（四舍五入），节气时刻由天文算法给出。
 */

import { GAN, ZHI, getJieTimes } from './ganzhi';
import type { BaziPillar, DaYunStep, LiuNianYear, QiYunInfo } from '../types';

/** 日主与其他天干的十神关系（dayGanIndex 0-9） */
export function getTenGod(dayGanIndex: number, otherGanIndex: number): string {
  const dayEl = Math.floor(dayGanIndex / 2);     // 0木 1火 2土 3金 4水
  const otherEl = Math.floor(otherGanIndex / 2);
  const samePolarity = dayGanIndex % 2 === otherGanIndex % 2;
  if (dayEl === otherEl) return samePolarity ? '比肩' : '劫财';
  if (otherEl === (dayEl + 1) % 5) return samePolarity ? '食神' : '伤官'; // 日主生
  if (otherEl === (dayEl + 2) % 5) return samePolarity ? '偏财' : '正财'; // 日主克
  if (otherEl === (dayEl + 3) % 5) return samePolarity ? '七杀' : '正官'; // 克日主
  return samePolarity ? '偏印' : '正印';                                    // 生日主
}

/** 出生墙钟（东八区）→ UTC 毫秒 */
function birthInstant(year: number, month: number, day: number, hour: number, minute: number): number {
  return Date.UTC(year, month - 1, day, hour, minute, 0) - 8 * 3600000;
}

/** 距下一个「节」的真实天数 */
function daysToNextJie(year: number, month: number, day: number, hour: number, minute: number): number {
  const birth = birthInstant(year, month, day, hour, minute);
  const candidates = [...getJieTimes(year - 1), ...getJieTimes(year), ...getJieTimes(year + 1)]
    .sort((a, b) => a.time - b.time);
  const next = candidates.find(t => t.time > birth);
  return next ? (next.time - birth) / 86400000 : 0;
}

/** 距上一个「节」的真实天数（正数） */
function daysFromPrevJie(year: number, month: number, day: number, hour: number, minute: number): number {
  const birth = birthInstant(year, month, day, hour, minute);
  const candidates = [...getJieTimes(year - 1), ...getJieTimes(year)].sort((a, b) => a.time - b.time);
  let prev = 0;
  for (const t of candidates) {
    if (t.time < birth) prev = t.time;
  }
  return prev ? (birth - prev) / 86400000 : 0;
}

const LIUNIAN_VERDICT: Record<string, { verdict: string; score: number }> = {
  '比肩': { verdict: '朋友相助，合作共赢，宜广结善缘', score: 4 },
  '劫财': { verdict: '竞争增多，谨防破财，忌投机冲动', score: 2 },
  '食神': { verdict: '才华外显，心情愉悦，利创作表达', score: 4 },
  '伤官': { verdict: '锋芒毕露，注意口舌是非，宜谨言', score: 3 },
  '偏财': { verdict: '机遇与偏财并存，稳健为上', score: 4 },
  '正财': { verdict: '财星照临，踏实进财，宜守成', score: 4 },
  '七杀': { verdict: '压力挑战并存，宜守不宜攻', score: 2 },
  '正官': { verdict: '贵人提携，事业顺遂，声誉提升', score: 5 },
  '偏印': { verdict: '宜学习思考，静观其变，忌冒进', score: 3 },
  '正印': { verdict: '庇佑护身，学业有成，家宅安宁', score: 5 },
};

export interface DaYunResult {
  qiYun: QiYunInfo;
  steps: DaYunStep[];
}

/**
 * 排大运：以月柱为起点，按年干阴阳 × 性别定顺逆，每步 10 年。
 * @param nowYear 用于标记当前大运；缺省取系统当前年份
 */
export function buildDaYun(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  gender: string,
  yearGanIndex: number,
  monthPillar: BaziPillar,
  dayGanIndex: number,
  stepCount: number = 10,
  nowYear?: number,
  birthHour: number = 12,
  birthMinute: number = 0,
): DaYunResult {
  const male = gender === '男';
  const yearYang = yearGanIndex % 2 === 0; // 甲丙戊庚壬为阳
  const forward = (yearYang && male) || (!yearYang && !male);
  const direction = forward ? '顺排' : '逆排';

  const days = forward
    ? daysToNextJie(birthYear, birthMonth, birthDay, birthHour, birthMinute)
    : daysFromPrevJie(birthYear, birthMonth, birthDay, birthHour, birthMinute);
  const startAge = Math.max(1, Math.round(days / 3));
  const startYear = birthYear + startAge;
  const dir = forward ? 1 : -1;
  const curYear = nowYear ?? new Date().getFullYear();

  const steps: DaYunStep[] = Array.from({ length: stepCount }, (_, k) => {
    const offset = dir * (k + 1); // 大运从月柱的下一位干支起排
    const ganIdx = ((monthPillar.ganIndex + offset) % 10 + 10) % 10;
    const zhiIdx = ((monthPillar.zhiIndex + offset) % 12 + 12) % 12;
    const sAge = startAge + k * 10;
    const sYear = startYear + k * 10;
    return {
      gan: GAN[ganIdx],
      zhi: ZHI[zhiIdx],
      ganIndex: ganIdx,
      zhiIndex: zhiIdx,
      tenGod: getTenGod(dayGanIndex, ganIdx),
      startAge: sAge,
      endAge: sAge + 9,
      startYear: sYear,
      endYear: sYear + 9,
      isCurrent: curYear >= sYear && curYear <= sYear + 9,
    };
  });

  const note = `${direction}：${yearYang ? '阳年' : '阴年'}${gender}，以月柱 ${monthPillar.gan}${monthPillar.zhi} 为起点${forward ? '顺行' : '逆行'}，约 ${startAge} 岁起运（起运岁数 = 出生到最近节气的天数 ÷ 3，简化）。`;
  return {
    qiYun: { direction, startAge, startYear, note },
    steps,
  };
}

/** 流年：以公历年份取六十甲子（立春后与年柱一致），给出十神与吉凶评语 */
export function buildLiuNian(
  dayGanIndex: number,
  fromYear: number = new Date().getFullYear(),
  count: number = 10,
): LiuNianYear[] {
  return Array.from({ length: count }, (_, k) => {
    const year = fromYear + k;
    const ganIdx = ((year - 4) % 10 + 10) % 10;
    const zhiIdx = ((year - 4) % 12 + 12) % 12;
    const tenGod = getTenGod(dayGanIndex, ganIdx);
    const v = LIUNIAN_VERDICT[tenGod] || { verdict: '平稳过渡，按部就班', score: 3 };
    return {
      year,
      gan: GAN[ganIdx],
      zhi: ZHI[zhiIdx],
      ganIndex: ganIdx,
      zhiIndex: zhiIdx,
      tenGod,
      verdict: v.verdict,
      score: v.score,
    };
  });
}
