# 原版直改说明

这次没有继续使用之前 Coral Genesis 1.0 的“生态研究平台”方向。

升级基线就是用户最开始上传的：

- React 18
- TypeScript
- Phaser 3.60
- SceneLevel1 ~ SceneLevel9
- 原三消矩阵 / 消除 / 掉落
- 原 14 个海洋与垃圾元素
- 原背景、鱼群、音效和菜单资源

## 保留下来的原作内容

1. 9 个关卡及原有矩阵形状
2. Phaser Scene 体系
3. 原有消除、下落、补充结构
4. 珊瑚 / 海洋动物 / 海洋垃圾元素
5. 原背景图、鱼群 Sprite Sheet、消失动画
6. 原背景音乐与 swap / drop / eliminate 音效
7. Reefscapers 支持入口
8. Eco Score / 解锁进度本地存储

## 直接升级的内容

### 游戏体验

- 无效交换不消耗 Moves
- 达成目标立即胜利
- 逐关增加合理 Moves
- 点击相邻元素也可以交换
- 自动检测无解棋盘并重排
- 连锁倍率与强匹配奖励

### 隐藏数学玩法

- 4 连 → Pulse
- 5 连 → φ Bloom
- 横纵交叉 → Symmetry Wave
- 3 / 5 / 8 级连锁 → Fibonacci Flow
- 黄金角 137.507764° 用于粒子散布
- 0.61803398875 用于背景珊瑚分枝长度

数学只负责形成“手感和美感”，游戏不会弹数学课程。

### 艺术 / UI

- 首页重新设计为深海科学艺术风
- 极简 HUD：Score / Moves / Goals / Bloom
- 移除游戏中的 NPC 教学气泡
- 新的胜利 / 失败卡片
- 新的 Ocean Cards / Reef Score / About / Support 可选面板
- 手机与桌面统一纵向游戏画布

### 生态表达

生态不再是仪表盘。

强连锁和 Bloom 会让珊瑚枝条在海底背景中持续生长，鱼群继续游动，让“恢复珊瑚礁”通过画面体现。
