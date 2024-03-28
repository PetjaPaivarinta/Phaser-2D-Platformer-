var platforms;
class iceWorld extends Phaser.Scene {
  constructor() {
    super({ key: "iceWorld" });
    this.player = null;
  }

  preload() {
    var width = this.cameras.main.width;
    var height = this.cameras.main.height; // Corrected typo

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    progressBox.fillRect(width / 2 - 30, height / 2 - 30, 2, 2);
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "22px monospace",
        fill: "#ddddd",
      },
    });

    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "22px monospace",
        fill: "#ddddd",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "22px monospace",
        fill: "#ddddd",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", function (value) {
      percentText.setText(parseInt(value * 100) + "%");
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 160, height / 2 - 30, 320 * value, 50);
    });

    this.load.on("fileprogress", function (file) {
      assetText.setText("Loading asset: " + file.key);
    });

    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      console.log("dwdwdw");
    });
    this.load.image("start player", "Assets/Images/1st Player img.png");
    this.load.image("second player", "Assets/Images/2nd Player img.png");
    this.load.image("coin", "Assets/Images/coin.png");
    this.load.audio("jump", "Assets/Audio/jump.mp3");
    this.load.image("lava", "Assets/Images/lava.png");
    this.load.image("platform", "Assets/Images/platform.png");

    for (let i = 0; i < 100; i++) {
      this.load.image("coin" + i, "Assets/Images/coin.png");
    }

    // load tilemap
    this.load.tilemapTiledJSON("map2", "Assets/tilemaps/iceWorldMap.json");

    // load the tileset image
    this.load.image("tiles2", "Assets/tilemaps/ice Tiles.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.jumpSound = this.sound.add("jump");

    // is grounded
    this.isPlayerOnGround = false;

    // load the tilemap stuff
    const map = this.make.tilemap({ key: "map2" });

    // add the tileset image to the map
    const tileset = map.addTilesetImage("ice", "tiles2");

    // create the layers
    const layer = map.createLayer("Ground", tileset, 0, 0);
    const notGroundLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);

    notGroundLayer.setCollisionBetween(0, 10000);
    layer.setCollisionBetween(0, 100);

    // create the score text and set it to follow the camera
    this.scoreText = this.add.text(
      this.sys.game.config.width / 3.3,
      this.sys.game.config.height / 3.2,
      "Score: 0",
      { fontSize: "200px", fill: "#000", fontWeight: "bold" }
    );
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(1);
    this.scoreText.setScale(0.1);

    // create the lava
    this.lava = this.physics.add.image(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 1.5 + 225,
      "lava"
    );
    this.lava.setDepth(5);
    this.lava.setScale(500, 3);
    this.lava.body.setAllowGravity(false);
    this.lava.setImmovable(true);

    // Create the platform
    // Create the platforms
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(4400, 1500, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4500, 1300, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4400, 1100, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4400, 900, "platform").setScale(0.1).refreshBody();

    // Create the tweens
    this.tweens.add({
      targets: this.platforms.getChildren()[0],
      x: 4800,
      duration: 1000,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.platforms.getChildren()[1],
      x: 4800,
      duration: 1100,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.platforms.getChildren()[2],
      x: 4800,
      duration: 1400,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: this.platforms.getChildren()[3],
      x: 4800,
      duration: 900,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    // create the player
    this.player = this.physics.add.sprite(
      this.sys.game.config.width / 2.7,
      this.sys.game.config.height / 1.6,
      "start player"
    );
    this.player.setScale(0.15);

    this.player.setDrag(100, 0);
    this.player.setMaxVelocity(1000, 500);
    this.physics.add.collider(this.lava, this.player, () => {
      this.scene.restart();
      this.score = 0;
      this.scoreText.setText("Score: " + this.score);
    }),
      this.physics.add.collider(
        this.player,
        layer,
        () => {
          this.isPlayerOnGround = true;
        },
        null,
        this
      );

    this.physics.add.collider(this.player, notGroundLayer);

    this.physics.add.collider(this.player, this.platforms, () => {
      this.scene.restart();
    });

    this.cameras.main.setZoom(2);

    this.coins = this.physics.add.group({
      key: "coin",
      repeat: 100, // Number of coins to create
      setXY: { x: 1000, y: 100, stepX: 50 }, // Position of the first coin and the distance between coins
    });

    // Set properties for each coin
    this.coins.children.iterate(function (coin) {
      coin.setScale(0.5); // Adjust scale as needed
      coin.setGravityY(500);
      this.physics.add.collider(coin, layer);
      coin.setBounce(0.5);
    }, this);
    this.score = 0;

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    this.escapeKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    this.frameCounter = 0;

    this.escapeKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.isPaused = false;

    this.isPlayerOnGround = false;
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true); // This will hide and disable the coin

    // Increase and update the score
    this.tweens.add({
      targets: this,
      score: this.score + 10,
      duration: 50,
      onUpdate: () => {
        this.scoreText.setText("Score: " + Math.floor(this.score));
      },
    });
  }

  update() {
    if (this.player.body.velocity.y > 200 && this.isPlayerOnGround) {
      this.isPlayerOnGround = false;
    }
    this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
    this.cameras.main.scrollY = 150; // replace 'someFixedValue' with the desired y position
    if (Phaser.Input.Keyboard.JustDown(this.escapeKey) && !this.isPaused) {
      this.scene.pause();
      this.isPaused = true;
      console.log("pause");

      this.escapeKey.on(
        "up",
        () => {
          this.scene.resume();
          this.isPaused = false;
          console.log("resume");
        },
        this,
        true
      ); // the third parameter is `once`, which means the event listener will be removed after being triggered
    }

    this.frameCounter++;

    // update the collider every 10 frames
    if (this.frameCounter % 10 === 0) {
      this.platforms.getChildren().forEach((platform) => {
        platform.refreshBody();
      });
    }

    // move the player left and right
    if (this.input.keyboard.addKey("A").isDown) {
      this.player.x -= 5;
    }
    if (this.input.keyboard.addKey("D").isDown) {
      this.player.x += 5;
    }
    if (this.input.keyboard.addKey("Space").isDown && this.isPlayerOnGround) {
      // jump
      this.jump();
      this.isPlayerOnGround = false;
    }

    if (
      this.input.keyboard.addKey("D").isUp &&
      this.player.body.velocity.y === 0
    ) {
      this.player.setVelocityX(100);
    }

    if (this.player.x > 4300) {
      this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
      this.cameras.main.zoomTo(1.5);
      this.lava.destroy();
    } else {
      this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
      this.cameras.main.scrollY = 150; // replace 'someFixedValue' with the desired y position
    }

    if (this.frameCounter % 15 === 0) {
      this.player.setTexture("second player");
    }
    if (this.frameCounter % 30 === 0) {
      this.player.setTexture("start player");
    }
  }
  jump() {
    this.player.setVelocityY(-500);
    this.jumpSound.play();
  }
}
