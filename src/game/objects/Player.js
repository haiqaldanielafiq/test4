import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pacman-0');

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics properties - smaller circle for fairness and smoother cornering
    this.setCircle(12, 4, 4);
    this.setCollideWorldBounds(true);
    this.speed = 200;
    this.scene = scene;

    // Animation
    this.play('pacman-chomp');

    // Input
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Direction tracking
    this.currentDirection = Phaser.NONE;
    this.queuedDirection = Phaser.NONE;
  }

  update() {
    this.handleInput();
    this.applyMovement();
    this.updateRotation();
  }

  handleInput() {
    if (this.cursors.left.isDown || this.wasd.left.isDown) this.queuedDirection = Phaser.LEFT;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) this.queuedDirection = Phaser.RIGHT;
    else if (this.cursors.up.isDown || this.wasd.up.isDown) this.queuedDirection = Phaser.UP;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) this.queuedDirection = Phaser.DOWN;
  }

  applyMovement() {
    const gridX = Math.floor((this.x - this.scene.offsetX) / this.scene.tileSize);
    const gridY = Math.floor((this.y - this.scene.offsetY) / this.scene.tileSize);
    const centerX = this.scene.offsetX + gridX * this.scene.tileSize + this.scene.tileSize / 2;
    const centerY = this.scene.offsetY + gridY * this.scene.tileSize + this.scene.tileSize / 2;

    const threshold = 6;

    // Try to change to queued direction
    if (this.queuedDirection !== Phaser.NONE && this.queuedDirection !== this.currentDirection) {
        // Can always reverse direction
        const opposites = {
            [Phaser.LEFT]: Phaser.RIGHT,
            [Phaser.RIGHT]: Phaser.LEFT,
            [Phaser.UP]: Phaser.DOWN,
            [Phaser.DOWN]: Phaser.UP
        };

        if (this.queuedDirection === opposites[this.currentDirection]) {
            this.currentDirection = this.queuedDirection;
            this.queuedDirection = Phaser.NONE;
        } else {
            // Otherwise only at intersections
            const distX = Math.abs(this.x - centerX);
            const distY = Math.abs(this.y - centerY);

            if (distX < threshold && distY < threshold) {
                if (this.canMove(gridX, gridY, this.queuedDirection)) {
                    this.x = centerX;
                    this.y = centerY;
                    this.currentDirection = this.queuedDirection;
                    this.queuedDirection = Phaser.NONE;
                }
            }
        }
    }

    // Check if hitting a wall in current direction
    if (this.currentDirection !== Phaser.NONE) {
        const distX = Math.abs(this.x - centerX);
        const distY = Math.abs(this.y - centerY);

        if (distX < threshold && distY < threshold) {
            if (!this.canMove(gridX, gridY, this.currentDirection)) {
                this.x = centerX;
                this.y = centerY;
                this.currentDirection = Phaser.NONE;
            }
        }
    }

    // Set velocity
    this.setVelocity(0);
    if (this.currentDirection === Phaser.LEFT) this.setVelocityX(-this.speed);
    else if (this.currentDirection === Phaser.RIGHT) this.setVelocityX(this.speed);
    else if (this.currentDirection === Phaser.UP) this.setVelocityY(-this.speed);
    else if (this.currentDirection === Phaser.DOWN) this.setVelocityY(this.speed);

    // Animation control
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.stop();
      this.setFrame(0);
    } else if (!this.anims.isPlaying) {
      this.play('pacman-chomp');
    }
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

  updateRotation() {
    switch (this.currentDirection) {
      case Phaser.LEFT: this.setAngle(180); break;
      case Phaser.RIGHT: this.setAngle(0); break;
      case Phaser.UP: this.setAngle(270); break;
      case Phaser.DOWN: this.setAngle(90); break;
      default: break;
    }
  }
}
