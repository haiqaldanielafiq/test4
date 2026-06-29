import Phaser from 'phaser';
import SceneHelper from '../utils/SceneHelper';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi-transparent background
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.75);
    overlay.fillRect(0, 0, width, height);

    this.add.text(width / 2, height * 0.25, 'PAUSED', {
      fontSize: '100px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Resume Button
    const btnResume = SceneHelper.createButton(this, width / 2, height * 0.45, 'Resume', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    // Restart Button
    const btnRestart = SceneHelper.createButton(this, width / 2, height * 0.6, 'Restart', () => {
      this.scene.stop('GameScene');
      this.scene.start('GameScene', { score: 0, lives: 3, level: 1 });
      this.scene.stop();
    });

    // Menu Button
    const btnMenu = SceneHelper.createButton(this, width / 2, height * 0.75, 'Main Menu', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
      this.scene.stop();
    });

    SceneHelper.setupKeyboardNav(this, [btnResume, btnRestart, btnMenu]);
  }
}
