import { Types } from "phaser";
import { BaseSprite, SpriteDefinition } from "./base.sprite";
import { AfterburnerSprite } from "./afterburner.sprite";
import { flyingService } from "./player.states";

export class PlayerSprite extends BaseSprite {
  flyingService: any;
  cursorKeys: Types.Input.Keyboard.CursorKeys;
  keys: any;
  input: any;
  private lastHorizontalState: string = "";
  private afterburner: AfterburnerSprite;
  private isMovingForward: boolean = false;

  constructor({ scene, x, y, texture }: SpriteDefinition) {
    super({ scene, x, y, texture });
    this.cursorKeys = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys("W,A,S,D");
    this.input = {};

    this.flyingService = flyingService;
    this.flyingService.start();
    this.setupPhysics();
    this.setupAnimations();
    this.setupAfterburner();
  }

  setupPhysics() {
    this.body.setCollideWorldBounds(true).setSize(44, 62).setOffset(12, 0);
    this.scene.physics.world.enable(this);
    this.body.setVelocity(0, 0);
  }

  setupAnimations() {
    this.anims.create({
      key: "idle",
      frames: [{ key: "heroship", frame: "PlayerBlue_Frame_01" }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: "left-turn",
      frames: [
        { key: "heroship", frame: "PlayerBlue_Frame_01" },
        { key: "heroship", frame: "PlayerBlue_Frame_02" },
      ],
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "right-turn",
      frames: [
        { key: "heroship", frame: "PlayerBlue_Frame_01" },
        { key: "heroship", frame: "PlayerBlue_Frame_02" },
      ],
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: "flying-left",
      frames: [{ key: "heroship", frame: "PlayerBlue_Frame_02" }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: "flying-right",
      frames: [{ key: "heroship", frame: "PlayerBlue_Frame_02" }],
      frameRate: 1,
      repeat: 0,
    });

    this.setFrame("PlayerBlue_Frame_01");
  }

  setupAfterburner() {
    console.log("Setting up afterburner for player");
    // Create afterburner effect positioned behind the ship
    this.afterburner = new AfterburnerSprite({
      scene: this.scene,
      x: this.x,
      y: this.y,
      texture: "phaser",
      frame: "Plasma_Large.png",
      parentSprite: this,
      offsetX: 0,
      offsetY: 40, // Position behind the ship
    });
  }

  handleInputs(
    cursorKeys?: Types.Input.Keyboard.CursorKeys,
    cursorKeysAlt?: any
  ) {
    const currentState = this.flyingService.state.value;

    const keys = cursorKeys || this.cursorKeys;
    const altKeys = cursorKeysAlt || this.keys;

    this.isMovingForward = false;

    if (keys.left.isDown || altKeys.left?.isDown) {
      if (!currentState.includes("Left")) {
        this.flyingService.send("fly-left");
      }
    } else if (keys.right.isDown || altKeys.right?.isDown) {
      if (!currentState.includes("Right")) {
        this.flyingService.send("fly-right");
      }
    } else {
      if (currentState.includes("Left") || currentState.includes("Right")) {
        this.flyingService.send("stop-horizontal");
      }
    }

    if (keys.up.isDown || altKeys.up?.isDown) {
      this.isMovingForward = true;
      if (!currentState.includes("Up")) {
        this.flyingService.send("fly-up");
      }
    } else if (keys.down.isDown || altKeys.down?.isDown) {
      if (!currentState.includes("Down")) {
        this.flyingService.send("fly-down");
      }
    } else {
      if (currentState.includes("Up") || currentState.includes("Down")) {
        this.flyingService.send("stop-vertical");
      }
    }

    this.updateAfterburnerState();
  }

  private updateAfterburnerState() {
    if (this.isMovingForward) {
      this.afterburner.activate();

      // Calculate intensity based on current velocity
      const velocityMagnitude = Math.sqrt(
        this.body.velocity.x * this.body.velocity.x +
          this.body.velocity.y * this.body.velocity.y
      );

      const intensity = Math.min(velocityMagnitude / 300, 2.0); // Normalize to reasonable range
      this.afterburner.setIntensity(Math.max(intensity, 0.8)); // Minimum intensity when moving
    } else {
      this.afterburner.deactivate();
    }
  }

  public setSpeedMultiplier(multiplier: number) {
    if (this.isMovingForward) {
      this.afterburner.setIntensity(multiplier);
    }
  }

  public update() {
    if (this.afterburner) {
      this.afterburner.updateAfterburner(
        this.scene.time.now,
        this.scene.game.loop.delta
      );
    }
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.handleInputs();

    const currentState = this.flyingService.state.value;

    // Reset accelerations
    this.body.setAccelerationX(0);
    this.body.setAccelerationY(0);

    // Determine current horizontal state
    let currentHorizontalState = "";
    if (currentState.includes("Left")) {
      currentHorizontalState = "left";
    } else if (currentState.includes("Right")) {
      currentHorizontalState = "right";
    } else {
      currentHorizontalState = "idle";
    }

    // Handle animation changes when horizontal state changes
    if (currentHorizontalState !== this.lastHorizontalState) {
      console.log(
        `State change: ${this.lastHorizontalState} -> ${currentHorizontalState}`
      );

      switch (currentHorizontalState) {
        case "left":
          this.body.setAccelerationX(-500);
          this.setFlipX(false);
          this.play("left-turn").once("animationcomplete", () => {
            this.play("flying-left");
          });
          break;

        case "right":
          this.body.setAccelerationX(500);
          this.setFlipX(true); // Mirror sprite for right
          this.play("right-turn").once("animationcomplete", () => {
            this.play("flying-right");
          });
          break;

        case "idle":
          this.setFlipX(false);
          this.play("idle");
          break;
      }

      this.lastHorizontalState = currentHorizontalState;
    } else {
      if (currentHorizontalState === "left") {
        this.body.setAccelerationX(-500);
        this.setFlipX(false);

        if (
          !this.anims.isPlaying &&
          this.anims.currentAnim?.key !== "flying-left"
        ) {
          this.play("flying-left");
        }
      } else if (currentHorizontalState === "right") {
        this.body.setAccelerationX(500);
        this.setFlipX(true);

        if (
          !this.anims.isPlaying &&
          this.anims.currentAnim?.key !== "flying-right"
        ) {
          this.play("flying-right");
        }
      }
    }

    if (currentState.includes("Up")) {
      this.body.setAccelerationY(-250);
    } else if (currentState.includes("Down")) {
      this.body.setAccelerationY(250);
    }

    if (this.afterburner) {
      this.afterburner.updateAfterburner(time, delta);
    }
  }

  public destroy() {
    if (this.afterburner) {
      this.afterburner.destroy();
    }
    super.destroy();
  }
}
