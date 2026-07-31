import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Clock, X } from 'lucide-react';
import type { DivinationResult } from '../../types';
import { hexagrams } from '../../data/hexagrams';

interface HistoryPanelProps {
  records: DivinationResult[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (record: DivinationResult) => void;
  onClear: () => void;
}

export default function HistoryPanel({ records, isOpen, onClose, onSelect, onClear }: HistoryPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-80 border-l border-imperial-red/20 bg-gradient-to-b from-[#2a1f1a] to-[#1a1410] shadow-2xl"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-imperial-red/20">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-400/60" />
                <h3 className="font-calligraphy text-lg text-amber-100">历史记录</h3>
              </div>
              <div className="flex items-center gap-2">
                {records.length > 0 && (
                  <button onClick={onClear} className="text-amber-400/40 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                )}
                <button onClick={onClose} className="text-amber-400/60 hover:text-amber-300 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-57px)] p-4 space-y-3">
              {records.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-amber-400/30 text-sm">暂无记录</p>
                  <p className="text-amber-400/20 text-xs mt-1">占卜后记录将显示在此处</p>
                </div>
              ) : (
                [...records].reverse().map((record) => {
                  const h = hexagrams.find(hx => hx.number === record.hexagram.number);
                  return (
                    <motion.button
                      key={record.id}
                      className="w-full text-left p-3 rounded-xl border border-imperial-red/10 hover:border-imperial-red/30 bg-imperial-red/[0.03] hover:bg-imperial-red/[0.08] transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(record)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{h?.unicode || '☰'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-amber-200 text-sm font-medium truncate">
                            {h?.nameCn} · {h?.name}
                          </p>
                          <p className="text-amber-400/40 text-xs truncate mt-0.5">
                            {record.question || '无问题'}
                          </p>
                        </div>
                      </div>
                      <p className="text-amber-400/30 text-[10px] mt-1.5">
                        {new Date(record.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
