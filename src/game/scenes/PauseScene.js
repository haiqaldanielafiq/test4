import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';

export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi-transparent background
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, width, height);

    this.add.text(width / 2, height * 0.3, 'PAUSED', {
      fontSize: '84px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Resume Button
    this.createButton(width / 2, height * 0.5, 'Resume', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    // Restart Button
    this.createButton(width / 2, height * 0.65, 'Restart', () => {
      this.scene.stop('GameScene');
      this.scene.start('GameScene', { score: 0, lives: 3, level: 1 });
      this.scene.stop();
    });

    // Menu Button
    this.createButton(width / 2, height * 0.8, 'Main Menu', () => {
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
      this.scene.stop();
    });
  }

  createButton(x, y, text, callback) {
    const container = this.add.container(x, y);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-150, -35, 300, 70, 15);

    const btnText = this.add.text(0, 0, text, {
      fontSize: '32px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    container.add([btnBg, btnText]);
    const hitArea = new Phaser.Geom.Rectangle(-150, -35, 300, 70);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', () => {
      audioManager.playClick();
      callback();
    });

    container.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1);
      btnBg.fillRoundedRect(-150, -35, 300, 70, 15);
    });

    container.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-150, -35, 300, 70, 15);
    });
  }
}
