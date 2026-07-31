/**
 * 天文算法：二十四节气精确时刻（1900-2100）
 *
 * 方法：对太阳视黄经（Meeus《Astronomical Algorithms》低精度公式 + 四项截断章动
 * Δψ 与光行差）做牛顿迭代，求其到达指定黄经（0°春分 … 345°惊蛰）的时刻。
 * 1900-2100 年内日期与万年历一致；时刻误差一般 1-3 分钟、个别可达 8 分钟
 * （低精度公式截断误差，未使用完整 VSOP87 级数）。
 * 返回值为 UTC 时刻，展示时按北京时间（UTC+8）换算。
 */

const DEG = Math.PI / 180;
const J2000 = 2451545.0;
const UNIX_JD = 2440587.5; // 1970-01-01 00:00 UTC 的儒略日

export const TERM_NAMES_24 = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
];

// 节气 → 太阳视黄经（度）
const TERM_ANGLES: Record<string, number> = {
  小寒: 285, 大寒: 300, 立春: 315, 雨水: 330, 惊蛰: 345, 春分: 0,
  清明: 15, 谷雨: 30, 立夏: 45, 小满: 60, 芒种: 75, 夏至: 90,
  小暑: 105, 大暑: 120, 立秋: 135, 处暑: 150, 白露: 165, 秋分: 180,
  寒露: 195, 霜降: 210, 立冬: 225, 小雪: 240, 大雪: 255, 冬至: 270,
};

// 近似日期（仅作牛顿迭代初值，实际返回精确时刻）
const APPROX: Record<string, [number, number]> = {
  小寒: [1, 6], 大寒: [1, 20], 立春: [2, 4], 雨水: [2, 19],
  惊蛰: [3, 6], 春分: [3, 21], 清明: [4, 5], 谷雨: [4, 20],
  立夏: [5, 6], 小满: [5, 21], 芒种: [6, 6], 夏至: [6, 21],
  小暑: [7, 7], 大暑: [7, 23], 立秋: [8, 8], 处暑: [8, 23],
  白露: [9, 8], 秋分: [9, 23], 寒露: [10, 8], 霜降: [10, 23],
  立冬: [11, 7], 小雪: [11, 22], 大雪: [12, 7], 冬至: [12, 22],
};

/** 世界时与力学时（TT）的差值 ΔT（秒），Espenak-Meeus 分段多项式 */
export function deltaT(year: number): number {
  const t = year - 2000;
  if (year < 1900) return -20 + 32 * Math.pow((year - 1820) / 100, 2);
  if (year < 1920) {
    const u = year - 1900;
    return -2.79 + 1.494119 * u - 0.0598939 * u * u + 0.0061966 * u ** 3 - 0.000197 * u ** 4;
  }
  if (year < 1941) {
    const u = year - 1920;
    return 21.2 + 0.84493 * u - 0.0761 * u * u + 0.0020936 * u ** 3;
  }
  if (year < 1961) {
    const u = year - 1941;
    return 29.07 + 0.407 * u - u * u / 233 + u ** 3 / 2547;
  }
  if (year < 1986) {
    const u = year - 1961;
    return 45.45 + 1.067 * u - u * u / 260 - u ** 3 / 718;
  }
  if (year < 2005) {
    const u = year - 2000;
    return 63.86 + 0.3345 * u - 0.060374 * u * u + 0.0017275 * u ** 3
      + 0.000651814 * u ** 4 + 0.00002373599 * u ** 5;
  }
  if (year < 2050) return 62.92 + 0.32217 * t + 0.005589 * t * t;
  return -20 + 32 * Math.pow((year - 1820) / 100, 2) - 0.5628 * (2150 - year);
}

function norm360(x: number): number {
  return ((x % 360) + 360) % 360;
}

function norm180(x: number): number {
  const r = norm360(x);
  return r > 180 ? r - 360 : r;
}

function utcMsToJdeTT(ms: number, year: number): number {
  const jdUTC = ms / 86400000 + UNIX_JD;
  return jdUTC + deltaT(year) / 86400;
}

function jdeTTToUtcMs(jdeTT: number, year: number): number {
  const jdUTC = jdeTT - deltaT(year) / 86400;
  return (jdUTC - UNIX_JD) * 86400000;
}

/**
 * 太阳视黄经（度）：Meeus 低精度太阳坐标 + 四项截断章动（Δψ）与光行差
 */
export function sunApparentLongitude(jdeTT: number): number {
  const T = (jdeTT - J2000) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG)
    + 0.000289 * Math.sin(3 * M * DEG);
  const trueLong = norm360(L0 + C);
  const Lp = 218.3165 + 481267.8813 * T;      // 月球平黄经
  const omega = 125.04452 - 1934.136261 * T;  // 月球升交点黄经
  // Δψ（角秒）：Meeus Ch.22 截断主项
  const dpsi = -17.2 * Math.sin(omega * DEG)
    - 1.32 * Math.sin(2 * L0 * DEG)
    - 0.23 * Math.sin(2 * Lp * DEG)
    + 0.21 * Math.sin(2 * omega * DEG);
  // 光行差（角秒），R 为日地距离近似
  const R = 1.00014 - 0.01671 * Math.cos(M * DEG) - 0.00014 * Math.cos(2 * M * DEG);
  const aberration = -20.4898 / R;
  return norm360(trueLong + (dpsi + aberration) / 3600);
}

const cache = new Map<string, number>();

/** 某年某节气的精确时刻（UTC Date） */
export function getSolarTermTime(year: number, name: string): Date {
  const key = `${year}|${name}`;
  const cached = cache.get(key);
  if (cached !== undefined) return new Date(cached);

  const target = TERM_ANGLES[name];
  if (target === undefined) throw new Error(`未知节气：${name}`);
  const [m, d] = APPROX[name];

  const ms = Date.UTC(year, m - 1, d, 4, 0, 0); // 初值：近似日期 04:00 UTC
  let jd = utcMsToJdeTT(ms, year);
  for (let i = 0; i < 5; i++) {
    const lam = sunApparentLongitude(jd);
    const err = norm180(lam - target);
    jd -= err / 0.98564736; // 太阳平均每日视运动约 0.9856°
  }
  const resultMs = jdeTTToUtcMs(jd, year);
  cache.set(key, resultMs);
  return new Date(resultMs);
}

/** 某公历年全部 24 节气（UTC 时刻） */
export function getSolarTermTimes(year: number): Array<{ name: string; time: Date }> {
  return TERM_NAMES_24.map(name => ({ name, time: getSolarTermTime(year, name) }));
}
