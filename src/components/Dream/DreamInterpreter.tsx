import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sparkles, RefreshCw } from 'lucide-react';
import { searchDreams, getRandomDreams, dreamCategories } from '../../data/dreamDict';
import type { DreamEntry } from '../../data/dreamDict';

export default function DreamInterpreter() {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('全部');
  const [selected, setSelected] = useState<DreamEntry | null>(null);
  const [showRandom, setShowRandom] = useState<DreamEntry[]>([]);

  const results = useMemo(() => {
    const r = query ? searchDreams(query) : [];
    return selectedCat === '全部' ? r : r.filter(d => d.category === selectedCat);
  }, [query, selectedCat]);

  const handleRandom = () => {
    setShowRandom(getRandomDreams(3));
    setQuery('');
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400/30 to-indigo-500/30 border border-purple-500/20 flex items-center justify-center">
          <Moon size={28} className="text-purple-300" />
        </div>
        <h2 className="font-calligraphy text-3xl text-amber-100 mt-3">周公解梦</h2>
        <p className="text-amber-400/50 text-sm mt-2">搜索梦境关键词 · 解析隐藏寓意</p>
      </motion.div>

      {/* Search */}
      <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/40" />
          <input
            value={query} onChange={e => { setQuery(e.target.value); setShowRandom([]); }}
            placeholder="搜索梦见什么...（如：水、蛇、考试）"
            className="w-full pl-9 pr-4 py-3 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {dreamCategories.slice(0, 5).map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  selectedCat === cat ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-ink-black/60 text-amber-400/40 border border-imperial-red/10 hover:border-purple-500/20'
                }`}
              >{cat}</button>
            ))}
          </div>
          <button onClick={handleRandom}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-ink-black/60 text-amber-400/60 text-xs border border-imperial-red/10 hover:border-purple-500/30 transition-colors">
            <RefreshCw size={12} /> 随机梦境
          </button>
        </div>
      </motion.div>

      {/* Results */}
      <div className="space-y-3">
        {showRandom.length > 0 && !query && (
          <>
            <p className="text-amber-400/40 text-xs text-center">— 随机梦境 —</p>
            {showRandom.map((d, i) => (
              <motion.div key={d.keyword} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/[0.05] to-indigo-500/[0.05] border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                onClick={() => setSelected(d)}>
                <div className="flex items-center gap-2 mb-1">
                  <Moon size={14} className="text-purple-400" />
                  <span className="text-amber-200 font-medium">{d.keyword}</span>
                  <span className="text-amber-400/30 text-xs">{d.lucky}</span>
                </div>
                <p className="text-amber-400/60 text-sm line-clamp-2">{d.interpretation}</p>
              </motion.div>
            ))}
          </>
        )}

        {results.map((d, i) => (
          <motion.div key={d.keyword} className="p-4 rounded-xl bg-gradient-to-r from-purple-500/[0.05] to-indigo-500/[0.05] border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => setSelected(d)}>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-500/10 text-purple-400/60 border border-purple-500/20">{d.category}</span>
              <span className="text-amber-200 font-medium">{d.keyword}</span>
              <span className="text-amber-400/30 text-xs">{d.lucky}</span>
            </div>
            <p className="text-amber-400/60 text-sm line-clamp-2">{d.interpretation}</p>
          </motion.div>
        ))}

        {query && results.length === 0 && (
          <p className="text-amber-400/40 text-center text-sm py-8">未找到相关梦境，试试其他关键词</p>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelected(null)}>
          <motion.div className="max-w-md w-full p-6 rounded-2xl bg-gradient-to-b from-ink-black to-ink-black/95 border border-purple-500/30"
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Moon size={20} className="text-purple-300" />
              </div>
              <div>
                <h3 className="text-xl font-calligraphy text-amber-100">{selected.keyword}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400/60 text-xs">{selected.category}</span>
                  <span className="text-amber-400 text-xs">{selected.lucky}</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-ink-black/60 border border-purple-500/20 mb-4">
              <p className="text-amber-300/80 text-sm leading-relaxed">{selected.interpretation}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/[0.05] border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400/60" />
                <span className="text-amber-400/60 text-xs">梦境反映潜意识，仅供娱乐参考</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30 transition-colors">
              关闭
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
