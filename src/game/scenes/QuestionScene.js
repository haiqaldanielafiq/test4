import Phaser from 'phaser';
import questions from '../data/questions';
import audioManager from '../utils/AudioManager';
import SceneHelper from '../utils/SceneHelper';

export default class QuestionScene extends Phaser.Scene {
  constructor() {
    super('QuestionScene');
  }

  init(data) {
    this.mainScene = data.mainScene;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background overlay with fade in
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0);
    overlay.fillRect(0, 0, width, height);

    this.tweens.add({
        targets: overlay,
        alpha: 0.9,
        duration: 300
    });

    // Pick a random question
    const questionData = questions[Math.floor(Math.random() * questions.length)];

    // Question Container for entry animation
    const contentGroup = this.add.container(0, -height);

    // Question Text
    const qText = this.add.text(width / 2, height * 0.25, questionData.question, {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: width * 0.8 }
    }).setOrigin(0.5);

    // Timer bar
    this.timeLeft = 15;
    this.maxTime = 15;

    const timerBg = this.add.graphics();
    timerBg.fillStyle(0x333333, 1);
    timerBg.fillRect(width / 2 - 200, height * 0.1, 400, 20);

    this.timerBar = this.add.graphics();

    this.timerText = this.add.text(width / 2, height * 0.06, `Time: ${this.timeLeft}s`, {
      fontSize: '32px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    contentGroup.add([qText, timerBg, this.timerBar, this.timerText]);

    this.timerEvent = this.time.addEvent({
      delay: 100,
      callback: () => {
        this.timeLeft -= 0.1;
        this.updateTimerUI(width, height);
        if (this.timeLeft <= 0) {
          this.handleAnswer(false);
        }
      },
      loop: true
    });

    // Options
    const buttons = [];
    questionData.options.forEach((option, index) => {
      const x = width / 2;
      const y = height * 0.45 + index * 90;

      const btn = SceneHelper.createButton(this, x, y, option, () => {
        this.handleAnswer(index === questionData.answer);
      }, { width: 600, height: 70, color: 0x444444, hoverColor: 0x666666, textColor: '#ffffff' });

      contentGroup.add(btn);
      buttons.push(btn);
    });

    SceneHelper.setupKeyboardNav(this, buttons);

    // Entry animation
    this.tweens.add({
        targets: contentGroup,
        y: 0,
        duration: 500,
        ease: 'Back.easeOut'
    });
  }

  updateTimerUI(width, height) {
    this.timerText.setText(`Time: ${Math.ceil(this.timeLeft)}s`);

    const progress = this.timeLeft / this.maxTime;
    const color = progress > 0.5 ? 0x00ff00 : (progress > 0.2 ? 0xffff00 : 0xff0000);

    this.timerBar.clear();
    this.timerBar.fillStyle(color, 1);
    this.timerBar.fillRect(width / 2 - 200, height * 0.1, 400 * progress, 20);
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

    // Exit animation then stop
    this.tweens.add({
        targets: this.cameras.main,
        alpha: 0,
        duration: 300,
        onComplete: () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        }
    });
  }
}
