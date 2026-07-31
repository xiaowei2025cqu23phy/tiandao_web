import { describe, it, expect } from 'vitest';
import { hexagrams, getHexagramByNumber } from '../src/data/hexagrams';
import { augmentHexagram } from '../src/data/nayin';

describe('纳甲 / 世应 / 六亲', () => {
  it('全部 64 卦都能挂到八宫并获得有效世应', () => {
    for (const h of hexagrams) {
      const a = augmentHexagram(h);
      expect(a.palace, h.nameCn).toBeTruthy();
      expect(a.element, h.nameCn).toBeTruthy();
      expect(a.hostLine, `${h.nameCn} 世爻`).toBeGreaterThanOrEqual(1);
      expect(a.hostLine, `${h.nameCn} 世爻`).toBeLessThanOrEqual(6);
      expect(a.guestLine, `${h.nameCn} 应爻`).toBeGreaterThanOrEqual(1);
      expect(a.guestLine, `${h.nameCn} 应爻`).toBeLessThanOrEqual(6);
    }
  });

  it('八宫世爻位置正确（兑宫修正）', () => {
    expect(augmentHexagram(getHexagramByNumber(1)!).hostLine).toBe(6);  // 乾 六世
    expect(augmentHexagram(getHexagramByNumber(31)!).hostLine).toBe(3); // 咸 三世
    expect(augmentHexagram(getHexagramByNumber(39)!).hostLine).toBe(4); // 蹇 四世
    expect(augmentHexagram(getHexagramByNumber(15)!).hostLine).toBe(5); // 谦 五世
    expect(augmentHexagram(getHexagramByNumber(62)!).hostLine).toBe(4); // 小过 游魂
    expect(augmentHexagram(getHexagramByNumber(54)!).hostLine).toBe(3); // 归妹 归魂
    expect(augmentHexagram(getHexagramByNumber(17)!).palace).toBe('震宫'); // 随 震宫归魂
  });

  it('乾为天纳甲（内卦甲、外卦壬）与六亲正确', () => {
    const a = augmentHexagram(getHexagramByNumber(1)!);
    expect(a.yaoLines.map(y => y.nayin)).toEqual(['甲子', '甲寅', '甲辰', '壬午', '壬申', '壬戌']);
    expect(a.yaoLines.map(y => y.sixRelative)).toEqual(['子孙', '妻财', '父母', '官鬼', '兄弟', '父母']);
  });

  it('坤为地纳甲（内卦乙、外卦癸）与六亲正确', () => {
    const a = augmentHexagram(getHexagramByNumber(2)!);
    expect(a.yaoLines.map(y => y.nayin)).toEqual(['乙未', '乙巳', '乙卯', '癸丑', '癸亥', '癸酉']);
    expect(a.yaoLines.map(y => y.sixRelative)).toEqual(['兄弟', '父母', '官鬼', '兄弟', '妻财', '子孙']);
  });

  it('坎为水六亲正确（水克火为妻财）', () => {
    const a = augmentHexagram(getHexagramByNumber(29)!);
    // 坎宫水：寅木子孙、辰土官鬼、午火妻财、申金父母、戌土官鬼、子水兄弟
    expect(a.yaoLines.map(y => y.sixRelative)).toEqual(['子孙', '官鬼', '妻财', '父母', '官鬼', '兄弟']);
  });

  it('世应在同卦中相隔三位（互错位校验）', () => {
    for (const h of hexagrams) {
      const a = augmentHexagram(h);
      const diff = Math.abs(a.hostLine! - a.guestLine!);
      expect(diff === 3, `${h.nameCn} 世应相隔 3 位`).toBe(true);
    }
  });
});
