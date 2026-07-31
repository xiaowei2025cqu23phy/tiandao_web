import { useState } from 'react';
import { motion } from 'framer-motion';

const WX = [
  { name:'金', color:'#fbbf24', angle:-90, label:'金' },
  { name:'水', color:'#60a5fa', angle:-162, label:'水' },
  { name:'木', color:'#34d399', angle:126, label:'木' },
  { name:'火', color:'#f87171', angle:54, label:'火' },
  { name:'土', color:'#c084fc', angle:-18, label:'土' },
];

const cx = 150, cy = 150, r = 100;

export default function WuXingCycle({ highlight }: { highlight?: string }) {
  const [active, setActive] = useState('');

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-calligraphy text-xl text-amber-100 mb-2">五行生克</h3>
      <p className="text-amber-400/40 text-xs mb-3">
        {active ? `选中：${active}` : '点击元素查看生克关系'}
      </p>
      <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
        {/* Outer circle */}
        <circle cx={cx} cy={cy} r={r+12} fill="none" stroke="rgba(139,30,30,0.15)" strokeWidth="1" />

        {/* Generate lines: 生 (clockwise pentagram) */}
        {WX.map((_, i) => (
          <line key={`sheng-${i}`}
            x1={cx + r * Math.cos((WX[i].angle * Math.PI) / 180)}
            y1={cy + r * Math.sin((WX[i].angle * Math.PI) / 180)}
            x2={cx + r * Math.cos((WX[(i+1)%5].angle * Math.PI) / 180)}
            y2={cy + r * Math.sin((WX[(i+1)%5].angle * Math.PI) / 180)}
            stroke="rgba(52,211,153,0.2)" strokeWidth="1" strokeDasharray="4 2" />
        ))}
        {/* 克 lines: every-other */}
        {WX.map((_, i) => (
          <line key={`ke-${i}`}
            x1={cx + r * Math.cos((WX[i].angle * Math.PI) / 180)}
            y1={cy + r * Math.sin((WX[i].angle * Math.PI) / 180)}
            x2={cx + r * Math.cos((WX[(i+2)%5].angle * Math.PI) / 180)}
            y2={cy + r * Math.sin((WX[(i+2)%5].angle * Math.PI) / 180)}
            stroke="rgba(248,113,113,0.15)" strokeWidth="1" />
        ))}

        {/* Center label */}
        <text x={cx} y={cy-5} textAnchor="middle" fill="rgba(245,230,211,0.15)" fontSize="10">五行</text>

        {/* Nodes */}
        {WX.map(w => {
          const h = active === w.name || highlight === w.name;
          return (
            <g key={w.name} onClick={() => setActive(active === w.name ? '' : w.name)}
              className="cursor-pointer">
              {h && <motion.circle cx={cx + r * Math.cos((w.angle*Math.PI)/180)} cy={cy + r * Math.sin((w.angle*Math.PI)/180)} r={22} fill={w.color} opacity={0.1}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} />}
              <circle cx={cx + r * Math.cos((w.angle*Math.PI)/180)} cy={cy + r * Math.sin((w.angle*Math.PI)/180)}
                r={h ? 18 : 14} fill={h ? w.color : '#1a1a1a'}
                stroke={w.color} strokeWidth={h ? 2 : 1} opacity={h ? 1 : 0.6} />
              <text x={cx + r * Math.cos((w.angle*Math.PI)/180)} y={cy + r * Math.sin((w.angle*Math.PI)/180)+4}
                textAnchor="middle" fill={h ? '#1a1a1a' : w.color} fontSize="12" fontWeight="bold">{w.label}</text>
            </g>
          );
        })}

        {/* Legend */}
        <text x={15} y={280} fill="rgba(52,211,153,0.4)" fontSize="9">── 相生</text>
        <text x={80} y={280} fill="rgba(248,113,113,0.4)" fontSize="9">── 相克</text>
      </svg>
    </div>
  );
}
