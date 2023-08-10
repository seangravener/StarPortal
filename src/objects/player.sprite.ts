import { Input, Scene, Types } from "phaser";
import { BaseSprite, SpriteDefinition } from "./base.sprite";
import { StateMachine } from "xstate";
import { flyingService } from "./player.states";

export class PlayerSprite extends BaseSprite {
  flyingService: any;
  cursorKeys: Types.Input.Keyboard.CursorKeys;
  keys: any;
  input: any;

  constructor({ scene, x, y, texture }: SpriteDefinition) {
    super({ scene, x, y, texture });
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("W,A,S,D");
    this.input = {};

    this.flyingService = flyingService;
    this.flyingService.start();
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
      // console.log(animationName);
      this.anims.create({
        key: animationName,
        repeat: 0,
        frameRate: 30,
        frames: playerFrames,
      });
    }
  }

  handleInputs() {
    if (
      this.cursorKeys.left.isUp &&
      this.flyingService.state.value === "FlyingLeft"
    ) {
      this.flyingService.send("stop-fly-left");
    } else if (
      this.cursorKeys.right.isUp &&
      this.flyingService.state.value === "FlyingRight"
    ) {
      this.flyingService.send("stop-fly-right");
    }

    if (
      this.cursorKeys.left.isDown &&
      this.flyingService.state.value !== "FlyingLeft"
    ) {
      this.flyingService.send("fly-left");
    } else if (
      this.cursorKeys.right.isDown &&
      this.flyingService.state.value !== "FlyingRight"
    ) {
      this.flyingService.send("fly-right");
    }

    if (this.cursorKeys.left.isDown) {
      console.log("left");
      flyingService.send("fly-left");
    } else if (this.cursorKeys.right.isDown) {
      flyingService.send("fly-right");
    } else if (this.cursorKeys.up.isDown) {
      flyingService.send("fly-up");
    } else if (this.cursorKeys.down.isDown) {
      flyingService.send("fly-down");
    } else {
      if (
        flyingService.state.value === "FlyingLeft" ||
        flyingService.state.value === "FlyingRight"
      ) {
        flyingService.send("stop-horizontal");
      }
      if (
        flyingService.state.value === "FlyingUp" ||
        flyingService.state.value === "FlyingDown"
      ) {
        flyingService.send("stop-vertical");
      }
    }
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.handleInputs();

    switch (this.flyingService.state.value) {
      case "FlyingLeft":
        this.body.setAccelerationX(-500);
        if (
          !this.anims.isPlaying ||
          this.anims.currentAnim.key !== "left-turn"
        ) {
          this.setFlipX(false);
          this.play("left-turn", true);
        }
        break;

      case "FlyingRight":
        this.body.setAccelerationX(500);
        if (
          !this.anims.isPlaying ||
          this.anims.currentAnim.key !== "right-turn"
        ) {
          this.setFlipX(true);
          this.play("right-turn", true);
        }
        break;

      case "FlyingUp":
        this.body.setAccelerationY(-250);
        break;

      case "FlyingDown":
        this.body.setAccelerationY(250);
        break;

      default:
        this.body.setAccelerationX(0);
        this.body.setAccelerationY(0);
        break;
    }
  }

  protected preUpdate_og(time: number, delta: number): void {
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
