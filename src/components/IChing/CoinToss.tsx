import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { CoinFace, LineType } from '../../types';

interface Props { onComplete: (lines: LineType[]) => void }

function tossCoin(): CoinFace { return Math.random() < 0.5 ? 'front' : 'back'; }

function determineLine(coins: CoinFace[]): LineType {
  const heads = coins.filter(c => c === 'front').length;
  if (heads === 3) return 'old_yang';   // 老阳 ●
  if (heads === 0) return 'old_yin';    // 老阴 ✕
  if (heads === 2) return 'yang';       // 少阳 —
  return 'yin';                          // 少阴 - -
}

const posLabels = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
const lineEmoji: Record<LineType, string> = { yang: '▬▬▬', yin: '▬ ▬', old_yang: '▬▬▬○', old_yin: '▬ ▬✕' };

export default function CoinToss({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [lines, setLines] = useState<LineType[]>([]);
  const [animating, setAnimating] = useState(false);
  const [lastCoinResult, setLastCoinResult] = useState<CoinFace[] | null>(null);

  const tossOne = useCallback(() => {
    if (animating || step >= 6) return;
    setAnimating(true);
    const results: CoinFace[] = [tossCoin(), tossCoin(), tossCoin()];

    setTimeout(() => {
      const line = determineLine(results);
      setLines(prev => {
        const next = [...prev, line];
        if (next.length === 6) setTimeout(() => onComplete(next), 500);
        return next;
      });
      setLastCoinResult(results);
      setAnimating(false);
      setStep(s => s + 1);
    }, 800);
  }, [step, animating, onComplete]);

  const isChanging = (l: LineType) => l === 'old_yang' || l === 'old_yin';

  return (
    <div className="space-y-5 max-w-md mx-auto">
      {/* Progress */}
      <div className="text-center space-y-2">
        <p className="text-amber-400/60 text-sm font-sans tracking-wider">
          第 {Math.min(step + 1, 6)} / 6 掷
        </p>
        <div className="w-full bg-imperial-red/10 h-1.5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-imperial-red to-amber-500 rounded-full"
            animate={{ width: `${(step / 6) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Coins display */}
      <div className="flex justify-center gap-5 py-4 min-h-[80px] items-center">
        {animating ? (
          [0, 1, 2].map(i => (
            <motion.div key={`anim-${step}-${i}`}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-amber-500/50 flex items-center justify-center shadow-lg"
              animate={{ rotateY: [0, 720], scale: [1, 1.1, 1] }} transition={{ duration: 0.7, ease: 'easeInOut' }}>
              <span className="text-amber-600/40 text-xs">◉</span>
            </motion.div>
          ))
        ) : lastCoinResult ? (
          lastCoinResult.map((face, i) => (
            <motion.div key={`done-${step - 1}-${i}`}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                face === 'front'
                  ? 'bg-gradient-to-br from-amber-200 to-amber-400 border-2 border-amber-500'
                  : 'bg-gradient-to-br from-gray-500 to-gray-700 border-2 border-gray-400'
              }`}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
              <span className={`text-sm font-bold ${face === 'front' ? 'text-amber-700' : 'text-gray-200'}`}>
                {face === 'front' ? '乾' : '坤'}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-amber-400/30 text-sm">点击下方按钮掷铜钱</p>
        )}
      </div>

      {/* Accumulated lines (bottom-up = 初在下) */}
      {lines.length > 0 && (
        <div className="flex justify-center">
          <div className="flex flex-col-reverse gap-1.5 min-w-[200px]">
            {lines.map((line, i) => (
              <motion.div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded bg-ink-black/40 border border-imperial-red/10"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <span className="text-amber-400/40 text-xs w-6 text-right">{posLabels[i]}</span>
                <span className={`text-sm ${isChanging(line) ? 'text-imperial-red' : 'text-amber-200'}`}>
                  {lineEmoji[line]}
                </span>
                {isChanging(line) && <span className="text-imperial-red text-[10px] font-medium">变爻</span>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Toss button */}
      {step < 6 && (
        <div className="text-center">
          <motion.button onClick={tossOne} disabled={animating}
            className="w-44 py-3 rounded-full bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-amber-900 font-medium text-sm shadow-lg disabled:opacity-40 hover:from-amber-500 hover:to-amber-600 transition-all"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {animating ? '摇动中...' : `掷第 ${step + 1} 次`}
          </motion.button>
          <p className="text-amber-400/30 text-xs mt-2">点击一次掷一回，共六次</p>
        </div>
      )}
    </div>
  );
}
