# Validation — Original Direct Upgrade 0.2.0

## Release verification — 2026-09-22

Verified against real installed dependencies on macOS:

- Dependency installation: PASS (`npm install --ignore-scripts --legacy-peer-deps`).
- Existing webpack-dev-server patch: PASS (`npm run postinstall`).
- Full TypeScript check: PASS (`tsc --noEmit`).
- Production bundle: PASS with existing ESLint / tooling warnings (`npm run build`).

Release preparation fixes: synchronized missing lockfile dependencies, configured legacy peer resolution for CRA / TypeScript 5, enabled downlevel iteration, and narrowed the Phaser audio type before setting volume. Local `.env` and `temp.env` files are excluded. No browser gameplay test was performed in this release preparation.

The original validation record below is retained for history.

验证日期：2026-09-18

## 已实际执行

### PatternEngine 严格 TypeScript 编译

使用容器内全局 TypeScript 5.8.3：

```bash
tsc src/game/PatternEngine.ts --target es2020 --module commonjs --strict
```

结果：PASS。

### 数学 / 三消结构测试

- 3 连识别：PASS，3 个自然清除，基础分 54
- 4 连 Pulse：PASS，扩展为 5 个清除，基础分 172
- 5 连 φ Bloom：PASS，扩展为 8 个清除，基础分 350
- 十字 Symmetry：PASS，扩展为 9 个清除，基础分 340
- 可行交换检测：PASS
- 无匹配棋盘不误报：PASS
- 连锁倍率：PASS

### 源码静态检查

- 37 个 `.ts/.tsx` 源文件 TypeScript syntax transpile：PASS
- 使用临时 QA 类型桩进行全 `src` 项目链路检查：PASS
- 相对 import 缺失：0
- `package.json`：可解析
- `package-lock.json`：可解析
- `public/manifest.json`：可解析
- Level 文件：9 / 9
- SceneLevel 文件：9 / 9

临时 QA 类型桩位于 `/tmp`，**不会进入交付 ZIP**。

### 素材检查

ImageMagick 解码：

- background.png：PASS
- game-area-cell.png：PASS
- 代表性 item 1 / 3 / 5 / 8 / 13：PASS

FFprobe 音频解码：

- background.mp3：PASS
- button.mp3：PASS
- drop.mp3：PASS
- eliminate.mp3：PASS
- swap.mp3：PASS

## 关键行为修复

- 无效交换不再消耗 Moves
- 达成目标立即胜利
- 点击 + 滑动均可交换
- 无可行交换时自动 Current Shift
- 返回玩家可继续下一片 Reef
- 桌面不再被强制重定向到 localhost iframe

## 当前环境限制

尝试了两次真实依赖安装：

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm ci --ignore-scripts --no-audit --no-fund --registry=https://registry.npmmirror.com
```

分别在 90 秒 / 120 秒的外部 registry 下载阶段超时，因此当前容器没有完成真实 CRA / Phaser 浏览器 bundle。

没有把这一项写成“通过”。交付 ZIP 中没有残留 `node_modules` 或半安装文件。

在正常联网环境中，请最终运行：

```bash
npm install
npm start
```

以及：

```bash
npm run build
```
