import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pacman-closed');

    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Physics properties
    this.setCircle(14);
    this.setCollideWorldBounds(true);
    this.speed = 200;

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
    this.currentDirection = 'NONE';
  }

  update() {
    this.handleInput();
    this.updateRotation();
  }

  handleInput() {
    this.setVelocity(0);

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.setVelocityX(-this.speed);
      this.currentDirection = 'LEFT';
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.setVelocityX(this.speed);
      this.currentDirection = 'RIGHT';
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.setVelocityY(-this.speed);
      this.currentDirection = 'UP';
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.setVelocityY(this.speed);
      this.currentDirection = 'DOWN';
    }

    // Stop animation if not moving
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.stop();
      this.setFrame(0); // Mouth closed
    } else {
      if (!this.anims.isPlaying) {
        this.play('pacman-chomp');
      }
    }
  }

  updateRotation() {
    switch (this.currentDirection) {
      case 'LEFT':
        this.setAngle(180);
        break;
      case 'RIGHT':
        this.setAngle(0);
        break;
      case 'UP':
        this.setAngle(270);
        break;
      case 'DOWN':
        this.setAngle(90);
        break;
      default:
        break;
    }
  }
}
