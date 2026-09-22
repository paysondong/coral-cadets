import { Scene } from "phaser";
import { constant } from "./Constant";
import { draw, fill } from "./LevelUtils";

type GameSceneBridge = Scene & {
  setupGoalHud?: (types: number[], target: number) => void;
  updateGoalHud?: (counts: number[], target: number) => void;
};

const LEVEL_PALETTES: number[][] = [
  [1, 2, 3, 5, 8],
  [2, 3, 4, 5, 6],
  [1, 4, 5, 7, 14],
  [1, 3, 8, 9, 12],
  [2, 5, 6, 10, 13],
  [1, 7, 8, 11, 12],
  [3, 4, 5, 9, 13],
  [1, 6, 7, 10, 11],
  [3, 5, 8, 12, 13],
];

export class Level {
  private scene: Scene;
  private textureKey: string;
  private gameAreaX: number = 0;
  private gameAreaY: number = 624;
  private gameAreaCellX: number = 0;
  private gameAreaCellY: number = 647;
  private cellWidth: number = 0;
  private dividerWidth: number = 0;
  private positions: { x: number; y: number }[] = [];
  private matrix: number[][];
  private goals: number[] = [];
  private goalsCount: number[];
  private levelCount: number;
  private moveCallback: () => void;

  public randomTypeSelection: number[];

  public updateGoals(delta1: number, delta2: number) {
    const target = 4 * this.levelCount;
    this.goalsCount[0] += delta1;
    this.goalsCount[1] += delta2;
    this.goalsCount[0] = Math.min(target, this.goalsCount[0]);
    this.goalsCount[1] = Math.min(target, this.goalsCount[1]);

    (this.scene as GameSceneBridge).updateGoalHud?.(this.goalsCount, target);
  }

  public isClear() {
    const target = 4 * this.levelCount;
    return this.goalsCount[0] === target && this.goalsCount[1] === target;
  }

  public getGoals() {
    return this.goals;
  }

  public getGoalCounts() {
    return [...this.goalsCount];
  }

  protected setGameAreaX(x: number) {
    this.gameAreaX = x;
  }

  protected setGameAreaY(y: number) {
    this.gameAreaY = y;
  }

  protected setGameAreaCellX(x: number) {
    this.gameAreaCellX = x;
  }

  protected setGameAreaCellY(y: number) {
    this.gameAreaCellY = y;
  }

  constructor(
    scene: Scene,
    moveCallback: () => void,
    textureKey: string,
    matrix: number[][],
    levelCount: number
  ) {
    this.scene = scene;
    this.moveCallback = moveCallback;
    this.textureKey = textureKey;
    this.levelCount = levelCount;
    this.matrix = matrix;
    this.goalsCount = [0, 0];
    this.randomTypeSelection = [...LEVEL_PALETTES[(levelCount - 1) % LEVEL_PALETTES.length]];
  }

  shuffle = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  public gameArea() {
    const gameAreaFrame = this.scene.add.image(0, 0, this.textureKey);
    gameAreaFrame.setScale(constant.SCALE);
    gameAreaFrame.setX(
      this.gameAreaX * constant.SCALE + gameAreaFrame.displayWidth / 2
    );
    gameAreaFrame.setY(
      this.gameAreaY * constant.SCALE + gameAreaFrame.displayHeight / 2
    );
    gameAreaFrame.setAlpha(0.94);

    const gameAreaCell = this.scene.add.image(
      0,
      0,
      constant.TEXTURE_KEY_GAME_AREA_CELL
    );
    gameAreaCell.setScale((constant.SCALE * 122) / 104);
    gameAreaCell.setX(
      this.gameAreaCellX * constant.SCALE + gameAreaCell.displayWidth / 2
    );
    gameAreaCell.setY(
      this.gameAreaCellY * constant.SCALE + gameAreaCell.displayHeight / 2
    );
    gameAreaCell.setAlpha(0.01);

    this.cellWidth = gameAreaCell.displayWidth;
    this.dividerWidth = 4 * constant.SCALE;
    const startX = gameAreaCell.x - (this.cellWidth + this.dividerWidth);
    const startY = gameAreaCell.y;

    this.positions = [];
    for (let j = 0; j < this.matrix.length; j++) {
      for (let i = 0; i < this.matrix[j].length; i++) {
        this.positions.push({
          x: startX + i * (this.cellWidth + this.dividerWidth),
          y: startY + j * (this.cellWidth + this.dividerWidth),
        });
      }
    }

    const matrixCell = this.matrix.map((row) => row.map((type) => ({ type })));
    const matrixSprite = this.matrix.map((row) =>
      row.map(() => ({} as Phaser.GameObjects.Sprite))
    );

    fill(matrixCell, this.randomTypeSelection).then(() => {
      const distinctTypes = this.shuffle(
        Array.from(
          new Set(matrixCell.flatMap((cells) => cells.map((cell) => cell.type)))
        ).filter((type) => type > 0)
      );

      if (this.goals.length === 0) {
        this.goals.push(distinctTypes[0]);
        this.goals.push(distinctTypes[1]);
        (this.scene as GameSceneBridge).setupGoalHud?.(
          this.goals,
          4 * this.levelCount
        );
      }

      draw(
        matrixCell,
        matrixSprite,
        {
          scene: this.scene,
          startX,
          startY,
          cellWidth: this.cellWidth,
          dividerWidth: this.dividerWidth,
        },
        () => {
          this.moveCallback();
        }
      );
    });
  }
}
