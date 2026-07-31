import { describe, it, expect } from 'vitest';
import { getTaiSui } from '../src/data/taisui';

describe('犯太岁', () => {
  it('2026 丙午年：马值、鼠冲、牛害、兔破、马刑', () => {
    const r = getTaiSui(2026);
    expect(r.ganZhi).toBe('丙午');
    expect(r.zodiac).toBe('马');
    const summary = r.offenders.map(o => `${o.zodiac}-${o.relation}`).sort();
    expect(summary).toEqual([
      '兔-破太岁', '牛-害太岁', '鼠-冲太岁', '马-刑太岁', '马-值太岁',
    ].sort());
  });

  it('2024 甲辰年：龙值、狗冲、兔害、牛破、龙刑（辰午酉亥自刑）', () => {
    const r = getTaiSui(2024);
    expect(r.ganZhi).toBe('甲辰');
    const summary = r.offenders.map(o => `${o.zodiac}-${o.relation}`).sort();
    expect(summary).toEqual([
      '兔-害太岁', '牛-破太岁', '狗-冲太岁', '龙-刑太岁', '龙-值太岁',
    ].sort());
  });

  it('2025 乙巳年：蛇值、猪冲、虎害、猴破、虎猴申寅巳三刑', () => {
    const r = getTaiSui(2025);
    expect(r.ganZhi).toBe('乙巳');
    const relations = r.offenders.map(o => `${o.zodiac}-${o.relation}`).sort();
    expect(relations).toEqual([
      '猴-刑太岁', '猴-破太岁', '猪-冲太岁', '虎-刑太岁', '虎-害太岁', '蛇-值太岁',
    ].sort());
  });

  it('2023 癸卯年：兔值、鸡冲、龙害、马破、鼠刑（子卯相刑）', () => {
    const r = getTaiSui(2023);
    expect(r.ganZhi).toBe('癸卯');
    const relations = r.offenders.map(o => `${o.zodiac}-${o.relation}`).sort();
    expect(relations).toEqual([
      '兔-值太岁', '龙-害太岁', '马-破太岁', '鸡-冲太岁', '鼠-刑太岁',
    ].sort());
  });

  it('每个犯太岁生肖都有建议', () => {
    for (const year of [2023, 2024, 2025, 2026, 2027]) {
      for (const o of getTaiSui(year).offenders) {
        expect(o.advice.length).toBeGreaterThan(5);
      }
    }
  });
});
