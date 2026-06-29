import Phaser from 'phaser';
import Player from '../objects/Player';
import Ghost from '../objects/Ghost';
import audioManager from '../utils/AudioManager';
import SceneHelper from '../utils/SceneHelper';

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
    this.combo = 0;
    this.comboTimer = null;
    this.bonusCoinTimer = 0;
  }

  init(data) {
    if (data.score !== undefined) this.score = data.score;
    if (data.lives !== undefined) this.lives = data.lives;
    if (data.level !== undefined) this.level = data.level;
  }

  create() {
    audioManager.initContext();
    audioManager.startMusic();
    this.cameras.main.setBackgroundColor('#000000');
    SceneHelper.addFadeIn(this);

    this.walls = this.physics.add.staticGroup();
    this.coins = this.physics.add.group();
    this.specialCoins = this.physics.add.group();
    this.ghosts = this.physics.add.group();

    const mazeWidth = this.maze[0].length * this.tileSize;
    const mazeHeight = this.maze.length * this.tileSize;

    // Center maze in world
    this.offsetX = (this.cameras.main.width - mazeWidth) / 2;
    this.offsetY = (this.cameras.main.height - mazeHeight) / 2;

    this.totalCoins = 0;
    this.coinsCollected = 0;

    for (let row = 0; row < this.maze.length; row++) {
      for (let col = 0; col < this.maze[row].length; col++) {
        const x = this.offsetX + col * this.tileSize + this.tileSize / 2;
        const y = this.offsetY + row * this.tileSize + this.tileSize / 2;

        if (this.maze[row][col] === 1) {
          this.walls.create(x, y, 'wall');
        } else {
          if ((row === 1 && col === 1) || (row === 1 && col === 21) ||
              (row === 20 && col === 1) || (row === 20 && col === 21)) {
            const coin = this.specialCoins.create(x, y, 'special-coin-0');
            coin.play('special-coin-spin');
            this.totalCoins++;
          }
          else if (!(row >= 9 && row <= 11 && col >= 9 && col <= 13)) {
            const coin = this.coins.create(x, y, 'coin-0');
            coin.play('coin-spin');
            this.totalCoins++;
          }
        }
      }
    }

    this.ghostSpawnPoints = [
      { x: this.offsetX + 10 * this.tileSize + this.tileSize / 2, y: this.offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-red' },
      { x: this.offsetX + 11 * this.tileSize + this.tileSize / 2, y: this.offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-pink' },
      { x: this.offsetX + 12 * this.tileSize + this.tileSize / 2, y: this.offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-cyan' },
      { x: this.offsetX + 13 * this.tileSize + this.tileSize / 2, y: this.offsetY + 10 * this.tileSize + this.tileSize / 2, texture: 'ghost-orange' }
    ];

    this.ghostSpawnPoints.forEach(point => {
      const ghost = new Ghost(this, point.x, point.y, point.texture);
      ghost.speed = 120 + (this.level - 1) * 15;
      this.ghosts.add(ghost);

      ghost.setAlpha(0);
      this.tweens.add({
        targets: ghost,
        alpha: 1,
        duration: 1000,
        ease: 'Power2'
      });
    });

    const centerX = this.offsetX + 11 * this.tileSize + this.tileSize / 2;
    const centerY = this.offsetY + 4 * this.tileSize + this.tileSize / 2;
    this.playerStartPos = { x: centerX, y: centerY };
    this.player = new Player(this, centerX, centerY);

    this.physics.add.collider(this.ghosts, this.walls);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.physics.add.overlap(this.player, this.specialCoins, this.collectSpecialCoin, null, this);
    this.physics.add.overlap(this.player, this.ghosts, this.handleGhostCollision, null, this);

    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.input.keyboard.on('keydown-ESC', () => {
      this.pauseGame();
    });

    this.createHUD();

    this.coinParticles = this.add.particles(0, 0, 'coin-0', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      gravityY: 200,
      emitting: false
    });
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  createHUD() {
    const textStyle = {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 4
    };

    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, textStyle).setScrollFactor(0).setDepth(100);
    this.livesText = this.add.text(20, 50, `Lives: ${this.lives}`, textStyle).setScrollFactor(0).setDepth(100);
    this.coinsText = this.add.text(20, 80, `Coins: ${this.coinsCollected}/${this.totalCoins}`, textStyle).setScrollFactor(0).setDepth(100);
    this.levelText = this.add.text(20, 110, `Level: ${this.level}`, textStyle).setScrollFactor(0).setDepth(100);
  }

  update(time, delta) {
    if (this.player) {
      this.player.update();
    }
    this.ghosts.getChildren().forEach(ghost => {
      ghost.update(time, delta);
    });

    this.bonusCoinTimer += delta;
    if (this.bonusCoinTimer > 20000) {
      this.bonusCoinTimer = 0;
      this.spawnBonusCoin();
    }
  }

  spawnBonusCoin() {
    const x = Phaser.Math.Between(this.offsetX + 32, this.offsetX + (this.maze[0].length-2) * 32);
    const y = Phaser.Math.Between(this.offsetY + 32, this.offsetY + (this.maze.length-2) * 32);

    const bonus = this.specialCoins.create(x, y, 'special-coin-0');
    bonus.setTint(0x00ff00);
    bonus.play('special-coin-spin');

    this.time.delayedCall(8000, () => {
      if (bonus.active) bonus.destroy();
    });
  }

  collectCoin(player, coin) {
    audioManager.playCoin();
    this.coinParticles.emitParticleAt(coin.x, coin.y, 5);
    coin.destroy();

    this.combo++;
    if (this.comboTimer) clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.combo = 0;
      this.updateHUD();
    }, 2000);

    const points = 10 * Math.min(this.combo, 5);
    this.score += points;
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
    audioManager.playGhost();
    this.cameras.main.shake(300, 0.01);
    this.lives--;
    this.updateHUD();

    if (this.lives <= 0) {
      this.saveHighScore();
      SceneHelper.transitionTo(this, 'GameOverScene', { score: this.score });
    } else {
      this.resetEntities();
    }
  }

  handleCorrectAnswer() {
    this.score += 50;
    this.updateHUD();
    this.checkWinCondition();
  }

  handleWrongAnswer() {
    this.lives--;
    this.updateHUD();
    if (this.lives <= 0) {
      this.saveHighScore();
      SceneHelper.transitionTo(this, 'GameOverScene', { score: this.score });
    }
  }

  saveHighScore() {
    const highscore = parseInt(localStorage.getItem('mathchase-highscore') || 0);
    if (this.score > highscore) {
      localStorage.setItem('mathchase-highscore', this.score);
    }
  }

  resetEntities() {
    this.player.setPosition(this.playerStartPos.x, this.playerStartPos.y);
    this.player.currentDirection = Phaser.NONE;
    this.player.queuedDirection = Phaser.NONE;
    this.player.setVelocity(0);

    this.ghosts.getChildren().forEach((ghost, index) => {
      const point = this.ghostSpawnPoints[index];
      ghost.resetPosition(point.x, point.y);
    });
  }

  checkWinCondition() {
    if (this.coinsCollected >= this.totalCoins) {
      SceneHelper.transitionTo(this, 'LevelCompleteScene', {
        score: this.score,
        level: this.level,
        lives: this.lives
      });
    }
  }

  updateHUD() {
    if (this.scoreText) {
      const comboText = this.combo > 1 ? ` (x${Math.min(this.combo, 5)})` : '';
      this.scoreText.setText(`Score: ${this.score}${comboText}`);
    }
    if (this.livesText) {
      this.livesText.setText(`Lives: ${this.lives}`);
    }
    if (this.coinsText) {
      this.coinsText.setText(`Coins: ${this.coinsCollected}/${this.totalCoins}`);
    }
  }
}
