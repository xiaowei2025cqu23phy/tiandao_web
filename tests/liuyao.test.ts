import { describe, it, expect } from 'vitest';
import { getHexagramByNumber } from '../src/data/hexagrams';
import { buildLiuYaoChart, liuShenStartName } from '../src/data/liuyao';

describe('六爻纳甲盘', () => {
  it('六神以日干起、自初爻顺排（甲乙日起青龙）', () => {
    const rows = buildLiuYaoChart(getHexagramByNumber(1)!, 0);
    expect(rows.map(r => r.liuShen)).toEqual(['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武']);
    expect(liuShenStartName(0)).toBe('青龙');
    expect(liuShenStartName(2)).toBe('朱雀');
    expect(liuShenStartName(6)).toBe('白虎');
    expect(liuShenStartName(8)).toBe('玄武');
  });

  it('丙日起朱雀', () => {
    const rows = buildLiuYaoChart(getHexagramByNumber(2)!, 2);
    expect(rows.map(r => r.liuShen)).toEqual(['朱雀', '勾陈', '腾蛇', '白虎', '玄武', '青龙']);
  });

  it('纯卦无伏神，世应在位（乾为天六世）', () => {
    const rows = buildLiuYaoChart(getHexagramByNumber(1)!, 0);
    expect(rows.every(r => !r.fuShen)).toBe(true);
    expect(rows[5].isHost).toBe(true); // 上爻为世
    expect(rows[2].isGuest).toBe(true); // 三爻为应
  });

  it('天风姤（乾宫一世）：初爻伏乾卦甲子子孙', () => {
    const rows = buildLiuYaoChart(getHexagramByNumber(44)!, 0);
    // 飞神：辛丑 辛亥 辛酉 / 壬午 壬申 壬戌
    expect(rows.map(r => r.nayin)).toEqual(['辛丑', '辛亥', '辛酉', '壬午', '壬申', '壬戌']);
    // 姤仅初爻与乾不同 → 初爻伏 甲子子孙
    expect(rows[0].fuShen).toEqual({ nayin: '甲子', sixRelative: '子孙' });
    expect(rows.slice(1).every(r => !r.fuShen)).toBe(true);
    // 姤为一世卦：初爻世、四爻应
    expect(rows[0].isHost).toBe(true);
    expect(rows[3].isGuest).toBe(true);
  });

  it('泽地萃（兑宫）：初二爻伏兑卦丁巳丁卯', () => {
    const rows = buildLiuYaoChart(getHexagramByNumber(45)!, 0);
    // 飞神：乙未乙巳乙卯 / 丁亥丁酉丁未
    expect(rows.map(r => r.nayin)).toEqual(['乙未', '乙巳', '乙卯', '丁亥', '丁酉', '丁未']);
    expect(rows[0].fuShen).toEqual({ nayin: '丁巳', sixRelative: '官鬼' });
    expect(rows[1].fuShen).toEqual({ nayin: '丁卯', sixRelative: '妻财' });
    expect(rows.slice(2).every(r => !r.fuShen)).toBe(true);
  });

  it('64 卦盘面结构完整：六神/纳甲/六亲齐全', () => {
    for (let n = 1; n <= 64; n++) {
      const rows = buildLiuYaoChart(getHexagramByNumber(n)!, n % 10);
      expect(rows).toHaveLength(6);
      for (const r of rows) {
        expect(r.liuShen.length).toBeGreaterThan(0);
        expect(r.nayin.length).toBe(2);
        expect(r.sixRelative.length).toBeGreaterThan(0);
      }
    }
  });
});
