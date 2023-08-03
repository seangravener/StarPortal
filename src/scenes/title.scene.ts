import { Cameras, Scene, Types } from "phaser";
import * as images from "../assets/images";
import { LayoutManager } from "../lib/layout.manager";

const _paths = [images.bgStatic1, images.bgPlanet];
const _images: any[] = [];
const _texts: any[] = [];

export class TitleScene extends Scene {
  layoutManager: LayoutManager;
  cursorKeys: Types.Input.Keyboard.CursorKeys | undefined;

  constructor() {
    super({ key: "TitleScene" });
  }

  preload() {
    for (const path of _paths) {
      this.load.image(path, path);
    }
  }

  create() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    const [w, h] = [this.cameras.main.width, this.cameras.main.height];
    const coords: [number, number, number, number] = [0, 0, w, h];
    for (const path of _paths) {
      _images.push(this.add.tileSprite(...coords, path).setOrigin(0));
    }

    this.createTitle();

    this.input.keyboard.once("keydown-SPACE", () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });

    this.cameras.main.once(
      Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        // this.scene.start("ShapesScene", { fadeIn: true });
        this.scene.start("PlayerScene", { fadeIn: true });
      }
    );

    this.cameras.main.fadeIn(1000, "#000000");

    this.layoutManager = new LayoutManager({
      scene: this,
    });
  }

  createTitle() {
    const topRowSize = 64;

    const color = "#cfcfcf";
    const [x, y] = [
      this.game.canvas.width / 2,
      this.game.canvas.height / 2 - topRowSize,
    ];

    // wrap in a new scene\container and append here
    this.add
      .text(x, y, "Star", {
        color,
        font: `${topRowSize}px PilotCommandLaser`,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(x, y + topRowSize, "Portal", {
        color,
        font: `${topRowSize + 8}px PilotCommandHalftone`,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(x, y + topRowSize * 2, "custom text", {
        color,
        font: `${topRowSize * 0.5}px SpaceRanger`,
      })
      .setOrigin(0.5, 0.5);
  }

  update(delta) {
    _images[1].tilePositionY += 0.25;
  }
}

/**
 * [x] seamless looping background
 * [x] fade transition to MenuScene
 * [ ] grid placement for items and text
 * [ ] start\continue
 *
 * Other scenes:
 * [ ] Dialog scene (with NineSlice)
 * [ ] Camera movement
 * [ ] Grid alignment that can align scenes and objects
 */
