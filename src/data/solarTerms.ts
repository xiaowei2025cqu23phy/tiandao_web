/**
 * 二十四节气（近似固定日期，与实际节气可能相差 1 天）
 * 「节」的日期与八字引擎 SOLAR_TERMS 保持一致口径。
 */

export interface SolarTermInfo {
  name: string;
  month: number;
  day: number;
  season: '春' | '夏' | '秋' | '冬';
  meaning: string;
  custom: string;
  wellness: string;
}

export const SOLAR_TERMS_24: SolarTermInfo[] = [
  { name: '立春', month: 2, day: 4, season: '春', meaning: '二十四节气之首，春气始而建立，万物复苏。', custom: '咬春（吃春饼萝卜）、鞭春牛、迎春。', wellness: '养肝护阳，早睡早起，舒展形体。' },
  { name: '雨水', month: 2, day: 19, season: '春', meaning: '东风解冻，冰雪皆散而为水，降水渐增。', custom: '回娘家、接寿、拉保保。', wellness: '春捂防寒，健脾祛湿。' },
  { name: '惊蛰', month: 3, day: 6, season: '春', meaning: '春雷乍动，蛰虫惊而出走，生机勃发。', custom: '祭白虎、打小人、吃梨。', wellness: '疏肝理气，防春困。' },
  { name: '春分', month: 3, day: 21, season: '春', meaning: '昼夜平分，阴阳相半，春色正中。', custom: '竖蛋、放风筝、吃春菜。', wellness: '调和阴阳，作息均衡。' },
  { name: '清明', month: 4, day: 5, season: '春', meaning: '天清地明，气清景明，慎终追远。', custom: '扫墓祭祖、踏青、插柳、放风筝。', wellness: '疏肝养肺，防过敏。' },
  { name: '谷雨', month: 4, day: 20, season: '春', meaning: '雨生百谷，播种移苗的最佳时节。', custom: '喝谷雨茶、赏牡丹、祭仓颉。', wellness: '健脾利湿，祛风湿。' },
  { name: '立夏', month: 5, day: 6, season: '夏', meaning: '夏气始立，万物繁茂，暑热渐盛。', custom: '称人、吃蛋、尝三鲜。', wellness: '养心静气，午休养阳。' },
  { name: '小满', month: 5, day: 21, season: '夏', meaning: '麦粒渐满而未尽，小得盈满。', custom: '祭车神、吃苦菜、动三车。', wellness: '清热利湿，防暑湿。' },
  { name: '芒种', month: 6, day: 6, season: '夏', meaning: '有芒之种谷可稼种，农事繁忙。', custom: '送花神、安苗、煮梅。', wellness: '养心防暑，清淡饮食。' },
  { name: '夏至', month: 6, day: 21, season: '夏', meaning: '日长之至，阳气至极，阴气始生。', custom: '吃面、祭地、互赠扇子。', wellness: '养心安神，忌贪凉饮冷。' },
  { name: '小暑', month: 7, day: 7, season: '夏', meaning: '暑气尚小，日渐炎热，入伏在即。', custom: '晒伏、食新、吃藕。', wellness: '防暑降温，静心养神。' },
  { name: '大暑', month: 7, day: 23, season: '夏', meaning: '一年中最热之时，湿热交蒸。', custom: '晒伏姜、喝暑羊、送大暑船。', wellness: '清热解暑，补水养阴。' },
  { name: '立秋', month: 8, day: 8, season: '秋', meaning: '秋气始立，暑去凉来，禾谷成熟。', custom: '贴秋膘、咬秋、晒秋。', wellness: '润肺防燥，收敛阳气。' },
  { name: '处暑', month: 8, day: 23, season: '秋', meaning: '暑气至此而止，秋意渐浓。', custom: '放河灯、开渔节、吃鸭。', wellness: '滋阴润燥，早睡早起。' },
  { name: '白露', month: 9, day: 8, season: '秋', meaning: '露凝而白，天气转凉，昼夜温差大。', custom: '收清露、饮白露茶、祭禹王。', wellness: '防秋燥，护呼吸道。' },
  { name: '秋分', month: 9, day: 23, season: '秋', meaning: '昼夜平分，秋色平分，五谷丰登。', custom: '祭月、竖蛋、吃秋菜。', wellness: '平补阴阳，润肺养胃。' },
  { name: '寒露', month: 10, day: 8, season: '秋', meaning: '露气寒冷，将凝结也，深秋已至。', custom: '登高、赏菊、吃芝麻。', wellness: '防寒保暖，润肺生津。' },
  { name: '霜降', month: 10, day: 23, season: '秋', meaning: '气肃而凝，露结为霜，秋之终章。', custom: '赏菊、吃柿子、进补。', wellness: '平补润燥，防秋郁。' },
  { name: '立冬', month: 11, day: 7, season: '冬', meaning: '冬气始立，万物收藏，水始冰。', custom: '吃饺子、补冬、祭祖。', wellness: '养藏之道，早睡晚起。' },
  { name: '小雪', month: 11, day: 22, season: '冬', meaning: '雨下而为寒气所薄，凝而为雪。', custom: '腌菜、晒鱼干、吃糍粑。', wellness: '温补阳气，防寒保暖。' },
  { name: '大雪', month: 12, day: 7, season: '冬', meaning: '至此而雪盛，仲冬正式开始。', custom: '腌肉、观赏封河、进补。', wellness: '温阳补肾，早卧晚起。' },
  { name: '冬至', month: 12, day: 22, season: '冬', meaning: '阴极之至，阳气始生，一阳来复。', custom: '吃饺子汤圆、祭天、数九。', wellness: '养阳护肾，进补佳时。' },
  { name: '小寒', month: 1, day: 6, season: '冬', meaning: '冷气积久而为寒，小者未至极也。', custom: '吃腊八粥、画梅花、冰戏。', wellness: '温补驱寒，护心脑。' },
  { name: '大寒', month: 1, day: 20, season: '冬', meaning: '寒气之逆极，一年终章，年关将至。', custom: '尾牙祭、扫尘、备年货。', wellness: '保暖固阳，为春蓄势。' },
];

/** 当前所处的节气（含跨年回绕） */
export function getCurrentSolarTerm(date: Date = new Date()): SolarTermInfo {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const sorted = [...SOLAR_TERMS_24].sort((a, b) => a.month - b.month || a.day - b.day);
  let current: SolarTermInfo = SOLAR_TERMS_24[SOLAR_TERMS_24.length - 1];
  let found = false;
  for (const t of sorted) {
    if (t.month < m || (t.month === m && t.day <= d)) {
      current = t;
      found = true;
    } else {
      break;
    }
  }
  if (!found) {
    // 1/1-1/5：仍处上一年的冬至
    current = SOLAR_TERMS_24.find(t => t.name === '冬至')!;
  }
  return current;
}
