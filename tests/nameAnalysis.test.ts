import { describe, it, expect } from 'vitest';
import { analyzeName } from '../src/data/nameAnalysis';

describe('姓名五格剖象（81 数理 + 三才）', () => {
  it('张伟（康熙笔画 张11 伟11）：天12 人22 地12 外2 总22', () => {
    const r = analyzeName('张', '伟');
    expect(r.strokes).toEqual({ surname: 11, given1: 11, given2: 0 });
    const values = r.grids.map(g => g.value);
    expect(values).toEqual([12, 22, 12, 2, 22]);
    const fortunes = r.grids.map(g => g.fortune);
    expect(fortunes).toEqual(['凶', '凶', '凶', '凶', '凶']);
  });

  it('李小龙（李7 小3 龙16）：天8 人10 地19 外17 总26', () => {
    const r = analyzeName('李', '小龙');
    expect(r.grids.map(g => g.value)).toEqual([8, 10, 19, 17, 26]);
    expect(r.grids.map(g => g.fortune)).toEqual(['吉', '凶', '凶', '半吉', '半吉']);
  });

  it('三才：张伟 天木-人木同类、人木-地木同类', () => {
    const r = analyzeName('张', '伟');
    expect(r.sanCai).toMatchObject({ tian: '木', ren: '木', di: '木', relations: ['同类', '同类'] });
    expect(r.sanCai.comment.length).toBeGreaterThan(0);
  });

  it('未收录字仍给出估算警告（私用区字符）', () => {
    const r1 = analyzeName('张', '伟');   // 人17金 地7金 → 同类
    const r2 = analyzeName('张', '\uE000');
    expect(r1.total.score).toBeGreaterThanOrEqual(0);
    expect(r2.total.score).toBeGreaterThanOrEqual(0);
    expect(r2.warning).toBeTruthy();
  });

  it('复姓欧阳龙（欧15 阳17 龙16 康熙）：天32 人33 地17 外16 总48，无警告', () => {
    const r = analyzeName('欧阳', '龙');
    expect(r.grids).toHaveLength(5);
    expect(r.grids.map(g => g.name)).toEqual(['天格', '人格', '地格', '外格', '总格']);
    expect(r.grids.map(g => g.value)).toEqual([32, 33, 17, 16, 48]);
    expect(r.warning).toBeUndefined();
    expect(r.total.score).toBeGreaterThanOrEqual(0);
  });

  it('81 数理释义非空', () => {
    const r = analyzeName('王', '明');
    for (const g of r.grids) {
      expect(g.meaning.length).toBeGreaterThan(0);
    }
  });

  it('康熙笔画抽查：偏旁按康熙计（氵4 艹6 阝阜8 王5 辶7）', () => {
    const cases: Array<[string, string, number]> = [
      ['王', '江', 7], ['王', '海', 11], ['王', '清', 12], ['王', '涛', 18], ['王', '泽', 17],
      ['王', '伟', 11], ['王', '阳', 17], ['王', '华', 12], ['王', '国', 11], ['王', '学', 16],
      ['王', '云', 12], ['王', '丽', 19], ['王', '悦', 11], ['王', '瑞', 14], ['王', '静', 16],
      ['王', '敏', 11], ['王', '飞', 9], ['王', '宁', 14], ['王', '兰', 23],
      ['蒋', '一', 17], ['苏', '一', 22], ['叶', '一', 15], ['陆', '一', 16], ['谭', '一', 19],
      ['钟', '一', 17], ['陈', '一', 16], ['邹', '一', 17], ['龚', '一', 22],
    ];
    for (const [surname, given, expected] of cases) {
      const r = analyzeName(surname, given);
      const stroke = given === '一' ? r.strokes.surname : r.strokes.given1;
      expect(stroke, `${surname}${given} 康熙笔画`).toBe(expected);
    }
  });
});
