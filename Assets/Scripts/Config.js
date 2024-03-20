import Phaser from 'phaser';
import GameScene from 'Assets/Scripts/GameScene.js';
import PreloadScene from 'Assets/Scripts/PreloadScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 36,
    scene: [PreloadScene, GameScene]
};

export { config }