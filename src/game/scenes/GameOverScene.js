import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';
import SceneHelper from '../utils/SceneHelper';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);
    audioManager.playGameOver();

    // Red tint overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x330000, 0.8);
    overlay.fillRect(0, 0, width, height);

    this.add.text(width / 2, height * 0.25, 'GAME OVER', {
      fontSize: '120px',
      fill: '#ff0000',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);

    // Shake effect on entry
    this.cameras.main.shake(500, 0.02);

    this.add.text(width / 2, height * 0.45, `Final Score: ${this.finalScore}`, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const highscore = localStorage.getItem('mathchase-highscore') || 0;
    if (this.finalScore > highscore) {
      const newRecord = this.add.text(width / 2, height * 0.55, 'NEW HIGH SCORE!', {
        fontSize: '40px',
        fill: '#ffff00',
        fontFamily: 'Arial',
        fontStyle: 'italic'
      }).setOrigin(0.5);

      this.tweens.add({
        targets: newRecord,
        alpha: 0,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else {
      this.add.text(width / 2, height * 0.55, `High Score: ${highscore}`, {
        fontSize: '32px',
        fill: '#aaaaaa',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    }

    const btnRestart = SceneHelper.createButton(this, width / 2, height * 0.75, 'Try Again', () => {
      SceneHelper.transitionTo(this, 'GameScene', { score: 0, lives: 3, level: 1 });
    });

    const btnMenu = SceneHelper.createButton(this, width / 2, height * 0.87, 'Main Menu', () => {
        SceneHelper.transitionTo(this, 'MenuScene');
    }, { width: 300, height: 60, fontSize: '24px' });

    SceneHelper.setupKeyboardNav(this, [btnRestart, btnMenu]);
  }
}
