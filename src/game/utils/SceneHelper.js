import Phaser from 'phaser';
import audioManager from './AudioManager';

export default class SceneHelper {
  static createButton(scene, x, y, text, callback, options = {}) {
    const {
      width = 360,
      height = 80,
      fontSize = '32px',
      color = 0xffffff,
      hoverColor = 0xffff00,
      textColor = '#000000'
    } = options;

    const container = scene.add.container(x, y);
    const btnBg = scene.add.graphics();

    const drawBg = (bgColor) => {
      btnBg.clear();
      btnBg.fillStyle(bgColor, 1);
      btnBg.fillRoundedRect(-width / 2, -height / 2, width, height, 20);
      btnBg.lineStyle(4, 0x0000ff, 1);
      btnBg.strokeRoundedRect(-width / 2, -height / 2, width, height, 20);
    };

    drawBg(color);

    const btnText = scene.add.text(0, 0, text, {
      fontSize: fontSize,
      fill: textColor,
      fontFamily: 'Arial',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    container.add([btnBg, btnText]);
    const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
    container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    container.on('pointerdown', () => {
      audioManager.playClick();
      callback();
    });

    container.on('pointerover', () => {
      drawBg(hoverColor);
      container.setScale(1.05);
    });

    container.on('pointerout', () => {
      drawBg(color);
      container.setScale(1);
    });

    return container;
  }

  static addFadeIn(scene) {
    scene.cameras.main.fadeIn(500, 0, 0, 0);
  }

  static transitionTo(scene, targetScene, data = {}) {
    scene.cameras.main.fadeOut(500, 0, 0, 0);
    scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      scene.scene.start(targetScene, data);
    });
  }

  static setupKeyboardNav(scene, buttons) {
    let index = -1;

    const updateSelection = (newIndex) => {
      // Clear previous selection
      if (index >= 0 && index < buttons.length) {
        buttons[index].emit('pointerout');
      }

      index = newIndex;
      if (index < 0) index = buttons.length - 1;
      if (index >= buttons.length) index = 0;

      // Set new selection
      buttons[index].emit('pointerover');
    };

    const tabKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    const enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    scene.input.keyboard.on('keydown-UP', () => updateSelection(index - 1));
    scene.input.keyboard.on('keydown-DOWN', () => updateSelection(index + 1));

    tabKey.on('down', (event) => {
      event.originalEvent.preventDefault();
      updateSelection(index + 1);
    });

    const triggerAction = () => {
      if (index >= 0 && index < buttons.length) {
        buttons[index].emit('pointerdown');
      }
    };

    enterKey.on('down', triggerAction);
    spaceKey.on('down', triggerAction);
  }
}
