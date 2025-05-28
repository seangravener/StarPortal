import { Types } from "phaser";
import { BaseSprite, SpriteDefinition } from "./base.sprite";
import { flyingService } from "./player.states";

export class PlayerSprite extends BaseSprite {
  flyingService: any;
  cursorKeys: Types.Input.Keyboard.CursorKeys;
  keys: any;
  input: any;
  private lastHorizontalState: string = "";

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

  handleInputs(
    cursorKeys?: Types.Input.Keyboard.CursorKeys,
    cursorKeysAlt?: any
  ) {
    const currentState = this.flyingService.state.value;

    // Use provided inputs or fall back to internal ones
    const keys = cursorKeys || this.cursorKeys;
    const altKeys = cursorKeysAlt || this.keys;

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
  }
}
