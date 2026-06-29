import Phaser from 'phaser';
import Player from '../objects/Player';
import Ghost from '../objects/Ghost';

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
    this.level = 1;
    this.coinsCollected = 0;
    this.totalCoins = 0;
  }

  init(data) {
    if (data.score !== undefined) this.score = data.score;
    if (data.lives !== undefined) this.lives = data.lives;
    if (data.level !== undefined) this.level = data.level;
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    this.walls = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.specialCoins = this.physics.add.group();
    this.ghosts = this.physics.add.group();

    const mazeWidth = this.maze[0].length * this.tileSize;
    const mazeHeight = this.maze.length * this.tileSize;

    // Center maze in world
    const offsetX = (this.cameras.main.width - mazeWidth) / 2;
    const offsetY = (this.cameras.main.height - mazeHeight) / 2;

    this.totalCoins = 0;
    this.coinsCollected = 0;

    for (let row = 0; row < this.maze.length; row++) {
      for (let col = 0; col < this.maze[row].length; col++) {
        const x = offsetX + col * this.tileSize + this.tileSize / 2;
        const y = offsetY + row * this.tileSize + this.tileSize / 2;

        if (this.maze[row][col] === 1) {
          this.walls.create(x, y, 'wall');
        } else {
          // Add special coins at corners
          if ((row === 1 && col === 1) || (row === 1 && col === 21) ||
              (row === 20 && col === 1) || (row === 20 && col === 21)) {
            this.specialCoins.create(x, y, 'special-coin');
            this.totalCoins++;
          }
          // Add coin in empty spaces (except middle area and special coin corners)
          else if (!(row >= 9 && row <= 11 && col >= 9 && col <= 13)) {
            this.coins.create(x, y, 'coin');
            this.totalCoins++;
          }
        }
      }
    }

    // Spawn Ghosts in the middle
    this.ghostSpawnPoints = [
      { x: offsetX + 10 * this.tileSize + this.tileSize / 2, y: offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-red' },
      { x: offsetX + 11 * this.tileSize + this.tileSize / 2, y: offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-pink' },
      { x: offsetX + 12 * this.tileSize + this.tileSize / 2, y: offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-cyan' },
      { x: offsetX + 13 * this.tileSize + this.tileSize / 2, y: offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-orange' }
    ];

    this.ghostSpawnPoints.forEach(point => {
      const ghost = new Ghost(this, point.x, point.y, point.texture);
      this.ghosts.add(ghost);
    });

    // Add Player at a safe position (row 4, col 11)
    const centerX = offsetX + 11 * this.tileSize + this.tileSize / 2;
    const centerY = offsetY + 4 * this.tileSize + this.tileSize / 2;
    this.playerStartPos = { x: centerX, y: centerY };
    this.player = new Player(this, centerX, centerY);

    // Collisions
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.ghosts, this.walls);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.specialCoins, this.collectSpecialCoin, null, this);
    this.physics.add.overlap(this.player, this.ghosts, this.handleGhostCollision, null, this);

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

    this.coinsText = this.add.text(20, 80, `Coins: ${this.coinsCollected}/${this.totalCoins}`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setScrollFactor(0);

    this.levelText = this.add.text(20, 110, `Level: ${this.level}`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
  }

  update(time, delta) {
    if (this.player) {
      this.player.update();
    }
    this.ghosts.getChildren().forEach(ghost => {
      ghost.update(time, delta);
    });
  }

  collectCoin(player, coin) {
    coin.destroy();
    this.score += 10;
    this.coinsCollected++;
    this.updateHUD();
    this.checkWinCondition();
  }

  collectSpecialCoin(player, coin) {
    coin.destroy();
    this.coinsCollected++;
    this.updateHUD();
    this.scene.pause();
    this.scene.launch('QuestionScene', { mainScene: this });
  }

  handleGhostCollision() {
    this.lives--;
    this.updateHUD();

    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { score: this.score });
    } else {
      this.resetEntities();
    }
  }

  handleCorrectAnswer() {
    this.score += 10;
    this.updateHUD();
    this.checkWinCondition();
  }

  handleWrongAnswer() {
    this.lives--;
    this.updateHUD();
    if (this.lives <= 0) {
      this.scene.start('GameOverScene', { score: this.score });
    }
  }

  resetEntities() {
    this.player.setPosition(this.playerStartPos.x, this.playerStartPos.y);
    this.player.setVelocity(0);

    this.ghosts.getChildren().forEach((ghost, index) => {
      const point = this.ghostSpawnPoints[index];
      ghost.resetPosition(point.x, point.y);
    });
  }

  checkWinCondition() {
    if (this.coinsCollected >= this.totalCoins) {
      this.scene.start('LevelCompleteScene', {
        score: this.score,
        level: this.level,
        lives: this.lives
      });
    }
  }

  updateHUD() {
    if (this.scoreText) {
      this.scoreText.setText(`Score: ${this.score}`);
    }
    if (this.livesText) {
      this.livesText.setText(`Lives: ${this.lives}`);
    }
    if (this.coinsText) {
      this.coinsText.setText(`Coins: ${this.coinsCollected}/${this.totalCoins}`);
    }
  }
}
