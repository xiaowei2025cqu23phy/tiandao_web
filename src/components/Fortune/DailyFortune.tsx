import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Palette, Navigation, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { getAlmanac } from '../../data/almanac';
import type { AlmanacDay } from '../../data/almanac';

export default function DailyFortune() {
  const [almanac] = useState<AlmanacDay | null>(() => getAlmanac(new Date()));
  const [selectedZodiac, setSelectedZodiac] = useState('');

  if (!almanac) return null;

  const userFortune = selectedZodiac
    ? almanac.fortunes.find(f => f.zodiac === selectedZodiac)
    : null;

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400/30 to-imperial-red/30 border border-amber-500/20 flex items-center justify-center">
          <Calendar size={28} className="text-amber-300" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-3">每日运势</h2>
        <p className="text-amber-400/60 mt-2">
          {almanac.year}年{almanac.month}月{almanac.day}日 · {almanac.weekday} · {almanac.solarTerm}
        </p>
        <p className="text-2xl font-calligraphy text-amber-200 mt-1">
          {almanac.yearGan}{almanac.yearZhi}年 · {almanac.monthGan}{almanac.monthZhi}月 · {almanac.dayGan}{almanac.dayZhi}日
        </p>
        <p className="text-amber-400/50 text-xs mt-1">
          农历 {almanac.lunarYear}年 {almanac.lunarDate}
        </p>
      </motion.div>

      {/* Lucky Info Cards */}
      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {[
          { icon: <Star size={18} />, label: '生肖', value: almanac.zodiac },
          { icon: <TriangleAlert size={18} />, label: '五行', value: almanac.wuxing },
          { icon: <Palette size={18} />, label: '幸运色', value: almanac.luckyColors[0] },
          { icon: <Navigation size={18} />, label: '吉方', value: almanac.luckyDirection },
        ].map(({ icon, label, value }) => (
          <div key={label} className="p-3 rounded-xl bg-imperial-red/[0.05] border border-imperial-red/10 text-center">
            <div className="text-amber-400/60 mb-1 flex justify-center">{icon}</div>
            <p className="text-amber-400/40 text-xs">{label}</p>
            <p className="text-amber-200 font-medium text-sm mt-0.5">{value}</p>
          </div>
        ))}
      </motion.div>

      {/* Auspicious / Inauspicious */}
      <motion.div className="grid grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="p-4 rounded-2xl bg-green-500/[0.05] border border-green-500/20">
          <h3 className="flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
            <CheckCircle2 size={16} /> 宜
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {almanac.auspicious.map(a => (
              <span key={a} className="px-2 py-0.5 text-xs rounded-lg bg-green-500/10 text-green-400/80 border border-green-500/20">{a}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-red-500/[0.05] border border-red-500/20">
          <h3 className="flex items-center gap-2 text-red-400 text-sm font-medium mb-3">
            <TriangleAlert size={16} /> 忌
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {almanac.inauspicious.map(a => (
              <span key={a} className="px-2 py-0.5 text-xs rounded-lg bg-red-500/10 text-red-400/80 border border-red-500/20">{a}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Zodiac Fortune */}
      <motion.div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-1">十二生肖运势</h3>
        <p className="text-amber-400/40 text-xs text-center mb-4">点击选择你的生肖</p>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4">
          {almanac.fortunes.map(f => (
            <button
              key={f.zodiac}
              onClick={() => setSelectedZodiac(f.zodiac)}
              className={`p-2 rounded-xl text-center text-sm transition-all ${
                selectedZodiac === f.zodiac
                  ? 'bg-imperial-red/20 border-imperial-red/50 text-amber-100 border'
                  : 'bg-ink-black/60 border border-imperial-red/10 text-amber-400/60 hover:border-imperial-red/30'
              }`}
            >
              <div>{f.stars}</div>
              <div className="text-xs mt-0.5">{f.zodiac}</div>
            </button>
          ))}
        </div>

        {userFortune && (
          <motion.div className="p-4 rounded-xl bg-ink-black/60 border border-imperial-red/10 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <p className="text-amber-200 font-medium">{userFortune.zodiac}年 {userFortune.stars} · {userFortune.summary}</p>
            <p className="text-amber-400/60 text-sm mt-1">{userFortune.detail}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
