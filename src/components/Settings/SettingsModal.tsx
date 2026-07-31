import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Globe, Cpu, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { AIConfig } from '../../types';
import { getProviderDefaults, testAPIConnection } from '../../services/aiService';
import Modal from '../Common/Modal';

const PROVIDERS = [
  { id: 'gemini', name: 'Gemini 1.5 Flash' },
  { id: 'openai', name: 'OpenAI (GPT-4o)' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'openrouter', name: 'OpenRouter' },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSave: (config: AIConfig) => void;
}

export default function SettingsModal({ isOpen, onClose, config, onSave }: SettingsModalProps) {
  const [provider, setProvider] = useState(config.provider);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [model, setModel] = useState(config.model);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleProviderChange = (id: string) => {
    setProvider(id);
    const defaults = getProviderDefaults(id);
    setBaseUrl(defaults.baseUrl);
    setModel(defaults.model);
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const ok = await testAPIConnection({ provider, baseUrl, model, apiKey });
    setTestResult(ok);
    setTesting(false);
  };

  const handleSave = () => {
    onSave({ provider, baseUrl, model, apiKey });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="设置中心">
      <div className="space-y-5">
        {/* Provider selection */}
        <div>
          <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
            <Cpu size={14} />
            AI 服务商
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map(p => (
              <motion.button
                key={p.id}
                className={`p-2.5 rounded-xl border text-sm transition-all ${
                  provider === p.id
                    ? 'border-imperial-red/50 bg-imperial-red/15 text-amber-200'
                    : 'border-imperial-red/10 bg-ink-black/50 text-amber-400/50 hover:border-imperial-red/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProviderChange(p.id)}
              >
                {p.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Base URL */}
        <div>
          <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
            <Globe size={14} />
            Base URL
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={e => { setBaseUrl(e.target.value); setTestResult(null); }}
            className="w-full p-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm placeholder:text-amber-400/30 focus:outline-none focus:border-imperial-red/50"
          />
        </div>

        {/* Model */}
        <div>
          <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
            <Cpu size={14} />
            Model
          </label>
          <input
            type="text"
            value={model}
            onChange={e => { setModel(e.target.value); setTestResult(null); }}
            className="w-full p-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm placeholder:text-amber-400/30 focus:outline-none focus:border-imperial-red/50"
          />
        </div>

        {/* API Key */}
        <div>
          <label className="flex items-center gap-2 text-amber-300 text-sm mb-2">
            <Key size={14} />
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={e => { setApiKey(e.target.value); setTestResult(null); }}
            placeholder="输入你的 API 密钥"
            className="w-full p-2.5 bg-ink-black/60 border border-imperial-red/20 rounded-xl text-amber-200 text-sm placeholder:text-amber-400/30 focus:outline-none focus:border-imperial-red/50"
          />
        </div>

        {/* Test & Save */}
        <div className="flex items-center gap-3 pt-2">
          <motion.button
            className="px-4 py-2.5 rounded-xl border border-imperial-red/30 text-amber-300 text-sm flex items-center gap-2 hover:bg-imperial-red/10 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTest}
            disabled={testing || !apiKey}
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            测试连接
          </motion.button>
          {testResult === true && (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={12} /> 连接成功
            </span>
          )}
          {testResult === false && (
            <span className="flex items-center gap-1 text-red-400 text-xs">
              <XCircle size={12} /> 连接失败
            </span>
          )}
          <div className="flex-1" />
          <motion.button
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-imperial-red to-imperial-red/80 text-amber-100 font-medium text-sm shadow-lg shadow-imperial-red/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
          >
            保存设置
          </motion.button>
        </div>
      </div>
    </Modal>
  );
}
