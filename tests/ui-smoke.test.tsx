import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import IChingDivination from '../src/components/IChing/IChingDivination';
import BaziCalculator from '../src/components/Bazi/BaziCalculator';
import DailyFortune from '../src/components/Fortune/DailyFortune';
import SeasonalCalendar from '../src/components/Fortune/SeasonalCalendar';
import MarriageCalculator from '../src/components/Marriage/MarriageCalculator';
import ZeriaPicker from '../src/components/Zeria/ZeriaPicker';
import NameAnalysisPage from '../src/components/NameAnalysis/NameAnalysis';
import DreamInterpreter from '../src/components/Dream/DreamInterpreter';
import CosmologyVisuals from '../src/components/Fortune/CosmologyVisuals';
import Header from '../src/components/Layout/Header';

const aiConfig = { provider: 'gemini', baseUrl: 'https://x', model: 'm', apiKey: '' };

describe('页面组件冒烟渲染（SSR）', () => {
  const pages: Array<[string, React.ReactElement]> = [
    ['易经', <IChingDivination aiConfig={aiConfig} onSave={() => {}} selectedRecord={null} />],
    ['八字', <BaziCalculator />],
    ['黄历', <DailyFortune />],
    ['岁时', <SeasonalCalendar />],
    ['合婚', <MarriageCalculator />],
    ['择日', <ZeriaPicker />],
    ['姓名', <NameAnalysisPage />],
    ['解梦', <DreamInterpreter />],
    ['宇宙论', <CosmologyVisuals />],
  ];

  it('九个页面均能渲染且包含各自标题', () => {
    for (const [name, el] of pages) {
      const html = renderToString(el);
      expect(html.length, `${name} 渲染为空`).toBeGreaterThan(100);
      expect(html, name).toContain('font-calligraphy');
    }
  });

  it('各页面渲染出关键功能文本', () => {
    const expectations: Array<[string, React.ReactElement, string]> = [
      ['易经', pages[0][1], '易经占卜'],
      ['八字', pages[1][1], '八字命理'],
      ['黄历', pages[2][1], '每日运势'],
      ['岁时', pages[3][1], '岁时历'],
      ['合婚', pages[4][1], '生肖合婚'],
      ['择日', pages[5][1], '择日'],
      ['姓名', pages[6][1], '姓名分析'],
      ['解梦', pages[7][1], '周公解梦'],
      ['宇宙论', pages[8][1], '宇宙论'],
    ];
    for (const [name, el, text] of expectations) {
      expect(renderToString(el), name).toContain(text);
    }
  });

  it('Header 桌面与移动端各含全部九个导航项', () => {
    const html = renderToString(
      <Header activeTab="iching" onTabChange={() => {}} onOpenSettings={() => {}} onToggleHistory={() => {}} />,
    );
    for (const label of ['易经', '八字', '黄历', '岁时', '合婚', '择日', '姓名', '解梦', '宇宙论']) {
      const count = html.split(label).length - 1;
      expect(count, `${label} 应出现两次（桌面+移动）`).toBeGreaterThanOrEqual(2);
    }
  });
});
