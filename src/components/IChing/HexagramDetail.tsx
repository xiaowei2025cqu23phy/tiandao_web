import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { hexagrams } from '../../data/hexagrams';
import Modal from '../Common/Modal';

export default function HexagramDetail() {
  const [selectedHexagram, setSelectedHexagram] = useState<typeof hexagrams[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = hexagrams.filter(h =>
    h.nameCn.includes(searchTerm) || h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.meaning.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-calligraphy text-xl text-amber-100">易理图解</h3>
        <p className="text-amber-400/40 text-sm mt-1">点击任一卦象查看详细解读</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xs mx-auto">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/40" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="搜索卦名..."
          className="w-full pl-9 pr-4 py-2 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm placeholder:text-amber-400/30 focus:outline-none focus:border-imperial-red/50 transition-colors"
        />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {filtered.map((h, i) => (
          <motion.button
            key={h.number}
            className="flex flex-col items-center gap-1 p-2 rounded-xl border border-imperial-red/10 bg-imperial-red/[0.03] hover:bg-imperial-red/[0.1] hover:border-imperial-red/30 transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedHexagram(h)}
          >
            <span className="text-xl sm:text-2xl">{h.unicode}</span>
            <span className="text-amber-200 text-xs font-medium">{h.nameCn}</span>
            <span className="text-amber-400/30 text-[10px]">{h.number}</span>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedHexagram}
        onClose={() => setSelectedHexagram(null)}
        title={selectedHexagram ? `${selectedHexagram.unicode} ${selectedHexagram.nameCn} · ${selectedHexagram.name}` : ''}
      >
        {selectedHexagram && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {/* Hexagram visual */}
            <div className="flex justify-center">
              <div className="flex flex-col gap-1 py-2">
                {selectedHexagram.binary.split('').reverse().map((bit, i) => (
                  <div key={i} className="flex justify-center">
                    {bit === '1' ? (
                      <div className="flex gap-1">
                        <div className="w-8 h-1.5 bg-amber-400 rounded-full" />
                        <div className="w-8 h-1.5 bg-amber-400 rounded-full" />
                      </div>
                    ) : (
                      <div className="w-[68px] h-1.5 bg-amber-400 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoCard label="卦序" value={`#${selectedHexagram.number}`} />
              <InfoCard label="二进制" value={selectedHexagram.binary} />
              <InfoCard label="上卦" value={selectedHexagram.upperTrigram} />
              <InfoCard label="下卦" value={selectedHexagram.lowerTrigram} />
              <div className="col-span-2">
                <InfoCard label="卦德" value={selectedHexagram.meaning} />
              </div>
            </div>

            {/* 卦辞 */}
            <div className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10">
              <h4 className="text-amber-300 text-xs font-medium mb-1 tracking-wider">卦辞</h4>
              <p className="text-amber-400/70 text-sm leading-relaxed italic">"{selectedHexagram.judgment}"</p>
            </div>

            {/* 彖传 */}
            {selectedHexagram.tuan && (
              <div className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10">
                <h4 className="text-amber-300 text-xs font-medium mb-1 tracking-wider">彖曰</h4>
                <p className="text-amber-400/50 text-xs leading-relaxed">{selectedHexagram.tuan}</p>
              </div>
            )}

            {/* 大象 */}
            <div className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10">
              <h4 className="text-amber-300 text-xs font-medium mb-1 tracking-wider">象曰</h4>
              <p className="text-amber-400/70 text-sm leading-relaxed">{selectedHexagram.description}</p>
            </div>

            {/* 六爻 */}
            {selectedHexagram.yaoLines.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-amber-300 text-xs font-medium tracking-wider">六爻爻辞</h4>
                {selectedHexagram.yaoLines.map(yl => (
                  <div key={yl.position} className="p-2 rounded-lg bg-ink-black/40 border border-imperial-red/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="text-imperial-red/70 text-xs font-medium min-w-[2em]">{yl.position}爻</span>
                      <span className="text-amber-300/80 text-xs flex-1">{yl.text}</span>
                    </div>
                    {yl.xiang && (
                      <p className="text-amber-400/25 text-[10px] mt-0.5 ml-6">象：{yl.xiang}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 用九/用六 */}
            {selectedHexagram.specLine && (
              <div className="p-3 rounded-xl bg-imperial-red/[0.08] border border-imperial-red/20 text-center">
                <span className="text-amber-200/80 text-xs italic">{selectedHexagram.specLine}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-ink-black/60 border border-imperial-red/10 text-center">
      <p className="text-amber-400/40 text-xs mb-1">{label}</p>
      <p className="text-amber-200 text-sm font-medium">{value}</p>
    </div>
  );
}
