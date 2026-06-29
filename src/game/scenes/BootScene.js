import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const { width, height } = this.cameras.main;

    // Black background
    this.cameras.main.setBackgroundColor('#000000');

    // Create loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    // Progress bar events
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // In a real scenario, you would load images, audio, etc. here.
    // Programmatically generate assets
    this.generateAssets();
  }

  generateAssets() {
    // Generate Neon Blue Wall Tile
    const wallGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    wallGraphics.lineStyle(2, 0x0000ff);
    wallGraphics.strokeRect(2, 2, 28, 28);
    wallGraphics.generateTexture('wall', 32, 32);

    // Generate Pac-Man (Mouth Closed)
    const pacmanClosed = this.make.graphics({ x: 0, y: 0, add: false });
    pacmanClosed.fillStyle(0xffff00, 1);
    pacmanClosed.fillCircle(16, 16, 14);
    pacmanClosed.generateTexture('pacman-closed', 32, 32);

    // Generate Pac-Man (Mouth Open)
    const pacmanOpen = this.make.graphics({ x: 0, y: 0, add: false });
    pacmanOpen.fillStyle(0xffff00, 1);
    // Draw a pie shape for mouth open
    pacmanOpen.beginPath();
    pacmanOpen.moveTo(16, 16);
    pacmanOpen.arc(16, 16, 14, Phaser.Math.DegToRad(30), Phaser.Math.DegToRad(330));
    pacmanOpen.closePath();
    pacmanOpen.fill();
    pacmanOpen.generateTexture('pacman-open', 32, 32);

    // Generate Coin
    const coinGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    coinGraphics.fillStyle(0xffff00, 1);
    coinGraphics.fillCircle(8, 8, 4);
    coinGraphics.generateTexture('coin', 16, 16);
  }

  create() {
    // Create Pac-Man animation
    this.anims.create({
      key: 'pacman-chomp',
      frames: [
        { key: 'pacman-closed' },
        { key: 'pacman-open' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.scene.start('MenuScene');
  }
}
