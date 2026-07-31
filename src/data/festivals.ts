/**
 * 传统节日（农历为主）与倒计时
 * 农历节日日期由 lunar.ts 精确查表换算，节气型节日（清明、冬至）用近似公历日期。
 */

import { solar2lunar } from './lunar';

export interface Festival {
  id: string;
  name: string;
  kind: 'lunar' | 'solar';
  month?: number;       // 农历月 / 公历月
  day?: number;         // 农历日 / 公历日
  lunarLastDay?: boolean; // 除夕：农历年的最后一天
  customs: string;
  foods?: string;
}

export const FESTIVALS: Festival[] = [
  { id: 'chunjie', name: '春节', kind: 'lunar', month: 1, day: 1, customs: '贴春联、放爆竹、拜年、发压岁钱。', foods: '饺子、年糕、汤圆' },
  { id: 'yuanxiao', name: '元宵节', kind: 'lunar', month: 1, day: 15, customs: '赏花灯、猜灯谜、逛庙会。', foods: '元宵、汤圆' },
  { id: 'longtaitou', name: '龙抬头', kind: 'lunar', month: 2, day: 2, customs: '剃龙头、引田龙、祭土地。', foods: '春饼、面条（龙须面）' },
  { id: 'shangsi', name: '上巳节', kind: 'lunar', month: 3, day: 3, customs: '祓禊沐浴、踏青、曲水流觞。', foods: '荠菜煮鸡蛋' },
  { id: 'qingming', name: '清明节', kind: 'solar', month: 4, day: 5, customs: '扫墓祭祖、踏青插柳、放风筝。', foods: '青团、馓子' },
  { id: 'duanwu', name: '端午节', kind: 'lunar', month: 5, day: 5, customs: '赛龙舟、挂艾草菖蒲、佩香囊、饮雄黄酒。', foods: '粽子' },
  { id: 'qixi', name: '七夕节', kind: 'lunar', month: 7, day: 7, customs: '乞巧、拜织女、观星、晒书晒衣。', foods: '巧果、酥糖' },
  { id: 'zhongyuan', name: '中元节', kind: 'lunar', month: 7, day: 15, customs: '祭祖、放河灯、超度亡灵。', foods: '鸭子、扁食' },
  { id: 'zhongqiu', name: '中秋节', kind: 'lunar', month: 8, day: 15, customs: '赏月、祭月、阖家团圆、玩花灯。', foods: '月饼、桂花酒' },
  { id: 'chongyang', name: '重阳节', kind: 'lunar', month: 9, day: 9, customs: '登高、赏菊、插茱萸、敬老。', foods: '重阳糕、菊花酒' },
  { id: 'hanyi', name: '寒衣节', kind: 'lunar', month: 10, day: 1, customs: '送寒衣、祭祖、烧纸。', foods: '红豆饭、面条' },
  { id: 'xiayuan', name: '下元节', kind: 'lunar', month: 10, day: 15, customs: '祭水官、斋醮祈福、享祭祖先。', foods: '糍粑、芋子包' },
  { id: 'dongzhi', name: '冬至', kind: 'solar', month: 12, day: 22, customs: '数九、祭天祭祖、家人团聚。', foods: '饺子、汤圆' },
  { id: 'laba', name: '腊八节', kind: 'lunar', month: 12, day: 8, customs: '喝腊八粥、泡腊八蒜、祭祖。', foods: '腊八粥' },
  { id: 'xiaonian', name: '小年', kind: 'lunar', month: 12, day: 23, customs: '祭灶神、扫尘、备年货。', foods: '糖瓜、饺子' },
  { id: 'chuxi', name: '除夕', kind: 'lunar', lunarLastDay: true, customs: '守岁、年夜饭、贴春联、放爆竹。', foods: '年夜饭、饺子' },
];

export interface UpcomingFestival {
  festival: Festival;
  date: Date;
  daysLeft: number;
  isToday: boolean;
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function matchesFestival(f: Festival, d: Date): boolean {
  if (f.kind === 'solar') {
    return f.month === d.getMonth() + 1 && f.day === d.getDate();
  }
  const lunar = solar2lunar(d.getFullYear(), d.getMonth() + 1, d.getDate());
  if (f.lunarLastDay) {
    // 除夕：次日为正月初一
    const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const nl = solar2lunar(next.getFullYear(), next.getMonth() + 1, next.getDate());
    return nl.month === 1 && nl.day === 1;
  }
  return lunar.month === f.month && lunar.day === f.day;
}

/** 某节日自 from 起（含当日）的下一次日期 */
export function nextFestivalDate(f: Festival, from: Date = new Date()): Date {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < 400; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    if (matchesFestival(f, d)) return d;
  }
  throw new Error(`未能在支持范围内找到节日「${f.name}」`);
}

/** 未来若干节日（含今日，按日期升序） */
export function getUpcomingFestivals(from: Date = new Date(), count: number = 5): UpcomingFestival[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return FESTIVALS
    .map(f => {
      const date = nextFestivalDate(f, today);
      const daysLeft = Math.round((date.getTime() - today.getTime()) / 86400000);
      return { festival: f, date, daysLeft, isToday: sameDay(date, today) };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, count);
}
