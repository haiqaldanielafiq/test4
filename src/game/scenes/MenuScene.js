import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Display title with glow effect
    const title = this.add.text(width / 2, height * 0.25, 'MATH CHASE', {
      fontSize: '120px',
      fill: '#ffff00',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);

    // Title pulse animation
    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut'
    });

    // Display subtitle
    this.add.text(width / 2, height * 0.4, 'Year 4 Money Edition', {
      fontSize: '40px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Decorative Pac-Man and Ghost
    const pacman = this.add.sprite(width * 0.2, height * 0.7, 'pacman-0');
    pacman.setScale(2);
    pacman.play('pacman-chomp');

    const ghost = this.add.sprite(width * 0.8, height * 0.7, 'ghost-red-0');
    ghost.setScale(2);
    ghost.play('ghost-red-wiggle');

    // Start Button
    this.createButton(width / 2, height * 0.6, 'Start Game', () => {
      this.scene.start('GameScene', { score: 0, lives: 3, level: 1 });
    });

    // Settings Button
    this.createButton(width / 2, height * 0.75, 'Settings', () => {
      this.scene.start('SettingsScene');
    });

    // Start background music if not already playing
    audioManager.startMusic();
  }

  createButton(x, y, text, callback) {
    const container = this.add.container(x, y);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-180, -40, 360, 80, 20);
    btnBg.lineStyle(4, 0x0000ff, 1);
    btnBg.strokeRoundedRect(-180, -40, 360, 80, 20);

    const btnText = this.add.text(0, 0, text, {
      fontSize: '40px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    container.add([btnBg, btnText]);
    const hitArea = new Phaser.Geom.Rectangle(-180, -40, 360, 80);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', () => {
      audioManager.playClick();
      callback();
    });

    container.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1);
      btnBg.fillRoundedRect(-180, -40, 360, 80, 20);
      btnBg.lineStyle(4, 0x00ffff, 1);
      btnBg.strokeRoundedRect(-180, -40, 360, 80, 20);
      container.setScale(1.1);
    });

    container.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-180, -40, 360, 80, 20);
      btnBg.lineStyle(4, 0x0000ff, 1);
      btnBg.strokeRoundedRect(-180, -40, 360, 80, 20);
      container.setScale(1);
    });
  }
}
