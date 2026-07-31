import { describe, it, expect } from 'vitest';
import { solar2lunar, lYearDays, leapMonth, monthDays } from '../src/data/lunar';

describe('农历转换（查表精确）', () => {
  it('锚点：1900-01-31 为庚子年正月初一', () => {
    const r = solar2lunar(1900, 1, 31);
    expect(r.year).toBe(1900);
    expect(r.label).toBe('正月初一');
  });

  it('2024-02-10 春节 = 正月初一', () => {
    const r = solar2lunar(2024, 2, 10);
    expect(r.year).toBe(2024);
    expect(r.label).toBe('正月初一');
  });

  it('2024-03-10 = 二月初一（2024 正月大 30 天）', () => {
    const r = solar2lunar(2024, 3, 10);
    expect(r.month).toBe(2);
    expect(r.day).toBe(1);
    expect(r.label).toBe('二月初一');
  });

  it('2026-07-31 = 丙午年六月十八', () => {
    const r = solar2lunar(2026, 7, 31);
    expect(r.year).toBe(2026);
    expect(r.month).toBe(6);
    expect(r.day).toBe(18);
    expect(r.label).toBe('六月十八');
  });

  it('2000-01-01 = 农历己卯年冬月廿五', () => {
    const r = solar2lunar(2000, 1, 1);
    expect(r.year).toBe(1999);
    expect(r.month).toBe(11);
    expect(r.day).toBe(25);
    expect(r.label).toBe('冬月廿五');
  });

  it('闰月正确：2020-05-23 = 闰四月初一，2023-03-22 = 闰二月初一', () => {
    const leap4 = solar2lunar(2020, 5, 23);
    expect(leap4.isLeap).toBe(true);
    expect(leap4.month).toBe(4);
    expect(leap4.day).toBe(1);
    expect(leap4.label).toBe('闰四月初一');

    const leap2 = solar2lunar(2023, 3, 22);
    expect(leap2.isLeap).toBe(true);
    expect(leap2.month).toBe(2);
    expect(leap2.day).toBe(1);
    expect(leap2.label).toBe('闰二月初一');
  });

  it('闰月前后月序正确：2020 闰四月前后仍为四/五月', () => {
    // 2020-05-22 = 四月三十，2020-05-23 = 闰四月初一，2020-06-21 = 五月初一
    expect(solar2lunar(2020, 5, 22).label).toBe('四月三十');
    expect(solar2lunar(2020, 5, 23).label).toBe('闰四月初一');
    expect(solar2lunar(2020, 6, 21).label).toBe('五月初一');
  });

  it('查表辅助函数正确', () => {
    expect(leapMonth(2020)).toBe(4);
    expect(leapMonth(2024)).toBe(0);
    expect(leapMonth(1900)).toBe(8); // 1900 闰八月
    // 1900：闰八月（小月 29 天）+ 7 个大月 → 348 + 7 + 29
    expect(lYearDays(1900)).toBe(384);
    // 2024：无闰月，6 个大月 → 348 + 6
    expect(lYearDays(2024)).toBe(354);
    // 2024 正月为小月（29 天）
    expect(monthDays(2024, 1)).toBe(29);
  });

  it('超出范围抛错', () => {
    expect(() => solar2lunar(1899, 12, 31)).toThrow();
    expect(() => solar2lunar(1900, 1, 30)).toThrow();
    expect(() => solar2lunar(2101, 1, 1)).toThrow();
  });
});
