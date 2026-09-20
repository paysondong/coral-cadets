import { Scene } from "phaser";
import { constant } from "./Constant";
import { SceneLevel } from "./SceneLevel";
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
export async function fill(matrix: Matrix, randomTypeSelection:number[]) {
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
}

let pointerX = -1;
let pointerY = -1;
let fromI = -1;
let fromJ = -1;

let spriteMatrix: SpriteMatrix;

let moveCallback: () => void;

export function draw(
  matrix: Matrix,
  inputSpriteMatrix: SpriteMatrix,
  context: CONTEXT,
  callback: () => void
) {
  spriteMatrix = inputSpriteMatrix;
  moveCallback = callback;
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

function generateItem(matrix: Matrix, i: number, j: number, context: CONTEXT) {
  const type = matrix[i][j].type;
  const item = context.scene.add.image(0, 0, "item-" + type);
  item.setScale(context.cellWidth / item.width);
  item.setX(context.startX + j * (context.cellWidth + context.dividerWidth));
  item.setY(context.startY + i * (context.cellWidth + context.dividerWidth));
  item.setInteractive();
  (item as any).tag = `item: ${i},${j}`;
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
    let endX = pointer.x;
    let endY = pointer.y;

    let swipeHorizontal = Math.abs(endX - pointerX);
    let swipeVertical = Math.abs(endY - pointerY);

    if (context.scene) {
    (context?.scene as SceneLevel).playSound((context?.scene as SceneLevel).swapSound!);
    }

    if (swipeHorizontal > swipeVertical) {
      if (endX < pointerX) {
        console.log("left: " + Math.abs(endX - pointerX));
        swap(matrix, fromI, fromJ, "left", context);
      } else if (endX > pointerX) {
        console.log("right: " + Math.abs(endX - pointerX));
        swap(matrix, fromI, fromJ, "right", context);
      }
    } else {
      if (endY < pointerY) {
        console.log("top: " + Math.abs(endY - pointerY));
        swap(matrix, fromI, fromJ, "top", context);
      } else if (endY > pointerY) {
        console.log("bottom: " + Math.abs(endY - pointerY));
        swap(matrix, fromI, fromJ, "bottom", context);
      }
    }
  });
  return item;
}

let inSwap = false;
/**
 * 交换两个格子
 * @param matrix 矩阵信息
 * @param itemRow 格子所在行
 * @param itemColumn 格子所在列
 * @param direction 格子方向
 * @param context 上下文
 * @returns
 */
async function swap(
  matrix: Matrix,
  itemRow: number,
  itemColumn: number,
  direction: "left" | "right" | "top" | "bottom",
  context: CONTEXT
) {
  if ((context.scene as SceneLevel)?.showWin) {
    return;
  }
  if (inSwap) {
    console.error("In Swap, please wait");
    return;
  }
  if (itemRow < 0 || itemColumn < 0) {
    return;
  }
  const aItem = matrix[itemRow][itemColumn];
  if (aItem.type === 0 || aItem.type === -1) {
    return;
  }
  inSwap = true;
  console.log(`fromItemRow: ${itemRow}, fromItemColumn: ${itemColumn}`);

  let toItemRow = itemRow;
  let toItemColumn = itemColumn;

  switch (direction) {
    case "left":
      toItemColumn -= 1;
      break;
    case "right":
      toItemColumn += 1;
      break;
    case "top":
      toItemRow -= 1;
      break;
    case "bottom":
      toItemRow += 1;
      break;
    default:
      console.error("no direction");
      break;
  }

  console.log(`toItemRow: ${toItemRow}, toItemColumn: ${toItemColumn}`);
  const bItem = matrix[toItemRow][toItemColumn];
  if (bItem === undefined) {
    console.error("out of bound");
  } else if (bItem.type === -1) {
    console.error("disabled cell");
  } else {
    matrix[toItemRow][toItemColumn] = aItem;
    matrix[itemRow][itemColumn] = bItem;
    if (aItem.image && bItem.image) {
      await Promise.all([
        doAnimation(context.scene, {
          targets: bItem.image,
          x: aItem.image.x,
          y: aItem.image.y,
          duration: 200,
          ease: "Power1",
        }),
        doAnimation(context.scene, {
          targets: aItem.image,
          x: bItem.image.x,
          y: bItem.image.y,
          duration: 200,
          ease: "Power1",
        }),
      ]);
      let rollback = true;
      while (await eliminateIdenticalItem(matrix, context)) {
        rollback = false;
        (context?.scene as SceneLevel).playSound((context?.scene as SceneLevel).elinimateSound!);
        if (context?.scene) {
          (context?.scene as SceneLevel).addScore(50);
        }
        let randomTypeSelection: number[] = [];
        if (context) {
          randomTypeSelection = (context.scene as SceneLevel).level!.randomTypeSelection;
        }
        await fillup(matrix, randomTypeSelection, context);
      }
      if (rollback) {
        matrix[itemRow][itemColumn] = aItem;
        matrix[toItemRow][toItemColumn] = bItem;
        await Promise.all([
          doAnimation(context.scene, {
            targets: aItem.image,
            x: bItem.image.x,
            y: bItem.image.y,
            duration: 200,
            ease: "Power1",
          }),
          doAnimation(context.scene, {
            targets: bItem.image,
            x: aItem.image.x,
            y: aItem.image.y,
            duration: 200,
            ease: "Power1",
          }),
        ]);
      }
    }
  }
  inSwap = false;
  moveCallback();
}
async function doAnimation(
  scene: Scene,
  config: Phaser.Types.Tweens.TweenBuilderConfig
) {
  return new Promise<void>((resolve) => {
    scene.tweens.add({
      ...config,
      onComplete: () => {
        resolve();
      },
    });
  });
}
/**
 * 检查是否有连续相同的格子
 * @param matrix
 * @returns 返回二维数组, 表示连续相同格子区域
 */
