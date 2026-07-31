import { describe, it, expect } from 'vitest';
import { getTenGod, buildDaYun, buildLiuNian } from '../src/data/dayun';
import { getYearPillar, getMonthPillar } from '../src/data/ganzhi';

describe('十神', () => {
  it('以甲日主为例，五行十神关系正确', () => {
    expect(getTenGod(0, 0)).toBe('比肩');   // 甲 vs 甲
    expect(getTenGod(0, 1)).toBe('劫财');   // 甲 vs 乙
    expect(getTenGod(0, 2)).toBe('食神');   // 甲 vs 丙
    expect(getTenGod(0, 3)).toBe('伤官');   // 甲 vs 丁
    expect(getTenGod(0, 4)).toBe('偏财');   // 甲 vs 戊
    expect(getTenGod(0, 5)).toBe('正财');   // 甲 vs 己
    expect(getTenGod(0, 6)).toBe('七杀');   // 甲 vs 庚
    expect(getTenGod(0, 7)).toBe('正官');   // 甲 vs 辛
    expect(getTenGod(0, 8)).toBe('偏印');   // 甲 vs 壬
    expect(getTenGod(0, 9)).toBe('正印');   // 甲 vs 癸
  });
});

describe('大运排盘', () => {
  // 2024-02-10：甲辰年（甲阳）、丙寅月、甲辰日
  const year = 2024, month = 2, day = 10;
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(yearPillar.ganIndex, month, day);

  it('阳年男顺排：丙寅 → 丁卯 → 戊辰 → 己巳', () => {
    expect(yearPillar.ganIndex).toBe(0);    // 甲
    expect(monthPillar.ganIndex).toBe(2);   // 丙
    const { steps, qiYun } = buildDaYun(year, month, day, '男', 0, monthPillar, 0, 6, 2026);
    expect(qiYun.direction).toBe('顺排');
    expect(steps.slice(0, 4).map(s => s.gan + s.zhi)).toEqual(['丁卯', '戊辰', '己巳', '庚午']);
    // 距惊蛰（3/6）25 天 ÷ 3 ≈ 8.3 → 8 岁起运
    expect(qiYun.startAge).toBe(8);
    expect(qiYun.startYear).toBe(2032);
    // 2026 年落在 2032-2041 之前，无当前大运
    expect(steps.some(s => s.isCurrent)).toBe(false);
  });

  it('阳年女逆排：丙寅 → 乙丑 → 甲子 → 癸亥', () => {
    const { steps, qiYun } = buildDaYun(year, month, day, '女', 0, monthPillar, 0, 6, 2026);
    expect(qiYun.direction).toBe('逆排');
    expect(steps.slice(0, 4).map(s => s.gan + s.zhi)).toEqual(['乙丑', '甲子', '癸亥', '壬戌']);
    // 距立春（2/4）6 天 ÷ 3 = 2 → 2 岁起运
    expect(qiYun.startAge).toBe(2);
  });

  it('阴年男逆排：2023-08-01 癸卯年（癸阴）男 → 逆排', () => {
    const y2 = 2023, m2 = 8, d2 = 1;
    const yp = getYearPillar(y2, m2, d2);
    const mp = getMonthPillar(yp.ganIndex, m2, d2);
    expect(yp.ganIndex).toBe(9); // 癸
    const { steps, qiYun } = buildDaYun(y2, m2, d2, '男', yp.ganIndex, mp, 2, 4, 2026);
    expect(qiYun.direction).toBe('逆排');
    // 月柱己未 → 逆排戊午
    expect(steps[0].gan + steps[0].zhi).toBe('戊午');
  });

  it('大运十神：甲日主 丁卯大运为伤官', () => {
    const { steps } = buildDaYun(year, month, day, '男', 0, monthPillar, 0, 3, 2026);
    expect(steps[0].tenGod).toBe('伤官'); // 丁
    expect(steps[1].tenGod).toBe('偏财'); // 戊
  });
});

describe('流年', () => {
  it('2024-2026 甲日主流年干支与十神正确', () => {
    const years = buildLiuNian(0, 2024, 3);
    expect(years.map(y => `${y.year}${y.gan}${y.zhi}`)).toEqual([
      '2024甲辰', '2025乙巳', '2026丙午',
    ]);
    expect(years[0].tenGod).toBe('比肩');
    expect(years[1].tenGod).toBe('劫财');
    expect(years[2].tenGod).toBe('食神');
  });

  it('评分范围 1-5，评语非空', () => {
    const years = buildLiuNian(5, 2026, 10);
    for (const y of years) {
      expect(y.score).toBeGreaterThanOrEqual(1);
      expect(y.score).toBeLessThanOrEqual(5);
      expect(y.verdict.length).toBeGreaterThan(0);
    }
  });
});
