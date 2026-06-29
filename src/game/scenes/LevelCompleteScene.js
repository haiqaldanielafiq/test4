import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';
import SceneHelper from '../utils/SceneHelper';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.lives = data.lives || 3;
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);
    audioManager.playVictory();

    // Celebration background
    const overlay = this.add.graphics();
    overlay.fillGradientStyle(0x000033, 0x000033, 0x003300, 0x003300, 1);
    overlay.fillRect(0, 0, width, height);

    const title = this.add.text(width / 2, height * 0.25, 'LEVEL COMPLETE!', {
      fontSize: '100px',
      fill: '#ffff00',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);

    // Victory animation
    this.tweens.add({
      targets: title,
      scale: 1.1,
      angle: 2,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut'
    });

    this.add.text(width / 2, height * 0.45, `Current Score: ${this.score}`, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.55, `Level ${this.level} Cleared!`, {
      fontSize: '40px',
      fill: '#00ff00',
      fontFamily: 'Arial',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    const btnNext = SceneHelper.createButton(this, width / 2, height * 0.75, 'Next Level', () => {
      SceneHelper.transitionTo(this, 'GameScene', {
        score: this.score,
        lives: this.lives,
        level: this.level + 1
      });
    });

    const btnMenu = SceneHelper.createButton(this, width / 2, height * 0.87, 'Main Menu', () => {
        SceneHelper.transitionTo(this, 'MenuScene');
    }, { width: 300, height: 60, fontSize: '24px' });

    SceneHelper.setupKeyboardNav(this, [btnNext, btnMenu]);

    // Simple celebration particles
    this.add.particles(0, 0, 'coin-0', {
        x: { min: 0, max: width },
        y: -50,
        speedY: { min: 200, max: 400 },
        speedX: { min: -50, max: 50 },
        scale: { start: 1, end: 0.5 },
        alpha: { start: 1, end: 0 },
        lifespan: 3000,
        frequency: 100,
        gravityY: 100
    });
  }
}
