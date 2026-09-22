import { Scene } from "phaser";
import { constant } from "./Constant";
import { SceneLevel } from "./SceneLevel";
import { analyzePattern, findPossibleMove, scorePattern, PatternPoint } from "./PatternEngine";

export type CONTEXT = {
  scene: Scene;
  startX: number;
  startY: number;
  cellWidth: number;
  dividerWidth: number;
};

type ItemInfo = {
  type: number;
  image?: Phaser.GameObjects.Image;
};

export type MatchSummary = {
  cleared: number;
  naturalCleared: number;
  specialCleared: number;
  maxLineLength: number;
  hasCross: boolean;
  center: PatternPoint;
  pattern: "match" | "pulse" | "golden" | "symmetry";
};

export type Matrix = ItemInfo[][];
export type SpriteMatrix = Phaser.GameObjects.Sprite[][];

export enum ITEM_TYPE {
  TEXTURE_KEY_ITEM_DISABLE = "item-disable",
  TEXTURE_KEY_ITEM_EMPTY = "item-empty",
  TEXTURE_KEY_ITEM_1 = "item-1",
  TEXTURE_KEY_ITEM_2 = "item-2",
  TEXTURE_KEY_ITEM_3 = "item-3",
  TEXTURE_KEY_ITEM_4 = "item-4",
  TEXTURE_KEY_ITEM_5 = "item-5",
  TEXTURE_KEY_ITEM_6 = "item-6",
  TEXTURE_KEY_ITEM_7 = "item-7",
  TEXTURE_KEY_ITEM_8 = "item-8",
  TEXTURE_KEY_ITEM_9 = "item-9",
  TEXTURE_KEY_ITEM_10 = "item-10",
  TEXTURE_KEY_ITEM_11 = "item-11",
  TEXTURE_KEY_ITEM_12 = "item-12",
  TEXTURE_KEY_ITEM_13 = "item-13",
  TEXTURE_KEY_ITEM_14 = "item-14",
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFiveElements(arr: number[]) {
  if (arr.length < 5) {
    throw new Error("数组元素不足5个");
  }

  const result = [];
  const tempArr = arr.slice();

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * tempArr.length);
    result.push(tempArr[randomIndex]);
    tempArr.splice(randomIndex, 1);
  }

  return result;
}

export async function fill(matrix: Matrix, randomTypeSelection: number[]) {
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j].type === 0) {
        const index = getRandomInt(0, randomTypeSelection.length - 1);
        row[j].type = randomTypeSelection[index];
      }
    }
  }

  while (await eliminateIdenticalItem(matrix)) {
    await fillup(matrix, randomTypeSelection);
  }
  await ensurePlayable(matrix, randomTypeSelection);
}

let pointerX = -1;
let pointerY = -1;
let fromI = -1;
let fromJ = -1;
let spriteMatrix: SpriteMatrix;
let moveCallback: () => void;
let selectedCell: { i: number; j: number; image: Phaser.GameObjects.Image } | null = null;

export function draw(
  matrix: Matrix,
  inputSpriteMatrix: SpriteMatrix,
  context: CONTEXT,
  callback: () => void
) {
  spriteMatrix = inputSpriteMatrix;
  moveCallback = callback;
  selectedCell = null;

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const spriteRow = spriteMatrix[i];
    for (let j = 0; j < row.length; j++) {
      if (row[j].type !== -1) {
        const item = generateItem(matrix, i, j, context);
        row[j].image = item;
        spriteRow[j] = generateDisappearSprite(i, j, context);
      }
    }
  }
}

function clearSelection() {
  if (!selectedCell) return;
  const baseScale = selectedCell.image.getData("baseScale") as number | undefined;
  if (baseScale) selectedCell.image.setScale(baseScale);
  selectedCell.image.clearTint();
  selectedCell = null;
}

function selectCell(i: number, j: number, image: Phaser.GameObjects.Image) {
  clearSelection();
  const baseScale = (image.getData("baseScale") as number) || image.scaleX;
  image.setTint(0xcffcff);
  image.setScale(baseScale * 1.07);
  selectedCell = { i, j, image };
}

function directionBetween(
  from: { i: number; j: number },
  to: { i: number; j: number }
): "left" | "right" | "top" | "bottom" | null {
  const di = to.i - from.i;
  const dj = to.j - from.j;
  if (Math.abs(di) + Math.abs(dj) !== 1) return null;
  if (dj === -1) return "left";
  if (dj === 1) return "right";
  if (di === -1) return "top";
  return "bottom";
}

