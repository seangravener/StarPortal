import { SceneController } from "../lib/scene.controller";
import { TitleScene } from "./title.scene";
import { ShapesScene } from "./shapes.scene";
import { PlayerScene } from "./player.scene";
import { Cameras } from "phaser";

export class MainScene extends SceneController {
  constructor() {
    super();
  }

  preload() {}

  create() {
    this.scene.add("TitleScene", TitleScene);
    // this.scene.add("MenuScene", MenuScene);
    this.scene.add("ShapesScene", ShapesScene);
    this.scene.add("PlayerScene", PlayerScene);

    this.scene.start("TitleScene");
  }
}
