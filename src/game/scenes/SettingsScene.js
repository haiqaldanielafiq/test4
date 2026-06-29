import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.9);
    overlay.fillRect(0, 0, width, height);

    this.add.text(width / 2, height * 0.2, 'SETTINGS', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Sound Toggle
    this.createToggle(width / 2, height * 0.4, 'Sound', audioManager.enabled, (enabled) => {
      audioManager.toggleSound(enabled);
    });

    // Music Toggle
    this.createToggle(width / 2, height * 0.55, 'Music', audioManager.musicEnabled, (enabled) => {
      audioManager.toggleMusic(enabled);
    });

    // Back Button
    const backBtn = this.add.container(width / 2, height * 0.8);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-100, -30, 200, 60, 15);

    const btnText = this.add.text(0, 0, 'Back', {
      fontSize: '32px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    backBtn.add([btnBg, btnText]);
    const hitArea = new Phaser.Geom.Rectangle(-100, -30, 200, 60);
    backBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    backBtn.on('pointerdown', () => {
      audioManager.playClick();
      this.scene.start('MenuScene');
    });

    backBtn.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1);
      btnBg.fillRoundedRect(-100, -30, 200, 60, 15);
    });

    backBtn.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-100, -30, 200, 60, 15);
    });
  }

  createToggle(x, y, label, initialState, callback) {
    const container = this.add.container(x, y);

    const text = this.add.text(-100, 0, label, {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5);

    const toggleBg = this.add.graphics();
    const toggleCircle = this.add.graphics();

    const drawToggle = (enabled) => {
      toggleBg.clear();
      toggleBg.fillStyle(enabled ? 0x00ff00 : 0x666666, 1);
      toggleBg.fillRoundedRect(50, -20, 100, 40, 20);

      toggleCircle.clear();
      toggleCircle.fillStyle(0xffffff, 1);
      toggleCircle.fillCircle(enabled ? 130 : 70, 0, 15);
    };

    drawToggle(initialState);
    container.add([text, toggleBg, toggleCircle]);

    const hitArea = new Phaser.Geom.Rectangle(50, -20, 100, 40);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let enabled = initialState;
    container.on('pointerdown', () => {
      enabled = !enabled;
      drawToggle(enabled);
      callback(enabled);
      audioManager.playClick();
    });
  }
}
