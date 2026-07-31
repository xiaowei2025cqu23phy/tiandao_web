/** 体用生克判断引擎 */

import type { Hexagram, LineType } from '../types';
import { augmentHexagram } from './nayin';

// ═══ 卦象五行 (八宫卦五行) ═══
const PALACE_ELEMENT: Record<string, string> = {
  乾宫:'金', 兑宫:'金',
  坎宫:'水',
  艮宫:'土', 坤宫:'土',
  震宫:'木', 巽宫:'木',
  离宫:'火',
};

const ELEMENT_RELATIONS: Record<string, Record<string, { name: string; verdict: string; detail: string }>> = {
  '金': { 金:{name:'比和',verdict:'大吉',detail:'二金比和，刚柔相济。体用同类，事业顺遂，财禄丰盈。'}, 木:{name:'体克用',verdict:'小吉',detail:'金克木。我克者为财，劳而有获，但需防力竭。'}, 水:{name:'用生体',verdict:'大吉',detail:'金生水，体生用。泄气之象，宜守不宜攻，需养精蓄锐。水反生金为用生体则大吉。'}, 火:{name:'用克体',verdict:'凶',detail:'火克金。用卦克体，主客位相冲。凡事多有阻逆，宜退守静观。'}, 土:{name:'体生用',verdict:'小凶',detail:'土生金。体生用为泄，付出多而回报少。宜量力而行。'} },
  '木': { 木:{name:'比和',verdict:'大吉',detail:'二木比和，同气连枝。贵人相助，诸事顺遂。'}, 火:{name:'体生用',verdict:'小凶',detail:'木生火。体生用泄气，宜蓄养精神，不可冒进。'}, 土:{name:'体克用',verdict:'小吉',detail:'木克土。我克者为财，虽有收获但需付出努力。'}, 金:{name:'用克体',verdict:'凶',detail:'金克木。用克体大凶，主客相冲，多有不顺。宜退守。'}, 水:{name:'用生体',verdict:'大吉',detail:'水生木。用生体大吉，贵人相扶，事业腾达。'} },
  '水': { 水:{name:'比和',verdict:'大吉',detail:'二水比和，源远流长。智慧通达，人际和谐。'}, 木:{name:'体生用',verdict:'小凶',detail:'水生木。体生用泄气，需沉潜积蓄力量。'}, 火:{name:'体克用',verdict:'小吉',detail:'水克火。我克者为财，虽胜亦需谨慎。'}, 金:{name:'用生体',verdict:'大吉',detail:'金生水。用生体大吉，得外力相助，运势亨通。'}, 土:{name:'用克体',verdict:'凶',detail:'土克水。用卦克体，多有阻逆。宜低调行事，以待时机。'} },
  '火': { 火:{name:'比和',verdict:'大吉',detail:'二火比和，光明普照。声誉日隆，事业有成。'}, 木:{name:'用生体',verdict:'大吉',detail:'木生火。用生体大吉，得贵人相助，如虎添翼。'}, 土:{name:'体生用',verdict:'小凶',detail:'火生土。体生用泄气，付出而不求回报。'}, 金:{name:'体克用',verdict:'小吉',detail:'火克金。我克者为财，辛苦但有收获。'}, 水:{name:'用克体',verdict:'凶',detail:'水克火。用克体大凶，主客相冲，宜退守避其锋芒。'} },
  '土': { 土:{name:'比和',verdict:'大吉',detail:'二土比和，厚重载物。稳重行事，根基稳固。'}, 木:{name:'用克体',verdict:'凶',detail:'木克土。用克体大凶，阻力重重。宜退守自重。'}, 火:{name:'用生体',verdict:'大吉',detail:'火生土。用生体大吉，有贵人相助，运势上升。'}, 金:{name:'体生用',verdict:'小凶',detail:'土生金。体生用泄气，投入多而产出少。'}, 水:{name:'体克用',verdict:'小吉',detail:'土克水。我克者为财，虽有小利但需防流失。'} },
};

const VERDICT_DESCRIPTIONS: Record<string, string> = {
  '大吉': '气运亨通，万事顺遂。天地人和，如沐春风。',
  '小吉': '运势尚可，虽有波折终得善果。宜主动进取。',
  '平稳': '吉凶参半，福祸相依。顺势而为，不妄动则吉。',
  '小凶': '运程滞涩，诸多不顺。宜守不宜攻，待天时。',
  '凶': '险象环生，需格外谨慎。退守静观，不可冒进。',
};

export interface TiYongResult {
  hostTrigram: string;      // 体卦 (上卦/下卦)
  guestTrigram: string;     // 用卦
  hostElement: string;      // 体卦五行
  guestElement: string;     // 用卦五行
  relation: string;         // 比和/体克用/用生体/体生用/用克体
  verdict: string;          // 大吉/小吉/平稳/凶
  detail: string;           // 详细解读
  evolution: string;        // 卦象演化叙述
}

export function calcTiYong(hexagram: Hexagram, originalLines: LineType[]): TiYongResult {
  const ah = augmentHexagram(hexagram);
  const palace = ah.palace || '乾宫';
  const hostElement = PALACE_ELEMENT[palace] || '金';

  // 体卦 = 世爻所在的卦 (世爻在1-3为下卦, 4-6为上卦)
  const hostIsUpper = (ah.hostLine || 6) >= 4;
  const hostTrigram = hostIsUpper ? hexagram.upperTrigram : hexagram.lowerTrigram;
  const guestTrigram = hostIsUpper ? hexagram.lowerTrigram : hexagram.upperTrigram;

  // 用卦五行 = 下卦/上卦对应的五行
  const triElement: Record<string, string> = {
    '天':'金','地':'土','雷':'木','风':'木',
    '水':'水','火':'火','山':'土','泽':'金',
  };
  const guestElement = triElement[guestTrigram] || '土';

  // 查生克关系表
  const rel = ELEMENT_RELATIONS[hostElement]?.[guestElement] || {
    name: '比和', verdict: '平稳', detail: '体用关系不明，宜静观其变。'
  };

  // 生成卦象演化叙述
  const movingIdx = originalLines.findIndex(l => l === 'old_yang' || l === 'old_yin');
  const posNames = ['初','二','三','四','五','上'];
  const evoPart = movingIdx >= 0
    ? `由于能量在「${posNames[movingIdx]}爻」的剧烈波动`
    : '能量稳定';

  const evolution = `目前处于「${hexagram.nameCn}」之${hexagram.meaning}态势。${evoPart}，体卦「${hostTrigram}(${hostElement})」与用卦「${guestTrigram}(${guestElement})」形成「${rel.name}」关系，综合判断为「${rel.verdict}」。`;

  return {
    hostTrigram, guestTrigram,
    hostElement, guestElement,
    relation: rel.name,
    verdict: rel.verdict,
    detail: rel.detail,
    evolution,
  };
}

export function getVerdictDescription(verdict: string): string {
  return VERDICT_DESCRIPTIONS[verdict] || '';
}
