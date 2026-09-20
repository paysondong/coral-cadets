import { constant } from "./Constant";
import { SceneLevel } from "./SceneLevel";

export class SceneLevel2 extends SceneLevel {
  constructor() {
    super(2, constant.TEXTURE_KEY_LEVEL_2);
  }
}