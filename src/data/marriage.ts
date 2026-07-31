/**
 * 生肖合婚
 * 关系判定优先级：六合 > 三合 > 六冲 > 六害 > 相刑 > 平；
 * 再叠加地支五行生克微调得分。
 */

export const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_WX: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木', 辰: '土', 巳: '火',
  午: '火', 未: '土', 申: '金', 酉: '金', 戌: '土', 亥: '水',
};

// 六合：子丑、寅亥、卯戌、辰酉、巳申、午未
const LIUHE: Array<[number, number]> = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
// 三合：申子辰、寅午戌、巳酉丑、亥卯未
const SANHE: number[][] = [[8, 0, 4], [2, 6, 10], [5, 9, 1], [11, 3, 7]];
// 六害：子未、丑午、寅巳、卯辰、申亥、酉戌
const LIUHAI: Array<[number, number]> = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
// 相刑：寅巳申、丑戌未、子卯、辰午酉亥（自刑）
const XING: number[][] = [[2, 5, 8], [1, 10, 7], [0, 3], [4], [6], [9], [11]];

const SHENG: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const KE: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

export interface MarriageResult {
  a: string;
  b: string;
  relation: string;   // 六合/三合/六冲/六害/相刑/同肖/平
  score: number;      // 0-100
  wuxing: string;     // 五行关系描述
  comment: string;
  advice: string;
}

function inPair(pairs: Array<[number, number]>, a: number, b: number): boolean {
  return pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function inGroup(groups: number[][], a: number, b: number): boolean {
  return groups.some(g => g.includes(a) && g.includes(b));
}

export function zodiacMarriage(zodiacA: string, zodiacB: string): MarriageResult {
  const a = ZODIAC.indexOf(zodiacA);
  const b = ZODIAC.indexOf(zodiacB);
  if (a < 0 || b < 0) throw new Error('未知生肖');

  let relation = '平';
  let base = 70;
  if (a === b) {
    relation = [4, 6, 9, 11].includes(a) ? '相刑' : '同肖';
    base = [4, 6, 9, 11].includes(a) ? 40 : 68;
  } else if (inPair(LIUHE, a, b)) {
    relation = '六合';
    base = 95;
  } else if (inGroup(SANHE, a, b)) {
    relation = '三合';
    base = 88;
  } else if (a === (b + 6) % 12 || b === (a + 6) % 12) {
    relation = '六冲';
    base = 55;
  } else if (inPair(LIUHAI, a, b)) {
    relation = '六害';
    base = 48;
  } else if (inGroup(XING, a, b)) {
    relation = '相刑';
    base = 40;
  }

  // 五行层
  const wxA = ZHI_WX[ZHI[a]];
  const wxB = ZHI_WX[ZHI[b]];
  let wxRelation = '同类';
  let wxBonus = 2;
  if (SHENG[wxA] === wxB || SHENG[wxB] === wxA) {
    wxRelation = '相生';
    wxBonus = 6;
  } else if (KE[wxA] === wxB || KE[wxB] === wxA) {
    wxRelation = '相克';
    wxBonus = -6;
  }
  const score = Math.max(20, Math.min(98, base + wxBonus));

  const comments: Record<string, string> = {
    '六合': '六合贵人，天作之合，阴阳相配，情深意笃。',
    '三合': '三合之局，志趣相投，互旺运势，和睦长久。',
    '六冲': '六冲相犯，聚少离多，观念相左，需用心经营。',
    '六害': '六害暗损，易生误会猜忌，宜坦诚沟通、多些包容。',
    '相刑': '相刑相伤，争执不断，矛盾难解，慎之慎之。',
    '同肖': '同属相知，性情相近，惺惺相惜，亦有本命年之扰。',
    '平': '无冲无合，平平淡淡，细水长流，重在经营。',
  };
  const advices: Record<string, string> = {
    '六合': '彼此助益，宜早定良缘，婚后和顺。',
    '三合': '共同兴趣多，可共谋事业，家和万事兴。',
    '六冲': '忌针锋相对，凡事各退一步，多制造共同回忆。',
    '六害': '少翻旧账，遇事当面说清，防范小人挑拨。',
    '相刑': '若已结合，宜分主次、各守本分，可择吉日调理。',
    '同肖': '互相理解，但需避免固执己见，共度本命年波折。',
    '平': '平淡见真情，培养共同爱好，关系自然稳固。',
  };

  return {
    a: zodiacA,
    b: zodiacB,
    relation,
    score,
    wuxing: `五行${wxRelation}：${zodiacA}属${wxA}、${zodiacB}属${wxB}`,
    comment: comments[relation],
    advice: advices[relation],
  };
}

/** 六合最佳配对（供参考展示） */
export const LIUHE_PAIRS = LIUHE.map(([a, b]) => `${ZODIAC[a]}${ZODIAC[b]}`);
