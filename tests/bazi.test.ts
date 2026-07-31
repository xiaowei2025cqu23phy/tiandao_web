import { describe, it, expect } from 'vitest';
import { calculateBazi } from '../src/data/bazi';

describe('八字主流程', () => {
  it('真太阳时叠加均时差：2024-11-03（+16.4 分）', () => {
    const r = calculateBazi(2024, 11, 3, 12, '男', { longitude: 120 });
    expect(r.solarTime.equationOfTime).toBeGreaterThan(15);
    expect(r.solarTime.correctedHour).toBe(12);
    expect(r.solarTime.correctedMinute).toBeGreaterThanOrEqual(14);
  });

  it('距立春交节过近（2024-02-04 16:30，交节 16:26）时给出边界提醒', () => {
    const r = calculateBazi(2024, 2, 4, 16, '男', { minute: 30 });
    expect(r.boundaryWarning).toBeTruthy();
    expect(r.boundaryWarning).toContain('立春');
  });

  it('远离交节的出生无提醒', () => {
    const r = calculateBazi(2024, 2, 10, 12, '男');
    expect(r.boundaryWarning).toBeUndefined();
  });

  it('边界提醒也会覆盖小寒等「节」', () => {
    // 2024 小寒约 1/6 05:00，取 1/6 04:50
    const r = calculateBazi(2024, 1, 6, 4, '男', { minute: 50 });
    expect(r.boundaryWarning).toBeTruthy();
    expect(r.boundaryWarning).toContain('小寒');
  });
});
