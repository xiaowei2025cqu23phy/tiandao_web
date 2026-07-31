import { describe, it, expect } from 'vitest';
import { nextFestivalDate, getUpcomingFestivals, FESTIVALS } from '../src/data/festivals';
import { getCurrentSolarTerm, getSolarTermDates, SOLAR_TERMS_24 } from '../src/data/solarTerms';
import { solar2lunar, moonPhase } from '../src/data/lunar';

const festival = (id: string) => FESTIVALS.find(f => f.id === id)!;

describe('传统节日倒计时', () => {
  it('2024 年锚点：春节 2/10、除夕 2/9、端午 6/10、中秋 9/17', () => {
    const from = new Date(2024, 0, 1);
    expect(nextFestivalDate(festival('chunjie'), from)).toEqual(new Date(2024, 1, 10));
    expect(nextFestivalDate(festival('chuxi'), from)).toEqual(new Date(2024, 1, 9));
    expect(nextFestivalDate(festival('duanwu'), from)).toEqual(new Date(2024, 5, 10));
    expect(nextFestivalDate(festival('zhongqiu'), from)).toEqual(new Date(2024, 8, 17));
    expect(nextFestivalDate(festival('qixi'), from)).toEqual(new Date(2024, 7, 10)); // 2024 七夕 8/10
  });

  it('从 2026-08-01 起，最近节日为七夕，且日期与农历七月初七一致', () => {
    const from = new Date(2026, 7, 1);
    const qixi = nextFestivalDate(festival('qixi'), from);
    const lunar = solar2lunar(qixi.getFullYear(), qixi.getMonth() + 1, qixi.getDate());
    expect(lunar.month).toBe(7);
    expect(lunar.day).toBe(7);
    const up = getUpcomingFestivals(from, 3);
    expect(up[0].festival.id).toBe('qixi');
    expect(up[0].daysLeft).toBe(qixi.getTime() === from.getTime() ? 0 : Math.round((qixi.getTime() - from.getTime()) / 86400000));
    expect(up[0].isToday).toBe(false);
  });

  it('节日当天 isToday 为 true', () => {
    const up = getUpcomingFestivals(new Date(2024, 8, 17), 10);
    const mid = up.find(u => u.festival.id === 'zhongqiu');
    expect(mid?.isToday).toBe(true);
    expect(mid?.daysLeft).toBe(0);
  });

  it('所有节日都能在未来 400 天内找到', () => {
    const from = new Date(2026, 0, 1);
    for (const f of FESTIVALS) {
      const d = nextFestivalDate(f, from);
      expect(d.getTime()).toBeGreaterThanOrEqual(from.getTime());
    }
  });
});

describe('二十四节气', () => {
  it('共 24 个，四季各 6 个', () => {
    expect(SOLAR_TERMS_24).toHaveLength(24);
    for (const s of ['春', '夏', '秋', '冬'] as const) {
      expect(SOLAR_TERMS_24.filter(t => t.season === s)).toHaveLength(6);
    }
  });

  it('2026-08-01 处于大暑（7/23 之后、立秋 8/8 之前）', () => {
    expect(getCurrentSolarTerm(new Date(2026, 7, 1)).name).toBe('大暑');
    expect(getCurrentSolarTerm(new Date(2026, 7, 8)).name).toBe('立秋');
  });

  it('年初跨年回绕：1/1 仍处于冬至', () => {
    expect(getCurrentSolarTerm(new Date(2026, 0, 1)).name).toBe('冬至');
    expect(getCurrentSolarTerm(new Date(2026, 0, 7)).name).toBe('小寒');
  });

  it('节气计算日期与近似参考日期相差不超过 2 天', () => {
    const BEIJING = 8 * 3600000;
    for (const td of getSolarTermDates(2026)) {
      const b = new Date(td.time.getTime() + BEIJING);
      const approx = SOLAR_TERMS_24.find(t => t.name === td.name)!;
      const diff = Math.abs(
        (Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate())
          - Date.UTC(2026, approx.month - 1, approx.day)) / 86400000,
      );
      expect(diff, td.name).toBeLessThanOrEqual(2);
    }
  });
});

describe('月相', () => {
  it('按农历日推月相', () => {
    expect(moonPhase(1, 30).name).toBe('新月');
    expect(moonPhase(8, 30).name).toBe('上弦月');
    expect(moonPhase(15, 30).name).toBe('满月');
    expect(moonPhase(19, 30).name).toBe('亏凸月');
    expect(moonPhase(23, 30).name).toBe('下弦月');
    expect(moonPhase(30, 30).name).toBe('晦月');
  });

  it('2026-08-01（农历六月十九）为亏凸月', () => {
    const lunar = solar2lunar(2026, 8, 1);
    expect(lunar.day).toBe(19);
    expect(moonPhase(lunar.day, 30).name).toBe('亏凸月');
  });
});
