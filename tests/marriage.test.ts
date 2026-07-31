import { describe, it, expect } from 'vitest';
import { zodiacMarriage, LIUHE_PAIRS } from '../src/data/marriage';

describe('生肖合婚', () => {
  it('六合：鼠牛（土克水微调）', () => {
    const r = zodiacMarriage('鼠', '牛');
    expect(r.relation).toBe('六合');
    expect(r.score).toBe(89); // 95 - 6
    expect(r.wuxing).toContain('相克');
  });

  it('六合：虎猪（水生木加分封顶 98）', () => {
    const r = zodiacMarriage('虎', '猪');
    expect(r.relation).toBe('六合');
    expect(r.score).toBe(98);
    expect(r.wuxing).toContain('相生');
  });

  it('三合：鼠猴（金生水）', () => {
    const r = zodiacMarriage('鼠', '猴');
    expect(r.relation).toBe('三合');
    expect(r.score).toBe(94);
  });

  it('六冲：鼠马、牛羊', () => {
    expect(zodiacMarriage('鼠', '马').relation).toBe('六冲');
    expect(zodiacMarriage('牛', '羊').relation).toBe('六冲');
  });

  it('六害：鼠羊、牛马', () => {
    expect(zodiacMarriage('鼠', '羊').relation).toBe('六害');
    expect(zodiacMarriage('牛', '马').relation).toBe('六害');
  });

  it('相刑：鼠兔、龙龙（自刑）', () => {
    expect(zodiacMarriage('鼠', '兔').relation).toBe('相刑');
    expect(zodiacMarriage('龙', '龙').relation).toBe('相刑');
  });

  it('同肖：狗狗（非自刑）', () => {
    const r = zodiacMarriage('狗', '狗');
    expect(r.relation).toBe('同肖');
    expect(r.score).toBe(70);
  });

  it('普通配对有合理分数', () => {
    const r = zodiacMarriage('鼠', '虎');
    expect(r.relation).toBe('平');
    expect(r.score).toBeGreaterThanOrEqual(60);
  });

  it('六合配对参考完整', () => {
    expect(LIUHE_PAIRS).toEqual(['鼠牛', '虎猪', '兔狗', '龙鸡', '蛇猴', '马羊']);
  });
});
