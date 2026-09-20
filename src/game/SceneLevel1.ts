import { constant } from "./Constant";
import { SceneLevel } from "./SceneLevel";

export class SceneLevel1 extends SceneLevel {
  constructor() {
    super(1, constant.TEXTURE_KEY_LEVEL_1, false);
  }
}
