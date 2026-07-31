import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Sparkles } from 'lucide-react';
import { calculateBazi, analyzeWuxing, dayMasterComment, wuxingLabel } from '../../data/bazi';
import type { BaziResult, WuxingAnalysis } from '../../types';

export default function BaziCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState(12);
  const [gender, setGender] = useState('男');
  const [result, setResult] = useState<BaziResult | null>(null);
  const [wuxing, setWuxing] = useState<WuxingAnalysis | null>(null);

  const handleCalculate = () => {
    if (!birthDate) return;
    const [y, m, d] = birthDate.split('-').map(Number);
    if (!y || !m || !d) return;

    const bazi = calculateBazi(y, m, d, birthHour, gender);
    const wx = analyzeWuxing(bazi);
    setResult(bazi);
    setWuxing(wx);
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-imperial-red/30 to-amber-700/30 border border-imperial-red/20 flex items-center justify-center">
          <Sparkles size={32} className="text-amber-400/60" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-4">八字命理</h2>
        <p className="text-amber-400/50 text-sm mt-2">
          输入出生信息，推算四柱八字与五行格局
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20 space-y-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
            <Calendar size={16} />
            出生日期（公历）
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50 transition-colors"
            placeholder="2000-01-01"
          />
        </div>

        {/* Hour + Gender row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
              <Clock size={16} />
              出生时辰
            </label>
            <select
              value={birthHour}
              onChange={e => setBirthHour(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50 transition-colors"
            >
              {[
                { v: 0, l: '子时 23:00-01:00' },  { v: 1, l: '丑时 01:00-03:00' },
                { v: 3, l: '寅时 03:00-05:00' },  { v: 5, l: '卯时 05:00-07:00' },
                { v: 7, l: '辰时 07:00-09:00' },  { v: 9, l: '巳时 09:00-11:00' },
                { v: 11, l: '午时 11:00-13:00' }, { v: 13, l: '未时 13:00-15:00' },
                { v: 15, l: '申时 15:00-17:00' }, { v: 17, l: '酉时 17:00-19:00' },
                { v: 19, l: '戌时 19:00-21:00' }, { v: 21, l: '亥时 21:00-23:00' },
                { v: 23, l: '夜子 23:00' },
              ].map(opt => (
                <option key={opt.v} value={opt.v}>{opt.l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
              <User size={16} />
              性别
            </label>
            <div className="flex gap-2">
              {['男', '女'].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm transition-all ${
                    gender === g
                      ? 'bg-imperial-red/20 border-imperial-red/50 text-amber-100'
                      : 'bg-ink-black/60 border-imperial-red/20 text-amber-400/50 hover:border-imperial-red/30'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-imperial-red/80 to-imperial-red/60 text-amber-100 font-medium text-sm hover:from-imperial-red hover:to-imperial-red/80 transition-all border border-imperial-red/30 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleCalculate}
          disabled={!birthDate}
          whileHover={birthDate ? { scale: 1.01 } : {}}
          whileTap={birthDate ? { scale: 0.99 } : {}}
        >
          🧮 推算八字
        </motion.button>
      </motion.div>

      {/* Result */}
      {result && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Four Pillars */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-5">四柱八字</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: '年柱', pillar: result.year },
                { label: '月柱', pillar: result.month },
                { label: '日柱', pillar: result.day },
                { label: '时柱', pillar: result.hour },
              ].map(({ label, pillar }) => (
                <motion.div
                  key={label}
                  className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-amber-400/30 text-xs">{label}</span>
                  <p className="text-xl font-calligraphy text-amber-100 mt-1">
                    {pillar.gan}{pillar.zhi}
                  </p>
                </motion.div>
              ))}
            </div>
            <p className="text-amber-400/30 text-xs text-center mt-3">
              {result.birthDate} · {result.gender} · {result.lunarDate}
            </p>
          </div>

          {/* Wuxing Analysis */}
          {wuxing && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
              <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-4">五行分析</h3>
              <div className="space-y-2">
                {(['metal', 'wood', 'water', 'fire', 'earth'] as const).map(el => {
                  const max = Math.max(...Object.values(wuxing));
                  const pct = max > 0 ? (wuxing[el] / max) * 100 : 0;
                  return (
                    <div key={el} className="flex items-center gap-3">
                      <span className="text-amber-400/60 text-sm w-8">{wuxingLabel(el)}</span>
                      <div className="flex-1 h-3 bg-ink-black/80 rounded-full overflow-hidden border border-imperial-red/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#c084fc'][
                              ['metal', 'wood', 'water', 'fire', 'earth'].indexOf(el)
                            ],
                            width: `${pct}%`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <span className="text-amber-200 text-xs w-4">{wuxing[el]}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-amber-400/50 text-sm text-center mt-3">
                {(() => {
                  const maxEl = Object.entries(wuxing).sort((a, b) => b[1] - a[1])[0];
                  const minEl = Object.entries(wuxing).sort((a, b) => a[1] - b[1])[0];
                  return `${wuxingLabel(maxEl[0])}最旺 · ${wuxingLabel(minEl[0])}偏弱`;
                })()}
              </p>
            </div>
          )}

          {/* Day Master Comment */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="font-calligraphy text-lg text-amber-100 text-center mb-3">日主解读</h3>
            <p className="text-amber-400/70 text-sm leading-relaxed text-center">
              {dayMasterComment(result)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
