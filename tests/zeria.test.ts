import { describe, it, expect } from 'vitest';
import { pickDays, PURPOSES, ZHISHEN, JIANCHU } from '../src/data/zeria';

describe('择日（建除十二神）', () => {
  it('2024-02-04（戊戌日，寅月）为成日（天牢·黑道）', () => {
    const days = pickDays('marry', 2024, 2);
    const d4 = days.find(d => d.date.getDate() === 4)!;
    expect(d4.dayPillar).toBe('戊戌');
    expect(d4.jianChu).toBe('成');
    expect(d4.shenName).toBe('天牢');
    expect(d4.isHuangDao).toBe(false);
    expect(d4.tags).toContain('宜嫁娶');
    // 戌与月建寅同属寅午戌三合
    expect(d4.tags).toContain('与月建三合');
  });

  it('建除按日支与月支差值循环', () => {
    const days = pickDays('marry', 2024, 2);
    // 2/8 起为建日（寅月：寅日为建）
    const d8 = days.find(d => d.date.getDate() === 8)!;
    expect(d8.jianChu).toBe('建');
    expect(d8.shenName).toBe('青龙');
    expect(d8.isHuangDao).toBe(true);
    // 建之后依次除满平定
    const d9 = days.find(d => d.date.getDate() === 9)!;
    const d10 = days.find(d => d.date.getDate() === 10)!;
    const d11 = days.find(d => d.date.getDate() === 11)!;
    expect([d9.jianChu, d10.jianChu, d11.jianChu]).toEqual(['除', '满', '平']);
  });

  it('月破日必为忌（2024-02-14 戊申日冲寅月）', () => {
    const days = pickDays('marry', 2024, 2);
    const d14 = days.find(d => d.date.getDate() === 14)!;
    expect(d14.dayPillar).toBe('戊申');
    expect(d14.tags).toContain('月破');
    expect(d14.tags).toContain('忌嫁娶');
    expect(d14.grade).toBe('忌');
    expect(d14.score).toBeLessThan(30);
  });

  it('避冲生肖：酉日冲兔，分数下降 30', () => {
    const without = pickDays('marry', 2024, 2);
    const withZodiac = pickDays('marry', 2024, 2, '兔');
    const base = without.find(d => d.date.getDate() === 3)!; // 2024-02-03 丁酉日
    const avoid = withZodiac.find(d => d.date.getDate() === 3)!;
    expect(base.dayPillar).toBe('丁酉');
    expect(avoid.tags).toContain('冲兔');
    expect(avoid.score).toBe(base.score - 30);
  });

  it('目的宜忌影响评分：嫁娶忌破日、宜成日', () => {
    const marry = pickDays('marry', 2024, 2);
    const travel = pickDays('travel', 2024, 2);
    // 同一日对不同目的的评分不同
    expect(marry[1].score).not.toBe(travel[1].score);
  });

  it('数据完整性：12 值日、5 用途、黄黑道神名齐全', () => {
    expect(JIANCHU).toHaveLength(12);
    expect(PURPOSES).toHaveLength(5);
    for (const jc of JIANCHU) {
      expect(ZHISHEN[jc]).toBeTruthy();
    }
    for (const p of PURPOSES) {
      for (const v of p.preferred) expect(JIANCHU).toContain(v);
      for (const v of p.avoid) expect(JIANCHU).toContain(v);
    }
  });
});
