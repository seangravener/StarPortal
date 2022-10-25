import { Scene } from "phaser";
import { TitleScene } from "./title.scene";
import { ShapesScene } from "./shapes.scene";
import { PlayerScene } from "./player.scene";

export class MainScene extends Scene {
  constructor() {
    super({ key: "MainScene" });
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
