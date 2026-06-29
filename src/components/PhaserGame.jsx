import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from '../game/scenes/BootScene';
import MenuScene from '../game/scenes/MenuScene';
import GameScene from '../game/scenes/GameScene';
import QuestionScene from '../game/scenes/QuestionScene';
import GameOverScene from '../game/scenes/GameOverScene';
import LevelCompleteScene from '../game/scenes/LevelCompleteScene';
import SettingsScene from '../game/scenes/SettingsScene';
import PauseScene from '../game/scenes/PauseScene';
import CreditsScene from '../game/scenes/CreditsScene';
import HelpScene from '../game/scenes/HelpScene';
import AboutScene from '../game/scenes/AboutScene';

const PhaserGame = () => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      parent: containerRef.current,
      backgroundColor: '#000000',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [
        BootScene,
        MenuScene,
        GameScene,
        QuestionScene,
        GameOverScene,
        LevelCompleteScene,
        SettingsScene,
        PauseScene,
        CreditsScene,
        HelpScene,
        AboutScene
      ],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} id="game-container" style={{ width: '100%', height: '100%' }} />;
};

export default PhaserGame;
