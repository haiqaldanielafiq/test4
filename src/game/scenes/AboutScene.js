import Phaser from 'phaser';
import SceneHelper from '../utils/SceneHelper';

export default class AboutScene extends Phaser.Scene {
  constructor() {
    super('AboutScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);

    this.add.text(width / 2, height * 0.2, 'ABOUT MATH CHASE', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const aboutText = "Math Chase: Year 4 Money Edition is an educational game designed to help students master currency operations, payment instruments, and monetary problem-solving through engaging gameplay inspired by classic arcade mechanics.";

    this.add.text(width / 2, height * 0.45, aboutText, {
      fontSize: '28px',
      fill: '#cccccc',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: width * 0.7 }
    }).setOrigin(0.5);

    const backBtn = SceneHelper.createButton(this, width / 2, height * 0.85, 'Back', () => {
      SceneHelper.transitionTo(this, 'MenuScene');
    });

    SceneHelper.setupKeyboardNav(this, [backBtn]);
  }
}
