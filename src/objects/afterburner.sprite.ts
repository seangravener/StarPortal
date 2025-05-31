import { BaseSprite, SpriteDefinition } from "./base.sprite";

export interface AfterburnerDefinition extends SpriteDefinition {
  parentSprite: Phaser.GameObjects.Sprite;
  offsetX?: number;
  offsetY?: number;
  intensity?: number;
}

export class AfterburnerSprite extends BaseSprite {
  private parentSprite: Phaser.GameObjects.Sprite;
  private offsetX: number;
  private offsetY: number;
  private intensity: number;
  private flames: Phaser.GameObjects.Sprite[] = [];
  private flameTimer: number = 0;
  private maxFlames: number = 3;

  constructor({
    scene,
    x,
    y,
    texture,
    frame,
    parentSprite,
    offsetX = 0,
    offsetY = 30,
    intensity = 1.0,
  }: AfterburnerDefinition) {
    super({ scene, x, y, texture, frame });
    this.parentSprite = parentSprite;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.intensity = intensity;

    this.setVisible(false);
    this.setDepth(5); // Above background but behind ship

    // Initialize flame particles
    this.createFlamePool();
  }

  private createFlamePool() {
    // Create a pool of flame sprites using different projectile frames for variety
    const flameFrames = [
      "Plasma_Large.png",
      "Plasma_Medium.png",
      "Plasma_Small.png",
    ];

    for (let i = 0; i < this.maxFlames; i++) {
      const flame = this.scene.add.sprite(
        0,
        0,
        "phaser",
        flameFrames[i % flameFrames.length]
      );
      flame.setVisible(false);
      flame.setTint(0xff4500); // Orange-red color
      flame.setBlendMode(Phaser.BlendModes.ADD); // Additive blending for glow effect
      flame.setDepth(5); // Same depth as main afterburner
      this.flames.push(flame);
    }
  }

  public setIntensity(intensity: number) {
    this.intensity = Math.max(0, Math.min(2.5, intensity));
  }

  public activate() {
    this.setVisible(true);
    this.flames.forEach((flame) => flame.setVisible(true));
  }

  public deactivate() {
    this.setVisible(false);
    this.flames.forEach((flame) => flame.setVisible(false));
  }

  public updateAfterburner(time: number, delta: number) {
    // Update position relative to parent sprite
    this.x = this.parentSprite.x + this.offsetX;
    this.y = this.parentSprite.y + this.offsetY;

    if (this.visible) {
      this.updateFlameAnimation(time, delta);
    }
  }

  private updateFlameAnimation(time: number, delta: number) {
    this.flameTimer += delta;

    this.flames.forEach((flame, index) => {
      // Stagger the flame positions
      const staggerY = index * 8;
      const staggerX = Math.sin(time * 0.01 + index) * 2 * this.intensity;

      flame.x = this.x + staggerX;
      flame.y = this.y + staggerY;

      // Animate scale based on intensity and time
      const baseScale = 0.5 + this.intensity * 0.3;
      const pulseScale = Math.sin(time * 0.02 + index * 0.5) * 0.2;
      flame.setScale(baseScale + pulseScale);

      // Animate alpha for flickering effect
      const baseAlpha = 0.6 + this.intensity * 0.3;
      const flickerAlpha = Math.sin(time * 0.03 + index * 0.8) * 0.3;
      flame.setAlpha(baseAlpha + flickerAlpha);

      // Color variation based on intensity
      if (this.intensity > 1.5) {
        flame.setTint(0x00ffff); // Blue flame for high intensity
      } else if (this.intensity > 1.0) {
        flame.setTint(0xffff00); // Yellow flame for medium intensity
      } else {
        flame.setTint(0xff4500); // Orange flame for normal intensity
      }
    });
  }

  public destroy() {
    this.flames.forEach((flame) => flame.destroy());
    this.flames = [];
    super.destroy();
  }
}
