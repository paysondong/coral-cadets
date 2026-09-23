# CoralCadets

**A coral-themed match-3 web game.**

> Current release: **v0.2.0 — Reef Skins (Stage 1)**
>
> This release adds lightweight player-selectable visual themes while preserving the existing gameplay and assets. See `RELEASE_NOTES_v0.2.0.md` and `STAGE_ROADMAP.md`.

这是在原始《珊瑚消消乐 / CoralCadet》代码上**直接升级**的版本，不是另起炉灶的新项目。

## 这版的设计原则

- **先好玩**：仍然是 9 关三消游戏，保留原有海洋角色、垃圾元素、鱼群动画、音效和关卡形状。
- **艺术性藏在反馈里**：深海玻璃 UI、生物荧光、黄金角粒子、珊瑚生长签名、连锁波纹。
- **数学藏在玩法里**：玩家不需要上课，也不需要读公式；4 连、5 连、十字、3→5→8 连锁会自然触发不同的视觉与奖励。
- **生态藏在世界里**：漂亮的连锁会让背景珊瑚继续“长出来”，而不是要求玩家管理 pH、氧气和仪表盘。

## 新玩法

- 3 连：普通 Match
- 4 连：`PULSE`，会额外清除邻接单元
- 5 连及以上：`φ BLOOM`，产生更大的局部爆发
- 十字 / T 型结构：`SYMMETRY WAVE`
- 连锁深度到 3 / 5 / 8：`FIBONACCI FLOW`
- Bloom 能量满：触发 `REEF BLOOM`，获得额外分数并让背景珊瑚生长
- 无效交换：**不扣步数**
- 完成目标：**立即过关**，不需要把剩余步数耗完
- 支持滑动交换，也支持点选两个相邻元素交换
- 棋盘无可走步骤时会自动 `CURRENT SHIFT`

## 运行

推荐 Node.js 18+。

```bash
npm install
npm start
```

浏览器打开：

```text
http://localhost:3000
```

现在桌面和手机共用同一个响应式游戏入口，不再跳转到旧的 `desktop.html` iframe。

生产构建：

```bash
npm run build
```

## 代码重点

```text
src/game/
├── Game.tsx              # 原入口直接升级后的启动界面
├── SceneLevel.ts         # 游戏 HUD、视觉反馈、胜负界面、Bloom
├── Level.ts              # 原关卡结构 + 关卡色彩组合 / 目标
├── LevelUtils.ts         # 原三消交换/掉落逻辑的升级版
├── PatternEngine.ts      # 纯数学匹配分析：4/5连、十字、可行交换
├── Layout.ts             # 手机/桌面统一纵向画布
├── theme/                # Stage 1: lightweight reef skins + local preference
├── Level1.ts ... Level9.ts
└── menu/                 # 极简游戏入口菜单
```

原始图片和音频资源仍在 `public/images` 与 `public/audio` 中继续使用。

## 版本

`0.2.0 — Reef Skins (Stage 1)`