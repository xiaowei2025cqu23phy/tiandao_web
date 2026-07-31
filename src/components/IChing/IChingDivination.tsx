import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Coins, Hash, Clock, Wheat, Sparkles, Briefcase, Heart, TrendingUp } from 'lucide-react';
import type { LineType, DivinationResult, AIConfig, DivinationMethod } from '../../types';
import { getHexagramByBinary, getMutualHexagram, getInverseHexagram, getComplementHexagram } from '../../data/hexagrams';
import { augmentHexagram } from '../../data/nayin';
import { calcTiYong } from '../../data/tiyong';
import { getAIDivination } from '../../services/aiService';
import CoinToss from './CoinToss';
import HexagramDisplay from './HexagramDisplay';
import WuXingCycle from './WuXingCycle';
import TypingText from '../Common/TypingText';

interface Props { aiConfig: AIConfig; onSave: (r: DivinationResult) => void; selectedRecord: DivinationResult | null; }

type Phase = 'idle' | 'tossing' | 'result' | 'interpreting';

const METHODS: { id: DivinationMethod; icon: React.ReactNode; label: string; desc: string }[] = [
  { id: 'coin', icon: <Coins size={16} />, label: '铜钱卦', desc: '三枚铜钱，六掷成卦' },
  { id: 'rice', icon: <Wheat size={16} />, label: '米卦', desc: '随手取数，灵动成卦' },
  { id: 'number', icon: <Hash size={16} />, label: '数字卦', desc: '自报三数，即刻起卦' },
  { id: 'time', icon: <Clock size={16} />, label: '时间卦', desc: '以当下时间起卦' },
];

function linesToBinary(lines: LineType[]): string {
  return lines.map(l => (l === 'yang' || l === 'old_yang') ? '1' : '0').join('');
}

// 八卦二进制（下→上），坤=000 ... 乾=111
const TRIGRAM_BINS = ['000', '001', '010', '011', '100', '101', '110', '111'];

/** 模块级构建结果：不依赖组件状态，纯逻辑（供事件回调调用） */
function buildDivinationResult(
  tossedLines: LineType[],
  method: DivinationMethod,
  question: string,
): DivinationResult | null {
  const bin = linesToBinary(tossedLines);
  const hex = getHexagramByBinary(bin);
  if (!hex) return null;

  const hasChanges = tossedLines.some(l => l === 'old_yang' || l === 'old_yin');
  const changedBin = tossedLines.map(l => {
    if (l === 'old_yang') return '0';
    if (l === 'old_yin') return '1';
    return (l === 'yang') ? '1' : '0';
  }).join('');

  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: Date.now(),
    question,
    method,
    originalLines: tossedLines,
    changedLines: hasChanges ? tossedLines.map(l => {
      if (l === 'old_yang') return 'yin';
      if (l === 'old_yin') return 'yang';
      return l;
    }) as LineType[] : tossedLines,
    hexagram: hex,
    relatingHexagram: hasChanges ? getHexagramByBinary(changedBin) : undefined,
    mutualHexagram: getMutualHexagram(hex),
    inverseHexagram: getInverseHexagram(hex),
    complementHexagram: getComplementHexagram(hex),
  };
}

