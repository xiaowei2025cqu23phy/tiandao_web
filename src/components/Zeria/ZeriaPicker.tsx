import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, CalendarDays } from 'lucide-react';
import { pickDays, PURPOSES } from '../../data/zeria';
import { ZODIAC } from '../../data/marriage';

const YEAR_OPTIONS = Array.from({ length: 9 }, (_, i) => 2024 + i);
const WEEK_HEADER = ['日', '一', '二', '三', '四', '五', '六'];

const gradeCell: Record<string, string> = {
  '大吉': 'bg-green-500/15 border-green-500/40 text-green-200',
  '吉': 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200',
  '平': 'bg-ink-black/60 border-imperial-red/10 text-amber-200',
  '忌': 'bg-red-500/10 border-red-500/25 text-red-300',
};

export default function ZeriaPicker() {
  const now = new Date();
  const [purposeId, setPurposeId] = useState('marry');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [zodiac, setZodiac] = useState('');
  const purpose = PURPOSES.find(p => p.id === purposeId) || PURPOSES[0];
  const days = pickDays(purposeId, year, month, zodiac || undefined);
  const goodDays = days.filter(d => d.grade === '大吉' || d.grade === '吉');
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400/30 to-amber-600/30 border border-emerald-500/20 flex items-center justify-center">
          <CalendarCheck size={32} className="text-emerald-300" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-4">择日</h2>
        <p className="text-amber-400/50 text-sm mt-2">
          建除十二神 · 黄道黑道 · 月破冲肖，择吉而行
        </p>
      </motion.div>

      {/* Purpose */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20 space-y-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <p className="text-amber-300 text-sm">择何事</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PURPOSES.map(p => (
            <button
              key={p.id}
              onClick={() => setPurposeId(p.id)}
              className={`py-2.5 rounded-xl border text-sm transition-all ${
                purposeId === p.id
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-amber-100'
                  : 'bg-ink-black/60 border-imperial-red/15 text-amber-400/60 hover:border-imperial-red/30'
              }`}
            >
              {p.name}
              <span className="block text-[10px] text-amber-400/40 mt-0.5">{p.desc}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-amber-400/60 text-xs mb-1.5 block">年份</label>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50"
            >
              {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y} 年</option>)}
            </select>
          </div>
          <div>
            <label className="text-amber-400/60 text-xs mb-1.5 block">月份</label>
            <select
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m} 月</option>)}
            </select>
          </div>
          <div>
            <label className="text-amber-400/60 text-xs mb-1.5 block">避冲生肖（可选）</label>
            <select
              value={zodiac}
              onChange={e => setZodiac(e.target.value)}
              className="w-full px-3 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50"
            >
              <option value="">不限</option>
              {ZODIAC.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-amber-200 text-sm font-medium">
            <CalendarDays size={16} /> {year}年{month}月择日
          </h3>
          <div className="flex gap-2 text-[10px]">
            <span className="text-green-300">■ 大吉</span>
            <span className="text-emerald-300">■ 吉</span>
            <span className="text-amber-200">■ 平</span>
            <span className="text-red-300">■ 忌</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 mb-5">
          {WEEK_HEADER.map(w => (
            <div key={w} className="text-center text-amber-400/40 text-xs py-1">{w}</div>
          ))}
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(d => (
            <div
              key={d.date.getDate()}
              className={`rounded-lg border p-1.5 text-center ${gradeCell[d.grade]}`}
              title={`${d.date.getMonth() + 1}月${d.date.getDate()}日 · ${d.dayPillar} · ${d.jianChu}日 · ${d.note}`}
            >
              <p className="text-sm font-medium">{d.date.getDate()}</p>
              <p className="text-[10px] opacity-70">{d.jianChu}</p>
            </div>
          ))}
        </div>

        {/* Good days */}
        <h4 className="text-amber-300/80 text-xs font-medium mb-3">
          {purpose.name}吉日（本月 {goodDays.length} 天）
        </h4>
        {goodDays.length > 0 ? (
          <div className="space-y-2">
            {goodDays.map(d => (
              <div key={d.date.getDate()}
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  d.grade === '大吉' ? 'bg-green-500/[0.06] border-green-500/25' : 'bg-ink-black/60 border-emerald-500/15'
                }`}>
                <div className="text-center shrink-0 w-12">
                  <p className="text-amber-400/40 text-[10px]">{d.date.getMonth() + 1}月</p>
                  <p className="text-xl font-calligraphy text-amber-100 leading-tight">{d.date.getDate()}</p>
                  <p className="text-[10px] text-amber-400/40">周{'日一二三四五六'[d.date.getDay()]}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full border ${
                      d.grade === '大吉' ? 'text-green-300 bg-green-500/10 border-green-500/30' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
                    }`}>
                      {d.grade}
                    </span>
                    <span className="text-amber-200 text-sm">{d.dayPillar}日</span>
                    <span className="text-amber-400/50 text-xs">{d.jianChu}日（{d.shenName}）</span>
                    <span className="text-amber-400/40 text-xs ml-auto font-bold">{d.score} 分</span>
                  </div>
                  <p className="text-amber-400/40 text-xs mt-1">
                    农历 {d.lunarLabel} · {d.tags.join(' · ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-amber-400/40 text-xs text-center py-3">
            本月无吉日（如有避冲生肖可考虑取消或换月再择）
          </p>
        )}
      </motion.div>

      {/* Note */}
      <motion.div
        className="p-4 rounded-2xl bg-ink-black/60 border border-imperial-red/10 text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      >
        <p className="text-amber-400/30 text-[11px] leading-relaxed">
          择日以建除十二神、黄道黑道与月破冲肖为要，属传统民俗参考；时运在人，择日之外更重在谋事在人。
        </p>
      </motion.div>
    </div>
  );
}
