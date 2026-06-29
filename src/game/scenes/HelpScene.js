import Phaser from 'phaser';
import SceneHelper from '../utils/SceneHelper';

export default class HelpScene extends Phaser.Scene {
  constructor() {
    super('HelpScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);

    this.add.text(width / 2, height * 0.15, 'HOW TO PLAY', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const instructions = [
      '• Use Arrow Keys or WASD to move.',
      '• Collect all coins to clear the level.',
      '• Avoid the ghosts! They will cost you a life.',
      '• Special coins trigger math questions.',
      '• Answer correctly to earn points and stay safe!',
      '• Master the Year 4 Money topics to win.'
    ];

    instructions.forEach((text, i) => {
      this.add.text(width / 2, height * 0.35 + i * 50, text, {
        fontSize: '28px',
        fill: '#cccccc',
        fontFamily: 'Arial',
        align: 'center'
      }).setOrigin(0.5);
    });

    const backBtn = SceneHelper.createButton(this, width / 2, height * 0.85, 'Got it!', () => {
      SceneHelper.transitionTo(this, 'MenuScene');
    });

    SceneHelper.setupKeyboardNav(this, [backBtn]);
  }
}
