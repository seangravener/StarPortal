import { Types, Scene } from "phaser";
import { LayoutManager } from "../lib/layout.manager";
import { PlayerSprite } from "../objects/player.sprite";
import { ProjectileSprite } from "../objects/projectile.sprite";
import { flyingStateMachine } from "../objects/player.states";
import * as images from "../assets/images";
import * as sprites from "../assets/sprites";
import { StateMachine } from "xstate";

export class PlayerScene extends Scene {
  cursorKeys: Types.Input.Keyboard.CursorKeys | undefined;
  cursorKeysAlt: any;
  spaceKey: Phaser.Input.Keyboard.Key | undefined;
  layout: LayoutManager;
  player1: PlayerSprite | undefined;
  moveState: StateMachine<any, any, any>;
  backgroundParallax1: Phaser.GameObjects.TileSprite;
  backgroundPlanet: Phaser.GameObjects.TileSprite;
  backgroundParallax2: Phaser.GameObjects.TileSprite;
  projectiles: Phaser.GameObjects.Group;
  lastShotTime: number = 0;
  shotCooldown: number = 100; // milliseconds between shots

  // Speed control properties
  baseScrollSpeed: number = 0.5;
  currentScrollSpeed: number = 0.5;
  speedMultiplier: number = 1.0;
  maxSpeedMultiplier: number = 2.5;
  minSpeedMultiplier: number = 0.5;
  normalSpeedMultiplier: number = 1.0;
  lastUpKeyTime: number = 0;
  lastDownKeyTime: number = 0;
  doubleKeyThreshold: number = 300; // milliseconds for double key press
  speedIndicatorText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "PlayerScene" });
    this.moveState = flyingStateMachine;
  }

  preload() {
    this.load.atlas("heroship", sprites.heroship_png, sprites.heroship_json);
    this.load.atlas("phaser", sprites.phaser_png, sprites.phaser_json);

    this.load.image("background_static", images.bgStatic1);
    this.load.image("background_parallax1", images.bgParallax1);
    this.load.image("background_parallax2", images.bgParallax2);
    this.load.image("background_planet", images.bgPlanet);
  }

  create() {
    this.layout = new LayoutManager({ scene: this });
    this.setBackground();
    this.createInputs();
    this.createPlayers();
    this.createProjectileGroup();
    this.createSpeedIndicator();
  }

  setBackground() {
    const [w, h] = [this.cameras.main.width, this.cameras.main.height];

    this.add.tileSprite(0, 0, w, h, "background_static").setOrigin(0);

    this.backgroundParallax2 = this.add
      .tileSprite(0, 0, w, h, "background_parallax2")
      .setAlpha(0.1)
      .setOrigin(0)
      .setScrollFactor(0);

    this.backgroundParallax1 = this.add
      .tileSprite(0, 0, w, h, "background_parallax1")
      .setAlpha(0.1)
      .setOrigin(0)
      .setScrollFactor(0);

    this.backgroundPlanet = this.add
      .tileSprite(0, 0, w, h, "background_planet")
      .setOrigin(0)
      .setScrollFactor(0);
  }

  createInputs() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursorKeysAlt = this.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      fire: "SPACE",
    });
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.setupSpeedControls();
  }

  setupSpeedControls() {
    this.input.keyboard.on("keydown-UP", () => {
      this.handleVerticalSpeedChange("up");
    });

    this.input.keyboard.on("keydown-W", () => {
      this.handleVerticalSpeedChange("up");
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.handleVerticalSpeedChange("down");
    });

    this.input.keyboard.on("keydown-S", () => {
      this.handleVerticalSpeedChange("down");
    });
  }

  handleVerticalSpeedChange(direction: "up" | "down") {
    const currentTime = this.time.now;

    if (direction === "up") {
      // Double UP press - cycle speed up or return to normal
      if (currentTime - this.lastUpKeyTime < this.doubleKeyThreshold) {
        // Normal -> Fast
        if (this.speedMultiplier === this.normalSpeedMultiplier) {
          this.speedMultiplier = this.maxSpeedMultiplier;
        }

        // Slow -> Normal
        else if (this.speedMultiplier === this.minSpeedMultiplier) {
          this.speedMultiplier = this.normalSpeedMultiplier;
        }

        // Fast -> Normal
        else if (this.speedMultiplier === this.maxSpeedMultiplier) {
          this.speedMultiplier = this.normalSpeedMultiplier;
        }

        this.updateScrollSpeed();
      }
      this.lastUpKeyTime = currentTime;
    } else if (direction === "down") {
      // Double DOWN press - cycle speed down or return to normal
      if (currentTime - this.lastDownKeyTime < this.doubleKeyThreshold) {
        // Normal -> Slow
        if (this.speedMultiplier === this.normalSpeedMultiplier) {
          this.speedMultiplier = this.minSpeedMultiplier;
        }

        // Fast -> Normal
        else if (this.speedMultiplier === this.maxSpeedMultiplier) {
          this.speedMultiplier = this.normalSpeedMultiplier;
        }

        // Slow -> Normal
        else if (this.speedMultiplier === this.minSpeedMultiplier) {
          this.speedMultiplier = this.normalSpeedMultiplier;
        }

        this.updateScrollSpeed();
      }

      this.lastDownKeyTime = currentTime;
    }
  }

  updateScrollSpeed() {
    this.currentScrollSpeed = this.baseScrollSpeed * this.speedMultiplier;
    this.updateSpeedIndicator();
  }

  createSpeedIndicator() {
    this.speedIndicatorText = this.add
      .text(20, 20, this.getSpeedText(), {
        fontSize: "18px",
        color: "#00ff00",
        fontFamily: "Arial",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: { x: 10, y: 5 },
      })
      .setScrollFactor(0)
      .setDepth(1000);
  }

  getSpeedText(): string {
    const speedPercent = Math.round(this.speedMultiplier * 100);
    let speedLabel = "NORMAL";

    if (this.speedMultiplier > 1) {
      speedLabel = "FAST";
    } else if (this.speedMultiplier < 1) {
      speedLabel = "SLOW";
    }

    return `SPEED: ${speedLabel} (${speedPercent}%)`;
  }

  updateSpeedIndicator() {
    if (this.speedIndicatorText) {
      this.speedIndicatorText.setText(this.getSpeedText());
    }
  }

  createPlayers() {
    this.player1 = new PlayerSprite({
      scene: this,
      x: 100,
      y: 100,
      texture: this.textures.get("heroship"),
    });
    this.layout.place(6, 6, this.player1);
  }

  createProjectileGroup() {
    this.projectiles = this.add.group({
      classType: ProjectileSprite,
      runChildUpdate: true,
    });
  }

  handleShooting() {
    const currentTime = this.time.now;

    if (
      this.spaceKey?.isDown &&
      currentTime - this.lastShotTime > this.shotCooldown
    ) {
      this.shoot();
      this.lastShotTime = currentTime;
    }
  }

  shoot() {
    if (!this.player1) return;

    // Create projectile at player position
    const projectile = new ProjectileSprite({
      scene: this,
      x: this.player1.x,
      y: this.player1.y - 20, // Offset slightly above player
      texture: "phaser",
      frame: "Laser_Large.png", // Using the large laser from the sprite sheet
      velocity: 600,
      direction: -1, // Shoot upward
    });

    this.projectiles.add(projectile);
  }

  addImages() {
    var atlasTexture = this.textures.get("heroship");
    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++) {
      var x = Phaser.Math.Between(0, 800);
      var y = Phaser.Math.Between(0, 600);

      // this.add.sprite(x, y, "heroship", frames[i]);
    }
  }

  update() {
    // Update player movement
    if (this.player1) {
      this.player1.update(this.cursorKeys, this.cursorKeysAlt);
    }

    // Handle shooting input
    this.handleShooting();

    // Update background scrolling with current speed
    this.backgroundParallax1.tilePositionY -= this.currentScrollSpeed * 0.5;
    this.backgroundPlanet.tilePositionY -= this.currentScrollSpeed;
    this.backgroundParallax2.tilePositionY -= this.currentScrollSpeed * 2;

    // Clean up destroyed projectiles
    this.projectiles.children.entries.forEach(
      (projectile: ProjectileSprite) => {
        if (!projectile.active) {
          this.projectiles.remove(projectile);
        }
      }
    );
  }
}
