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
    var mapText = this.make.text({
      x: width / 2,
      y: height / 2 - 150,
      text: "Level 4",
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
    this.load.image("background", "Assets/Images/background.png");
    this.load.audio("jump", "Assets/Audio/jump.mp3");
    this.load.image("enemy", "Assets/Images/enemy.png");
    this.load.image("platform", "Assets/Images/platform.png");
    this.load.image("jumpImg", "Assets/Images/jump.png");
    this.load.audio('coinSound', 'Assets/Audio/CoinSFX.mp3');

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
      this.scoreText = this.add.text(650, 350, "Score: ", {
        fontSize: "200px",
        fill: "#000",
        fontWeight: "bold",
      });
    }
    this.scoreText.setScrollFactor(0);
    this.scoreText.setText("Score: " + scoreManager.getScore());
    this.scoreText.setDepth(1);
    this.scoreText.setScale(0.1);

     if (IS_TOUCH) {
     this.cameras.main.scrollY = 170;
      this.jumpBtn = this.add.image(
        window.innerWidth * 0.9,
        window.innerHeight * 0.8,
        "jumpImg"
      )
      .setInteractive({capture: false})
      .setScrollFactor(0)
      .setDepth(5);
    }

    // create the player
    // Assuming 'player' is your player object
    this.player = this.physics.add.sprite(
      0,
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

    if (IS_TOUCH) {
      this.cameras.main.setZoom(1);
    } else {
      this.cameras.main.setZoom(3);
    }

    this.physics.add.collider(this.player, notGroundLayer, () => {
            this.scene.start("DeathMenu");

    });

    console.log(this.groundCounter);

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
      setXY: { x: 400, y: 350, stepX: 300 }, // Position of the first coin and the distance between coins
    });

    // Set properties for each coin
    this.coins.children.iterate(function (coin) {
      coin.setScale(0.5); // Adjust scale as needed
      coin.setGravityY(100);
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

    this.groundCounter = 0;

    this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;

    this.player.setVelocityX(100); // Adjust the value as needed
  }

  collectCoin(player, coin) {
    coin.disableBody(true, true); // This will hide and disable the coin
    this.coinSound = this.sound.add('coinSound');
    this.coinSound.play();
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

    if (IS_TOUCH) {

      if (
        this.input.activePointer.leftButtonDown() &&
        this.isPlayerOnGround &&
        !this.isJumping &&
        this.input.activePointer.x > this.sys.game.config.width / 1.5 &&
        this.input.activePointer.y > this.sys.game.config.height / 3
      ) {
        this.jump();
        this.isJumping = true;
        this.time.delayedCall(301, () => {
          this.isJumping = false;
        });
      }
    }

    if (this.player.x > 6500) {
      this.cameras.main.scrollY = this.player.y - this.cameras.main.height / 2;
    }

    if (!IS_TOUCH) {
      this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2.5;
    } else {
      this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 4;
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

    if (this.frameCounter % 20 === 0) {
      this.player.setVelocityX(this.player.body.velocity.x + 5);
    }

    // if (this.player.body.velocity.x > 200) {
    //   this.cameras.main.shake(40, 0.01);
    // }

    if (this.frameCounter % 15 === 0) {
      this.player.setTexture("second player");
    }
    if (this.frameCounter % 30 === 0) {
      this.player.setTexture("start player");
    }
     if (this.player.x > 2500) {
      this.scene.start('FinishScreen')
    }
  }
  jump() {
    if (this.groundCounter == 0) {
      this.physics.world.gravity.y = -2300;
      this.tweens.add({
        targets: this.player,
        angle: this.player.angle + 180,
        duration: 300,
      });
      this.groundCounter++;
    } else if (this.groundCounter == 1) {
      this.physics.world.gravity.y = 2300;
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
