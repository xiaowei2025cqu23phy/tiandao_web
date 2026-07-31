import { motion } from 'framer-motion';

// ═══ 河图 (He Tu) ═══
const HeTu = () => (
  <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
    {/* Center: 5+10 */}
    <circle cx={150} cy={150} r={18} fill="#c084fc22" stroke="#c084fc44" strokeWidth="1" />
    <text x={150} y={145} textAnchor="middle" fill="#c084fc" fontSize="10">五</text>
    <text x={150} y={158} textAnchor="middle" fill="#c084fc66" fontSize="8">土</text>

    {/* North: 1+6 (水) */}
    <g transform="translate(150,60)" className="text-center">
      <circle r={14} fill="#60a5fa22" stroke="#60a5fa44" strokeWidth="1" />
      <text y={4} textAnchor="middle" fill="#60a5fa" fontSize="10">一 六</text>
      <text y={15} textAnchor="middle" fill="#60a5fa66" fontSize="8">水</text>
    </g>
    {/* South: 2+7 (火) */}
    <g transform="translate(150,240)">
      <circle r={14} fill="#f8717122" stroke="#f8717144" strokeWidth="1" />
      <text y={4} textAnchor="middle" fill="#f87171" fontSize="10">二 七</text>
      <text y={15} textAnchor="middle" fill="#f8717166" fontSize="8">火</text>
    </g>
    {/* East: 3+8 (木) */}
    <g transform="translate(60,150)">
      <circle r={14} fill="#34d39922" stroke="#34d39944" strokeWidth="1" />
      <text y={4} textAnchor="middle" fill="#34d399" fontSize="10">三 八</text>
      <text y={15} textAnchor="middle" fill="#34d39966" fontSize="8">木</text>
    </g>
    {/* West: 4+9 (金) */}
    <g transform="translate(240,150)">
      <circle r={14} fill="#fbbf2422" stroke="#fbbf2444" strokeWidth="1" />
      <text y={4} textAnchor="middle" fill="#fbbf24" fontSize="10">四 九</text>
      <text y={15} textAnchor="middle" fill="#fbbf2466" fontSize="8">金</text>
    </g>

    {/* Connecting lines */}
    <line x1={150} y1={74} x2={150} y2={128} stroke="rgba(96,165,250,0.15)" strokeWidth="1" />
    <line x1={150} y1={226} x2={150} y2={172} stroke="rgba(248,113,113,0.15)" strokeWidth="1" />
    <line x1={74} y1={150} x2={128} y2={150} stroke="rgba(52,211,153,0.15)" strokeWidth="1" />
    <line x1={226} y1={150} x2={172} y2={150} stroke="rgba(251,191,36,0.15)" strokeWidth="1" />

    <text x={150} y={285} textAnchor="middle" fill="rgba(245,230,211,0.2)" fontSize="9">河图 · He Tu</text>
  </svg>
);

// ═══ 洛书 (Luo Shu) ═══
const LuoShu = () => {
  const grid = [
    [4,9,2],[3,5,7],[8,1,6]
  ];
  const colors = ['#60a5fa','#fbbf24','#f87171','#34d399','#c084fc','#fbbf24','#f87171','#34d399','#60a5fa'];
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
      {grid.flatMap((row, ri) => row.map((n, ci) => (
        <g key={`${ri}-${ci}`} transform={`translate(${80 + ci*50},${80 + ri*50})`}>
          <rect x={-22} y={-22} width={44} height={44} rx={8}
            fill={`${colors[ri*3+ci]}11`} stroke={`${colors[ri*3+ci]}22`} strokeWidth="1" />
          <text x={0} y={2} textAnchor="middle" dominantBaseline="middle"
            fill={colors[ri*3+ci]} fontSize="14" fontWeight="bold">{n}</text>
        </g>
      )))}
      <text x={150} y={285} textAnchor="middle" fill="rgba(245,230,211,0.2)" fontSize="9">洛书 · Luo Shu</text>
    </svg>
  );
};

