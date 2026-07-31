import { describe, it, expect } from 'vitest';
import { correctSolarTime, trueSolarHour, longitudeCorrection, equationOfTime } from '../src/data/solarTime';

describe('真太阳时（经度修正）', () => {
  it('均时差锚点：2/11 约 -14.2、4/15 约 0、11/3 约 +16.4（分钟）', () => {
    expect(equationOfTime(2024, 2, 11)).toBeCloseTo(-14.2, 0);
    expect(equationOfTime(2024, 4, 15)).toBeCloseTo(0, 0);
    expect(equationOfTime(2024, 11, 3)).toBeCloseTo(16.4, 0);
  });

  it('均时差近零日（4/15）：120°E 12:00 仍为 12:00', () => {
    const r = correctSolarTime(2024, 4, 15, 12, 0, 120);
    expect(Math.abs(r.correctionMinutes)).toBeLessThanOrEqual(1);
    expect(r.correctedHour).toBe(12);
  });

  it('均时差 +16 分日（11/3）：120°E 12:00 → 12:16', () => {
    const r = correctSolarTime(2024, 11, 3, 12, 0, 120);
    expect(r.equationOfTime).toBeGreaterThan(15);
    expect(r.correctedHour).toBe(12);
    expect(r.correctedMinute).toBeGreaterThanOrEqual(14);
    expect(r.correctedMinute).toBeLessThanOrEqual(18);
  });

  it('北京 116.4°E（均时差近零日）：12:00 → 11:46', () => {
    const r = correctSolarTime(2024, 4, 15, 12, 0, 116.4);
    expect(r.correctedHour).toBe(11);
    expect(r.correctedMinute).toBe(46);
    expect(r.longitudeCorrection).toBe(-14);
  });

  it('经度 + 均时差叠加：116.4°E 11/3 12:00 → 约 12:02', () => {
    const r = correctSolarTime(2024, 11, 3, 12, 0, 116.4);
    expect(r.longitudeCorrection).toBe(-14);
    expect(r.equationOfTime).toBeGreaterThan(15);
    expect(r.correctedHour).toBe(12);
    expect(r.correctedMinute).toBeGreaterThanOrEqual(0);
    expect(r.correctedMinute).toBeLessThanOrEqual(4);
  });

  it('乌鲁木齐 87.6°E（均时差近零日）：13:00 → 10:50（时辰可能跨支）', () => {
    const r = correctSolarTime(2024, 4, 15, 13, 0, 87.6);
    expect(r.correctedHour).toBe(10);
    expect(r.correctedMinute).toBe(50);
    expect(r.longitudeCorrection).toBe(-130);
    expect(trueSolarHour(2024, 4, 15, 13, 0, 87.6)).toBeCloseTo(10.833, 2);
  });

  it('经度 120°E 均时差近零日基本不修正', () => {
    const r = correctSolarTime(2024, 4, 15, 8, 30, 120);
    expect(r.correctedHour).toBe(8);
    expect(r.correctedMinute).toBe(30);
    expect(Math.abs(r.correctionMinutes)).toBeLessThanOrEqual(1);
  });

  it('跨日：00:30 在 150°E 修正 +120 分钟 → 02:30', () => {
    const r = correctSolarTime(2024, 4, 15, 0, 30, 150);
    expect(r.correctedHour).toBe(2);
    expect(r.correctedMinute).toBe(30);
  });

  it('跨日（负方向）：23:30 在 90°E 修正 -120 分钟 → 21:30', () => {
    const r = correctSolarTime(2024, 4, 15, 23, 30, 90);
    expect(r.correctedHour).toBe(21);
    expect(r.correctedMinute).toBe(30);
  });

  it('经度修正函数：每 1° = 4 分钟', () => {
    expect(longitudeCorrection(120)).toBe(0);
    expect(longitudeCorrection(121)).toBe(4);
    expect(longitudeCorrection(119)).toBe(-4);
  });
});
