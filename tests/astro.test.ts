import { describe, it, expect } from 'vitest';
import { getSolarTermTime, getSolarTermTimes, deltaT } from '../src/data/astro';
import { getMonthBranchIndexExact, getYearPillarExact, getJieTimes } from '../src/data/ganzhi';

/** 北京时间墙钟 → UTC 毫秒 */
function beijingMs(y: number, m: number, d: number, hh: number, mm: number): number {
  return Date.UTC(y, m - 1, d, hh, mm) - 8 * 3600000;
}

describe('节气天文计算', () => {
  // 公开万年历锚点（北京时间）；时刻容差 ±10 分钟，日期必须完全一致
  const anchors: Array<[number, string, number, number, number, number]> = [
    [2000, '春分', 2000, 3, 20, 15 * 60 + 35],
    [2000, '立春', 2000, 2, 4, 20 * 60 + 40],
    [2018, '立春', 2018, 2, 4, 5 * 60 + 28],
    [2020, '夏至', 2020, 6, 21, 5 * 60 + 43],
    [2023, '冬至', 2023, 12, 22, 11 * 60 + 27],
    [2024, '立春', 2024, 2, 4, 16 * 60 + 26],
    [2024, '春分', 2024, 3, 20, 11 * 60 + 6],
    [2024, '冬至', 2024, 12, 21, 17 * 60 + 20],
    [2025, '立春', 2025, 2, 3, 22 * 60 + 10],
    [2025, '小寒', 2025, 1, 5, 10 * 60 + 32],
  ];

  it('与公开万年历一致：日期精确，时刻误差 ≤ 10 分钟', () => {
    for (const [year, name, y2, m2, d2, minutes] of anchors) {
      const computed = getSolarTermTime(year, name).getTime();
      const expected = beijingMs(y2, m2, d2, Math.floor(minutes / 60), minutes % 60);
      const diff = Math.abs(computed - expected);
      expect(diff, `${year}${name} 日期`).toBeGreaterThanOrEqual(0);
      // 日期一致
      const b = new Date(computed + 8 * 3600000);
      expect(`${b.getUTCFullYear()}-${b.getUTCMonth() + 1}-${b.getUTCDate()}`, `${year}${name} 日期`).toBe(
        `${y2}-${m2}-${d2}`,
      );
      // 时刻误差
      expect(diff, `${year}${name} 时刻误差`).toBeLessThanOrEqual(10 * 60000);
    }
  });

  it('每年 24 个节气，时间递增且各年首尾相接', () => {
    const a = getSolarTermTimes(2026);
    expect(a).toHaveLength(24);
    for (let i = 1; i < 24; i++) {
      expect(a[i].time.getTime()).toBeGreaterThan(a[i - 1].time.getTime());
    }
    // 2026-12 冬至 < 2027-01 小寒
    expect(getSolarTermTime(2026, '冬至').getTime()).toBeLessThan(getSolarTermTime(2027, '小寒').getTime());
  });

  it('ΔT 秒差为正且在合理范围', () => {
    expect(deltaT(2000)).toBeGreaterThan(60);
    expect(deltaT(2026)).toBeGreaterThan(60);
    expect(deltaT(2026)).toBeLessThan(80);
    expect(deltaT(1900)).toBeGreaterThan(-10);
  });
});

describe('八字边界（精确节气时刻）', () => {
  it('2024 立春（约 16:26）：之前癸卯年丑月，之后甲辰年寅月', () => {
    expect(getYearPillarExact(2024, 2, 4, 15, 0).gan).toBe('癸');
    expect(getYearPillarExact(2024, 2, 4, 18, 0).gan).toBe('甲');
    expect(getMonthBranchIndexExact(2024, 2, 4, 15, 0)).toBe(1); // 丑
    expect(getMonthBranchIndexExact(2024, 2, 4, 18, 0)).toBe(2); // 寅
  });

  it('2025 立春（约 22:10）：21:30 仍甲辰年，23:00 起乙巳年', () => {
    expect(getYearPillarExact(2025, 2, 3, 21, 30).gan).toBe('甲');
    expect(getYearPillarExact(2025, 2, 3, 23, 0).gan).toBe('乙');
  });

  it('2024 惊蛰（3/5 前后）：9:00 仍寅月，12:00 起卯月', () => {
    expect(getMonthBranchIndexExact(2024, 3, 5, 9, 0)).toBe(2); // 寅
    expect(getMonthBranchIndexExact(2024, 3, 5, 12, 0)).toBe(3); // 卯
  });

  it('十二「节」每年 12 个且月支映射正确', () => {
    const jies = getJieTimes(2026);
    expect(jies).toHaveLength(12);
    expect(jies.map(j => j.branch)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]);
    // 时间递增
    for (let i = 1; i < 12; i++) {
      expect(jies[i].time).toBeGreaterThan(jies[i - 1].time);
    }
  });
});
