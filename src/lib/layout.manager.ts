import { Scene } from "phaser";
import { PlayerSprite } from "../objects/player.sprite";

interface Bounds {
  cell: { width: number; height: number };
  rows: number;
  cols: number;
}

interface Config {
  x: number;
  y: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
  debug?: boolean;
}

export class LayoutManager {
  scene: Scene;
  config: Config;
  graphics: any;

  constructor({
    scene,
    x = 0,
    y = 0,
    rows = 12,
    cols = 12,
    debug = false,
  }: any) {
    this.scene = scene;
    const { width, height } = this.scene.cameras.main;
    this.config = { x, y, width, height, rows, cols };

    if (debug) {
      this.addGrid();
    }
  }

  get bounds(): Bounds {
    return {
      cell: {
        width: this.config.width / this.config.cols,
        height: this.config.height / this.config.rows,
      },
      rows: this.config.rows,
      cols: this.config.cols,
    };
  }

  addGrid(): void {
    this.graphics = this.scene.add.graphics({ x: 0, y: 0, z: 99 });
    this.graphics.lineStyle(1, 0xff00ff, 0.33);
    this.drawGrid();
  }

  drawGrid(): void {
    this.graphics.beginPath();
    this.drawHorizontalLines();
    this.drawVerticalLines();
    this.graphics.closePath();
    this.graphics.strokePath();
  }

  drawHorizontalLines(): void {
    for (let i = 0; i < this.config.width; i += this.bounds.cell.width) {
      this.graphics.moveTo(i, 0);
      this.graphics.lineTo(i, this.config.height);
    }
  }

  drawVerticalLines(): void {
    for (let i = 0; i < this.config.height; i += this.bounds.cell.height) {
      this.graphics.moveTo(0, i);
      this.graphics.lineTo(this.config.width, i);
    }
  }

  place(x: number, y: number, sprite: PlayerSprite): void {
    sprite.x = this.calculateSpriteCoordinate(x, this.bounds.cell.width);
    sprite.y = this.calculateSpriteCoordinate(y, this.bounds.cell.height);
  }

  calculateSpriteCoordinate(index: number, cellDimension: number): number {
    return cellDimension * index + cellDimension / 2;
  }
}