export default function IChingDivination({ aiConfig, onSave, selectedRecord }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [method, setMethod] = useState<DivinationMethod | null>(null);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<DivinationResult | null>(null);
  const [aiText, setAiText] = useState('');
  const [aiAngle, setAiAngle] = useState('');
  const [loading, setLoading] = useState(false);
  const [num1, setNum1] = useState(''); const [num2, setNum2] = useState(''); const [num3, setNum3] = useState('');
  const [castError, setCastError] = useState('');

  // ── Number divination ──────────────────────────
  const handleNumberSubmit = () => {
    const a = parseInt(num1) || 0, b = parseInt(num2) || 0, c = parseInt(num3) || 0;
    if (!a || !b || !c) return;
    // 上卦=num1%8, 下卦=num2%8, 动爻=num3%6
    const up = TRIGRAM_BINS[a % 8];
    const lo = TRIGRAM_BINS[b % 8];
    const moving = c % 6; // 0-based, 0=初爻

    const bin = lo + up;
    // Convert to LineType array (all yang)
    const ll: LineType[] = bin.split('').map((ch, i) => {
      const isYang = ch === '1';
      return i === moving ? (isYang ? 'old_yang' : 'old_yin') : (isYang ? 'yang' : 'yin');
    });
    buildResult(ll, 'number');
  };

  // ── Time divination ──────────────────────────
  const handleTimeSubmit = () => {
    const now = new Date();
    const yr = now.getFullYear(), mo = now.getMonth() + 1, dy = now.getDate(), hr = now.getHours();
    const up = ((yr % 10 + mo) % 8);
    const lo = ((dy + hr) % 8);
    const moving = ((yr + mo + dy + hr) % 6);

    const upBin = TRIGRAM_BINS[up];
    const loBin = TRIGRAM_BINS[lo];
    const bin = loBin + upBin;
    const ll: LineType[] = bin.split('').map((ch, i) => {
      const isYang = ch === '1';
      return i === moving ? (isYang ? 'old_yang' : 'old_yin') : (isYang ? 'yang' : 'yin');
    });
    buildResult(ll, 'time');
  };

  // ── Rice divination ──────────────────────────
  const submitRice = (a: number, b: number, c: number) => {
    const up = TRIGRAM_BINS[a % 8];
    const lo = TRIGRAM_BINS[b % 8];
    const moving = c % 6;

    const bin = lo + up;
    const ll: LineType[] = bin.split('').map((ch, i) => {
      const isYang = ch === '1';
      return i === moving ? (isYang ? 'old_yang' : 'old_yin') : (isYang ? 'yang' : 'yin');
    });
    buildResult(ll, 'rice');
  };

  // ── Common result builder ─────────────────────
  const buildResult = (tossedLines: LineType[], m: DivinationMethod) => {
    const newResult = buildDivinationResult(tossedLines, m, question);
    if (!newResult) {
      setCastError('未收录该卦象数据（二进制 ' + linesToBinary(tossedLines) + '），请重新起卦');
      setPhase('idle');
      setResult(null);
      return;
    }
    setCastError('');
    setResult(newResult);
    setPhase('result');
  };

  // ── Coin toss → called by CoinToss component ──
  const handleTossComplete = (tossedLines: LineType[]) => {
    buildResult(tossedLines, 'coin');
  };

  // ── AI Interpretation ─────────────────────────
  const handleAIInterpret = async (angle: string) => {
    if (!result) return;
    setLoading(true);
    setPhase('interpreting');
    setAiText('');
    setAiAngle(angle);
    try {
      const h = augmentHexagram(result.hexagram);
      const rh = result.relatingHexagram ? augmentHexagram(result.relatingHexagram) : undefined;
      const changeInfo = rh
        ? `本卦：${h.nameCn}（${h.meaning}，${h.palace||''}属${h.element||''}），变卦：${rh.nameCn}（${rh.meaning}）`
        : '静卦，无变爻';

      const context = [
        `卦名：${h.nameCn}（${h.meaning}）`,
        h.palace ? `八宫：${h.palace}，属${h.element}，世在${['','初','二','三','四','五','上'][h.hostLine||0]}爻` : '',
        `卦辞：${h.judgment}`,
        h.tuan ? `彖传：${h.tuan}` : '',
        `大象：${h.description}`,
        `爻辞：${h.yaoLines.map(yl => `${yl.position}爻${yl.nayin||''}${yl.sixRelative||''}${yl.isHost?'世':''}${yl.isGuest?'应':''}：${yl.text}`).join('；')}`,
        h.specLine ? `${h.specLine}` : '',
        rh ? `变卦：${rh.nameCn}（${rh.meaning}）— 卦辞：${rh.judgment}` : '',
      ].filter(Boolean).join('\n');

      const text = await getAIDivination(aiConfig, result.question, `${h.nameCn}（${h.meaning}）`, context, `${changeInfo}\n解读角度：${angle}`);
      setAiText(text);
      onSave({ ...result, aiInterpretation: text });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '未知错误';
      setAiText(`⚠️ 解读失败：${msg}`);
    } finally { setLoading(false); }
  };

  const reset = () => { setPhase('idle'); setMethod(null); setResult(null); setAiText(''); setQuestion(''); setNum1(''); setNum2(''); setNum3(''); setCastError(''); };

  // ═══ RENDER ══════════════════════════════════

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Phase: Method Selection */}
      {phase === 'idle' && (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {castError && (
            <div className="max-w-md mx-auto px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
              ⚠️ {castError}
            </div>
          )}
          <div className="text-center">
            <h2 className="font-calligraphy text-3xl text-amber-100">易经占卜</h2>
            <p className="text-amber-400/50 text-sm mt-2">诚心默念所问之事 · 选择起卦方式</p>
          </div>

          {/* Question input */}
          <div className="max-w-md mx-auto">
            <textarea value={question} onChange={e => setQuestion(e.target.value)}
              placeholder="默念你的问题...（可选）"
              className="w-full px-4 py-3 h-20 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm placeholder:text-amber-400/30 focus:outline-none focus:border-imperial-red/50 resize-none transition-colors" />
          </div>

          {/* Method cards */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {METHODS.map(m => (
              <motion.button key={m.id}
                className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20 text-left hover:border-imperial-red/40 transition-all space-y-2 group"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMethod(m.id);
                  setPhase('tossing');
                  if (m.id === 'time') setTimeout(() => handleTimeSubmit(), 300);
                  if (m.id === 'rice') {
                    const a = Math.floor(Math.random() * 100) + 1;
                    const b = Math.floor(Math.random() * 100) + 1;
                    const c = Math.floor(Math.random() * 100) + 1;
                    setNum1(String(a)); setNum2(String(b)); setNum3(String(c));
                    setTimeout(() => submitRice(a, b, c), 300);
                  }
                }}>
                <div className="w-10 h-10 rounded-full bg-imperial-red/10 flex items-center justify-center text-amber-300 group-hover:text-amber-100 transition-colors">
                  {m.icon}
                </div>
                <div>
                  <h3 className="text-amber-200 text-sm font-medium">{m.label}</h3>
                  <p className="text-amber-400/40 text-xs mt-0.5">{m.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Phase: Tossing */}
      {phase === 'tossing' && method && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {method === 'coin' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-amber-200/80 text-sm">每摇一次出三枚铜钱，共六次成一卦</p>
              </div>
              <CoinToss onComplete={handleTossComplete} />
            </div>
          )}
          {method === 'number' && (
            <div className="max-w-xs mx-auto space-y-4 p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
              <h3 className="text-center text-amber-200 text-sm font-medium">报三个数字 (1-99)</h3>
              <div className="flex gap-3">
                <input value={num1} onChange={e => setNum1(e.target.value)}
                  placeholder="上卦" maxLength={2} className="w-full px-3 py-3 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-center text-lg font-calligraphy focus:outline-none focus:border-imperial-red/50" />
                <input value={num2} onChange={e => setNum2(e.target.value)}
                  placeholder="下卦" maxLength={2} className="w-full px-3 py-3 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-center text-lg font-calligraphy focus:outline-none focus:border-imperial-red/50" />
                <input value={num3} onChange={e => setNum3(e.target.value)}
                  placeholder="动爻" maxLength={2} className="w-full px-3 py-3 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-center text-lg font-calligraphy focus:outline-none focus:border-imperial-red/50" />
              </div>
              <motion.button onClick={handleNumberSubmit} disabled={!num1||!num2||!num3}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-imperial-red/80 to-imperial-red/60 text-amber-100 font-medium text-sm disabled:opacity-40"
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                🧮 起卦
              </motion.button>
            </div>
          )}
          {/* Time/Rice auto-triggered, show loading */}
          {(method === 'time' || method === 'rice') && (
            <div className="text-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-imperial-red/30 border-t-imperial-red" />
              <p className="text-amber-400/60 text-sm">正在起卦...</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Phase: Result */}
      {(phase === 'result' || phase === 'interpreting') && result && (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Method badge */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-imperial-red/10 text-imperial-red/70 text-xs border border-imperial-red/20">
              {METHODS.find(m => m.id === result.method)?.label || '铜钱卦'} 起卦
            </span>
          </div>

          {/* Main Hexagram */}
          <HexagramDisplay hexagram={result.hexagram} lines={result.originalLines} label="本卦"
            changedLines={result.changedLines} />

          {/* 体用生克判断 */}
          {result && (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
                <h3 className="text-amber-300 text-xs font-medium mb-3 flex items-center gap-2">
                  <Sparkles size={14} /> 体用生克
                </h3>
                {(() => {
                  const ty = calcTiYong(result.hexagram, result.originalLines);
                  const vColors: Record<string,string> = {'大吉':'text-green-400','小吉':'text-emerald-400','平稳':'text-amber-400','小凶':'text-orange-400','凶':'text-red-400'};
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-400/50">体卦：</span>
                        <span className="text-amber-200">{ty.hostTrigram}({ty.hostElement})</span>
                        <span className="text-amber-400/30 text-[10px]">主方</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-400/50">用卦：</span>
                        <span className="text-amber-200">{ty.guestTrigram}({ty.guestElement})</span>
                        <span className="text-amber-400/30 text-[10px]">客方</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-400/50">关系：</span>
                        <span className="text-amber-200">{ty.relation}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-400/50 text-xs">判断：</span>
                        <span className={`text-sm font-bold ${vColors[ty.verdict] || 'text-amber-400'}`}>{ty.verdict}</span>
                      </div>
                      <p className="text-amber-400/50 text-xs leading-relaxed">{ty.detail}</p>
                      <p className="text-amber-400/30 text-[10px] italic">{ty.evolution}</p>
                    </div>
                  );
                })()}
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.05] to-ink-black/50 border border-imperial-red/20">
                <WuXingCycle />
              </div>
            </motion.div>
          )}

          {/* Hexagram Chain: 变卦 + 互卦 + 综卦 + 错卦 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {result.relatingHexagram && (
              <motion.div className="p-3 rounded-xl bg-imperial-red/[0.05] border border-imperial-red/20 text-center"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <p className="text-amber-400/40 text-[10px] mb-1">变卦</p>
                <p className="text-2xl">{result.relatingHexagram.unicode}</p>
                <p className="text-amber-200 text-xs mt-1">{result.relatingHexagram.nameCn}</p>
                <p className="text-amber-400/40 text-[10px] mt-0.5 line-clamp-2">{result.relatingHexagram.judgment}</p>
              </motion.div>
            )}
            {result.mutualHexagram && (
              <motion.div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-center"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                <p className="text-amber-400/40 text-[10px] mb-1">互卦</p>
                <p className="text-2xl">{result.mutualHexagram.unicode}</p>
                <p className="text-amber-200 text-xs mt-1">{result.mutualHexagram.nameCn}</p>
              </motion.div>
            )}
            {result.inverseHexagram && (
              <motion.div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20 text-center"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                <p className="text-amber-400/40 text-[10px] mb-1">综卦</p>
                <p className="text-2xl">{result.inverseHexagram.unicode}</p>
                <p className="text-amber-200 text-xs mt-1">{result.inverseHexagram.nameCn}</p>
              </motion.div>
            )}
            {result.complementHexagram && (
              <motion.div className="p-3 rounded-xl bg-purple-500/[0.05] border border-purple-500/20 text-center"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-amber-400/40 text-[10px] mb-1">错卦</p>
                <p className="text-2xl">{result.complementHexagram.unicode}</p>
                <p className="text-amber-200 text-xs mt-1">{result.complementHexagram.nameCn}</p>
              </motion.div>
            )}
          </div>

          {/* AI Interpretation */}
          {phase === 'interpreting' && (
            <motion.div className="p-6 rounded-2xl bg-gradient-to-b from-imperial-red/[0.08] to-ink-black/50 border border-imperial-red/20"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-calligraphy text-xl text-amber-100 text-center mb-4">
                {aiAngle || '天机'}解读
              </h3>
              {loading ? (
                <div className="text-center py-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="w-8 h-8 mx-auto mb-2 rounded-full border-2 border-imperial-red/30 border-t-imperial-red" />
                  <p className="text-amber-400/50 text-sm">天机子正在参悟卦象...</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-ink-black/60 border border-imperial-red/10">
                  <TypingText key={aiText} text={aiText} speed={20} />
                </div>
              )}
            </motion.div>
          )}

          {/* Multi-angle AI Buttons */}
          {phase === 'result' && (
            <div className="space-y-3">
              <p className="text-amber-400/40 text-xs text-center">AI 大师解读</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { angle:'综合运势', icon:<Sparkles size={14} />, color:'from-imperial-red/80 to-imperial-red/60', label:'综合运势' },
                  { angle:'事业前程', icon:<Briefcase size={14} />, color:'from-blue-500/80 to-blue-600/60', label:'事业前程' },
                  { angle:'情感婚姻', icon:<Heart size={14} />, color:'from-pink-500/80 to-pink-600/60', label:'情感婚姻' },
                  { angle:'财运求财', icon:<TrendingUp size={14} />, color:'from-amber-500/80 to-amber-600/60', label:'财运求财' },
                ].map(a => (
                  <motion.button key={a.angle}
                    onClick={() => handleAIInterpret(a.angle)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r ${a.color} text-white font-medium text-sm hover:opacity-90 transition-all border border-white/10`}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {a.icon} {a.label}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center">
                <motion.button onClick={reset}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-ink-black/60 border border-imperial-red/20 text-amber-400/70 font-medium text-sm hover:border-imperial-red/40"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <RotateCcw size={14} /> 重新起卦
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Show loaded record */}
      {selectedRecord && phase === 'idle' && (
        <div className="space-y-4">
          <HexagramDisplay hexagram={selectedRecord.hexagram} lines={selectedRecord.originalLines} label="历史记录" />
          {selectedRecord.aiInterpretation && (
            <div className="p-4 rounded-xl bg-ink-black/60 border border-imperial-red/10">
              <p className="text-amber-400/70 text-sm leading-relaxed">{selectedRecord.aiInterpretation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
