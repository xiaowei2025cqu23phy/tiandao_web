export type CoinFace = 'front' | 'back';

export type LineType = 'yang' | 'yin' | 'old_yang' | 'old_yin';

export interface YaoLine {
  position: string;     // "初"/"二"/"三"/"四"/"五"/"上"
  text: string;         // 爻辞
  xiang: string;        // 小象传
  nayin?: string;       // 纳甲干支 e.g. "甲子"
  sixRelative?: string; // 六亲: 父母/兄弟/妻财/官鬼/子孙
  isHost?: boolean;     // 世爻
  isGuest?: boolean;    // 应爻
}

export interface Hexagram {
  number: number;
  name: string;         // 拼音
  nameCn: string;       // 中文名
  unicode: string;      // 卦符
  binary: string;       // 二进制 (下→上)
  upperTrigram: string; // 上卦
  lowerTrigram: string; // 下卦
  meaning: string;      // 卦德
  description: string;  // 大象传
  judgment: string;     // 卦辞
  tuan: string;         // 彖传
  yaoLines: YaoLine[];  // 六爻爻辞
  specLine?: string;    // 用九/用六
  // 筮法属性
  palace?: string;      // 八宫: 乾宫/坎宫/艮宫/震宫/巽宫/离宫/坤宫/兑宫
  element?: string;     // 五行: 金/木/水/火/土
  solarTerm?: string;   // 节气 e.g. "大雪"
  monthZhi?: string;    // 月建 e.g. "子"
  hostLine?: number;    // 世爻位 (1-6, 0=无)
  guestLine?: number;   // 应爻位
  spirit?: string;      // 神煞 e.g. "青龙/朱雀/勾陈/腾蛇/白虎/玄武"
  activeTrigram?: 'upper'|'lower'; // 用体: 用卦在上/在下
}

export interface DivinationResult {
  id: string;
  timestamp: number;
  question: string;
  method: DivinationMethod;
  originalLines: LineType[];
  changedLines: LineType[];
  hexagram: Hexagram;
  relatingHexagram?: Hexagram;  // 变卦
  mutualHexagram?: Hexagram;    // 互卦
  inverseHexagram?: Hexagram;   // 综卦
  complementHexagram?: Hexagram; // 错卦
  aiInterpretation?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  models: string[];
  defaultModel: string;
}

export interface AIConfig {
  provider: string;
  baseUrl: string;
  model: string;
  apiKey: string;
}

export type TabType = 'iching' | 'bazi' | 'fortune' | 'festival' | 'marriage' | 'zeria' | 'name' | 'dream' | 'cosmos';
export type DivinationMethod = 'coin' | 'rice' | 'number' | 'time' | 'yarrow';

// ═══ Bazi types ═══

export interface BaziPillar {
  gan: string;        // 天干
  zhi: string;        // 地支
  ganIndex: number;   // 0-9
  zhiIndex: number;   // 0-11
}

export interface BaziResult {
  year: BaziPillar;    // 年柱
  month: BaziPillar;   // 月柱
  day: BaziPillar;     // 日柱
  hour: BaziPillar;    // 时柱
  tenGods: [string, string, string, string]; // 年/月/日/时干相对日主的十神（日主为「日主」）
  birthDate: string;   // 公历生日
  birthHour: number;   // 出生时辰 (0-23)
  lunarDate: string;   // 农历日期
  gender: string;      // 男/女
  longitude: number;   // 出生地经度（东经正）
  solarTime: {
    correctedHour: number;   // 真太阳时小时
    correctedMinute: number; // 真太阳时分钟
    correctionMinutes: number;
    label: string;           // 如「11:46」
    note: string;
  };
  daYun: DaYunResult;
  liuNian: LiuNianYear[];
}

export interface WuxingAnalysis {
  metal: number;   // 金
  wood: number;    // 木
  water: number;   // 水
  fire: number;    // 火
  earth: number;   // 土
}

export interface QiYunInfo {
  direction: '顺排' | '逆排';
  startAge: number;   // 起运岁数（简化：天数 ÷ 3）
  startYear: number;  // 起运公历年份
  note: string;
}

export interface DaYunStep {
  gan: string;
  zhi: string;
  ganIndex: number;
  zhiIndex: number;
  tenGod: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  isCurrent: boolean; // 当前是否处于该大运
}

export interface DaYunResult {
  qiYun: QiYunInfo;
  steps: DaYunStep[];
}

export interface LiuNianYear {
  year: number;
  gan: string;
  zhi: string;
  ganIndex: number;
  zhiIndex: number;
  tenGod: string;
  verdict: string;
  score: number; // 1-5
}
