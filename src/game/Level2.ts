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
  [number, number, number, number, number, number, number, number, number]
] = [
  [-1, -1, -1, 0, 0, 0, -1, -1, -1],
  [-1, -1, -1, 0, 0, 0, -1, -1, -1],
  [-1, -1, 0, 0, 0, 0, 0, -1, -1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [-1, -1, 0, 0, 0, 0, 0, -1, -1],
  [-1, -1, -1, 0, 0, 0, -1, -1, -1],
  [-1, -1, -1, 0, 0, 0, -1, -1, -1],
];

export class Level2 extends Level {
  constructor(scene: Scene, moveCallback: () => void) {
    super(scene, moveCallback, constant.TEXTURE_KEY_LEVEL_2, matrix, 2);
    this.setGameAreaCellX(155);
    this.setGameAreaX(0);
  }
}
