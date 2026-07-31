import { describe, it, expect } from 'vitest';
import type { LineType } from '../src/types';
import { getHexagramByNumber } from '../src/data/hexagrams';
import { calcTiYong } from '../src/data/tiyong';

describe('体用生克', () => {
  it('乾为天：同宫比和 → 大吉', () => {
    const lines: LineType[] = ['yang', 'yang', 'yang', 'yang', 'yang', 'yang'];
    const r = calcTiYong(getHexagramByNumber(1)!, lines);
    expect(r.relation).toBe('比和');
    expect(r.verdict).toBe('大吉');
  });

  it('坎为水：同宫比和 → 大吉', () => {
    const lines: LineType[] = ['yin', 'yang', 'yin', 'yin', 'yang', 'yin'];
    const r = calcTiYong(getHexagramByNumber(29)!, lines);
    expect(r.relation).toBe('比和');
    expect(r.verdict).toBe('大吉');
  });

  it('任一卦都能给出体用判断', () => {
    for (let n = 1; n <= 64; n++) {
      const lines: LineType[] = Array.from({ length: 6 }, () => 'yang');
      const r = calcTiYong(getHexagramByNumber(n)!, lines);
      expect(['大吉', '小吉', '平稳', '小凶', '凶'], `#${n}`).toContain(r.verdict);
      expect(r.detail.length).toBeGreaterThan(0);
    }
  });
});