function handleTapSelection(
  matrix: Matrix,
  i: number,
  j: number,
  image: Phaser.GameObjects.Image,
  context: CONTEXT
) {
  if (!selectedCell) {
    selectCell(i, j, image);
    return;
  }

  if (selectedCell.i === i && selectedCell.j === j) {
    clearSelection();
    return;
  }

  const direction = directionBetween(selectedCell, { i, j });
  if (!direction) {
    selectCell(i, j, image);
    return;
  }

  const origin = { i: selectedCell.i, j: selectedCell.j };
  clearSelection();
  (context.scene as SceneLevel).playSound((context.scene as SceneLevel).swapSound!);
  void swap(matrix, origin.i, origin.j, direction, context);
}

function generateItem(matrix: Matrix, i: number, j: number, context: CONTEXT) {
  const type = matrix[i][j].type;
  const item = context.scene.add.image(0, 0, "item-" + type);
  const baseScale = context.cellWidth / item.width;
  item.setScale(baseScale);
  item.setData("baseScale", baseScale);
  item.setX(context.startX + j * (context.cellWidth + context.dividerWidth));
  item.setY(context.startY + i * (context.cellWidth + context.dividerWidth));
  item.setInteractive({ useHandCursor: true });
  (item as any).tag = `item: ${i},${j}`;

  item.on("pointerover", () => {
    if (selectedCell?.image === item) return;
    context.scene.tweens.add({
      targets: item,
      scaleX: baseScale * 1.035,
      scaleY: baseScale * 1.035,
      duration: 90,
    });
  });

  item.on("pointerout", () => {
    if (selectedCell?.image === item) return;
    context.scene.tweens.add({
      targets: item,
      scaleX: baseScale,
      scaleY: baseScale,
      duration: 90,
    });
  });

  item.on(
    "pointerdown",
    function (this: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) {
      pointerX = pointer.x;
      pointerY = pointer.y;
      fromI = Math.round(
        (this.y - context.startY) / (context.cellWidth + context.dividerWidth)
      );
      fromJ = Math.round(
        (this.x - context.startX) / (context.cellWidth + context.dividerWidth)
      );
    }
  );

  item.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    const endX = pointer.x;
    const endY = pointer.y;
    const dx = endX - pointerX;
    const dy = endY - pointerY;
    const swipeHorizontal = Math.abs(dx);
    const swipeVertical = Math.abs(dy);
    const threshold = Math.max(context.cellWidth * 0.22, 8);

    if (Math.max(swipeHorizontal, swipeVertical) < threshold) {
      handleTapSelection(matrix, fromI, fromJ, item, context);
      return;
    }

    clearSelection();
    (context.scene as SceneLevel).playSound((context.scene as SceneLevel).swapSound!);

    if (swipeHorizontal > swipeVertical) {
      void swap(matrix, fromI, fromJ, dx < 0 ? "left" : "right", context);
    } else {
      void swap(matrix, fromI, fromJ, dy < 0 ? "top" : "bottom", context);
    }
  });

  return item;
}

let inSwap = false;

