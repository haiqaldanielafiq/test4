import Phaser from 'phaser';

export default class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('LevelCompleteScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.lives = data.lives || 3;
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height * 0.3, 'LEVEL COMPLETE!', {
      fontSize: '72px',
      fill: '#ffff00',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.45, `Current Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const nextBtn = this.add.container(width / 2, height * 0.65);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-150, -40, 300, 80, 20);

    const btnText = this.add.text(0, 0, 'Next Level', {
      fontSize: '32px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    nextBtn.add([btnBg, btnText]);

    const hitArea = new Phaser.Geom.Rectangle(-150, -40, 300, 80);
    nextBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    nextBtn.on('pointerdown', () => {
      this.scene.start('GameScene', {
        score: this.score,
        lives: this.lives,
        level: this.level + 1
      });
    });

    nextBtn.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
    });

    nextBtn.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
    });
  }
}
