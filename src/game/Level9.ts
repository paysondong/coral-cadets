import { Scene } from "phaser";
import { constant } from "./Constant";
import { Level } from "./Level";

const matrix: [
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number],
  [number, number, number, number, number, number, number]
] = [
  [-1, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, -1],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [-1, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, -1],
]

export class Level9 extends Level {
  constructor(scene: Scene, moveCallback: () => void) {
    super(scene, moveCallback, constant.TEXTURE_KEY_LEVEL_9, matrix, 9); 
    this.setGameAreaX(120);
    this.setGameAreaY(626);
    this.setGameAreaCellX(267);
  }
}
