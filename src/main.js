import "./style.css";
import { AUTO, Game, Loader } from "phaser";
import { MainScene } from "./scenes/main.scene";
import { TitleScene } from "./scenes/title.scene";
import * as images from "./assets/images";

const config = {
  type: AUTO,
  parent: "game-canvas",
  width: 940,
  height: 520,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    },
  },
  pixelArt: true,
  scene: [MainScene],
};

(function () {
  new Game(config);
})();
