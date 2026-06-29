import Phaser from 'phaser';
import audioManager from '../utils/AudioManager';
import SceneHelper from '../utils/SceneHelper';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    SceneHelper.addFadeIn(this);

    // Display title with glow effect
    const title = this.add.text(width / 2, height * 0.18, 'MATH CHASE', {
      fontSize: '110px',
      fill: '#ffff00',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);

    // Title pulse animation
    this.tweens.add({
      targets: title,
      scale: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Quad.easeInOut'
    });

    // Display subtitle
    this.add.text(width / 2, height * 0.32, 'Year 4 Money Edition', {
      fontSize: '36px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // High Score display
    const highscore = localStorage.getItem('mathchase-highscore') || 0;
    this.add.text(width / 2, height * 0.38, `HIGH SCORE: ${highscore}`, {
      fontSize: '28px',
      fill: '#00ffff',
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    // Decorative Pac-Man and Ghost
    const pacman = this.add.sprite(width * 0.15, height * 0.5, 'pacman-0');
    pacman.setScale(3);
    pacman.play('pacman-chomp');

    const ghost = this.add.sprite(width * 0.85, height * 0.5, 'ghost-red-0');
    ghost.setScale(3);
    ghost.play('ghost-red-wiggle');

    // Buttons
    const btnStart = SceneHelper.createButton(this, width / 2, height * 0.5, 'Start Game', () => {
      SceneHelper.transitionTo(this, 'GameScene', { score: 0, lives: 3, level: 1 });
    });

    const btnHelp = SceneHelper.createButton(this, width / 2, height * 0.61, 'How to Play', () => {
      SceneHelper.transitionTo(this, 'HelpScene');
    });

    const btnSettings = SceneHelper.createButton(this, width / 2, height * 0.72, 'Settings', () => {
      SceneHelper.transitionTo(this, 'SettingsScene');
    });

    const btnAbout = SceneHelper.createButton(this, width / 4, height * 0.85, 'About', () => {
      SceneHelper.transitionTo(this, 'AboutScene');
    }, { width: 200 });

    const btnCredits = SceneHelper.createButton(this, (width / 4) * 3, height * 0.85, 'Credits', () => {
      SceneHelper.transitionTo(this, 'CreditsScene');
    }, { width: 200 });

    SceneHelper.setupKeyboardNav(this, [btnStart, btnHelp, btnSettings, btnAbout, btnCredits]);

    // Start background music if not already playing
    audioManager.startMusic();
  }
}
