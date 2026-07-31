import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Heart, Users } from 'lucide-react';
import { zodiacMarriage, ZODIAC, LIUHE_PAIRS } from '../../data/marriage';

const SANHE_GROUPS = ['申子辰', '寅午戌', '巳酉丑', '亥卯未'];

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-300';
  return 'text-red-400';
}

function scoreBar(score: number): string {
  if (score >= 80) return 'from-green-500/80 to-emerald-500/60';
  if (score >= 60) return 'from-amber-500/80 to-amber-600/60';
  return 'from-red-500/80 to-rose-600/60';
}

export default function MarriageCalculator() {
  const [zodiacA, setZodiacA] = useState('鼠');
  const [zodiacB, setZodiacB] = useState('牛');
  const result = zodiacMarriage(zodiacA, zodiacB);

  const relationColor: Record<string, string> = {
    '六合': 'bg-green-500/10 border-green-500/30 text-green-300',
    '三合': 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    '六冲': 'bg-red-500/10 border-red-500/30 text-red-300',
    '六害': 'bg-orange-500/10 border-orange-500/30 text-orange-300',
    '相刑': 'bg-red-600/10 border-red-600/30 text-red-300',
    '同肖': 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    '平': 'bg-ink-black/60 border-imperial-red/20 text-amber-300',
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Header */}
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-500/30 to-imperial-red/30 border border-pink-500/20 flex items-center justify-center">
          <HeartHandshake size={32} className="text-pink-300/80" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-4">生肖合婚</h2>
        <p className="text-amber-400/50 text-sm mt-2">
          六合 · 三合 · 六冲 · 六害 · 相刑，观属相而知姻缘
        </p>
      </motion.div>

      {/* Selectors */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: '一方生肖', value: zodiacA, set: setZodiacA },
            { label: '另一方生肖', value: zodiacB, set: setZodiacB },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
                <Users size={16} />
                {label}
              </label>
              <select
                value={value}
                onChange={e => set(e.target.value)}
                className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-imperial-red/50 transition-colors"
              >
                {ZODIAC.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Result */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center gap-6 mb-5">
          {[zodiacA, zodiacB].map((z, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-imperial-red/20 border border-pink-500/20 flex items-center justify-center">
                <span className="font-calligraphy text-2xl text-amber-100">{z}</span>
              </div>
              <p className="text-amber-400/40 text-xs mt-1.5">{i === 0 ? '一方' : '另一方'}</p>
            </div>
          ))}
          <Heart size={22} className="text-pink-400/70" />
        </div>

        <div className="text-center">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm border ${relationColor[result.relation] || relationColor['平']}`}>
            {result.relation}
          </span>
          <p className={`font-calligraphy text-4xl mt-4 ${scoreColor(result.score)}`}>
            {result.score}
            <span className="text-base text-amber-400/40"> 分</span>
          </p>
          <div className="max-w-xs mx-auto mt-3 h-2.5 bg-ink-black/80 rounded-full overflow-hidden border border-imperial-red/10">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${scoreBar(result.score)}`}
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-2 text-center">
          <p className="text-amber-200 text-sm">{result.comment}</p>
          <p className="text-amber-400/60 text-xs">{result.wuxing}</p>
          <p className="text-amber-400/50 text-xs leading-relaxed">{result.advice}</p>
        </div>
      </motion.div>

      {/* Reference */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-4">婚配参考</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-green-500/[0.05] border border-green-500/20">
            <p className="text-green-400 text-xs font-medium mb-2">六合上等婚</p>
            <p className="text-amber-200">{LIUHE_PAIRS.join('、')}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
            <p className="text-emerald-400 text-xs font-medium mb-2">三合吉配</p>
            <p className="text-amber-200">{SANHE_GROUPS.map(g => g.split('').join('·')).join('　')}</p>
          </div>
        </div>
        <p className="text-amber-400/30 text-[11px] text-center mt-4">
          合婚仅为传统民俗参考，姻缘终在人心经营，莫以生肖论定终身。
        </p>
      </motion.div>
    </div>
  );
}