async function swap(
  matrix: Matrix,
  itemRow: number,
  itemColumn: number,
  direction: "left" | "right" | "top" | "bottom",
  context: CONTEXT
) {
  const scene = context.scene as SceneLevel;
  if (scene.showWin || inSwap) return;
  if (itemRow < 0 || itemColumn < 0) return;
  if (!matrix[itemRow] || !matrix[itemRow][itemColumn]) return;

  const aItem = matrix[itemRow][itemColumn];
  if (aItem.type <= 0) return;

  let toItemRow = itemRow;
  let toItemColumn = itemColumn;
  if (direction === "left") toItemColumn -= 1;
  if (direction === "right") toItemColumn += 1;
  if (direction === "top") toItemRow -= 1;
  if (direction === "bottom") toItemRow += 1;

  const bItem = matrix[toItemRow]?.[toItemColumn];
  if (!bItem || bItem.type === -1 || !aItem.image || !bItem.image) {
    scene.onInvalidMove?.();
    return;
  }

  inSwap = true;
  let consumedMove = false;
  matrix[toItemRow][toItemColumn] = aItem;
  matrix[itemRow][itemColumn] = bItem;

  try {
    await Promise.all([
      doAnimation(context.scene, {
        targets: bItem.image,
        x: aItem.image.x,
        y: aItem.image.y,
        duration: 170,
        ease: "Sine.easeInOut",
      }),
      doAnimation(context.scene, {
        targets: aItem.image,
        x: bItem.image.x,
        y: bItem.image.y,
        duration: 170,
        ease: "Sine.easeInOut",
      }),
    ]);

    let rollback = true;
    let cascade = 0;

    while (true) {
      const summary = await eliminateIdenticalItem(matrix, context);
      if (!summary) break;

      rollback = false;
      cascade += 1;
      scene.playSound(scene.elinimateSound!);
      const score = scoreMatch(summary, cascade);
      scene.addScore(score);
      scene.onMatchResolved?.(summary, cascade, score, context);
      await fillup(matrix, scene.level?.randomTypeSelection ?? [], context);
    }

    if (rollback) {
      matrix[itemRow][itemColumn] = aItem;
      matrix[toItemRow][toItemColumn] = bItem;
      await Promise.all([
        doAnimation(context.scene, {
          targets: aItem.image,
          x: bItem.image.x,
          y: bItem.image.y,
          duration: 160,
          ease: "Back.easeOut",
        }),
        doAnimation(context.scene, {
          targets: bItem.image,
          x: aItem.image.x,
          y: aItem.image.y,
          duration: 160,
          ease: "Back.easeOut",
        }),
      ]);
      scene.onInvalidMove?.();
    } else {
      const shifted = await ensurePlayable(matrix, scene.level?.randomTypeSelection ?? [], context);
      if (shifted) scene.onBoardShift?.();
      consumedMove = true;
      scene.onCascadeComplete?.(cascade);
    }
  } finally {
    inSwap = false;
    if (consumedMove) moveCallback();
  }
}


async function doAnimation(
  scene: Scene,
  config: Phaser.Types.Tweens.TweenBuilderConfig
) {
  return new Promise<void>((resolve) => {
    scene.tweens.add({
      ...config,
      onComplete: () => resolve(),
    });
  });
}

function scoreMatch(summary: MatchSummary, cascade: number) {
  return scorePattern(
    {
      clearPoints: Array.from({ length: summary.cleared }, (_, index) => ({ i: 0, j: index })),
      naturalPoints: Array.from({ length: summary.naturalCleared }, (_, index) => ({ i: 0, j: index })),
      maxLineLength: summary.maxLineLength,
      cross: summary.hasCross ? { i: 0, j: 0 } : null,
    },
    cascade
  );
}

async function eliminateIdenticalItem(
  matrix: Matrix,
  context?: CONTEXT
): Promise<MatchSummary | null> {
  const geometry = analyzePattern(matrix.map((row) => row.map((item) => item.type)));
  if (!geometry) return null;

  const naturalSize = geometry.naturalPoints.length;
  const allPoints = geometry.clearPoints;
  const eliminatedImages: Phaser.GameObjects.Image[] = [];
  const promises: Promise<void>[] = [];
  let goals: number[] = [];
  const goalCounts = [0, 0];

  if (context?.scene) {
    goals = (context.scene as SceneLevel).level?.getGoals() ?? [];
  }

  for (const point of allPoints) {
    const item = matrix[point.i][point.j];
    if (goals[0] === item.type) goalCounts[0]++;
    if (goals[1] === item.type) goalCounts[1]++;

    item.type = 0;
    if (context && item.image) {
      spriteMatrix[point.i][point.j]?.play(
        "animation-disappear-" + point.i + "-" + point.j
      );
      promises.push(
        doAnimation(context.scene, {
          targets: item.image,
          alpha: 0,
          scaleX: item.image.scaleX * 0.72,
          scaleY: item.image.scaleY * 0.72,
          duration: 260,
          ease: "Quad.easeIn",
        })
      );
      eliminatedImages.push(item.image);
    }
    item.image = undefined;
  }

  await Promise.all(promises);
  eliminatedImages.forEach((image) => image.destroy());

  if (context?.scene) {
    (context.scene as SceneLevel).level?.updateGoals(goalCounts[0], goalCounts[1]);
  }

  return {
    cleared: allPoints.length,
    naturalCleared: naturalSize,
    specialCleared: Math.max(0, allPoints.length - naturalSize),
    maxLineLength: geometry.maxLineLength,
    hasCross: Boolean(geometry.cross),
    center: geometry.focus,
    pattern: geometry.pattern,
  };
}

