import Phaser from 'phaser';
import Player from '../objects/Player';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    this.tileSize = 32;
    this.score = 0;
    this.lives = 3;
    this.coinsCollected = 0;
    this.totalCoins = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    this.walls = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();

    const mazeWidth = this.maze[0].length * this.tileSize;
    const mazeHeight = this.maze.length * this.tileSize;

    // Center maze in world
    const offsetX = (this.cameras.main.width - mazeWidth) / 2;
    const offsetY = (this.cameras.main.height - mazeHeight) / 2;

    for (let row = 0; row < this.maze.length; row++) {
      for (let col = 0; col < this.maze[row].length; col++) {
        const x = offsetX + col * this.tileSize + this.tileSize / 2;
        const y = offsetY + row * this.tileSize + this.tileSize / 2;

        if (this.maze[row][col] === 1) {
          this.walls.create(x, y, 'wall');
        } else {
          // Add coin in empty spaces (except middle area)
          if (!(row >= 9 && row <= 11 && col >= 9 && col <= 13)) {
            this.coins.create(x, y, 'coin');
            this.totalCoins++;
          }
        }
      }
    }

    // Add Player at the center
    const centerX = offsetX + (this.maze[0].length / 2) * this.tileSize;
    const centerY = offsetY + (this.maze.length / 2) * this.tileSize;
    this.player = new Player(this, centerX, centerY);

    // Collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // Camera setup
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    // HUD setup
    this.createHUD();
  }

  createHUD() {
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    this.livesText = this.add.text(20, 50, `Lives: ${this.lives}`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    this.coinsText = this.add.text(20, 80, `Coins: ${this.coinsCollected}/10`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
  }

  update() {
    if (this.player) {
      this.player.update();
    }
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.score += 10;
    this.coinsCollected++;
    this.updateHUD();
  }

  updateHUD() {
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    }
    if (this.coinsText) {
      this.coinsText.setText(`Coins: ${this.coinsCollected}/10`);
    }
  }
}
