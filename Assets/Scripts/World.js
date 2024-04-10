class World extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
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

    var mapText = this.make.text({
      x: width / 2,
      y: height / 2 - 150,
      text: "Level 1",
      style: {
        font: "50px Impact",
        fill: "#ddddd",
      },
    });

    loadingText.setOrigin(0.5, 0.5);
    mapText.setOrigin(0.5, 0.5);

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
    this.load.image("arrow", "Assets/Images/arrow.png");
    this.load.image("lava", "Assets/Images/lava.png");
    this.load.image("jumpImg", "Assets/Images/jump.png");

    for (let i = 0; i < 100; i++) {
      this.load.image("coin" + i, "Assets/Images/coin.png");
    }

    // load tilemap
    this.load.tilemapTiledJSON("map", "Assets/tilemaps/world1.json");

    // load the tileset image
    this.load.image("tiles", "Assets/tilemaps/world1 tiles.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 1.5 - 150,
        "Welcome to the Game",
        {
          fontFamily: "Comic Sans",
          fontSize: "220px",
          color: "#ffffff",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(1)
      .setScale(0.2);
    this.jumpSound = this.sound.add("jump");

    // is grounded
    this.isPlayerOnGround = false;

    // load the tilemap stuff
    const map = this.make.tilemap({ key: "map" });

    // add the tileset image to the map
    const tileset = map.addTilesetImage("spritesheet", "tiles");

    // create the layers
    const layer = map.createLayer("Ground", tileset, 100, 100);
    const notGroundLayer = map.createLayer("Tile Layer 1", tileset, 100, 100);

    notGroundLayer.setCollisionBetween(0, 100);
    layer.setCollisionBetween(0, 100);

    // create the score text and set it to follow the camera
    if (IS_TOUCH) {
      this.scoreText = this.add.text(
        window.innerWidth * 0.06,
        window.innerHeight * 0.2,
        "Score: ",
        {
          fontSize: "200px",
          fill: "#000",
          fontWeight: "bold",
        }
      );
    } else {
      this.scoreText = this.add.text(500, 300, "Score: ", {
        fontSize: "200px",
        fill: "#000",
        fontWeight: "bold",
      });
    }
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(1);
    this.scoreText.setText("Score: " + scoreManager.getScore());
    this.scoreText.setScale(0.1);

    // create the lava
    this.lava = this.physics.add.image(1000, 900, "lava");
    this.lava.setDepth(5);
    this.lava.setScale(500, 3);
    this.lava.body.setAllowGravity(false);
    this.lava.setImmovable(true);
    //this.lava.preFX.addGlow();
    this.lava.postFX.addGlow(["#ffffff"], [15], [2], [false]);

    // create the player
    this.player = this.physics.add.image(800, 700, "start player");
    this.player.setScale(0.15);

    this.physics.add.collider(this.lava, this.player, () => {
      this.scene.start("DeathMenu");
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

    if (IS_TOUCH) {
      this.cameras.main.setZoom(1);
    } else {
      this.cameras.main.setZoom(2);
    }
    if (IS_TOUCH) {
      this.rightBtn = this.add
        .image(window.innerWidth * 0.15, window.innerHeight * 0.8, "arrow")
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(5);
      this.rightBtn.angle = 180;
      this.rightBtn
        .on(
          "pointerdown",
          function () {
            this.moveRight();
          },
          this
        )
        .on(
          "pointerup",
          function () {
            this.stopMoving();
          },
          this
        );
      this.leftBtn = this.add
        .image(window.innerWidth * 0.06, window.innerHeight * 0.8, "arrow")
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(5);
      this.leftBtn
        .on(
          "pointerdown",
          function () {
            this.moveLeft();
          },
          this
        )
        .on(
          "pointerup",
          function () {
            this.stopMoving();
          },
          this
        );
      this.jumpBtn = this.add.image(
        window.innerWidth * 0.9,
        window.innerHeight * 0.8,
        "jumpImg"
      );
      this.jumpBtn.setScrollFactor(0);
      this.jumpBtn.setDepth(5);
    }
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
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true); // This will hide and disable the coin

    scoreManager.increaseScore(10),
      this.scoreText.setText("Score: " + scoreManager.getScore());
  }

  update() {
    if (this.player.body.velocity.y > 200 && this.isPlayerOnGround) {
      this.isPlayerOnGround = false;
    }
    this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;

    if (IS_TOUCH) {
      this.cameras.main.scrollY = 500;
      if (
        this.input.activePointer.leftButtonDown() &&
        this.isPlayerOnGround &&
        this.input.activePointer.x > this.sys.game.config.width / 1.5 &&
        this.input.activePointer.y > this.sys.game.config.height / 3
      ) {
        this.jump();
        this.isPlayerOnGround = false;
      }
    } else {
      this.cameras.main.scrollY = 150; // replace 'someFixedValue' with the desired y position
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

    if (this.player.x > 5500) {
      this.scene.start("iceWorld");
    }

    this.frameCounter++;

    // destroy coin, increase score, and update score text
    if (!IS_TOUCH) {
      if (this.input.keyboard.addKey("A").isDown) {
        this.moveLeft();
      } else if (this.input.keyboard.addKey("D").isDown) {
        this.moveRight();
      } else {
        this.stopMoving();
      }
      if (this.input.keyboard.addKey("Space").isDown && this.isPlayerOnGround) {
        // jump
        this.jump();
        this.isPlayerOnGround = false;
      }
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
  moveLeft() {
    console.log("moving left");
    this.player.setVelocityX(-300);
  }

  moveRight() {
    console.log("moving right");
    this.player.setVelocityX(300);
  }
  stopMoving() {
    this.player.setVelocityX(0);
  }
}
