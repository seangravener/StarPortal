import { Types, Scene } from "phaser";
import { LayoutManager } from "../lib/layout.manager";
import { PlayerSprite } from "../objects/player.sprite";
import { flyingStateMachine } from "../objects/player.states";
import * as images from "../assets/images";
import * as sprites from "../assets/sprites";
import { StateMachine } from "xstate";

export class PlayerScene extends Scene {
  cursorKeys: Types.Input.Keyboard.CursorKeys | undefined;
  cursorKeysAlt: any;
  layout: LayoutManager;
  player1: PlayerSprite | undefined;
  moveState: StateMachine<any, any, any>;
  backgroundParallax1: Phaser.GameObjects.TileSprite;
  backgroundPlanet: Phaser.GameObjects.TileSprite;
  backgroundParallax2: Phaser.GameObjects.TileSprite;

  constructor() {
    super({ key: "PlayerScene" });
    this.moveState = flyingStateMachine;
  }

  preload() {
    this.load.atlas("heroship", sprites.heroship_png, sprites.heroship_json);

    this.load.image("background_static", images.bgStatic1);
    this.load.image("background_parallax1", images.bgParallax1);
    this.load.image("background_parallax2", images.bgParallax2);
    this.load.image("background_planet", images.bgPlanet);
  }

  create() {
    this.layout = new LayoutManager({ scene: this });
    this.setBackground();
    this.createInputs();
    this.createPlayers();

    this.moveState.transition("FlyingLeft", () =>
      console.log("ok, flying now")
    );

    console.log(
      "trans",
      this.moveState.transition("Flying", () => console.log("flying event"))
    );
  }

  setBackground() {
    const [w, h] = [this.cameras.main.width, this.cameras.main.height];

    this.add.tileSprite(0, 0, w, h, "background_static").setOrigin(0);

    // Add the near background, make sure it's added after the far background to ensure proper layering.
    this.backgroundParallax2 = this.add
      .tileSprite(0, 0, w, h, "background_parallax2")
      .setAlpha(0.10)
      .setOrigin(0)
      .setScrollFactor(0);

    // Add the far background.
    this.backgroundParallax1 = this.add
      .tileSprite(0, 0, w, h, "background_parallax1")
      .setAlpha(0.10)
      .setOrigin(0)
      .setScrollFactor(0);

    // Add the near background, make sure it's added after the far background to ensure proper layering.
    this.backgroundPlanet = this.add
      .tileSprite(0, 0, w, h, "background_planet")
      .setOrigin(0)
      .setScrollFactor(0);
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

  update() {
    const velocity = 0.5;

    this.backgroundParallax1.tilePositionY -= velocity * 0.5;
    this.backgroundPlanet.tilePositionY -= velocity;
    this.backgroundParallax2.tilePositionY -= velocity * 2;
  }
}
