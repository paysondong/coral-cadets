# Changelog — 0.2.0 Direct Upgrade

## Game First

- 原项目 `/` 直接进入游戏，不再强制先登录。
- 登录 / 注册仍保留在 `/signin` 与 `/register`。
- 返回玩家根据 `unlock_count` 自动继续下一片 Reef。

## Match Feel

- 无效交换不扣步。
- 达成收集目标立即过关。
- 支持点击相邻单元交换。
- 4 连 = Pulse。
- 5+ 连 = φ Bloom。
- 十字结构 = Symmetry Wave。
- Cascade 3 / 5 / 8 = Fibonacci Flow。
- Bloom Meter 满触发 Reef Bloom + 300。
- 棋盘无解会自动 Current Shift。

## Art

- 全新深海首页和极简菜单。
- 游戏 HUD 改为 Score / Moves / Goals / Bloom。
- 移除主游戏 NPC 教学气泡。
- 黄金角粒子：137.507764°。
- Reef Bloom 使用 0.61803398875 分枝比例绘制背景珊瑚。
- 新胜利 / 失败卡片。

## Optional Panels

- Eco Points → Reef Score。
- Ocean Trivia → Ocean Cards。
- About / Support 改为轻量玻璃卡片。
- 这些都不阻挡主游戏流程。

## Responsive

- 新增统一 Layout 计算。
- 手机和桌面共用同一纵向画布。
- 删除桌面强制跳转 `desktop.html` iframe 的旧逻辑。
