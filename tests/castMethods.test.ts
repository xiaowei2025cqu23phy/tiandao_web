import { describe, it, expect } from 'vitest';
import {
  trigramByNumber,
  movingLineIndex,
  numberCast,
  timeCast,
  timeCastDetail,
  yarrowLine,
  yarrowLineSteps,
} from '../src/data/castMethods';

describe('先天八卦数（梅花易数）', () => {
  it('乾一兑二离三震四巽五坎六艮七坤八', () => {
    expect(trigramByNumber(1)).toBe('111'); // 乾
    expect(trigramByNumber(2)).toBe('110'); // 兑
    expect(trigramByNumber(3)).toBe('101'); // 离
    expect(trigramByNumber(4)).toBe('100'); // 震
    expect(trigramByNumber(5)).toBe('011'); // 巽
    expect(trigramByNumber(6)).toBe('010'); // 坎
    expect(trigramByNumber(7)).toBe('001'); // 艮
    expect(trigramByNumber(8)).toBe('000'); // 坤
    expect(trigramByNumber(0)).toBe('000'); // 余 0 视作 8
    expect(trigramByNumber(9)).toBe('111'); // 9 % 8 = 1
  });

  it('动爻：除以 6 取余，余 0 取上爻', () => {
    expect(movingLineIndex(1)).toBe(0); // 初爻
    expect(movingLineIndex(2)).toBe(1); // 二爻
    expect(movingLineIndex(5)).toBe(4); // 五爻
    expect(movingLineIndex(6)).toBe(5); // 上爻
    expect(movingLineIndex(7)).toBe(0);
  });

  it('数字卦：1 上乾 + 8 下坤 + 6 动上爻 → 否卦上九动', () => {
    const lines = numberCast(1, 8, 6);
    const bin = lines.map(l => (l === 'yang' || l === 'old_yang') ? '1' : '0').join('');
    expect(bin).toBe('000111'); // 天地否
    expect(lines[5]).toBe('old_yang'); // 上爻动
    expect(lines.slice(0, 3).every(l => l === 'yin')).toBe(true); // 下卦坤
    expect(lines[3]).toBe('yang'); // 上卦乾
    expect(lines[4]).toBe('yang');
  });

  it('数字卦：3 上离 + 5 下巽 + 4 动四爻 → 家人卦(011101)四爻动', () => {
    const lines = numberCast(3, 5, 4);
    const bin = lines.map(l => (l === 'yang' || l === 'old_yang') ? '1' : '0').join('');
    expect(bin).toBe('011101'); // 风火家人
    expect(lines[3]).toBe('old_yang');
  });
});

describe('时间卦（梅花易数）', () => {
  it('2024-02-10 12:00：辰年5 + 正月1 + 初一1 = 7 → 上艮；加午时7 → 14%8=6 → 下坎；动爻 14%6 余2 → 二爻', () => {
    const d = new Date(2024, 1, 10, 12);
    const detail = timeCastDetail(d);
    expect(detail.yearZhi).toBe('辰');
    expect(detail.yearNum).toBe(5);
    expect(detail.lunarMonth).toBe(1);
    expect(detail.lunarDay).toBe(1);
    expect(detail.hourZhi).toBe('午');
    expect(detail.hourNum).toBe(7);

    const lines = timeCast(d);
    const bin = lines.map(l => (l === 'yang' || l === 'old_yang') ? '1' : '0').join('');
    expect(bin).toBe('010001'); // 山水蒙
    expect(lines[1]).toBe('old_yang'); // 二爻动
  });
});

describe('大衍筮法（蓍草卦）', () => {
  it('每爻三变，策数序列合法（一变归奇 5/9，二变三变 4/8）', () => {
    for (let i = 0; i < 500; i++) {
      const { line, changes } = yarrowLineSteps();
      expect(changes).toHaveLength(3);
      expect(changes[0].start).toBe(49);
      expect([5, 9]).toContain(changes[0].removed);
      expect([4, 8]).toContain(changes[1].removed);
      expect([4, 8]).toContain(changes[2].removed);
      expect(changes[2].end % 4).toBe(0);
      expect(['yang', 'yin', 'old_yang', 'old_yin']).toContain(line);
    }
  });

  it('四象概率接近 老阳3/16 少阳5/16 少阴7/16 老阴1/16', () => {
    const N = 40000;
    const counts = { old_yang: 0, yang: 0, yin: 0, old_yin: 0 };
    for (let i = 0; i < N; i++) counts[yarrowLine()]++;
    const p = (k: keyof typeof counts) => counts[k] / N;
    expect(p('old_yang')).toBeCloseTo(3 / 16, 1);
    expect(p('yang')).toBeCloseTo(5 / 16, 1);
    expect(p('yin')).toBeCloseTo(7 / 16, 1);
    expect(p('old_yin')).toBeCloseTo(1 / 16, 1);
  });
});
