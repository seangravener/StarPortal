import { Scene } from "phaser";

let _instance = undefined;
let _currentScene = "";

class GameService extends Scene {
  get currentScene() {
    this.scene.get(_currentScene);
  }

  static asSingleton() {
    return _instance ? _instance : (_instance = new GameService());
  }
}

export { GameService };
