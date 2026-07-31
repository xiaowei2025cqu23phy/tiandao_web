# 🏮 天机 · Tianji

AI 智能易经占卜与八字命理。融合东方智慧与现代科技。

```bash
npm install && npm run dev
```

---

## 功能

| 模块 | 说明 |
|------|------|
| 🔮 **易经占卜** | 铜钱起卦 → 本卦/变卦 → AI 解卦（含互卦/综卦/错卦、体用生克） |
| 🧮 **八字命理** | 公历生日 → 四柱八字 → 真太阳时 → 五行分析 → 大运流年 |
| 📜 **64卦全解** | 全部 64 卦的卦名、卦辞、彖传、大象、六爻爻辞，随查随看 |
| 🧠 **多 AI 支持** | Gemini / OpenAI / DeepSeek / OpenRouter 四种模型 |
| 📝 **历史记录** | localStorage 持久化，查看/清除以往的占卜结果 |
| 📅 **每日黄历** | 干支日、节气、宜忌、生肖运势、幸运色与方位 |

## 占卜流程

```
输入问题 → 虚拟铜钱起卦（6爻） → 生成本卦 + 变卦 → AI 解卦
```

每一步都有精美的交互动画。支持铜钱、数字、米卦、时间四种起卦方式。

## 八字流程

```
输入出生日期 + 时辰 + 出生地经度 + 性别 → 推算四柱 → 真太阳时 → 五行分析 → 大运/流年 → 日主解读
```

### 干支计算的精度说明

- **日柱**以 1900-01-01（甲戌日）为锚点精确推算，与万年历一致；
- **年柱**以立春为界（立春前按上一年计）；
- **月柱**按「五虎遁」配合节气定支，**时柱**按「五鼠遁」；
- **真太阳时**：按出生地经度修正标准时（每 1° = 4 分钟，东经为正，默认 120°E），仅做经度修正、未叠加均时差，误差通常在 ±15 分钟内；
- **农历**：1900–2100 年闰月与大小月查表**精确转换**（1900-01-31 = 正月初一锚点）；
- **大运**：以月柱为起点，阳男阴女顺排、阴男阳女逆排，每步 10 年，附十神与起止年份；起运岁数简化为「出生到最近节气的天数 ÷ 3」（节气采用近似固定日期，可能相差 1 天）；
- **流年**：以公历年份推六十甲子，附十神与吉凶评语（规则化，仅供参考）。

## AI 配置

在设置中填入 API Key 即可使用 AI 解卦。支持：

- **Gemini** — Google 免费 API（浏览器直连可用）
- **OpenAI** — GPT-4o（官方 API 默认不允许浏览器跨域直连，建议通过自有代理中转）
- **DeepSeek** — 国产高性价比
- **OpenRouter** — 聚合 API

未配置 AI 也可以正常起卦和查看卦象。API Key 仅保存在浏览器 localStorage 中，请勿在公共设备上使用。

## 测试

核心算法（64 卦二进制与卦变关系、干支计算、农历转换、真太阳时、大运流年十神、黄历一致性、纳甲世应六亲、体用生克）均有单元测试：

```bash
npm test          # 单次运行
npm run test:watch  # 监听模式
```

## 技术栈

| 技术 | 用途 |
|------|------|
| React 19 | UI 框架 |
| TypeScript 6 | 类型安全 |
| Vite 8 | 构建工具 |
| Tailwind CSS 4 | 样式 |
| Framer Motion | 动画 |
| Vitest | 单元测试 |
| Lucide React | 图标 |

## 项目结构

```
src/
├── components/
│   ├── IChing/            易经占卜
│   │   ├── IChingDivination.tsx   主流程
│   │   ├── CoinToss.tsx           铜钱起卦动画
│   │   ├── HexagramDisplay.tsx    卦象展示
│   │   └── HexagramDetail.tsx     64卦全览
│   ├── Bazi/               八字命理
│   │   └── BaziCalculator.tsx    四柱八字排盘
│   ├── Common/             通用组件
│   │   ├── Modal.tsx
│   │   └── TypingText.tsx        AI 打字机效果
│   ├── Layout/Header.tsx   顶部导航
│   ├── History/HistoryPanel.tsx  历史记录
│   └── Settings/SettingsModal.tsx 设置面板
├── data/
│   ├── hexagrams.ts        64卦完整数据（下→上二进制）
│   ├── ganzhi.ts           天干地支共享引擎（八字/黄历同源）
│   ├── bazi.ts             八字计算
│   ├── lunar.ts            农历转换（1900-2100 查表）
│   ├── solarTime.ts        真太阳时（经度修正）
│   ├── dayun.ts            大运/流年/十神
│   └── nayin.ts            纳甲/世应/六亲
├── services/aiService.ts   AI Provider 集成
├── hooks/useLocalStorage.ts
├── types/index.ts          类型定义
└── App.tsx                 根组件
tests/                      单元测试（Vitest）
```

---

## 许可

MIT