function checkIdentical(matrix: Matrix) {
  const identicalArea: { i: number; j: number }[][] = [];
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    const ret = checkIdenticalInRow(row).filter((e) => e.length >= 3);
    // console.log(`第${i}行 , ${ret.map(e => e.join("-")).join(";")}`)
    identicalArea.push(...ret.map((e) => e.map((e) => ({ i, j: e }))));
  }
  for (let j = 0; j < matrix[0].length; j++) {
    const column = new Array(matrix.length)
      .fill(0)
      .map((_, idx) => matrix[idx][j]);
    const ret = checkIdenticalInRow(column).filter((e) => e.length >= 3);
    // console.log(`第${j}列 , ${ret.map(e => e.join("-")).join(";")}`)
    const areas = ret.map((e) => e.map((e) => ({ i: e, j })));
    areas.forEach((area) => {
      //这条竖线上任意一点已经在行上有连续的点,则把这条竖线跟行的点加在一起
      let joinRow = false;
      for (let point of area) {
        const found = identicalArea.find((e) =>
          e.find((p) => p.i === point.i && p.j === point.j)
        );
        if (found) {
          joinRow = true;
          found.push(...area);
          break;
        }
      }
      if (!joinRow) {
        identicalArea.push(area);
      }
    });
  }
  return identicalArea;
}

function checkIdenticalInRow(row: ItemInfo[]) {
  let result: number[][] = [];
  let i = 0;
  result[i] = [0];
  row
    .map((e) => e.type)
    .reduce((pre, cur, curIdx) => {
      cur === pre && cur !== -1
        ? result[i].push(curIdx)
        : (result[++i] = [curIdx]);
      return cur;
    });
  return result;
}
/**
 * 消除相同的格子
 * @param matrix
 */
async function eliminateIdenticalItem(matrix: Matrix, context?: CONTEXT) {
  const identialItems = checkIdentical(matrix);
  const elimatedItems = [];
  const promises = [];
  let goals: number[] = [];
  let goalCounts: number[] = [];
  if (context?.scene) {
    goals = (context.scene as SceneLevel).level?.getGoals()!;
    goalCounts = new Array(goals.length);
    goalCounts.fill(0);
  }

  for (let area of identialItems) {
    for (let point of area) {
      const item = matrix[point.i][point.j];
      if (goals[0] === item.type) {
        goalCounts[0]++;
      } else if (goals[1] === item.type) {
        goalCounts[1]++;
      }
      item.type = 0;
      if (context) {
        spriteMatrix[point.i][point.j].play(
          "animation-disappear-" + point.i + "-" + point.j
        );
        promises.push(
          doAnimation(context.scene, {
            targets: item.image,
            alpha: 0,
            duration: 500,
            ease: "Power1",
          })
        );
        elimatedItems.push(item.image);
      }
      item.image = undefined;
    }
  }
  await Promise.all(promises);
  elimatedItems.forEach((e) => {
    e?.destroy();
  });
  if (context?.scene) {
    (context?.scene as SceneLevel).level?.updateGoals(goalCounts[0], goalCounts[1]);
  }
  return identialItems.length > 0;
}

/**
 * 掉落补齐空格
 * @param matrix
 */
async function fillup(matrix: Matrix, randomTypeSelection: number[], context?: CONTEXT) {
  if (context?.scene) {
    (context?.scene as SceneLevel).playSound((context?.scene as SceneLevel).dropSound!);
  }
  let hasEmpty = false;
  const promises = [];
  for (let j = 0; j < matrix[0].length; j++) {
    const column = new Array(matrix.length)
      .fill(0)
      .map((_, idx) => matrix[idx][j]);
    const leftItems = column.filter((e) => e.type > 0);
    if (!column.find((e) => e.type === 0)) {
      continue;
    }
    hasEmpty = true;
    let idx = leftItems.length - 1;
    for (let i = matrix.length - 1; i >= 0; i--) {
      if (matrix[i][j].type === -1) {
        continue;
      }
      if (idx < 0) {
        matrix[i][j] = {
          type: 0,
        };
      } else {
        matrix[i][j] = leftItems[idx--];
        let image = matrix[i][j]?.image;
        if (context && image) {
          promises.push(
            doAnimation(context.scene, {
              targets: image,
              y:
                context.startY + i * (context.cellWidth + context.dividerWidth),
              duration: 200,
              ease: "Power1",
            })
          );
        }
      }
    }
  }
  await Promise.all(promises);
  if (!hasEmpty) {
    return;
  }
  for (let j = 0; j < matrix[0].length; j++) {
    for (let i = 0; i < matrix.length; i++) {
      const item = matrix[i][j];
      if (item.type === -1) {
        continue;
      } else if (item.type === 0) {
        const index = getRandomInt(0, randomTypeSelection.length - 1);
        item.type = randomTypeSelection[index];
        if (context) {
          item.image = generateItem(matrix, i, j, context);
        }
        break;
      }
    }
  }
  await fillup(matrix, randomTypeSelection, context);
}
async function delay(timeout: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
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
      {
        start: 0,
        end: 14,
      }
    ),
    frameRate: 15,
    repeat: 0,
  });

  const disappear = context.scene.add.sprite(
    context.startX +
      j * (context.cellWidth + context.dividerWidth) -
      10 * constant.SCALE,
    context.startY +
      i * (context.cellWidth + context.dividerWidth) -
      10 * constant.SCALE,
    constant.TEXTURE_KEY_DISAPPEAR
  );
  (disappear as any).tag = `sprite: ${i},${j}`;
  disappear.setScale(constant.SCALE * 2);

  return disappear;
}