// ═══ 先天八卦 ═══
const FuXiBagua = () => {
  const trigrams = [
    { name:'乾', tri:'☰', nat:'天', angle:-90 },
    { name:'兑', tri:'☱', nat:'泽', angle:-45 },
    { name:'离', tri:'☲', nat:'火', angle:0 },
    { name:'震', tri:'☳', nat:'雷', angle:45 },
    { name:'巽', tri:'☴', nat:'风', angle:135 },
    { name:'坎', tri:'☵', nat:'水', angle:180 },
    { name:'艮', tri:'☶', nat:'山', angle:-135 },
    { name:'坤', tri:'☷', nat:'地', angle:90 },
  ];
  return <BaguaCompass trigrams={trigrams} title="先天八卦 · Fú Xī" />;
};

// ═══ 后天八卦 ═══
const KingWenBagua = () => {
  const trigrams = [
    { name:'离', tri:'☲', nat:'火', angle:-90 },
    { name:'坤', tri:'☷', nat:'地', angle:-135 },
    { name:'兑', tri:'☱', nat:'泽', angle:-180 },
    { name:'乾', tri:'☰', nat:'天', angle:135 },
    { name:'坎', tri:'☵', nat:'水', angle:90 },
    { name:'艮', tri:'☶', nat:'山', angle:45 },
    { name:'震', tri:'☳', nat:'雷', angle:0 },
    { name:'巽', tri:'☴', nat:'风', angle:-45 },
  ];
  return <BaguaCompass trigrams={trigrams} title="后天八卦 · Wén Wáng" />;
};

function BaguaCompass({ trigrams, title }: { trigrams: { name:string; tri:string; nat:string; angle:number }[]; title:string }) {
  const cx = 150, cy = 150, r = 100;
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[300px]">
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r+15} fill="none" stroke="rgba(139,30,30,0.15)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r-5} fill="none" stroke="rgba(139,30,30,0.08)" strokeWidth="1" strokeDasharray="3 6" />

      {/* Center Taiji */}
      <circle cx={cx} cy={cy} r={20} fill="#f5e6d311" />
      <text x={cx} y={cy+4} textAnchor="middle" fill="rgba(245,230,211,0.2)" fontSize="8">太极</text>

      {/* Trigrams */}
      {trigrams.map(t => {
        const rad = (t.angle * Math.PI) / 180;
        return (
          <g key={t.name} transform={`translate(${cx + r*Math.cos(rad)},${cy + r*Math.sin(rad)})`}>
            <text x={0} y={-12} textAnchor="middle" fill="rgba(245,230,211,0.5)" fontSize="8">{t.name}</text>
            <text x={0} y={2} textAnchor="middle" fill="rgba(245,230,211,0.25)" fontSize="16">{t.tri}</text>
            <text x={0} y={18} textAnchor="middle" fill="rgba(245,230,211,0.2)" fontSize="7">{t.nat}</text>
          </g>
        );
      })}

      <text x={cx} y={285} textAnchor="middle" fill="rgba(245,230,211,0.2)" fontSize="9">{title}</text>
    </svg>
  );
}

// ═══ Main component ═══
export default function CosmologyVisuals() {
  return (
    <motion.div className="space-y-8 py-4 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center">
        <h2 className="font-calligraphy text-3xl text-amber-100">宇宙论</h2>
        <p className="text-amber-400/50 text-sm mt-2">河洛八卦 · 天地之数</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.03] to-ink-black/50 border border-imperial-red/10"
          initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.1}}>
          <HeTu />
        </motion.div>
        <motion.div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.03] to-ink-black/50 border border-imperial-red/10"
          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.2}}>
          <LuoShu />
        </motion.div>
        <motion.div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.03] to-ink-black/50 border border-imperial-red/10"
          initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}>
          <FuXiBagua />
        </motion.div>
        <motion.div className="p-4 rounded-2xl bg-gradient-to-b from-imperial-red/[0.03] to-ink-black/50 border border-imperial-red/10"
          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}}>
          <KingWenBagua />
        </motion.div>
      </div>
    </motion.div>
  );
}
