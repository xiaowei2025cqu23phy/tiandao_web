import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin, Sparkles } from 'lucide-react';
import { calculateBazi, analyzeWuxing, dayMasterComment, wuxingLabel } from '../../data/bazi';
import { getShenSha, getChangsheng, CHANGSHENG_DESC } from '../../data/shensha';
import type { BaziResult, WuxingAnalysis } from '../../types';

export default function BaziCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [birthHour, setBirthHour] = useState(12);
  const [birthMinute, setBirthMinute] = useState(0);
  const [longitude, setLongitude] = useState(120);
  const [gender, setGender] = useState('男');
  const [result, setResult] = useState<BaziResult | null>(null);
  const [wuxing, setWuxing] = useState<WuxingAnalysis | null>(null);
  const [formError, setFormError] = useState('');

  const handleCalculate = () => {
    if (!birthDate) return;
    setFormError('');
    const [y, m, d] = birthDate.split('-').map(Number);
    if (!y || !m || !d) return;

    // 农历查表支持 1900-01-31 ~ 2100 年内
    if (y < 1900 || y > 2100) {
      setFormError('仅支持 1900-01-31 至 2100-12-31 之间的出生日期');
      return;
    }
    if (y === 1900 && m === 1 && d < 31) {
      setFormError('1900 年需从 1 月 31 日（正月初一）起算');
      return;
    }

    try {
      const bazi = calculateBazi(y, m, d, birthHour, gender, { minute: birthMinute, longitude });
      const wx = analyzeWuxing(bazi);
      setResult(bazi);
      setWuxing(wx);
    } catch (err: unknown) {
      setResult(null);
      setWuxing(null);
      setFormError(err instanceof Error ? err.message : '推算失败，请检查输入');
    }
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
            onChange={e => { setBirthDate(e.target.value); setFormError(''); }}
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

        {/* Minute + Longitude row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
              <Clock size={16} />
              出生分钟
            </label>
            <input
              type="number"
              min={0}
              max={59}
              value={birthMinute}
              onChange={e => setBirthMinute(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
              className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50 transition-colors"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
              <MapPin size={16} />
              出生地经度（东经）
            </label>
            <input
              type="number"
              step="0.1"
              min={-180}
              max={180}
              value={longitude}
              onChange={e => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) setLongitude(Math.max(-180, Math.min(180, v)));
              }}
              className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50 transition-colors"
              placeholder="120"
            />
            <p className="text-amber-400/30 text-[11px] mt-1">默认 120°（东八区标准时），如北京 116.4°</p>
          </div>
        </div>

        {formError && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
            ⚠️ {formError}
          </div>
        )}

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
                { label: '年柱', pillar: result.year, tenGod: result.tenGods[0] },
                { label: '月柱', pillar: result.month, tenGod: result.tenGods[1] },
                { label: '日柱', pillar: result.day, tenGod: result.tenGods[2] },
                { label: '时柱', pillar: result.hour, tenGod: result.tenGods[3] },
              ].map(({ label, pillar, tenGod }) => (
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
                  <p className="text-amber-400/40 text-[11px] mt-1">{tenGod}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-amber-400/40 text-xs text-center mt-3 space-y-1">
              <p>
                {result.birthDate} · {result.gender} · {result.lunarDate}
              </p>
              <p className="text-amber-400/50">
                真太阳时 {result.solarTime.label}（{result.solarTime.note}）
              </p>
            </div>
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

          {/* Shen Sha + Changsheng */}
          {(() => {
            const pillars = [result.year, result.month, result.day, result.hour];
            const shensha = getShenSha(pillars);
            const stages = ['年支', '月支', '日支', '时支'].map((label, i) => ({
              label,
              stage: getChangsheng(result.day.ganIndex, pillars[i].zhiIndex),
            }));
            const monthStage = stages[1].stage;
            return (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
                <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-4">神煞与长生</h3>

                {shensha.length > 0 ? (
                  <div className="space-y-2">
                    {shensha.map(s => (
                      <div key={s.name} className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-200 text-sm font-medium">{s.name}</span>
                          <span className="text-amber-400/50 text-[11px]">
                            {s.pillars.join('、')}见
                          </span>
                        </div>
                        <p className="text-amber-400/50 text-xs mt-1">{s.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-amber-400/40 text-xs text-center">四柱中未见常见神煞</p>
                )}

                <div className="grid grid-cols-4 gap-2 mt-4">
                  {stages.map(s => (
                    <div key={s.label} className="p-2.5 rounded-xl bg-ink-black/60 border border-imperial-red/10 text-center">
                      <p className="text-amber-400/40 text-[10px]">{s.label}</p>
                      <p className="text-amber-200 text-sm mt-0.5">{s.stage}</p>
                    </div>
                  ))}
                </div>
                <p className="text-amber-400/50 text-xs text-center mt-3">
                  {result.day.gan}日主对月令为「{monthStage}」：{CHANGSHENG_DESC[monthStage]}
                </p>
              </div>
            );
          })()}

          {/* Da Yun */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-2">大运排盘</h3>
            <p className="text-amber-400/50 text-xs text-center mb-4">
              {result.daYun.qiYun.note}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-amber-400/40 text-xs">
                    <th className="py-2 font-normal text-left">大运</th>
                    <th className="py-2 font-normal text-left">十神</th>
                    <th className="py-2 font-normal text-right">年龄</th>
                    <th className="py-2 font-normal text-right">年份</th>
                  </tr>
                </thead>
                <tbody>
                  {result.daYun.steps.map(step => (
                    <tr
                      key={`${step.gan}${step.zhi}`}
                      className={`border-t border-imperial-red/10 ${
                        step.isCurrent ? 'bg-imperial-red/10' : ''
                      }`}
                    >
                      <td className="py-2 text-amber-100 font-calligraphy text-lg">
                        {step.gan}{step.zhi}
                        {step.isCurrent && (
                          <span className="ml-2 text-[10px] text-amber-400/70 bg-amber-400/10 border border-amber-400/20 rounded-full px-1.5 py-0.5">
                            当前
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-amber-400/60">{step.tenGod}</td>
                      <td className="py-2 text-amber-400/60 text-right">{step.startAge}-{step.endAge} 岁</td>
                      <td className="py-2 text-amber-400/60 text-right">{step.startYear}-{step.endYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Liu Nian */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-4">未来十年流年</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.liuNian.map(n => (
                <div
                  key={n.year}
                  className={`p-3 rounded-xl border flex items-center gap-3 ${
                    n.score >= 4
                      ? 'bg-green-500/[0.05] border-green-500/20'
                      : n.score === 3
                        ? 'bg-ink-black/60 border-imperial-red/10'
                        : 'bg-red-500/[0.05] border-red-500/20'
                  }`}
                >
                  <div className="text-center shrink-0">
                    <p className="text-amber-400/40 text-[10px]">{n.year}</p>
                    <p className="font-calligraphy text-lg text-amber-100 leading-tight">
                      {n.gan}{n.zhi}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-amber-400/70 text-xs">
                      {n.tenGod} · {'★'.repeat(n.score)}{'☆'.repeat(5 - n.score)}
                    </p>
                    <p className="text-amber-400/50 text-xs mt-0.5 truncate" title={n.verdict}>{n.verdict}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
