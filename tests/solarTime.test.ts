import { describe, it, expect } from 'vitest';
import { correctSolarTime, trueSolarHour, longitudeCorrection } from '../src/data/solarTime';

describe('真太阳时（经度修正）', () => {
  it('北京 116.4°E：12:00 修正约 -14 分钟 → 11:46', () => {
    const r = correctSolarTime(12, 0, 116.4);
    expect(r.correctedHour).toBe(11);
    expect(r.correctedMinute).toBe(46);
    expect(r.correctionMinutes).toBe(-14);
    expect(r.label).toBe('11:46');
  });

  it('乌鲁木齐 87.6°E：13:00 修正约 -130 分钟 → 10:50（时辰可能跨支）', () => {
    const r = correctSolarTime(13, 0, 87.6);
    expect(r.correctedHour).toBe(10);
    expect(r.correctedMinute).toBe(50);
    expect(r.correctionMinutes).toBe(-130);
    expect(trueSolarHour(13, 0, 87.6)).toBeCloseTo(10.833, 2);
  });

  it('经度 120°E 不修正', () => {
    const r = correctSolarTime(8, 30, 120);
    expect(r.correctedHour).toBe(8);
    expect(r.correctedMinute).toBe(30);
    expect(r.correctionMinutes).toBe(0);
  });

  it('跨日：00:30 在 150°E 修正 +120 分钟 → 02:30', () => {
    const r = correctSolarTime(0, 30, 150);
    expect(r.correctedHour).toBe(2);
    expect(r.correctedMinute).toBe(30);
  });

  it('跨日（负方向）：23:30 在 90°E 修正 -120 分钟 → 21:30', () => {
    const r = correctSolarTime(23, 30, 90);
    expect(r.correctedHour).toBe(21);
    expect(r.correctedMinute).toBe(30);
  });

  it('经度修正函数：每 1° = 4 分钟', () => {
    expect(longitudeCorrection(120)).toBe(0);
    expect(longitudeCorrection(121)).toBe(4);
    expect(longitudeCorrection(119)).toBe(-4);
  });
});
