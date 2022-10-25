import { Types, Scene } from "phaser";
import { LayoutManager } from "../lib/layout.manager";
import { PlayerSprite } from "../objects/player.sprite";
import { flyingStateMachine } from "../objects/player.states";
import * as sprites from "../assets/sprites";
import { StateMachine } from "xstate";

export class PlayerScene extends Scene {
  cursorKeys: Types.Input.Keyboard.CursorKeys | undefined;
  cursorKeysAlt: any;
  layout: LayoutManager;
  player1: PlayerSprite | undefined;
  moveState: StateMachine<any, any, any>;

  constructor() {
    super({ key: "PlayerScene" });
    this.moveState = flyingStateMachine;
  }

  preload() {
    this.load.atlas("heroship", sprites.heroship_png, sprites.heroship_json);
  }

  create() {
    this.layout = new LayoutManager({ scene: this });
    this.createInputs();
    this.createPlayers();

    this.moveState.transition("FlyingLeft", () => console.log("ok, flying now"));

    console.log(
      "trans",
      this.moveState.transition("Flying", () => console.log("flying event"))
    );
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
