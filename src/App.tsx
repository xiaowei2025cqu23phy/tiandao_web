import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Layout/Header';
import SettingsModal from './components/Settings/SettingsModal';
import HistoryPanel from './components/History/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { DivinationResult, AIConfig, TabType } from './types';

// 页面按需加载（代码分割）
const IChingDivination = lazy(() => import('./components/IChing/IChingDivination'));
const BaziCalculator = lazy(() => import('./components/Bazi/BaziCalculator'));
const DailyFortune = lazy(() => import('./components/Fortune/DailyFortune'));
const SeasonalCalendar = lazy(() => import('./components/Fortune/SeasonalCalendar'));
const MarriageCalculator = lazy(() => import('./components/Marriage/MarriageCalculator'));
const ZeriaPicker = lazy(() => import('./components/Zeria/ZeriaPicker'));
const NameAnalysisPage = lazy(() => import('./components/NameAnalysis/NameAnalysis'));
const DreamInterpreter = lazy(() => import('./components/Dream/DreamInterpreter'));
const CosmologyVisuals = lazy(() => import('./components/Fortune/CosmologyVisuals'));

function PageFallback() {
  return (
    <div className="flex justify-center py-24">
      <motion.div
        className="w-10 h-10 rounded-full border-2 border-imperial-red/30 border-t-imperial-red"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
      />
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('iching');
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DivinationResult | null>(null);

  const [aiConfig, setAiConfig] = useLocalStorage<AIConfig>('tianji-ai-config', {
    provider: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
    model: 'gemini-1.5-flash',
    apiKey: '',
  });

  const [records, setRecords] = useLocalStorage<DivinationResult[]>('tianji-history', []);

  const handleSaveRecord = useCallback((result: DivinationResult) => {
    setRecords(prev => {
      const existing = prev.findIndex(r => r.id === result.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = result;
        return next;
      }
      return [...prev, result];
    });
  }, [setRecords]);

  const handleClearHistory = useCallback(() => {
    setRecords([]);
    setSelectedRecord(null);
  }, [setRecords]);

  return (
    <div className="min-h-screen bg-ink-black flex flex-col">
      {/* Background ornament */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-imperial-red/[0.03] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/[0.02] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-imperial-red/[0.01] blur-3xl" />
      </div>

      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setShowSettings(true)}
        onToggleHistory={() => setShowHistory(prev => !prev)}
      />

      <main className="flex-1 relative z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {activeTab === 'iching' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="iching" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                  <IChingDivination aiConfig={aiConfig} onSave={handleSaveRecord} selectedRecord={selectedRecord} />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'bazi' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="bazi" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <BaziCalculator />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'fortune' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="fortune" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <DailyFortune />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'festival' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="festival" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <SeasonalCalendar />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'marriage' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="marriage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <MarriageCalculator />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'zeria' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="zeria" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <ZeriaPicker />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'name' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="name" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <NameAnalysisPage />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'dream' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="dream" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <DreamInterpreter />
                </motion.div>
              </Suspense>
            )}
            {activeTab === 'cosmos' && (
              <Suspense fallback={<PageFallback />}>
                <motion.div key="cosmos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <CosmologyVisuals />
                </motion.div>
              </Suspense>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={aiConfig}
        onSave={setAiConfig}
      />

      {/* History Panel */}
      <HistoryPanel
        records={records}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelect={(record) => {
          setSelectedRecord(record);
          setShowHistory(false);
          setActiveTab('iching');
        }}
        onClear={handleClearHistory}
      />
    </div>
  );
}

export default App;
