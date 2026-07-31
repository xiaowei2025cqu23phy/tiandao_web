/** 纳甲世应六亲 — 按八宫卦统配 */
import type { Hexagram } from '../types';

// 八宫卦: [宫名, 五行, 卦号列表, 世爻位]
type PalaceEntry = [string, string, number[], number];
const PALACES: PalaceEntry[] = [
  ['乾宫','金',[1,44,33,12,20,23,35,14], 6],  // 乾为天 一世 二世 三世 四世 五世 游魂 归魂
  ['坎宫','水',[29,60,3,63,49,55,36,7], 6],
  ['艮宫','土',[52,22,41,26,38,10,61,53], 6],
  ['震宫','木',[51,16,40,32,46,48,28,17], 6],
  ['巽宫','木',[57,9,37,42,25,21,27,18], 6],
  ['离宫','火',[30,56,50,64,4,59,6,13], 6],
  ['坤宫','土',[2,24,19,11,34,43,5,8], 6],
  ['兑宫','金',[58,47,45,31,39,15,62,54], 6],  // 兑为泽 泽水困 泽地萃 泽山咸 水山蹇 地山谦 雷山小过 雷泽归妹
];

// 世爻位: 本宫卦(六世)=6, 一世=1, 二世=2...五世=5, 游魂=4, 归魂=3
const HOST_LINES: Record<number, number> = {
  0: 6,   // 本宫卦 (六世)
  1: 1,   // 一世
  2: 2,   // 二世
  3: 3,   // 三世
  4: 4,   // 四世
  5: 5,   // 五世
  6: 4,   // 游魂
  7: 3,   // 归魂
};
const GUEST_OFFSET = 3; // 应爻隔三位

// 纳甲干支底表（键名与卦象数据中的卦名一致：天=乾 地=坤 雷=震 风=巽 水=坎 火=离 山=艮 泽=兑）
const TIAN_GAN: Record<string, string[]> = {
  '天': ['甲','壬'],
  '地': ['乙','癸'],
  '雷': ['庚'],
  '风': ['辛'],
  '水': ['戊'],
  '火': ['己'],
  '山': ['丙'],
  '泽': ['丁'],
};
const DI_ZHI_PURE: Record<string, string[]> = {
  '天': ['子','寅','辰','午','申','戌'],
  '雷': ['子','寅','辰','午','申','戌'], // 同天
  '水': ['寅','辰','午','申','戌','子'],
  '山': ['辰','午','申','戌','子','寅'],
  '地': ['未','巳','卯','丑','亥','酉'],
  '风': ['丑','亥','酉','未','巳','卯'],
  '火': ['卯','丑','亥','酉','未','巳'],
  '泽': ['巳','卯','丑','亥','酉','未'],
};

// 五行生克 → 六亲关系
function sixRelative(element: string, lineZhi: string): string {
  const zhiWx: Record<string, string> = {
    子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',
    午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水',
  };
  const lEl = zhiWx[lineZhi] || '土';
  if (lEl === element) return '兄弟';
  const SHENG: Record<string, string> = { '金':'水', '水':'木', '木':'火', '火':'土', '土':'金' }; // 我生
  const KE: Record<string, string> = { '金':'木', '木':'土', '土':'水', '水':'火', '火':'金' };     // 我克
  if (SHENG[element] === lEl) return '子孙';
  if (SHENG[lEl] === element) return '父母';
  if (KE[element] === lEl) return '妻财';
  return '官鬼';
}

export function augmentHexagram(h: Hexagram): Hexagram {
  // 查八宫
  let palace = '', element = '', hostLine = 6;
  for (const [p, e, nums] of PALACES) {
    const idx = nums.indexOf(h.number);
    if (idx >= 0) {
      palace = p;
      element = e;
      hostLine = HOST_LINES[idx] || 6;
      break;
    }
  }
  const guestLine = hostLine <= 3 ? hostLine + GUEST_OFFSET : hostLine - GUEST_OFFSET;

  // 纳甲
  const tri = h.lowerTrigram;
  // 内卦（初-三）用第一干，外卦（四-上）乾坤改用第二干（壬/癸）
  const gans = TIAN_GAN[tri] || ['甲'];
  const zhiArr = DI_ZHI_PURE[tri] || DI_ZHI_PURE['天'];

  const yaoLines = h.yaoLines.map((yl, i) => {
    const gan = gans[Math.min(i >= 3 ? 1 : 0, gans.length - 1)] || gans[0] || '甲';
    const nayin = `${gan}${zhiArr[i]}`;
    const sixR = sixRelative(element, zhiArr[i]);
    return {
      ...yl,
      nayin,
      sixRelative: sixR,
      isHost: (i + 1) === hostLine,
      isGuest: (i + 1) === guestLine,
    };
  });

  return {
    ...h,
    palace,
    element,
    hostLine,
    guestLine,
    yaoLines,
    activeTrigram: hostLine <= 3 ? 'lower' : 'upper',
  };
}
