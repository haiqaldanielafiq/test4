import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Display title
    const title = this.add.text(width / 2, height / 3, 'Math Chase', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    });
    title.setOrigin(0.5);

    // Start Button
    const buttonStyle = {
      backgroundColor: '#ffffff',
      fill: '#000000',
      fontSize: '32px',
      fontFamily: 'Arial',
      padding: { x: 20, y: 10 }
    };

    const startButton = this.add.text(width / 2, height / 2 + 50, 'Start Game', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Hover effect
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#cccccc' });
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#ffffff' });
    });
  }
}
