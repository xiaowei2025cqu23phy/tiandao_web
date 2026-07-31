import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { LineType, Hexagram } from '../../types';
import { augmentHexagram } from '../../data/nayin';

interface HexagramDisplayProps {
  hexagram: Hexagram;
  lines: LineType[];
  label: string;
  changedLines?: LineType[];
}

export default function HexagramDisplay({ hexagram, lines, label, changedLines }: HexagramDisplayProps) {
  const h = useMemo(() => augmentHexagram(hexagram), [hexagram]);
  const displayLines = [...lines].reverse();

  return (
    <motion.div
      className="bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 rounded-2xl border border-imperial-red/20 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-4">
        <span className="text-5xl">{h.unicode}</span>
        <h3 className="font-calligraphy text-2xl text-amber-100 mt-2">
          {h.nameCn} · {h.name}
        </h3>
        <p className="text-amber-400/50 text-sm mt-1">{h.meaning}</p>
        <span className="inline-block mt-2 px-3 py-0.5 text-xs rounded-full bg-imperial-red/10 text-imperial-red border border-imperial-red/20">
          {label}
        </span>
      </div>

      {/* Hexagram visualization */}
      <div className="flex justify-center">
        <div className="flex flex-col gap-1.5 py-4">
          {displayLines.map((line, index) => {
            const actualIndex = lines.length - 1 - index;
            const isChanging = line === 'old_yang' || line === 'old_yin';
            const isYang = line === 'yang' || line === 'old_yang';
            const changed = changedLines?.[actualIndex];
            const showChanged = changed && (changed !== line);

            return (
              <motion.div
                key={index}
                className="flex items-center gap-3 group"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <span className="text-amber-400/30 text-xs w-4 text-right">
                  {displayLines.length - index}
                </span>
                <div className="flex gap-1.5">
                  {isYang ? (
                    <>
                      <div className={`h-1.5 w-10 sm:w-14 rounded-full transition-all duration-500 ${
                        isChanging
                          ? 'bg-gradient-to-r from-imperial-red via-amber-400 to-imperial-red'
                          : 'bg-amber-400'
                      }`} />
                      <div className={`h-1.5 w-10 sm:w-14 rounded-full transition-all duration-500 ${
                        isChanging
                          ? 'bg-gradient-to-r from-imperial-red via-amber-400 to-imperial-red'
                          : 'bg-amber-400'
                      }`} />
                    </>
                  ) : (
                    <div className={`h-1.5 w-[88px] sm:w-[124px] rounded-full transition-all duration-500 ${
                      isChanging
                        ? 'bg-gradient-to-r from-imperial-red via-amber-400 to-imperial-red'
                        : 'bg-amber-400'
                    }`} />
                  )}
                </div>
                {isChanging && (
                  <motion.span
                    className="text-imperial-red text-[10px]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ● 变
                  </motion.span>
                )}
                {showChanged && changed && (
                  <motion.span
                    className="text-amber-400/60 text-[10px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    → {(changed === 'yang' || changed === 'old_yang') ? '阳' : '阴'}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 卦辞 */}
      <motion.div className="mt-4 p-4 rounded-xl bg-ink-black/50 border border-imperial-red/10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <h4 className="text-amber-300 text-xs font-medium mb-2 text-center tracking-wider">卦辞</h4>
        <p className="text-amber-300/80 text-sm leading-relaxed text-center font-sans italic">
          "{h.judgment}"
        </p>
        <p className="text-amber-400/50 text-xs text-center mt-2 font-sans">
          {h.description}
        </p>
      </motion.div>

      {/* 彖传 */}
      {h.tuan && (
        <motion.div className="mt-3 p-4 rounded-xl bg-ink-black/50 border border-imperial-red/10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <h4 className="text-amber-300 text-xs font-medium mb-2 tracking-wider">彖曰</h4>
          <p className="text-amber-400/60 text-xs leading-relaxed">{h.tuan}</p>
        </motion.div>
      )}

      {/* 筮法属性: 八宫·世应·纳甲·六亲 */}
      {h.palace && (
        <motion.div className="mt-3 p-3 rounded-xl bg-ink-black/50 border border-imperial-red/10 grid grid-cols-4 gap-2 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <div><span className="text-amber-400/40 text-[10px]">八宫</span><p className="text-amber-200 text-xs">{h.palace}</p></div>
          <div><span className="text-amber-400/40 text-[10px]">五行</span><p className="text-amber-200 text-xs">{h.element}</p></div>
          <div><span className="text-amber-400/40 text-[10px]">世爻</span><p className="text-amber-200 text-xs">{h.hostLine ? ['','初','二','三','四','五','上'][h.hostLine]+'爻' : '—'}</p></div>
          <div><span className="text-amber-400/40 text-[10px]">应爻</span><p className="text-amber-200 text-xs">{h.guestLine ? ['','初','二','三','四','五','上'][h.guestLine]+'爻' : '—'}</p></div>
        </motion.div>
      )}

      {/* 六爻 */}
      {h.yaoLines.length > 0 && (
        <motion.div className="mt-3 space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <h4 className="text-amber-300 text-xs font-medium mb-2 text-center tracking-wider">六爻爻辞</h4>
          {h.yaoLines.map(yl => (
            <div key={yl.position} className={`p-2 rounded-lg border ${yl.isHost ? 'bg-imperial-red/[0.12] border-imperial-red/30' : yl.isGuest ? 'bg-amber-500/[0.08] border-amber-500/20' : 'bg-ink-black/40 border-imperial-red/[0.08]'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-imperial-red/70 text-xs font-medium min-w-[2em]">{yl.position}</span>
                {yl.nayin && <span className="text-amber-400/50 text-[10px] min-w-[3em]">{yl.nayin}</span>}
                {yl.sixRelative && <span className="text-emerald-400/60 text-[10px] min-w-[2em]">{yl.sixRelative}</span>}
                {yl.isHost && <span className="text-imperial-red text-[10px] font-bold">世</span>}
                {yl.isGuest && <span className="text-amber-300 text-[10px] font-bold">应</span>}
                <span className="text-amber-300/80 text-xs flex-1">{yl.text}</span>
              </div>
              {yl.xiang && (
                <p className="text-amber-400/30 text-[10px] mt-0.5 ml-10">象：{yl.xiang}</p>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* 用九/用六 */}
      {h.specLine && (
        <motion.div className="mt-3 p-3 rounded-xl bg-imperial-red/[0.08] border border-imperial-red/20 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
          <span className="text-amber-200/80 text-xs italic">{h.specLine}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
