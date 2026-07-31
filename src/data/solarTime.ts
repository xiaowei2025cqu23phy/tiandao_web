/**
 * 真太阳时 — 以出生地经度修正标准时
 * 中国标准时间基于东经 120°，每 1° 相差 4 分钟（东经为正）。
 * 说明：本实现仅做经度修正，未叠加「均时差」（太阳视运动不均匀），误差通常在 ±15 分钟内。
 */

export interface SolarTimeResult {
  correctedHour: number;      // 修正后小时 0-23
  correctedMinute: number;    // 修正后分钟 0-59
  correctionMinutes: number;  // 总修正分钟数（可为负）
  label: string;              // 如「11:46」
  note: string;               // 说明文字
}

/** 经度 → 分钟修正（东经为正，如北京 116.4°E 约 -14 分钟） */
export function longitudeCorrection(longitude: number): number {
  const lon = Math.max(-180, Math.min(180, longitude));
  return Math.round((lon - 120) * 4);
}

/** 标准时 → 真太阳时 */
export function correctSolarTime(
  hour: number,
  minute: number = 0,
  longitude: number = 120,
): SolarTimeResult {
  const correction = longitudeCorrection(longitude);
  const base = (Math.max(0, Math.min(23, Math.floor(hour))) * 60
    + Math.max(0, Math.min(59, Math.floor(minute))));
  const total = ((base + correction) % 1440 + 1440) % 1440;
  const correctedHour = Math.floor(total / 60);
  const correctedMinute = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    correctedHour,
    correctedMinute,
    correctionMinutes: correction,
    label: `${pad(correctedHour)}:${pad(correctedMinute)}`,
    note: correction === 0
      ? '出生地经度 120°E，标准时即真太阳时'
      : `按东经 ${longitude}° 修正 ${correction >= 0 ? '+' : ''}${correction} 分钟`,
  };
}

/** 真太阳时的小时数（浮点，用于时辰划分） */
export function trueSolarHour(
  hour: number,
  minute: number = 0,
  longitude: number = 120,
): number {
  const r = correctSolarTime(hour, minute, longitude);
  return r.correctedHour + r.correctedMinute / 60;
}
