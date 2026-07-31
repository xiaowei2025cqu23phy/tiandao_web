import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { getUpcomingFestivals, FESTIVALS } from '../../data/festivals';
import { getSolarTermDates, getCurrentSolarTermDetail } from '../../data/solarTerms';
import { solar2lunar, moonPhase, monthDays, leapDays } from '../../data/lunar';
import { getYearPillar } from '../../data/ganzhi';

const SEASON_ORDER = ['春', '夏', '秋', '冬'] as const;
const BEIJING_OFFSET = 8 * 3600000;

/** UTC 时刻 → 北京时间墙钟 */
function beijing(date: Date): Date {
  return new Date(date.getTime() + BEIJING_OFFSET);
}

function formatBeijing(date: Date): string {
  const b = beijing(date);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${b.getUTCMonth() + 1}月${b.getUTCDate()}日 ${pad(b.getUTCHours())}:${pad(b.getUTCMinutes())}`;
}

export default function SeasonalCalendar() {
  const today = useMemo(() => new Date(), []);

  const info = useMemo(() => {
    const y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate();
    const l = solar2lunar(y, m, d);
    const yp = getYearPillar(y, m, d);
    return {
      lunar: l,
      ganZhi: `${yp.gan}${yp.zhi}`,
      moon: moonPhase(l.day, l.isLeap ? leapDays(l.year) : monthDays(l.year, l.month)),
      term: getCurrentSolarTermDetail(today),
    };
  }, [today]);

  const upcoming = useMemo(() => getUpcomingFestivals(today, 5), [today]);
  const termDates = useMemo(() => getSolarTermDates(today.getFullYear()), [today]);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400/30 to-imperial-red/30 border border-amber-500/20 flex items-center justify-center">
          <Sun size={32} className="text-amber-300" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-4">岁时历</h2>
        <p className="text-amber-400/50 text-sm mt-2">二十四节气 · 传统节日 · 月相流转</p>

        <div className="mt-4 inline-flex flex-wrap justify-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-imperial-red/10 border border-imperial-red/20 text-amber-200">
            农历 {info.ganZhi}年 {info.lunar.label}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-imperial-red/10 border border-imperial-red/20 text-amber-200">
            {info.moon.emoji} {info.moon.name}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200">
            当前节气：{info.term.info.name}（{formatBeijing(info.term.time)}）
          </span>
        </div>
      </motion.div>

      {/* Upcoming festivals */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-5">近期节日</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {upcoming.map(u => (
            <div key={u.festival.id}
              className={`p-4 rounded-xl border ${
                u.isToday ? 'bg-amber-500/10 border-amber-500/30' : 'bg-ink-black/60 border-imperial-red/10'
              }`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-amber-200 font-medium">{u.festival.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  u.isToday
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'bg-imperial-red/10 text-amber-400/70 border border-imperial-red/20'
                }`}>
                  {u.isToday ? '就是今天' : `还有 ${u.daysLeft} 天`}
                </span>
              </div>
              <p className="text-amber-400/50 text-xs mt-1.5">
                {u.date.getMonth() + 1}月{u.date.getDate()}日 · {u.festival.customs}
              </p>
              {u.festival.foods && (
                <p className="text-amber-400/40 text-xs mt-1">时令：{u.festival.foods}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 24 solar terms */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      >
        <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-1">二十四节气</h3>
        <p className="text-amber-400/40 text-xs text-center mb-5">节气时刻由天文算法计算，与万年历一致（北京时间）</p>
        {SEASON_ORDER.map(season => (
          <div key={season} className="mb-5 last:mb-0">
            <p className="text-amber-400/60 text-sm mb-2 flex items-center gap-2">
              <span className="inline-block w-6 h-6 rounded-full bg-imperial-red/10 border border-imperial-red/20 text-center leading-6 text-xs">
                {season}
              </span>
              季
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {termDates.filter(td => td.info.season === season).map(td => {
                const t = td.info;
                const isCurrent = t.name === info.term.info.name;
                return (
                  <div key={t.name}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-ink-black/60 border-imperial-red/10'
                    }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-amber-200 font-medium text-sm">{t.name}</p>
                      <span className="text-amber-400/40 text-[11px]">{formatBeijing(td.time)}</span>
                    </div>
                    <p className="text-amber-400/60 text-xs mt-1.5 leading-relaxed">{t.meaning}</p>
                    <p className="text-amber-400/40 text-xs mt-1.5">
                      <span className="text-amber-400/60">俗：</span>{t.custom}
                    </p>
                    <p className="text-amber-400/40 text-xs mt-1">
                      <span className="text-amber-400/60">养：</span>{t.wellness}
                    </p>
                    {isCurrent && (
                      <span className="mt-2 inline-block text-[10px] text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">
                        当前节气
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* All festivals */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-5">传统节日</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FESTIVALS.map(f => (
            <div key={f.id} className="p-4 rounded-xl bg-ink-black/60 border border-imperial-red/10">
              <p className="text-amber-200 font-medium text-sm">{f.name}</p>
              <p className="text-amber-400/60 text-xs mt-1.5 leading-relaxed">{f.customs}</p>
              {f.foods && (
                <p className="text-amber-400/40 text-xs mt-1.5">时令：{f.foods}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
