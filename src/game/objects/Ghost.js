import Phaser from 'phaser';

export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, `${texture}-0`);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics properties - smaller circle for fairness
    this.setCircle(12, 4, 4);
    this.setCollideWorldBounds(true);
    this.speed = 150;
    this.scene = scene;
    this.textureKey = texture;

    // Animation
    this.play(`${texture}-wiggle`);

    // Movement state
    this.currentDir = Phaser.NONE;
    this.nextDir = Phaser.NONE;
    this.lastTile = { x: -1, y: -1 };
  }

  update() {
    const gridX = Math.floor((this.x - this.scene.offsetX) / this.scene.tileSize);
    const gridY = Math.floor((this.y - this.scene.offsetY) / this.scene.tileSize);

    // Only make decisions at intersections (center of tile)
    if (gridX !== this.lastTile.x || gridY !== this.lastTile.y) {
      const centerX = this.scene.offsetX + gridX * this.scene.tileSize + this.scene.tileSize / 2;
      const centerY = this.scene.offsetY + gridY * this.scene.tileSize + this.scene.tileSize / 2;

      const dist = Phaser.Math.Distance.Between(this.x, this.y, centerX, centerY);

      if (dist < 4) {
        this.lastTile = { x: gridX, y: gridY };
        this.makeDecision(gridX, gridY);
      }
    }

    this.applyMovement();
  }

  makeDecision(gridX, gridY) {
    if (!this.scene.player) return;

    const directions = [Phaser.LEFT, Phaser.RIGHT, Phaser.UP, Phaser.DOWN];
    const opposites = {
      [Phaser.LEFT]: Phaser.RIGHT,
      [Phaser.RIGHT]: Phaser.LEFT,
      [Phaser.UP]: Phaser.DOWN,
      [Phaser.DOWN]: Phaser.UP,
      [Phaser.NONE]: Phaser.NONE
    };

    // Get available exits (don't go back unless stuck)
    const availableExits = directions.filter(dir => {
        if (dir === opposites[this.currentDir]) return false;
        return this.canMove(gridX, gridY, dir);
    });

    if (availableExits.length === 0) {
        this.currentDir = opposites[this.currentDir];
        return;
    }

    // AI Logic based on personality
    let target = { x: this.scene.player.x, y: this.scene.player.y };

    if (this.textureKey === 'ghost-pink') {
        // Target ahead of player
        const pBody = this.scene.player.body;
        target.x += pBody.velocity.x * 0.5;
        target.y += pBody.velocity.y * 0.5;
    } else if (this.textureKey === 'ghost-cyan') {
        // Intercept logic: point between Blinky (red) and player
        const redGhost = this.scene.ghosts.getChildren().find(g => g.textureKey === 'ghost-red');
        if (redGhost) {
            target.x = this.scene.player.x + (this.scene.player.x - redGhost.x);
            target.y = this.scene.player.y + (this.scene.player.y - redGhost.y);
        }
    } else if (this.textureKey === 'ghost-orange') {
        // Random if close, chase if far
        const distToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
        if (distToPlayer < 200) {
            this.currentDir = availableExits[Math.floor(Math.random() * availableExits.length)];
            return;
        }
    }

    // Pick exit that gets closest to target
    let bestDir = availableExits[0];
    let minDist = Infinity;

    availableExits.forEach(dir => {
        const nextX = this.scene.offsetX + (gridX + (dir === Phaser.LEFT ? -1 : dir === Phaser.RIGHT ? 1 : 0)) * this.scene.tileSize;
        const nextY = this.scene.offsetY + (gridY + (dir === Phaser.UP ? -1 : dir === Phaser.DOWN ? 1 : 0)) * this.scene.tileSize;
        const d = Phaser.Math.Distance.Between(nextX, nextY, target.x, target.y);
        if (d < minDist) {
            minDist = d;
            bestDir = dir;
        }
    });

    this.currentDir = bestDir;
  }

  canMove(gridX, gridY, dir) {
    let nx = gridX;
    let ny = gridY;
    if (dir === Phaser.LEFT) nx--;
    else if (dir === Phaser.RIGHT) nx++;
    else if (dir === Phaser.UP) ny--;
    else if (dir === Phaser.DOWN) ny++;

    if (ny < 0 || ny >= this.scene.maze.length || nx < 0 || nx >= this.scene.maze[0].length) return false;
    return this.scene.maze[ny][nx] !== 1;
  }

  applyMovement() {
    this.setVelocity(0);
    if (this.currentDir === Phaser.LEFT) this.setVelocityX(-this.speed);
    else if (this.currentDir === Phaser.RIGHT) this.setVelocityX(this.speed);
    else if (this.currentDir === Phaser.UP) this.setVelocityY(-this.speed);
    else if (this.currentDir === Phaser.DOWN) this.setVelocityY(this.speed);
  }

  resetPosition(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0);
    this.currentDir = Phaser.NONE;
    this.lastTile = { x: -1, y: -1 };
  }
}
