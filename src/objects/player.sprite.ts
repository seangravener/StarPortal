import { Input, Types } from "phaser";
import { BaseSprite } from "./base.sprite";

export class PlayerSprite extends BaseSprite {
  cursorKeys: Types.Input.Keyboard.CursorKeys;
  keys: any;
  input: any;

  constructor({ scene, x, y, texture }) {
    super({ scene, x, y, texture });
    this.cursorKeys = scene.cursorKeys;
    this.keys = scene.keys;
    this.input = {};

    this.setupPhysics();
    this.setupAnimations();
  }

  setupPhysics() {
    this.body.setCollideWorldBounds(true).setSize(44, 62).setOffset(12, 0);
    this.scene.physics.world.enable(this);
    this.body.setVelocity(0, 0);
  }

  setupAnimations() {
    const playerFrames = this.anims
      .generateFrameNames("heroship")
      .filter((frame) =>
        frame?.frame?.toString().split("_").includes("PlayerBlue")
      );

    for (const animationName of ["left-turn", "right-turn"]) {
      console.log(animationName);
      this.anims.create({
        key: animationName,
        repeat: 0,
        frameRate: 30,
        frames: playerFrames,
      });
    }
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.input.didPressJump = Input.Keyboard.JustDown(this.cursorKeys.up);

    if (this.cursorKeys.up.isDown) {
      this.body.setAccelerationY(-250);
      this.setFlipY(false);
    } else if (this.cursorKeys.left.isDown) {
      if (
        this.body.velocity.x < 0 &&
        this.body.acceleration.x < 0 &&
        Input.Keyboard.JustDown(this.cursorKeys.left)
      ) {
        this.setFlipX(false);
        this.play("left-turn", true);
      }
      this.body.setAccelerationX(-500);
    } else if (this.cursorKeys.right.isDown) {
      if (
        this.body.velocity.x > 0 &&
        this.body.acceleration.x > 0 &&
        Input.Keyboard.JustDown(this.cursorKeys.right)
      ) {
        console.log(
          "right justdown",
          Input.Keyboard.JustDown(this.cursorKeys.right)
        );
        this.setFlipX(true);
        this.play("right-turn");
      }
      this.body.setAccelerationX(500);
    } else if (this.cursorKeys.down.isDown) {
      this.body.setAccelerationY(250);
      // this.setFlipY(true);
    } else {
      this.body.setAccelerationX(0);
      // this.body.setVelocity(0, 0);
    }
  }
}
