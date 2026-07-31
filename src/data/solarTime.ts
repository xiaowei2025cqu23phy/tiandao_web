/**
 * 真太阳时 — 以出生地经度修正标准时
 * 中国标准时间基于东经 120°，每 1° 相差 4 分钟（东经为正）；
 * 并叠加当日「均时差」（太阳视运动不均匀，全年 -14 ~ +16 分钟），
 * 总误差一般在 1-2 分钟内。
 */

export interface SolarTimeResult {
  correctedHour: number;      // 修正后小时 0-23
  correctedMinute: number;    // 修正后分钟 0-59
  correctionMinutes: number;  // 总修正分钟数（可为负）
  longitudeCorrection: number; // 经度修正分钟数
  equationOfTime: number;      // 当日均时差分钟数
  label: string;              // 如「11:46」
  note: string;               // 说明文字
}

/** 经度 → 分钟修正（东经为正，如北京 116.4°E 约 -14 分钟） */
export function longitudeCorrection(longitude: number): number {
  const lon = Math.max(-180, Math.min(180, longitude));
  return Math.round((lon - 120) * 4);
}

/**
 * 当日均时差（分钟），NOAA/Meeus 标准公式
 * 代表「视太阳时 - 平太阳时」，全年约 -14 ~ +16 分钟。
 */
export function equationOfTime(year: number, month: number, day: number): number {
  // 儒略世纪数（以当日 12:00 UTC 近似）
  const jd = Date.UTC(year, month - 1, day, 12) / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  const rad = Math.PI / 180;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T; // 太阳平黄经
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;   // 平近点角
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T; // 轨道离心率
  const eps = 23.43929111; // 平黄赤交角（度，忽略长期变化，影响 < 0.01 分）
  const y = Math.pow(Math.tan(eps * rad / 2), 2);
  return (180 / Math.PI) * 4 * (
    y * Math.sin(2 * L0 * rad)
    - 2 * e * Math.sin(M * rad)
    + 4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad)
    - 0.5 * y * y * Math.sin(4 * L0 * rad)
    - 1.25 * e * e * Math.sin(2 * M * rad)
  );
}

/** 标准时 → 真太阳时 */
export function correctSolarTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0,
  longitude: number = 120,
): SolarTimeResult {
  const lonCorr = longitudeCorrection(longitude);
  const eot = equationOfTime(year, month, day);
  const correction = lonCorr + eot;
  const base = (Math.max(0, Math.min(23, Math.floor(hour))) * 60
    + Math.max(0, Math.min(59, Math.floor(minute))));
  const total = ((base + correction) % 1440 + 1440) % 1440;
  const correctedHour = Math.floor(total / 60);
  const correctedMinute = Math.floor(total) % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    correctedHour,
    correctedMinute,
    correctionMinutes: correction,
    longitudeCorrection: lonCorr,
    equationOfTime: eot,
    label: `${pad(correctedHour)}:${pad(correctedMinute)}`,
    note: `经度修正 ${lonCorr >= 0 ? '+' : ''}${lonCorr} 分，均时差 ${eot >= 0 ? '+' : ''}${eot.toFixed(1)} 分`,
  };
}

/** 真太阳时的小时数（浮点，用于时辰划分） */
export function trueSolarHour(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0,
  longitude: number = 120,
): number {
  const r = correctSolarTime(year, month, day, hour, minute, longitude);
  return r.correctedHour + r.correctedMinute / 60;
}
