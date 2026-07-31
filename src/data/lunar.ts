/**
 * 农历（阴历）转换 — 1900-2100 精确查表
 * 数据来源：公历/农历互转表（1900-2100 闰月及月大小信息）
 */

// 农历 1900-2100 闰月与大小月信息表
// 每项编码：低 4 位 = 闰月（0 表示无闰月）；第 17 位（0x10000）= 闰月 30 天；
// 第 16-4 位（0x8000>>m）= 第 m 个月是否为 30 天（大月）
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520, // 2100
];

const MONTH_CN = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const DAY_CN = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

export function leapMonth(year: number): number {
  return LUNAR_INFO[year - 1900] & 0xf;
}

export function leapDays(year: number): number {
  return leapMonth(year) ? ((LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29) : 0;
}

export function monthDays(year: number, month: number): number {
  return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
}

export function lYearDays(year: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
  return sum + leapDays(year);
}

export interface LunarDate {
  year: number;      // 农历年份（正月初一为界）
  month: number;     // 1-12
  isLeap: boolean;   // 是否闰月
  day: number;       // 1-30
  monthCn: string;   // 如「六月」「闰二月」
  dayCn: string;     // 如「十八」
  label: string;     // 如「六月十八」
}

/** 从 1900-01-31（农历正月初一）起的天数 */
export function solarOffsetDays(year: number, month: number, day: number): number {
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000);
}

/** 公历转农历（1900-01-31 ~ 2100 年内），查表精确推算 */
export function solar2lunar(year: number, month: number, day: number): LunarDate {
  if (year < 1900 || year > 2100) {
    throw new RangeError('仅支持 1900-01-31 至 2100-12-31 的公历日期');
  }

  let offset = solarOffsetDays(year, month, day);
  if (offset < 0) {
    throw new RangeError('仅支持 1900-01-31 起的公历日期');
  }

  // 先按农历年累加，定位农历年
  let temp = 0;
  let i = 1900;
  for (; i < 2101 && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  const lunarYear = i;
  if (lunarYear > 2100) {
    throw new RangeError('仅支持 2100 年内的公历日期');
  }

  // 再按月（含闰月）累加，定位农历月/日
  const leap = leapMonth(lunarYear);
  let isLeap = false;
  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(lunarYear);
    } else {
      temp = monthDays(lunarYear, i);
    }
    if (isLeap && i === leap + 1) {
      isLeap = false;
    }
    offset -= temp;
  }
  // 恰好落在闰月与非闰月的分界上
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --i;
    }
  }
  if (offset < 0) {
    offset += temp;
    --i;
  }

  const lunarMonth = i;
  const lunarDay = offset + 1;
  const monthCn = `${isLeap ? '闰' : ''}${MONTH_CN[lunarMonth - 1]}月`;
  const dayCn = DAY_CN[lunarDay - 1];

  return {
    year: lunarYear,
    month: lunarMonth,
    isLeap,
    day: lunarDay,
    monthCn,
    dayCn,
    label: `${monthCn}${dayCn}`,
  };
}
