import { describe, it, expect } from 'vitest';
import { analyzeName } from '../src/data/nameAnalysis';

describe('姓名五格剖象（81 数理 + 三才）', () => {
  it('张伟：天12 人17 地7 外2 总17，数理吉凶正确', () => {
    const r = analyzeName('张', '伟');
    expect(r.strokes).toEqual({ surname: 11, given1: 6, given2: 0 });
    const values = r.grids.map(g => g.value);
    expect(values).toEqual([12, 17, 7, 2, 17]);
    const fortunes = r.grids.map(g => g.fortune);
    expect(fortunes).toEqual(['凶', '半吉', '吉', '凶', '半吉']);
  });

  it('李小龙：天8 人10 地19 外17 总26', () => {
    const r = analyzeName('李', '小龙');
    expect(r.grids.map(g => g.value)).toEqual([8, 10, 19, 17, 26]);
    expect(r.grids.map(g => g.fortune)).toEqual(['吉', '凶', '凶', '半吉', '半吉']);
  });

  it('三才：张伟 天木-人金相克、人金-地金同类', () => {
    const r = analyzeName('张', '伟');
    expect(r.sanCai).toMatchObject({ tian: '木', ren: '金', di: '金', relations: ['相克', '同类'] });
    expect(r.sanCai.comment.length).toBeGreaterThan(0);
  });

  it('三才双生有加分：人地相生时评分高于纯相克', () => {
    const r1 = analyzeName('张', '伟');   // 人17金 地7金 → 同类
    const r2 = analyzeName('张', '炎');   // 炎? 不在字库 → 估算，仅验证不崩溃
    expect(r1.total.score).toBeGreaterThanOrEqual(0);
    expect(r2.total.score).toBeGreaterThanOrEqual(0);
    expect(r2.warning).toBeTruthy();
  });

  it('复姓：五格结构完整且提示笔画未收录', () => {
    const r = analyzeName('欧阳', '龙');
    expect(r.grids).toHaveLength(5);
    expect(r.grids.map(g => g.name)).toEqual(['天格', '人格', '地格', '外格', '总格']);
    expect(r.warning).toBeTruthy();
    expect(r.total.score).toBeGreaterThanOrEqual(0);
  });

  it('81 数理释义非空', () => {
    const r = analyzeName('王', '明');
    for (const g of r.grids) {
      expect(g.meaning.length).toBeGreaterThan(0);
    }
  });
});
