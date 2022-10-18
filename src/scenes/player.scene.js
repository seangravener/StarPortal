import { Scene } from "phaser";
import { LayoutManager } from "../lib/layout.manager";
import { PlayerSprite } from "../objects/player.sprite";
import * as sprites from "../assets/sprites";

export class PlayerScene extends Scene {
  keys;

  constructor() {
    super();
  }

  preload() {
    this.load.atlas("heroship", sprites.heroship_png, sprites.heroship_json);
  }

  create() {
    this.layout = new LayoutManager({ scene: this });
    this.createInputs();
    this.createPlayers();
  }

  createInputs() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursorKeysAlt = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      fire: "SPACE",
    });
  }

  createPlayers() {
    this.player1 = new PlayerSprite({
      scene: this,
      x: 100,
      y: 100,
      texture: this.textures.get("heroship"),
    });
    this.layout.place(6, 6, this.player1);

    // this.player2 = new PlayerSprite({
    //   scene: this,
    //   x: 100,
    //   y: 200,
    //   texture: this.textures.get("heroship"),
    // });
  }

  addImages() {
    var atlasTexture = this.textures.get("heroship");
    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++) {
      var x = Phaser.Math.Between(0, 800);
      var y = Phaser.Math.Between(0, 600);

      // this.add.sprite(x, y, "heroship", frames[i]);
    }
  }

  update() {}
}
