import Phaser from 'phaser';

export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(14);
    this.setCollideWorldBounds(true);
    this.speed = 150;
    this.scene = scene;

    // AI movement timer
    this.moveTimer = 0;
    this.changeInterval = 1000; // Change direction every 1 second
  }

  update(time, delta) {
    this.moveTimer += delta;

    if (this.moveTimer > this.changeInterval) {
      this.moveTimer = 0;
      this.chasePlayer();
    }
  }

  chasePlayer() {
    if (!this.scene.player) return;

    const dx = this.scene.player.x - this.x;
    const dy = this.scene.player.y - this.y;

    // Simple chase: move in the axis with larger distance
    if (Math.abs(dx) > Math.abs(dy)) {
      this.setVelocityX(dx > 0 ? this.speed : -this.speed);
      this.setVelocityY(0);
    } else {
      this.setVelocityY(dy > 0 ? this.speed : -this.speed);
      this.setVelocityX(0);
    }
  }

  resetPosition(x, y) {
    this.setPosition(x, y);
    this.setVelocity(0);
    this.moveTimer = 0;
  }
}
