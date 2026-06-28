import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Ensure black background
    this.cameras.main.setBackgroundColor('#000000');

    // Display "Game Scene" centered
    const text = this.add.text(width / 2, height / 2, 'Game Scene', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    });
    text.setOrigin(0.5);
  }
}
