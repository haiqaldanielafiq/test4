import Phaser from 'phaser';
import SceneHelper from '../utils/SceneHelper';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);

    this.add.text(width / 2, height * 0.2, 'CREDITS', {
      fontSize: '64px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const credits = [
      'Development: Jules',
      'Engine: Phaser 3',
      'UI Framework: React',
      'Math Content: Year 4 DSKP',
      'Audio: Procedural Web Audio API'
    ];

    credits.forEach((text, i) => {
      this.add.text(width / 2, height * 0.4 + i * 50, text, {
        fontSize: '32px',
        fill: '#cccccc',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    });

    const backBtn = SceneHelper.createButton(this, width / 2, height * 0.85, 'Back', () => {
      SceneHelper.transitionTo(this, 'MenuScene');
    });

    SceneHelper.setupKeyboardNav(this, [backBtn]);
  }
}
