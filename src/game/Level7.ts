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
  [number, number, number, number, number, number, number, number, number]
] = [
  [-1, -1, 0, 0, 0, 0, 0, -1, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, -1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [-1, -1, 0, 0, 0, 0, 0, -1, -1],
  [-1, -1, 0, 0, 0, 0, 0, -1, -1],
];

export class Level7 extends Level {
  constructor(scene: Scene, moveCallback: () => void) {
    super(scene, moveCallback, constant.TEXTURE_KEY_LEVEL_7, matrix, 7);
    this.setGameAreaX(3.5);
    this.setGameAreaY(626);
    this.setGameAreaCellX(143);
  }
}
