import { describe, it, expect } from 'vitest';
import { getShenSha, getChangsheng } from '../src/data/shensha';
import type { BaziPillar } from '../src/types';

const pillar = (ganIndex: number, zhiIndex: number): BaziPillar => ({
  gan: '', zhi: '', ganIndex, zhiIndex,
});

describe('神煞', () => {
  it('甲日主：月支未 → 天乙贵人', () => {
    const pillars = [pillar(0, 4), pillar(0, 7), pillar(0, 4), pillar(0, 6)];
    const list = getShenSha(pillars);
    const tianyi = list.find(s => s.name === '天乙贵人');
    expect(tianyi).toBeDefined();
    expect(tianyi!.pillars).toContain('月支');
  });

  it('乙日主：日支子 → 天乙贵人（乙己鼠猴乡）', () => {
    const pillars = [pillar(1, 8), pillar(1, 6), pillar(1, 0), pillar(1, 8)];
    const list = getShenSha(pillars);
    const tianyi = list.find(s => s.name === '天乙贵人');
    expect(tianyi).toBeDefined();
    expect(tianyi!.pillars).toContain('日支');
  });

  it('辛日主：时支午 → 天乙贵人（六辛逢马虎），禄神在酉', () => {
    const pillars = [pillar(7, 6), pillar(7, 4), pillar(7, 1), pillar(7, 6)];
    const list = getShenSha(pillars);
    expect(list.find(s => s.name === '天乙贵人')).toBeDefined();
    expect(list.find(s => s.name === '禄神')).toBeUndefined(); // 酉不在四支
    const pillars2 = [pillar(7, 6), pillar(7, 4), pillar(7, 1), pillar(7, 9)];
    expect(getShenSha(pillars2).find(s => s.name === '禄神')?.pillars).toContain('时支');
  });

  it('日支午（寅午戌局）：时支卯 → 桃花；月支申 → 驿马；年支戌 → 华盖', () => {
    const pillars = [pillar(0, 10), pillar(0, 8), pillar(0, 6), pillar(0, 3)];
    const list = getShenSha(pillars);
    expect(list.find(s => s.name === '桃花')?.pillars).toContain('时支');
    expect(list.find(s => s.name === '驿马')?.pillars).toContain('月支');
    expect(list.find(s => s.name === '华盖')?.pillars).toContain('年支');
  });

  it('羊刃：甲日主日支卯 → 羊刃', () => {
    const pillars = [pillar(0, 2), pillar(0, 1), pillar(0, 3), pillar(0, 0)];
    expect(getShenSha(pillars).find(s => s.name === '羊刃')?.pillars).toContain('日支');
  });
});

describe('十二长生', () => {
  it('甲长生于亥、帝旺于卯；乙长生于午；壬长生于申', () => {
    expect(getChangsheng(0, 11)).toBe('长生');  // 甲 vs 亥
    expect(getChangsheng(0, 3)).toBe('帝旺');   // 甲 vs 卯
    expect(getChangsheng(0, 2)).toBe('临官');   // 甲 vs 寅
    expect(getChangsheng(1, 6)).toBe('长生');   // 乙 vs 午
    expect(getChangsheng(8, 8)).toBe('长生');   // 壬 vs 申
    expect(getChangsheng(2, 2)).toBe('长生');   // 丙 vs 寅
    expect(getChangsheng(7, 9)).toBe('临官');   // 辛 vs 酉
    expect(getChangsheng(7, 8)).toBe('帝旺');   // 辛 vs 申
  });
});
