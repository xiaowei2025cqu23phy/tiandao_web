import { describe, it, expect } from 'vitest';
import {
  getDayPillar,
  getYearPillar,
  getMonthPillar,
  getHourPillar,
  getHourZhiIndex,
  getMonthBranchIndex,
  getSolarTermName,
  pillarLabel,
} from '../src/data/ganzhi';

describe('干支计算', () => {
  it('日柱锚点：1900-01-01 为甲戌日', () => {
    expect(pillarLabel(getDayPillar(1900, 1, 1))).toBe('甲戌');
  });

  it('日柱与万年历一致（外部锚点）', () => {
    expect(pillarLabel(getDayPillar(2024, 2, 10))).toBe('甲辰');   // 2024 春节
    expect(pillarLabel(getDayPillar(2026, 7, 31))).toBe('丙午');
    expect(pillarLabel(getDayPillar(2000, 1, 1))).toBe('戊午');
  });

  it('日柱六十甲子循环正确（1900-01-01 起 60 天回到甲戌）', () => {
    expect(pillarLabel(getDayPillar(1900, 3, 2))).toBe('甲戌'); // 1900-01-01 + 60
  });

  it('年柱以立春为界', () => {
    expect(pillarLabel(getYearPillar(2024, 2, 10))).toBe('甲辰'); // 立春后
    expect(pillarLabel(getYearPillar(2024, 1, 15))).toBe('癸卯'); // 立春前
    expect(pillarLabel(getYearPillar(2026, 7, 31))).toBe('丙午');
  });

  it('月柱五虎遁与节气定支正确', () => {
    // 2024-02-10（立春后）甲辰年 → 丙寅月
    expect(pillarLabel(getMonthPillar(0, 2, 10))).toBe('丙寅');
    // 2026-07-31（小暑后）丙午年 → 乙未月
    expect(pillarLabel(getMonthPillar(2, 7, 31))).toBe('乙未');
    // 1900-01-01（小寒前）己亥年 → 丙子月
    expect(pillarLabel(getMonthPillar(5, 1, 1))).toBe('丙子');
    // 2024-01-15（小寒后、立春前）甲年 → 丁丑月
    expect(pillarLabel(getMonthPillar(0, 1, 15))).toBe('丁丑');
  });

  it('月支边界：小寒前为子月，小寒当日为丑月', () => {
    expect(getMonthBranchIndex(1, 5)).toBe(0); // 子
    expect(getMonthBranchIndex(1, 6)).toBe(1); // 丑
    expect(getMonthBranchIndex(2, 3)).toBe(1); // 丑
    expect(getMonthBranchIndex(2, 4)).toBe(2); // 寅
  });

  it('节气名正确', () => {
    expect(getSolarTermName(7, 31)).toBe('小暑');
    expect(getSolarTermName(2, 10)).toBe('立春');
    expect(getSolarTermName(1, 1)).toBe('大雪');
  });

  it('时柱五鼠遁与时辰地支正确', () => {
    expect(getHourZhiIndex(0)).toBe(0);  // 0 点子时
    expect(getHourZhiIndex(23)).toBe(0); // 23 点子时
    expect(getHourZhiIndex(13)).toBe(7); // 13 点未时
    expect(getHourZhiIndex(11)).toBe(6); // 11 点午时
    expect(pillarLabel(getHourPillar(0, 23))).toBe('甲子'); // 甲日子时
    expect(pillarLabel(getHourPillar(0, 13))).toBe('辛未'); // 甲日未时
    expect(pillarLabel(getHourPillar(1, 0))).toBe('丙子');  // 乙日子时
  });
});
