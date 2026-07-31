import { describe, it, expect } from 'vitest';
import { getAlmanac } from '../src/data/almanac';
import { getDayPillar, getYearPillar, getMonthPillar, pillarLabel } from '../src/data/ganzhi';

describe('黄历与八字引擎一致性', () => {
  it('2026-07-31 黄历干支与外部万年历一致', () => {
    const a = getAlmanac(new Date(2026, 6, 31));
    expect(`${a.yearGan}${a.yearZhi}`).toBe('丙午');
    expect(`${a.monthGan}${a.monthZhi}`).toBe('乙未');
    expect(`${a.dayGan}${a.dayZhi}`).toBe('丙午');
    expect(a.weekday).toBe('星期五');
    expect(a.solarTerm).toBe('小暑');
    expect(a.zodiac).toBe('马');
  });

  it('2024 春节黄历干支正确', () => {
    const a = getAlmanac(new Date(2024, 1, 10));
    expect(`${a.yearGan}${a.yearZhi}`).toBe('甲辰');
    expect(`${a.monthGan}${a.monthZhi}`).toBe('丙寅');
    expect(`${a.dayGan}${a.dayZhi}`).toBe('甲辰');
    expect(a.weekday).toBe('星期六');
  });

  it('抽样日期：黄历日柱/年柱/月柱与干支引擎完全一致', () => {
    for (let y = 2020; y <= 2026; y++) {
      for (let m = 1; m <= 12; m++) {
        const a = getAlmanac(new Date(y, m - 1, 15));
        expect(`${a.dayGan}${a.dayZhi}`, `${y}-${m}-15 日柱`).toBe(pillarLabel(getDayPillar(y, m, 15)));
        expect(`${a.yearGan}${a.yearZhi}`, `${y}-${m}-15 年柱`).toBe(pillarLabel(getYearPillar(y, m, 15)));
        const yp = getYearPillar(y, m, 15);
        expect(`${a.monthGan}${a.monthZhi}`, `${y}-${m}-15 月柱`).toBe(pillarLabel(getMonthPillar(yp.ganIndex, m, 15)));
      }
    }
  });

  it('星期计算与 Date 一致', () => {
    const dates = [new Date(2024, 0, 1), new Date(2024, 11, 31), new Date(2026, 6, 31)];
    for (const d of dates) {
      const a = getAlmanac(d);
      expect(a.weekday).toBe(`星期${'日一二三四五六'[d.getDay()]}`);
    }
  });

  it('宜忌/幸运信息非空', () => {
    const a = getAlmanac(new Date(2026, 6, 31));
    expect(a.auspicious.length).toBeGreaterThan(0);
    expect(a.inauspicious.length).toBeGreaterThan(0);
    expect(a.luckyColors.length).toBeGreaterThan(0);
    expect(a.fortunes).toHaveLength(12);
  });
});
