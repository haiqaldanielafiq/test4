import Phaser from 'phaser';
import questions from '../data/questions';
import audioManager from '../utils/AudioManager';

export default class QuestionScene extends Phaser.Scene {
  constructor() {
    super('QuestionScene');
  }

  init(data) {
    this.mainScene = data.mainScene;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.85);
    overlay.fillRect(0, 0, width, height);

    // Pick a random question
    const questionData = questions[Math.floor(Math.random() * questions.length)];

    // Question Text
    this.add.text(width / 2, height * 0.25, questionData.question, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: width * 0.8 }
    }).setOrigin(0.5);

    // Timer
    this.timeLeft = 15;
    this.timerText = this.add.text(width / 2, height * 0.1, `Time: ${this.timeLeft}`, {
      fontSize: '40px',
      fill: '#ff0000',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
          this.handleAnswer(false);
        }
      },
      loop: true
    });

    // Options
    const buttonWidth = 500;
    const buttonHeight = 60;
    const spacing = 80;

    questionData.options.forEach((option, index) => {
      const x = width / 2;
      const y = height * 0.45 + index * spacing;

      const container = this.add.container(x, y);

      const btnBg = this.add.graphics();
      btnBg.fillStyle(0x444444, 1);
      btnBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
      btnBg.lineStyle(2, 0xffffff, 1);
      btnBg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);

      const btnText = this.add.text(0, 0, option, {
        fontSize: '32px',
        fill: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5);

      container.add([btnBg, btnText]);

      const hitArea = new Phaser.Geom.Rectangle(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
      container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

      container.on('pointerover', () => {
        btnBg.clear();
        btnBg.fillStyle(0x666666, 1);
        btnBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
        btnBg.lineStyle(2, 0xffff00, 1);
        btnBg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
      });

      container.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x444444, 1);
        btnBg.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
        btnBg.lineStyle(2, 0xffffff, 1);
        btnBg.strokeRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 10);
      });

      container.on('pointerdown', () => {
        this.handleAnswer(index === questionData.answer);
      });
    });
  }

  handleAnswer(isCorrect) {
    if (this.timerEvent) this.timerEvent.destroy();

    if (isCorrect) {
      audioManager.playCorrect();
      this.mainScene.handleCorrectAnswer();
    } else {
      audioManager.playWrong();
      this.mainScene.handleWrongAnswer();
    }
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}
