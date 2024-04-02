class jetPackWorld extends Phaser.Scene {
  constructor() {
    super({ key: "jetPackWorld" });
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
    this.load.image("background", "Assets/Images/background.png");
    this.load.audio("jump", "Assets/Audio/jump.mp3");
    this.load.image("platform", "Assets/Images/platform.png");

    // load tilemap
    this.load.tilemapTiledJSON("map3", "Assets/tilemaps/jetpackWorld.json");

    // load the tileset image
    this.load.image("tiles3", "Assets/tilemaps/jetWall.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      400,
      this.sys.game.config.width * 10,
      this.sys.game.config.height * 2,
      "background"
    );
    this.jumpSound = this.sound.add("jump");

    // is grounded
    this.isPlayerOnGround = false;

    // load the tilemap stuff
    const map = this.make.tilemap({ key: "map3" });

    // add the tileset image to the map
    const tileset = map.addTilesetImage("jetWall", "tiles3");

    // create the layers
    const layer = map.createLayer("Tile Layer 1", tileset, 0, 0);

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

   
    // Create the platforms
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(4400, 800, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4500, 1100, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4400, 1400, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4400, 1500, "platform").setScale(0.1).refreshBody();
    this.platforms.create(4400, 1700, "platform").setScale(0.1).refreshBody();

    // Create the tweens
    this.tweens.add({
      targets: this.platforms.getChildren()[0],
      x: 4800,
      duration: 2000,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.platforms.getChildren()[1],
      x: 4800,
      duration: 2300,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.platforms.getChildren()[2],
      x: 4800,
      duration: 2600,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: this.platforms.getChildren()[3],
      x: 4900,
      duration: 3900,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: this.platforms.getChildren()[4],
      x: 5000,
      duration: 3900,
      ease: "Linear",
      yoyo: true,
      repeat: -1,
    });

    // create the player
    // Assuming 'player' is your player object
    this.player = this.physics.add.sprite(
      this.sys.game.config.width / 2, // Spawn at half the game's width
      this.sys.game.config.height / 2, // Spawn at half the game's height
      "start player"
    );
    this.player.setScale(0.15);

    this.player.setDrag(100, 0);
    this.player.setMaxVelocity(300, 500);
      this.physics.add.collider(
        this.player,
        layer,
        () => {
          this.isPlayerOnGround = true;
        },
        null,
        this
      );

    this.physics.add.collider(this.player, this.platforms, () => {
      this.scene.restart();
    });

    this.cameras.main.setZoom(2);

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

  update() {
    if (this.player.body.velocity.y > 200 && this.isPlayerOnGround) {
      this.isPlayerOnGround = false;
    }
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
    if (this.player.x > 4200 && this.player.y > 1700 && this.isPlayerOnGround) {
      this.load.scene("jetPackScene");
    }

    // move the player left and right
    if (this.input.keyboard.addKey("A").isDown) {
      this.background.tilePositionX += 1.5;

      this.player.setVelocityX(-300);
    } else if (this.input.keyboard.addKey("D").isDown) {
      this.player.setVelocityX(300);
      this.background.tilePositionX -= 1.5;
    }
    if (this.input.keyboard.addKey("Space").isDown && this.isPlayerOnGround) {
      // jump
      this.jump();
      this.isPlayerOnGround = false;
    }

    if (this.player.x > 4300) {
      this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
      this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
      this.cameras.main.zoomTo(1);
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
