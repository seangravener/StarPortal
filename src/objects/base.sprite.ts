import { GameObjects, Physics, Scene, Textures } from "phaser";

export type SpriteDefinition = {
  scene: Scene;
  x: number;
  y: number;
  texture: string | Textures.Texture;
  frame?: string | number;
};

export class BaseSprite extends GameObjects.Sprite {
  body: Physics.Arcade.Body;

  constructor({ scene, x, y, texture, frame }: SpriteDefinition) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
