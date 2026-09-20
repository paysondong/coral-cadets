import { Scene } from "phaser";
import { constant } from "./Constant";
import { Level } from "./Level";

const matrix: [
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number, number]
] = [
  [-1, 0, 0, -1, -1, 0, 0, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-1, 0, 0, 0, 0, 0, 0, -1],
  [-1, -1, 0, 0, 0, 0, -1, -1],
  [-1, -1, -1, 0, 0, -1, -1, -1],
];

export class Level1 extends Level {
  constructor(scene: Scene, moveCallback: () => void) {
    super(scene, moveCallback, constant.TEXTURE_KEY_LEVEL_1, matrix, 1);
    this.setGameAreaCellX(213);
    this.setGameAreaX(68);
  }
}
