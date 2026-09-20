import { Scene } from "phaser";
import { constant } from "./Constant";
import { draw, fill, getRandomFiveElements } from "./LevelUtils";

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
  private goalsText: Phaser.GameObjects.Text[] = [];

  private moveCallback: () => void;
  public randomTypeSelection = getRandomFiveElements([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
]);

  public updateGoals(delta1: number, delta2: number) {
    this.goalsCount[0] += delta1;
    this.goalsCount[1] += delta2;

    this.goalsCount[0] = Math.min(4 * this.levelCount, this.goalsCount[0]);
    this.goalsCount[1] = Math.min(4 * this.levelCount, this.goalsCount[1]);
    this.goalsText[0].setText(`${this.goalsCount[0]}/${4 * this.levelCount}`);
    this.goalsText[1].setText(`${this.goalsCount[1]}/${4 * this.levelCount}`);
  }

  public isClear() {
    return this.goalsCount[0] === 4 * this.levelCount && this.goalsCount[1] === 4 * this.levelCount;  
  }

  public getGoals() {
    return this.goals;
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

  constructor(scene: Scene, moveCallback: () => void, textureKey: string, matrix: number[][], levelCount: number) {
    this.scene = scene;
    this.moveCallback = moveCallback;
    this.textureKey = textureKey;
    this.levelCount = levelCount;
    this.matrix = matrix;
    this.goalsCount = [
      0,
      0,
    ];
  }

  shuffle = (array: number[]) => { 
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }; 

  public gameArea() {
    const gameAreaFrame = this.scene.add.image(
      0,
      0,
      this.textureKey,
    );
    gameAreaFrame.setScale(constant.SCALE);
    gameAreaFrame.setX(this.gameAreaX * constant.SCALE + gameAreaFrame.displayWidth / 2);
    gameAreaFrame.setY(this.gameAreaY * constant.SCALE + gameAreaFrame.displayHeight / 2);

    const gameAreaCell = this.scene.add.image(
      0,
      0,
      constant.TEXTURE_KEY_GAME_AREA_CELL
    );
    gameAreaCell.setScale((constant.SCALE * 122) / 104);
    gameAreaCell.setX(this.gameAreaCellX * constant.SCALE + gameAreaCell.displayWidth / 2);
    gameAreaCell.setY(this.gameAreaCellY * constant.SCALE + gameAreaCell.displayHeight / 2);

    this.cellWidth = gameAreaCell.displayWidth;
    this.dividerWidth = 4 * constant.SCALE;
    let startX = gameAreaCell.x - (this.cellWidth + this.dividerWidth);
    let startY = gameAreaCell.y;

    // 8 * 7 Matrix
    for (let j = 0; j < this.matrix.length; j++) {
      for (let i = 0; i < this.matrix[j].length; i++) {
        this.positions.push({
          x: startX + i * (this.cellWidth + this.dividerWidth),
          y: startY + j * (this.cellWidth + this.dividerWidth),
        });
      }
    }
    console.log(this.matrix);
    const matrixCell = this.matrix.map((e) => e.map((e) => ({ type: e })));
    const matrixSprite = this.matrix.map((e) => e.map((e) => ({} as any)));

    console.log(matrixCell);

    fill(matrixCell, this.randomTypeSelection).then(() => {
      const distinctTypes = this.shuffle(Array.from(
        new Set(matrixCell.flatMap(cells => cells.map(cell => cell.type)))
      ).filter(type => type > 0));

      if (this.goals.length === 0) {
        this.goals.push(distinctTypes[0]);
        this.goals.push(distinctTypes[1]);
        const goal1 = this.scene.add.image(205, 37, `item-${this.goals[0]}`);
        const goal2 = this.scene.add.image(255, 37, `item-${this.goals[1]}`);
        const goal1Text = this.scene.add.text(190, 55, `0/${this.levelCount * 4}`);
        goal1Text.setColor("black");
        const goal2Text = this.scene.add.text(240, 55, `0/${this.levelCount * 4}`);
        goal2Text.setColor("black");
        goal1.setScale(this.cellWidth / goal1.width * 0.7);
        goal2.setScale(this.cellWidth / goal2.width * 0.7);

        this.goalsText.push(goal1Text);
        this.goalsText.push(goal2Text);
      }
      console.log(this.goals);
      draw(
        matrixCell,
        matrixSprite,
        {
          scene: this.scene,
          startX: startX,
          startY: startY,
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
