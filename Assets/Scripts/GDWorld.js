class GDWorld extends Phaser.Scene {
  constructor() {
    super({ key: "GDWorld" });
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
    this.load.image("background", "Assets/Images/background.png");
    this.load.audio("jump", "Assets/Audio/jump.mp3");
    this.load.image("enemy", "Assets/Images/enemy.png");
    this.load.image("platform", "Assets/Images/platform.png");

    // load tilemap
    this.load.tilemapTiledJSON("map4", "Assets/tilemaps/GDWorldMap.json");

    // load the tileset image
    this.load.image("tiles4", "Assets/tilemaps/GDTiles.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      200,
      this.sys.game.config.width * 10,
      this.sys.game.config.height * 2,
      "background"
    );
    this.jumpSound = this.sound.add("jump");

    // is grounded
    this.isPlayerOnGround = false;

    // load the tilemap stuff
    const map = this.make.tilemap({ key: "map4" });

    // add the tileset image to the map
    const tileset = map.addTilesetImage("GDTiles", "tiles4");

    // create the layers
    const notGroundLayer = map.createLayer("Ground", tileset, -350, 0);
    const layer = map.createLayer("Tile Layer 1", tileset, -350, 0);

    notGroundLayer.setCollisionBetween(0, 10000);
    layer.setCollisionBetween(0, 100);

    // create the score text and set it to follow the camera
    this.scoreText = this.add.text(200, 300, "", {
      fontSize: "200px",
      fill: "#000",
      fontWeight: "bold",
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setText("Score: " + scoreManager.getScore());
    this.scoreText.setDepth(1);
    this.scoreText.setScale(0.2);

    // create the player
    // Assuming 'player' is your player object
    this.player = this.physics.add.sprite(
      2,
      350, // Spawn at half the game's height
      "start player"
    );
    this.player.setScale(0.1);
    this.player.setMaxVelocity(2000, 500);
    this.physics.add.collider(
      this.player,
      layer,
      () => {
        this.isPlayerOnGround = true;
      },
      null,
      this
    );

    this.cameras.main.setZoom(3);

    this.physics.add.collider(this.player, notGroundLayer, () => {
      this.scene.restart();
      scoreManager.score = Math.floor(scoreManager.score / 2);
      this.scoreText.setText("Score: " + scoreManager.getScore());
    });

    this.escapeKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    this.frameCounter = 0;

    this.escapeKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    this.isPaused = false;

    this.isPlayerOnGround = false;

    this.coins = this.physics.add.group({
      key: "coin",
      repeat: 100, // Number of coins to create
      setXY: { x: 1000, y: 500, stepX: 650 }, // Position of the first coin and the distance between coins
    });

    // Set properties for each coin
    this.coins.children.iterate(function (coin) {
      coin.setScale(1.5); // Adjust scale as needed
      coin.setGravityY(200);
      this.physics.add.collider(coin, layer);
      coin.setBounce(1);
    }, this);

    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this
    );

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemies,
      callbackScope: this,
      loop: true,
    });

    this.groundCounter = 0;

    this.enemies = this.physics.add.group();

    this.physics.add.collider(this.player, this.enemies, () => {
      this.scene.restart();
      scoreManager.score = Math.floor(scoreManager.score / 2);
      this.scoreText.setText("Score: " + scoreManager.getScore());
    });

    this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;

    this.player.setVelocityX(100); // Adjust the value as needed
  }

  spawnEnemies() {
    let enemy = this.enemies.create(900, 800, "enemy");
    enemy.setScale(2.5); // Adjust scale as needed
    enemy.setVelocityX(-500); // Adjust velocity as needed
    enemy.body.setAllowGravity(false);
    enemy.y = Phaser.Math.Between(600, 850); // Set the y-coordinate to a random value between minHeight and maxHeight
    enemy.setDepth(2);
    enemy.x = Phaser.Math.Between(2200, 6100);
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true); // This will hide and disable the coin

    scoreManager.increaseScore(10),
      this.scoreText.setText("Score: " + scoreManager.getScore());
  }

  update() {
    if (this.keys.SPACE.isDown && this.isPlayerOnGround && !this.isJumping) {
      this.jump();
      this.isJumping = true;
      this.time.delayedCall(301, () => {
        this.isJumping = false;
      });
    }

    this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;

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

    if (this.frameCounter % 20 === 0) {
      this.player.setVelocityX(this.player.body.velocity.x + 5);
    }

    if (this.player.body.velocity.x > 200) {
      this.cameras.main.shake(10, 0.01);
    }

    if (this.frameCounter % 15 === 0) {
      this.player.setTexture("second player");
    }
    if (this.frameCounter % 30 === 0) {
      this.player.setTexture("start player");
    }

    if (this.player.x > 6100) {
      this.scene.start("GDWorld");
    }
  }
  jump() {
    if (this.groundCounter == 0) {
      this.physics.world.gravity.y = -1600;
      this.tweens.add({
        targets: this.player,
        angle: this.player.angle - 180,
        duration: 300,
      });
      this.groundCounter++;
    } else if (this.groundCounter == 1) {
      this.physics.world.gravity.y = 1600;
      this.tweens.add({
        targets: this.player,
        angle: this.player.angle + 180,
        duration: 300,
      });
      this.groundCounter--;
    }

    // rotate the player
    console.log("jump");
    this.isPlayerOnGround = false;
    this.jumpSound.play();
  }
}
