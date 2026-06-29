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
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);
    progressBox.lineStyle(2, 0xffffff, 0.2);
    progressBox.strokeRoundedRect(width / 2 - 160, height / 2 - 25, 320, 50, 10);

    const progressBar = this.add.graphics();

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 60,
      text: 'LOADING MATH CHASE...',
      style: {
        font: '24px monospace',
        fill: '#ffffff',
        fontWeight: 'bold'
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
      percentText.setText(Math.floor(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffff00, 1);
      progressBar.fillRoundedRect(width / 2 - 150, height / 2 - 15, 300 * value, 30, 5);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    // Programmatically generate assets
    this.generateAssets();
  }

  generateAssets() {
    // Generate Neon Blue Wall Tile
    const wallGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    // Outer glow
    wallGraphics.lineStyle(4, 0x0000ff, 0.3);
    wallGraphics.strokeRect(2, 2, 28, 28);
    // Main line
    wallGraphics.lineStyle(2, 0x00ffff, 1);
    wallGraphics.strokeRect(4, 4, 24, 24);
    // Inner detail
    wallGraphics.lineStyle(1, 0x0000ff, 0.5);
    wallGraphics.strokeRect(10, 10, 12, 12);
    wallGraphics.generateTexture('wall', 32, 32);

    // Generate Pac-Man frames for smooth animation
    const pacmanAngles = [0, 15, 30, 45];
    pacmanAngles.forEach((angle, index) => {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffff00, 1);
      if (angle === 0) {
        g.fillCircle(16, 16, 14);
      } else {
        g.beginPath();
        g.moveTo(16, 16);
        g.arc(16, 16, 14, Phaser.Math.DegToRad(angle), Phaser.Math.DegToRad(360 - angle));
        g.closePath();
        g.fill();
      }
      g.generateTexture(`pacman-${index}`, 32, 32);
    });

    // Generate Coin frames
    for (let i = 0; i < 4; i++) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffff00, 1);
      const scaleX = [1, 0.7, 0.4, 0.7][i];
      g.fillEllipse(8, 8, 8 * scaleX, 8);
      g.generateTexture(`coin-${i}`, 16, 16);
    }

    // Generate Special Coin frames
    for (let i = 0; i < 4; i++) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffff00, 1);
      const scaleX = [1, 0.7, 0.4, 0.7][i];
      g.fillEllipse(12, 12, 12 * scaleX, 12);
      g.lineStyle(2, 0xffffff, 1);
      g.strokeEllipse(12, 12, 12 * scaleX, 12);
      g.generateTexture(`special-coin-${i}`, 24, 24);
    }

    // Generate Ghosts with wiggling animation
    const ghostColors = {
      'ghost-red': 0xff0000,
      'ghost-pink': 0xffb8ff,
      'ghost-cyan': 0x00ffff,
      'ghost-orange': 0xffb852
    };

    Object.entries(ghostColors).forEach(([key, color]) => {
      for (let i = 0; i < 2; i++) {
        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(color, 1);
        // Head
        g.fillCircle(16, 14, 12);
        // Body
        g.fillRect(4, 14, 24, 12);

        // Bottom squiggles
        if (i === 0) {
          g.fillCircle(8, 26, 4);
          g.fillCircle(16, 26, 4);
          g.fillCircle(24, 26, 4);
        } else {
          g.fillCircle(12, 26, 4);
          g.fillCircle(20, 26, 4);
          g.fillRect(4, 26, 4, 4);
          g.fillRect(24, 26, 4, 4);
        }

        // Eyes
        g.fillStyle(0xffffff, 1);
        g.fillCircle(11, 12, 3);
        g.fillCircle(21, 12, 3);
        g.fillStyle(0x000000, 1);
        g.fillCircle(11, 12, 1);
        g.fillCircle(21, 12, 1);

        g.generateTexture(`${key}-${i}`, 32, 32);
      }
    });
  }

  create() {
    // Create Pac-Man animation
    this.anims.create({
      key: 'pacman-chomp',
      frames: [
        { key: 'pacman-0' },
        { key: 'pacman-1' },
        { key: 'pacman-2' },
        { key: 'pacman-3' },
        { key: 'pacman-2' },
        { key: 'pacman-1' }
      ],
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'coin-spin',
      frames: [
        { key: 'coin-0' },
        { key: 'coin-1' },
        { key: 'coin-2' },
        { key: 'coin-3' }
      ],
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'special-coin-spin',
      frames: [
        { key: 'special-coin-0' },
        { key: 'special-coin-1' },
        { key: 'special-coin-2' },
        { key: 'special-coin-3' }
      ],
      frameRate: 8,
      repeat: -1
    });

    const ghostColors = ['red', 'pink', 'cyan', 'orange'];
    ghostColors.forEach(color => {
      this.anims.create({
        key: `ghost-${color}-wiggle`,
        frames: [
          { key: `ghost-${color}-0` },
          { key: `ghost-${color}-1` }
        ],
        frameRate: 4,
        repeat: -1
      });
    });

    this.scene.start('MenuScene');
  }
}
