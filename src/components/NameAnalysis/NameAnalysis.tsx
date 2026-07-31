import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Hash, Sparkles, Briefcase, Heart } from 'lucide-react';
import { analyzeName } from '../../data/nameAnalysis';
import type { NameAnalysis as NameAnalysisType } from '../../data/nameAnalysis';

export default function NameAnalysisPage() {
  const [surname, setSurname] = useState('');
  const [given, setGiven] = useState('');
  const [result, setResult] = useState<NameAnalysisType | null>(null);

  const handleAnalyze = () => {
    if (!surname || !given) return;
    setResult(analyzeName(surname, given));
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-500/30 border border-emerald-500/20 flex items-center justify-center">
          <User size={28} className="text-emerald-300" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-3">姓名分析</h2>
        <p className="text-amber-400/50 text-sm mt-2">五格剖象法 — 输入姓名查看格局运势</p>
      </motion.div>

      {/* Form */}
      <motion.div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20 space-y-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-amber-300 text-sm mb-2 block">姓氏</label>
            <input value={surname} onChange={e => setSurname(e.target.value)} maxLength={2}
              placeholder="张 / 欧阳"
              className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-center text-lg font-calligraphy focus:outline-none focus:border-imperial-red/50" />
          </div>
          <div>
            <label className="text-amber-300 text-sm mb-2 block">名字</label>
            <input value={given} onChange={e => setGiven(e.target.value)} maxLength={2}
              placeholder="三丰"
              className="w-full px-4 py-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-center text-lg font-calligraphy focus:outline-none focus:border-imperial-red/50" />
          </div>
        </div>
        <motion.button
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500/80 to-cyan-500/80 text-white font-medium text-sm hover:from-emerald-500 hover:to-cyan-500 transition-all disabled:opacity-40"
          onClick={handleAnalyze} disabled={!surname || !given}
          whileHover={surname && given ? { scale: 1.01 } : {}}
          whileTap={surname && given ? { scale: 0.99 } : {}}
        >
          🔮 分析姓名
        </motion.button>
      </motion.div>

      {result && (
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Name Header */}
          <div className="text-center p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <p className="text-3xl font-calligraphy text-amber-100">{result.surname}{result.given}</p>
            <p className="text-amber-400/40 text-sm mt-1">
              笔画: 姓{result.strokes.surname} + 名{result.strokes.given1}{result.strokes.given2 > 0 ? `+${result.strokes.given2}` : ''}
            </p>
          </div>

          {result.warning && (
            <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300/90 text-xs text-center">
              ⚠️ {result.warning}
            </div>
          )}

          {/* Five Grids */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-3">
              <Hash size={16} /> 五格剖象
            </h3>
            <div className="space-y-2">
              {result.grids.map((g, i) => (
                <motion.div key={g.name} className="flex items-center gap-3 p-2 rounded-lg bg-ink-black/40 border border-imperial-red/10"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="w-12 text-center">
                    <div className="text-amber-200 text-sm font-medium">{g.name}</div>
                    <div className="text-amber-400/40 text-[10px]">{g.wuxing}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-200 text-lg font-bold">{g.value}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                        g.fortune === '吉'
                          ? 'text-green-300 bg-green-500/10 border-green-500/25'
                          : g.fortune === '半吉'
                            ? 'text-amber-300 bg-amber-500/10 border-amber-500/25'
                            : 'text-red-300 bg-red-500/10 border-red-500/25'
                      }`}>
                        {g.fortune}
                      </span>
                    </div>
                    <div className="text-amber-400/50 text-xs leading-relaxed">{g.meaning}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* San Cai */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-3">
              <Sparkles size={16} /> 三才配置
            </h3>
            <div className="flex items-center justify-center gap-3 text-sm">
              <div className="text-center">
                <p className="text-amber-400/40 text-[10px]">天格</p>
                <p className="text-amber-200">{result.sanCai.tian}</p>
              </div>
              <span className="text-amber-400/40 text-xs">{result.sanCai.relations[0]}</span>
              <div className="text-center">
                <p className="text-amber-400/40 text-[10px]">人格</p>
                <p className="text-amber-200">{result.sanCai.ren}</p>
              </div>
              <span className="text-amber-400/40 text-xs">{result.sanCai.relations[1]}</span>
              <div className="text-center">
                <p className="text-amber-400/40 text-[10px]">地格</p>
                <p className="text-amber-200">{result.sanCai.di}</p>
              </div>
            </div>
            <p className="text-amber-400/50 text-xs text-center mt-3 leading-relaxed">{result.sanCai.comment}</p>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
            <h3 className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-3">
              <Sparkles size={16} /> 综合评定
            </h3>
            <div className="text-center">
              <p className={`text-3xl font-bold ${
                result.total.score >= 85 ? 'text-green-400' : result.total.score >= 70 ? 'text-amber-400' : 'text-amber-200'
              }`}>
                {result.total.score} 分
              </p>
              <p className="text-amber-300/80 text-sm mt-1">{result.total.comment}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10 text-center">
                <Heart size={14} className="text-red-400/60 mx-auto mb-1" />
                <p className="text-amber-400/40 text-xs">幸运色</p>
                <p className="text-amber-200 text-sm">{result.total.lucky.join('、')}</p>
              </div>
              <div className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10 text-center">
                <Briefcase size={14} className="text-blue-400/60 mx-auto mb-1" />
                <p className="text-amber-400/40 text-xs">适合职业</p>
                <p className="text-amber-200 text-sm">{result.total.careers.slice(0, 3).join('、')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