async function fillup(
  matrix: Matrix,
  randomTypeSelection: number[],
  context?: CONTEXT
) {
  if (context?.scene) {
    (context.scene as SceneLevel).playSound((context.scene as SceneLevel).dropSound!);
  }

  let hasEmpty = false;
  const promises: Promise<void>[] = [];

  for (let j = 0; j < matrix[0].length; j++) {
    const column = new Array(matrix.length).fill(0).map((_, idx) => matrix[idx][j]);
    const leftItems = column.filter((item) => item.type > 0);
    if (!column.find((item) => item.type === 0)) continue;

    hasEmpty = true;
    let idx = leftItems.length - 1;
    for (let i = matrix.length - 1; i >= 0; i--) {
      if (matrix[i][j].type === -1) continue;
      if (idx < 0) {
        matrix[i][j] = { type: 0 };
      } else {
        matrix[i][j] = leftItems[idx--];
        const image = matrix[i][j].image;
        if (context && image) {
          promises.push(
            doAnimation(context.scene, {
              targets: image,
              y: context.startY + i * (context.cellWidth + context.dividerWidth),
              duration: 180,
              ease: "Cubic.easeInOut",
            })
          );
        }
      }
    }
  }

  await Promise.all(promises);
  if (!hasEmpty) return;

  for (let j = 0; j < matrix[0].length; j++) {
    for (let i = 0; i < matrix.length; i++) {
      const item = matrix[i][j];
      if (item.type === -1) continue;
      if (item.type === 0) {
        const index = getRandomInt(0, randomTypeSelection.length - 1);
        item.type = randomTypeSelection[index];
        if (context) {
          item.image = generateItem(matrix, i, j, context);
          const baseY = item.image.y;
          item.image.y = Math.max(0, baseY - context.cellWidth * 1.8);
          item.image.alpha = 0;
          await doAnimation(context.scene, {
            targets: item.image,
            y: baseY,
            alpha: 1,
            duration: 190,
            ease: "Cubic.easeOut",
          });
        }
        break;
      }
    }
  }

  await fillup(matrix, randomTypeSelection, context);
}

async function ensurePlayable(
  matrix: Matrix,
  randomTypeSelection: number[],
  context?: CONTEXT
) {
  const types = matrix.map((row) => row.map((item) => item.type));
  if (findPossibleMove(types)) return false;

  const positions: Array<{ i: number; j: number }> = [];
  const pool: number[] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].type > 0) {
        positions.push({ i, j });
        pool.push(matrix[i][j].type);
      }
    }
  }

  const sourcePool = pool.length === positions.length && pool.length > 0
    ? pool
    : positions.map(() => randomTypeSelection[getRandomInt(0, randomTypeSelection.length - 1)]);

  for (let attempt = 0; attempt < 160; attempt++) {
    const shuffled = [...sourcePool];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const target = getRandomInt(0, index);
      [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
    }

    positions.forEach((position, index) => {
      matrix[position.i][position.j].type = shuffled[index];
    });

    const nextTypes = matrix.map((row) => row.map((item) => item.type));
    if (!analyzePattern(nextTypes) && findPossibleMove(nextTypes)) {
      if (context) {
        const animations: Promise<void>[] = [];
        for (const { i, j } of positions) {
          const item = matrix[i][j];
          if (!item.image) continue;
          item.image.setTexture(`item-${item.type}`);
          animations.push(
            doAnimation(context.scene, {
              targets: item.image,
              alpha: { from: 0.28, to: 1 },
              duration: 230,
              ease: "Sine.easeOut",
            })
          );
        }
        await Promise.all(animations);
      }
      return true;
    }
  }

  return false;
}

function generateDisappearSprite(i: number, j: number, context: CONTEXT) {
  const animationKey = "animation-disappear-" + i + "-" + j;
  if (context.scene.anims.exists(animationKey)) {
    context.scene.anims.remove(animationKey);
  }
  context.scene.anims.create({
    key: animationKey,
    frames: context.scene.anims.generateFrameNumbers(
      constant.TEXTURE_KEY_DISAPPEAR,
      { start: 0, end: 14 }
    ),
    frameRate: 22,
    repeat: 0,
  });

  const disappear = context.scene.add.sprite(
    context.startX + j * (context.cellWidth + context.dividerWidth) - 10 * constant.SCALE,
    context.startY + i * (context.cellWidth + context.dividerWidth) - 10 * constant.SCALE,
    constant.TEXTURE_KEY_DISAPPEAR
  );
  (disappear as any).tag = `sprite: ${i},${j}`;
  disappear.setScale(constant.SCALE * 2);
  disappear.setAlpha(0.9);

  return disappear;
}
