import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LineType } from '../../types';
import { yarrowLineSteps } from '../../data/castMethods';

interface Props { onComplete: (lines: LineType[]) => void }

const posLabels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
const lineEmoji: Record<LineType, string> = { yang: '▬▬▬', yin: '▬ ▬', old_yang: '▬▬▬○', old_yin: '▬ ▬✕' };
const VALUE_CN: Record<LineType, string> = {
  yang: '七 · 少阳', yin: '八 · 少阴', old_yang: '九 · 老阳（变）', old_yin: '六 · 老阴（变）',
};

interface StepData { line: LineType; changes: { start: number; removed: number; end: number }[] }

export default function YarrowDivination({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState<LineType[]>([]);
  const [animating, setAnimating] = useState(false);
  const [stage, setStage] = useState(-1); // -1=未开始，0-2=三变
  const [current, setCurrent] = useState<StepData | null>(null);

  const castOne = () => {
    if (animating || step >= 6) return;
    setAnimating(true);
    const data = yarrowLineSteps();
    setCurrent(data);
    setStage(0);
    setTimeout(() => setStage(1), 700);
    setTimeout(() => setStage(2), 1400);
    setTimeout(() => {
      setLines(prev => {
        const next = [...prev, data.line];
        if (next.length === 6) setTimeout(() => onComplete(next), 600);
        return next;
      });
      setStage(-1);
      setCurrent(null);
      setAnimating(false);
      setStep(s => s + 1);
    }, 2100);
  };

  const isChanging = (l: LineType) => l === 'old_yang' || l === 'old_yin';

  return (
    <div className="space-y-5 max-w-md mx-auto">
      {/* 大衍之数 */}
      <div className="p-4 rounded-xl bg-ink-black/50 border border-imperial-red/10 text-center">
        <p className="text-amber-300/80 text-xs leading-relaxed">
          「大衍之数五十，其用四十有九。分而为二以象两，挂一以象三，揲之以四以象四时，归奇于扐以象闰。」
        </p>
        <p className="text-amber-400/40 text-[10px] mt-2">——《周易·系辞上》</p>
      </div>

      {/* Progress */}
      <div className="text-center space-y-2">
        <p className="text-amber-400/60 text-sm">第 {Math.min(step + 1, 6)} / 6 爻</p>
        <div className="w-full bg-imperial-red/10 h-1.5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-imperial-red to-amber-500 rounded-full"
            animate={{ width: `${(step / 6) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* 三变过程 */}
      <div className="min-h-[120px] flex flex-col justify-center items-center gap-2 py-2">
        {current && stage >= 0 ? (
          <div className="w-full space-y-2">
            {current.changes.map((c, i) => (
              <motion.div
                key={i}
                className={`px-4 py-2 rounded-xl border text-center text-xs transition-colors ${
                  stage >= i
                    ? 'bg-imperial-red/[0.08] border-imperial-red/25 text-amber-200'
                    : 'bg-ink-black/40 border-imperial-red/[0.08] text-amber-400/30'
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {['一变', '二变', '三变'][i]}：{c.start} 策 → 分二挂一揲四 → 归奇 {c.removed} 策，余 {c.end} 策
              </motion.div>
            ))}
            {stage === 2 && (
              <motion.p className="text-center text-amber-300 text-sm pt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {current.changes[2].end / 4} 策为爻，得 {VALUE_CN[current.line]}
              </motion.p>
            )}
          </div>
        ) : (
          <p className="text-amber-400/30 text-sm">点击下方布爻，三变成一爻</p>
        )}
      </div>

      {/* Accumulated lines (bottom-up) */}
      {lines.length > 0 && (
        <div className="flex justify-center">
          <div className="flex flex-col-reverse gap-1.5 min-w-[220px]">
            {lines.map((line, i) => (
              <motion.div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded bg-ink-black/40 border border-imperial-red/10"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <span className="text-amber-400/40 text-xs w-6 text-right">{posLabels[i]}</span>
                <span className={`text-sm ${isChanging(line) ? 'text-imperial-red' : 'text-amber-200'}`}>
                  {lineEmoji[line]}
                </span>
                {isChanging(line) && <span className="text-imperial-red text-[10px]">变爻</span>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Cast button */}
      {step < 6 && (
        <div className="text-center">
          <motion.button onClick={castOne} disabled={animating}
            className="w-48 py-3 rounded-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-amber-900 font-medium text-sm shadow-lg disabled:opacity-40 hover:from-amber-500 hover:to-amber-600 transition-all"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {animating ? '布爻中...' : `布第 ${step + 1} 爻`}
          </motion.button>
          <p className="text-amber-400/30 text-xs mt-2">每爻三变，共十八变成一卦</p>
        </div>
      )}
    </div>
  );
}
