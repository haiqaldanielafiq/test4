import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background is already black by default if config is set,
    // but we can ensure it here or via the config.
    this.cameras.main.setBackgroundColor('#000000');

    // Display white text "Math Chase" centered
    const text = this.add.text(width / 2, height / 2, 'Math Chase', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    });
    text.setOrigin(0.5);
  }
}
