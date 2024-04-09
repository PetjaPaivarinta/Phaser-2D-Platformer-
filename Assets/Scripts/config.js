window.onload = function () {
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
        gravity: { y: 950 },
        debug: true,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MainMenu, World, iceWorld, jetPackWorld, GDWorld, DeathMenu],
  };
  const game = new Phaser.Game(config);
};
