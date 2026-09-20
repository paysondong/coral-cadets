import { constant } from "./Constant";
import { SceneLevel } from "./SceneLevel";

export class SceneLevel3 extends SceneLevel {
  constructor() {
    super(3, constant.TEXTURE_KEY_LEVEL_3);
  }
}