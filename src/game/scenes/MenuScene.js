import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Display title
    this.add.text(width / 2, height * 0.3, 'Math Chase', {
      fontSize: '84px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Display subtitle
    this.add.text(width / 2, height * 0.45, 'Educational Pac-Man Adventure', {
      fontSize: '32px',
      fill: '#ffff00', // Pac-Man yellow for flair
      fontFamily: 'Arial',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Start Button Container for animation
    const buttonContainer = this.add.container(width / 2, height * 0.7);

    // Button background
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-150, -40, 300, 80, 20);

    // Button text
    const startText = this.add.text(0, 0, 'Start Game', {
      fontSize: '40px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    buttonContainer.add([btnBg, startText]);

    // Make button interactive
    const hitArea = new Phaser.Geom.Rectangle(-150, -40, 300, 80);
    buttonContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    // Pulsing animation
    this.tweens.add({
      targets: buttonContainer,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Hover effects
    buttonContainer.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1); // Yellow on hover
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
      this.input.setDefaultCursor('pointer');
    });

    buttonContainer.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
      this.input.setDefaultCursor('default');
    });

    buttonContainer.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Handle responsiveness
    this.scale.on('resize', this.resize, this);

    // Cleanup on scene shutdown
    this.events.on('shutdown', () => {
      this.scale.off('resize', this.resize, this);
    });
  }

  resize(gameSize) {
    const { width, height } = gameSize;
    this.cameras.resize(width, height);
    // Ideally, reposition elements here if they aren't using relative positioning
    // Since we used fractions of width/height in create, they'll stay centered if we re-run logic
    // But for a simple foundation, the FIT scale mode handles most of this.
  }
}
