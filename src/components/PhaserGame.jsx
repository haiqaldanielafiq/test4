import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import BootScene from '../scenes/BootScene';
import MenuScene from '../scenes/MenuScene';
import GameScene from '../scenes/GameScene';

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
      scene: [BootScene, MenuScene, GameScene],
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
