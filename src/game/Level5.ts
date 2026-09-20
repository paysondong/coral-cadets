import { Scene } from "phaser";
import { constant } from "./Constant";
import { Level } from "./Level";

const matrix: [
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number, number]
] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export class Level5 extends Level {
  constructor(scene: Scene, moveCallback: () => void) {
    super(scene, moveCallback, constant.TEXTURE_KEY_LEVEL_5, matrix, 5);
    this.setGameAreaX(3.5);
    this.setGameAreaY(626);
    this.setGameAreaCellX(143);
  }
}
