import { BaseSprite, SpriteDefinition } from "./base.sprite";

export interface ProjectileDefinition extends SpriteDefinition {
  velocity?: number;
  direction?: number;
}

export class ProjectileSprite extends BaseSprite {
  private velocity: number;
  private direction: number;

  constructor({
    scene,
    x,
    y,
    texture,
    frame,
    velocity = 500,
    direction = -1,
  }: ProjectileDefinition) {
    super({ scene, x, y, texture, frame });

    this.velocity = velocity;
    this.direction = direction; // -1 for up, 1 for down

    // Set up physics body
    this.body.setSize(this.width * 0.8, this.height * 0.8);
    this.body.setVelocityY(this.velocity * this.direction);

    // Remove projectile when it goes off screen
    this.scene.time.delayedCall(3000, () => {
      if (this.active) {
        this.destroy();
      }
    });
  }

  update() {
    // Destroy projectile if it goes off screen
    if (this.y < -50 || this.y > this.scene.cameras.main.height + 50) {
      this.destroy();
    }
  }
}
