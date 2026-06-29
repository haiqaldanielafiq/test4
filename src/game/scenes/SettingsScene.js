import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';
import SceneHelper from '../utils/SceneHelper';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);

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
    const soundToggle = this.createToggle(width / 2, height * 0.4, 'Sound', audioManager.enabled, (enabled) => {
      audioManager.toggleSound(enabled);
    });

    // Music Toggle
    const musicToggle = this.createToggle(width / 2, height * 0.55, 'Music', audioManager.musicEnabled, (enabled) => {
      audioManager.toggleMusic(enabled);
    });

    // Back Button
    const backBtn = SceneHelper.createButton(this, width / 2, height * 0.8, 'Back', () => {
      SceneHelper.transitionTo(this, 'MenuScene');
    });

    SceneHelper.setupKeyboardNav(this, [soundToggle, musicToggle, backBtn]);
  }

  createToggle(x, y, label, initialState, callback) {
    const container = this.add.container(x, y);

    const text = this.add.text(-120, 0, label, {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0, 0.5);

    const toggleBg = this.add.graphics();
    const toggleCircle = this.add.graphics();

    const drawToggle = (enabled) => {
      toggleBg.clear();
      toggleBg.fillStyle(enabled ? 0x00ff00 : 0x666666, 1);
      toggleBg.fillRoundedRect(50, -25, 120, 50, 25);
      toggleBg.lineStyle(4, 0xffffff, 1);
      toggleBg.strokeRoundedRect(50, -25, 120, 50, 25);

      toggleCircle.clear();
      toggleCircle.fillStyle(0xffffff, 1);
      toggleCircle.fillCircle(enabled ? 145 : 75, 0, 20);
    };

    drawToggle(initialState);
    container.add([text, toggleBg, toggleCircle]);

    const hitArea = new Phaser.Geom.Rectangle(-120, -25, 290, 50);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    let enabled = initialState;
    container.on('pointerdown', () => {
      enabled = !enabled;
      drawToggle(enabled);
      callback(enabled);
      audioManager.playClick();
    });

    container.on('pointerover', () => {
        container.setScale(1.05);
    });

    container.on('pointerout', () => {
        container.setScale(1);
    });

    return container;
  }
}
