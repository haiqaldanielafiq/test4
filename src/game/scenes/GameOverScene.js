import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    audioManager.playGameOver();

    const title = this.add.text(width / 2, height * 0.3, 'GAME OVER', {
      fontSize: '100px',
      fill: '#ff0000',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Game Over animation
    this.tweens.add({
      targets: title,
      y: height * 0.35,
      duration: 500,
      ease: 'Bounce.easeOut'
    });

    this.add.text(width / 2, height * 0.5, `Final Score: ${this.finalScore}`, {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const highscore = localStorage.getItem('mathchase-highscore') || 0;
    if (this.finalScore > highscore) {
      this.add.text(width / 2, height * 0.58, 'NEW HIGH SCORE!', {
        fontSize: '32px',
        fill: '#ffff00',
        fontFamily: 'Arial',
        fontStyle: 'italic'
      }).setOrigin(0.5);
    } else {
      this.add.text(width / 2, height * 0.58, `High Score: ${highscore}`, {
        fontSize: '32px',
        fill: '#aaaaaa',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    }

    const restartBtn = this.add.container(width / 2, height * 0.75);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-150, -40, 300, 80, 20);

    const btnText = this.add.text(0, 0, 'Try Again', {
      fontSize: '32px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    restartBtn.add([btnBg, btnText]);

    const hitArea = new Phaser.Geom.Rectangle(-150, -40, 300, 80);
    restartBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    restartBtn.on('pointerdown', () => {
      audioManager.playClick();
      this.scene.start('GameScene', { score: 0, lives: 3, level: 1 });
    });

    restartBtn.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
    });

    restartBtn.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
    });
  }
}
