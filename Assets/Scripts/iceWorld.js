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

   var mapText = this.make.text({
     x: width / 2,
     y: height / 2 - 150,
     text: "Level 2",
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
    this.load.image("background", "Assets/Images/background.png");
    this.load.image("coin", "Assets/Images/coin.png");
    this.load.audio("jump", "Assets/Audio/jump.mp3");
    this.load.image("lava2", "Assets/Images/water.jpg");
    this.load.image("platform", "Assets/Images/platform.png");
    this.load.image("jumpImg", "Assets/Images/jump.png");
    this.load.image("arrow", "Assets/Images/arrow.png");

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
    const map = this.make.tilemap({ key: "map2" });

    // add the tileset image to the map
    const tileset = map.addTilesetImage("ice", "tiles2");

    // create the layers
    const layer = map.createLayer("Ground", tileset, -100, 100);
    const notGroundLayer = map.createLayer("Tile Layer 1", tileset, -100, 100);

    notGroundLayer.setCollisionBetween(0, 10000);
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
    this.scoreText.setText("Score: " + scoreManager.getScore());
    this.scoreText.setDepth(1);
    this.scoreText.setScale(0.1);

    // create the lava2
    this.lava2 = this.physics.add.image(
      800,
      1050,
      "lava2"
    ).setScale(10, 1)
    this.lava2.setDepth(5);
    this.lava2.body.setAllowGravity(false);
    this.lava2.setImmovable(true);

    // Create the platform
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

    if (IS_TOUCH) {
      this.isLeftButtonDown = false;
      this.isRightButtonDown = false;
      this.isJumpButtonDown = false;
    }

    // create the player
    // Assuming 'player' is your player object
    this.player = this.physics.add.sprite(800, 700, "start player");
    this.player.setScale(0.15);

    this.player.setDrag(100, 0);
    this.player.setMaxVelocity(300, 500);
    this.physics.add.collider(this.lava2, this.player, () => {
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
  .on('pointerdown', function (pointer) {
    if (pointer.pointerId === 1) {
      this.isRightButtonDown = true;
    } else if (pointer.pointerId === 2) {
      this.isJumpButtonDown = true;
    }
  }, this)
  .on('pointerup', function (pointer) {
    if (pointer.pointerId === 1) {
      this.isRightButtonDown = false;
    } else if (pointer.pointerId === 2) {
      this.isJumpButtonDown = false;
    }
  }, this);
      this.leftBtn = this.add
        .image(window.innerWidth * 0.06, window.innerHeight * 0.8, "arrow")
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(5);
      this.leftBtn
  .on('pointerdown', function (pointer) {
    if (pointer.pointerId === 1) {
      this.isLeftButtonDown = true;
    } else if (pointer.pointerId === 2) {
      this.isJumpButtonDown = true;
    }
  }, this)
  .on('pointerup', function (pointer) {
    if (pointer.pointerId === 1) {
      this.isLeftButtonDown = false;
    } else if (pointer.pointerId === 2) {
      this.isJumpButtonDown = false;
    }
  }, this);
      this.jumpBtn = this.add.image(
        window.innerWidth * 0.9,
        window.innerHeight * 0.8,
        "jumpImg"
      )
      .setInteractive()
      .setScrollFactor(0)
        .setDepth(5);
      this.jumpBtn
  .on('pointerdown', function (pointer) {
    this.isJumpButtonDown = true;
  }, this)
  .on('pointerup', function (pointer) {
    this.isJumpButtonDown = false;
  }, this);
    }

    this.physics.add.collider(this.player, notGroundLayer, () => {
     this.scene.start("DeathMenu");
    });

    this.physics.add.collider(this.player, this.platforms, () => {
      this.scene.start('DeathMenu')
    });

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

    this.input.addPointer(7);

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

    scoreManager.increaseScore(10),
      this.scoreText.setText("Score: " + scoreManager.getScore());
  }

  update() {

    if (IS_TOUCH) {
      if (this.isLeftButtonDown) {
        this.moveLeft();
      } else if (this.isRightButtonDown) {
        this.moveRight();
      } else if (this.isJumpButtonDown && this.isPlayerOnGround) {
        this.jump();
        this.isPlayerOnGround = false;
      }
    }
     if (IS_TOUCH) {
      this.cameras.main.scrollY = 500;
    } else {
      this.cameras.main.scrollY = 150; // replace 'someFixedValue' with the desired y position
    }
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
      this.scene.start("jetPackWorld");
    }

    if (!IS_TOUCH) {
      if (this.input.keyboard.addKey("A").isDown) {
        this.moveLeft();
      } else if (this.input.keyboard.addKey("D").isDown) {
        this.moveRight();
      }
      if (this.input.keyboard.addKey("Space").isDown && this.isPlayerOnGround) {
        // jump
        this.jump();
        this.isPlayerOnGround = false;
      }
    }


    if (this.player.x > 4300) {
      this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
      this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
      this.cameras.main.zoomTo(1);
    } else {
      this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
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
