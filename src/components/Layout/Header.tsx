import { motion } from 'framer-motion';
import { Sparkles, Settings, History, BookOpen, Calendar, User, Moon, Compass, Sun, HeartHandshake, CalendarCheck } from 'lucide-react';
import type { TabType } from '../../types';

const TABS: { id: TabType; icon: React.ReactNode; label: string }[] = [
  { id: 'iching', icon: <BookOpen size={13} />, label: '易经' },
  { id: 'bazi', icon: <Sparkles size={13} />, label: '八字' },
  { id: 'fortune', icon: <Calendar size={13} />, label: '黄历' },
  { id: 'festival', icon: <Sun size={13} />, label: '岁时' },
  { id: 'marriage', icon: <HeartHandshake size={13} />, label: '合婚' },
  { id: 'zeria', icon: <CalendarCheck size={13} />, label: '择日' },
  { id: 'name', icon: <User size={13} />, label: '姓名' },
  { id: 'dream', icon: <Moon size={13} />, label: '解梦' },
  { id: 'cosmos', icon: <Compass size={13} />, label: '宇宙论' },
];

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenSettings: () => void;
  onToggleHistory: () => void;
}

export default function Header({ activeTab, onTabChange, onOpenSettings, onToggleHistory }: HeaderProps) {
  return (
    <motion.header
      className="relative z-10 border-b border-imperial-red/20 bg-gradient-to-b from-ink-black/95 to-ink-black/80 backdrop-blur-sm"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-imperial-red via-imperial-red/80 to-amber-700 flex items-center justify-center">
                <Sparkles size={18} className="text-amber-100" />
              </div>
              <div className="absolute inset-0 rounded-full bg-imperial-red/20 animate-ping-slow" />
            </div>
            <div>
              <h1 className="font-calligraphy text-2xl text-amber-100 leading-none">天机</h1>
              <p className="text-[10px] text-amber-400/60 tracking-[0.3em]">TIAN JI</p>
            </div>
          </motion.div>

          {/* Tabs (desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-imperial-red/5 rounded-full p-1 border border-imperial-red/10 overflow-x-auto max-w-full">
            {TABS.map(({ id, icon, label }) => (
              <TabButton
                key={id}
                active={activeTab === id}
                onClick={() => onTabChange(id)}
                icon={icon}
                label={label}
                layoutId="tab-bg"
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <IconButton onClick={onToggleHistory} icon={<History size={18} />} label="历史记录" />
            <IconButton onClick={onOpenSettings} icon={<Settings size={18} />} label="设置" />
          </div>
        </div>

        {/* Tabs (mobile) */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto px-3 pb-2 pt-1 -mx-1">
          {TABS.map(({ id, icon, label }) => (
            <TabButton
              key={id}
              active={activeTab === id}
              onClick={() => onTabChange(id)}
              icon={icon}
              label={label}
              layoutId="tab-bg-mobile"
              compact
            />
          ))}
        </div>
      </div>
    </motion.header>
  );
}

function TabButton({
  active, onClick, icon, label, layoutId, compact,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
  layoutId: string; compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 flex items-center gap-2 rounded-full font-medium transition-all duration-300 ${
        compact ? 'px-3.5 py-1.5 text-xs' : 'px-5 py-2 text-sm'
      } ${
        active
          ? 'text-amber-100'
          : 'text-amber-400/50 hover:text-amber-400/80'
      }`}
    >
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-imperial-red/80 to-imperial-red/60"
          layoutId={layoutId}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}

function IconButton({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg text-amber-400/50 hover:text-amber-300 hover:bg-imperial-red/10 transition-all duration-200"
      title={label}
    >
      {icon}
    </button>
  );
}
