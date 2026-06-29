import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height * 0.3, 'GAME OVER', {
      fontSize: '84px',
      fill: '#ff0000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.45, `Final Score: ${this.finalScore}`, {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    const restartBtn = this.add.container(width / 2, height * 0.65);
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xffffff, 1);
    btnBg.fillRoundedRect(-150, -40, 300, 80, 20);

    const btnText = this.add.text(0, 0, 'Try Again', {
      fontSize: '32px',
      fill: '#000000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    restartBtn.add([btnBg, btnText]);

    const hitArea = new Phaser.Geom.Rectangle(-150, -40, 300, 80);
    restartBtn.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    restartBtn.on('pointerdown', () => {
      this.scene.start('GameScene', { score: 0, lives: 3, level: 1 });
    });

    restartBtn.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffff00, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
    });

    restartBtn.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-150, -40, 300, 80, 20);
    });
  }
}
