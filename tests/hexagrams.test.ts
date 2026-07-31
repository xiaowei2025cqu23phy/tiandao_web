import { describe, it, expect } from 'vitest';
import {
  hexagrams,
  getHexagramByBinary,
  getHexagramByNumber,
  getMutualHexagram,
  getInverseHexagram,
  getComplementHexagram,
} from '../src/data/hexagrams';

// 易经六十四卦「下→上」二进制标准表（King Wen 序）
const KING_WEN_BINARIES: Record<number, string> = {
  1: '111111', 2: '000000', 3: '100010', 4: '010001', 5: '111010', 6: '010111',
  7: '010000', 8: '000010', 9: '111011', 10: '110111', 11: '111000', 12: '000111',
  13: '101111', 14: '111101', 15: '001000', 16: '000100', 17: '100110', 18: '011001',
  19: '110000', 20: '000011', 21: '100101', 22: '101001', 23: '000001', 24: '100000',
  25: '100111', 26: '111001', 27: '100001', 28: '011110', 29: '010010', 30: '101101',
  31: '001110', 32: '011100', 33: '001111', 34: '111100', 35: '000101', 36: '101000',
  37: '101011', 38: '110101', 39: '001010', 40: '010100', 41: '110001', 42: '100011',
  43: '111110', 44: '011111', 45: '000110', 46: '011000', 47: '010110', 48: '011010',
  49: '101110', 50: '011101', 51: '100100', 52: '001001', 53: '001011', 54: '110100',
  55: '101100', 56: '001101', 57: '011011', 58: '110110', 59: '010011', 60: '110010',
  61: '110011', 62: '001100', 63: '101010', 64: '010101',
};

const TRIGRAM_BY_BIN: Record<string, string> = {
  '111': '天', '000': '地', '100': '雷', '010': '水',
  '001': '山', '110': '泽', '101': '火', '011': '风',
};

describe('hexagrams 数据完整性', () => {
  it('恰好 64 卦，卦号 1-64 且无重复', () => {
    expect(hexagrams).toHaveLength(64);
    const numbers = hexagrams.map(h => h.number).sort((a, b) => a - b);
    expect(numbers).toEqual(Array.from({ length: 64 }, (_, i) => i + 1));
    expect(new Set(numbers).size).toBe(64);
  });

  it('所有卦名唯一', () => {
    const names = hexagrams.map(h => h.nameCn);
    expect(new Set(names).size).toBe(64);
  });

  it('二进制与 King Wen 标准表一致（下→上）', () => {
    for (const h of hexagrams) {
      expect(KING_WEN_BINARIES[h.number], `${h.nameCn}(${h.number})`).toBe(h.binary);
    }
  });

  it('二进制覆盖全部 64 种可能（起卦永不落空）', () => {
    const binaries = new Set(hexagrams.map(h => h.binary));
    expect(binaries.size).toBe(64);
    for (let n = 0; n < 64; n++) {
      const bin = n.toString(2).padStart(6, '0');
      expect(binaries.has(bin), `缺少 ${bin}`).toBe(true);
    }
  });

  it('上卦/下卦名称与二进制一致', () => {
    for (const h of hexagrams) {
      expect(TRIGRAM_BY_BIN[h.binary.slice(0, 3)], `${h.nameCn} 下卦`).toBe(h.lowerTrigram);
      expect(TRIGRAM_BY_BIN[h.binary.slice(3)], `${h.nameCn} 上卦`).toBe(h.upperTrigram);
    }
  });

  it('Unicode 卦符按序对应（U+4DC0 起）', () => {
    for (const h of hexagrams) {
      expect(h.unicode, `${h.nameCn}(${h.number})`).toBe(String.fromCodePoint(0x4DC0 + h.number - 1));
    }
  });

  it('每卦含六爻，爻序为初→上，卦辞/彖传/大象/卦德均非空', () => {
    const positions = ['初', '二', '三', '四', '五', '上'];
    for (const h of hexagrams) {
      expect(h.yaoLines).toHaveLength(6);
      expect(h.yaoLines.map(y => y.position)).toEqual(positions);
      expect(h.judgment.trim()).not.toBe('');
      expect(h.tuan.trim()).not.toBe('');
      expect(h.description.trim()).not.toBe('');
      expect(h.meaning.trim()).not.toBe('');
      for (const y of h.yaoLines) {
        expect(y.text.trim(), `${h.nameCn} ${y.position}`).not.toBe('');
        expect(y.xiang.trim(), `${h.nameCn} ${y.position}`).not.toBe('');
      }
    }
  });

  it('仅乾坤有用九/用六', () => {
    for (const h of hexagrams) {
      if (h.number === 1) expect(h.specLine).toContain('用九');
      else if (h.number === 2) expect(h.specLine).toContain('用六');
      else expect(h.specLine).toBeUndefined();
    }
  });
});

describe('hexagrams 卦变关系', () => {
  it('互卦/综卦/错卦全部能在 64 卦内解析', () => {
    for (const h of hexagrams) {
      expect(getMutualHexagram(h), `${h.nameCn} 互卦`).toBeDefined();
      expect(getInverseHexagram(h), `${h.nameCn} 综卦`).toBeDefined();
      expect(getComplementHexagram(h), `${h.nameCn} 错卦`).toBeDefined();
    }
  });

  it('经典对卦关系正确', () => {
    expect(getInverseHexagram(getHexagramByNumber(31)!).number).toBe(32); // 咸综恒
    expect(getInverseHexagram(getHexagramByNumber(33)!).number).toBe(34); // 遁综大壮
    expect(getInverseHexagram(getHexagramByNumber(63)!).number).toBe(64); // 既济综未济
    expect(getInverseHexagram(getHexagramByNumber(61)!).number).toBe(61); // 中孚自综
    expect(getComplementHexagram(getHexagramByNumber(1)!).number).toBe(2); // 乾坤互错
    expect(getComplementHexagram(getHexagramByNumber(17)!).number).toBe(18); // 随错蛊
    expect(getComplementHexagram(getHexagramByNumber(63)!).number).toBe(64); // 既济错未济
    expect(getMutualHexagram(getHexagramByNumber(3)!).number).toBe(23); // 屯互剥
    expect(getMutualHexagram(getHexagramByNumber(31)!).number).toBe(44); // 咸互姤
  });

  it('按二进制查卦与按卦号查卦一致', () => {
    for (const h of hexagrams) {
      expect(getHexagramByBinary(h.binary)?.number).toBe(h.number);
      expect(getHexagramByNumber(h.number)?.binary).toBe(h.binary);
    }
  });
});
