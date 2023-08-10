import { Scene } from "phaser";

let _instance: GameService | undefined = undefined;
let _currentScene = "";

export class GameService extends Scene {
  get currentScene() {
    return this.scene.get(_currentScene);
  }

  resetInstance() {
    _instance = new GameService({});
    return _instance;
  }

  static asSingleton() {
    return _instance ? _instance : (_instance = new GameService({}));
  }
}
