import type { AIConfig } from '../types';

const DEFAULT_CONFIGS: Record<string, Omit<AIConfig, 'apiKey'>> = {
  gemini: { provider: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/', model: 'gemini-1.5-flash' },
  openai: { provider: 'openai', baseUrl: 'https://api.openai.com/v1/', model: 'gpt-4o' },
  deepseek: { provider: 'deepseek', baseUrl: 'https://api.deepseek.com/', model: 'deepseek-chat' },
  openrouter: { provider: 'openrouter', baseUrl: 'https://openrouter.ai/api/v1/', model: 'deepseek/deepseek-chat' },
};

export function getProviderDefaults(provider: string) {
  return DEFAULT_CONFIGS[provider] || DEFAULT_CONFIGS.gemini;
}

function buildGeminiPayload(_model: string, messages: { role: string; content: string }[]) {
  const contents = messages.map(m => ({
    parts: [{ text: m.content }],
    role: m.role === 'assistant' ? 'model' : 'user',
  }));
  return { contents };
}

function buildOpenAIPayload(model: string, messages: { role: string; content: string }[]) {
  return { model, messages, stream: false } as const;
}

async function callProvider(config: AIConfig, messages: { role: string; content: string }[]): Promise<string> {
  const { provider, baseUrl, model, apiKey } = config;

  if (!apiKey) throw new Error('未配置 API 密钥，请在设置中心配置');

  switch (provider) {
    case 'gemini': {
      const url = `${baseUrl}${model}:generateContent?key=${apiKey}`;
      const body = buildGeminiPayload(model, messages);
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Gemini API 错误: ${res.status} ${err}`);
      }
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '无法获取解读';
    }
    case 'openai':
    case 'deepseek':
    case 'openrouter': {
      const body = buildOpenAIPayload(model, messages);
      const res = await fetch(`${baseUrl}chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`${provider} API 错误: ${res.status} ${err}`);
      }
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '无法获取解读';
    }
    default:
      throw new Error(`不支持的 AI Provider: ${provider}`);
  }
}

export async function getAIDivination(
  config: AIConfig,
  question: string,
  _hexagramName: string,
  context: string,
  lines: string
): Promise<string> {
  const systemPrompt = `你是一位精通《易经》的资深命理大师，名为"天机子"。将古老易经智慧与现代生活结合，为人解惑。

原则：
1. 用优雅简洁的中文（现代文为主，适当引用经文）
2. 结合卦辞、彖传、爻辞的原文进行解读，不可凭空捏造
3. 针对用户问题给出具体有建设性的指引
4. 语气温和睿智，展现东方智慧
5. 篇幅 300 字以内
6. 哲理和心理学角度分析，避免迷信口吻

卦象详情：
${context}

卦变情况：
${lines || '静卦无变爻'}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question || '请为我解读当前卦象的寓意和启示。' },
  ];

  return callProvider(config, messages);
}

export async function testAPIConnection(config: AIConfig): Promise<boolean> {
  try {
    const messages = [{ role: 'user', content: '请回复"连接成功"四个字。' }];
    await callProvider(config, messages);
    return true;
  } catch {
    return false;
  }
}
