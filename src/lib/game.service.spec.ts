// import { describe, beforeEach, afterEach, it, expect } from "vitest";
import { Game, Scene } from "phaser";
import { GameService } from "./game.service";

describe("GameService", () => {
  let service: GameService;

  beforeEach(() => {
    // Since GameService is a singleton, we need to reset its instance before each test
    // Please replace this with the actual method to reset the GameService singleton.
    // As of September 2021, there's no common way to do this, so it depends on your implementation.
    // GameService.resetInstance()
    // service = {} as GameService
    service = GameService.asSingleton();
  });

  afterEach(() => {
    // Cleanup after each test
    // Note: If your game service has some state or side effects, you might want to clean them up here.
  });

  it("GameService is a singleton", async () => {
    const service1 = GameService.asSingleton();
    const service2 = GameService.asSingleton();

    expect(service1).toBe(service2);
  });

  it("currentScene returns a Phaser Scene", async () => {
    const scene = new Scene({ key: "test" });
    service.scene.get = () => scene;

    expect(service.currentScene).toBeInstanceOf(Scene);
  });
});
