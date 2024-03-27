const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  dom: {
    createContainer: true,
  },

  backgroundColor: "#3498db",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MainMenu, World, iceWorld],
};

const game = new Phaser.Game(config);
