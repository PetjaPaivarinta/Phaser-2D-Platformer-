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

    var mapText = this.make.text({
      x: width / 2,
      y: height / 2 - 150,
      text: "Level 3",
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
    this.load.image("arrow", "Assets/Images/arrow.png");

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
      200,
      this.sys.game.config.width * 10,
      this.sys.game.config.height * 2,
      "background"
    );
    this.jumpSound = this.sound.add("jump");

    // is grounded
    this.isPlayerOnGround = false;

    // load the tilemap stuff
    const map = this.make.tilemap({ key: "map3" });

    if (IS_TOUCH) {
      this.cameras.main.setZoom(1);
    } else {
      this.cameras.main.setZoom(1);
    }

    // add the tileset image to the map
    const tileset = map.addTilesetImage("jetWall", "tiles3");

    // create the layers
    const layer = map.createLayer("Tile Layer 1", tileset, 0, 0);

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
      this.scoreText = this.add.text(200, 300, "Score: ", {
        fontSize: "200px",
        fill: "#000",
        fontWeight: "bold",
      });
    }
    this.scoreText.setScrollFactor(0);
    this.scoreText.setText("Score: " + scoreManager.getScore());
    this.scoreText.setDepth(1);
    this.scoreText.setScale(0.2);

    // create the player
    // Assuming 'player' is your player object
    this.player = this.physics.add.sprite(
      100,
      800, // Spawn at half the game's height
      "start player"
    );
    this.player.setScale(0.25);
    this.player.setGravityY(500);
    this.player.body.immovable = true;
    this.player.setDrag(100, 0);
    this.player.setMaxVelocity(20000, 500);
    this.physics.add.collider(
      this.player,
      layer,
      () => {
        this.isPlayerOnGround = true;
      },
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

    if (IS_TOUCH) {
     
      this.jumpBtn = this.add.image(
        window.innerWidth * 0.9,
        window.innerHeight * 0.8,
        "jumpImg"
      )
      .setInteractive({capture: false})
      .setScrollFactor(0)
      .setDepth(5);
    }

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

    this.enemies = this.physics.add.group();

    this.physics.add.collider(this.player, this.enemies, () => {
     this.scene.start("DeathMenu");
    });
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
    if(!IS_TOUCH){
    if (
      this.cursors.up.isDown ||
      this.keys.W.isDown ||
      this.keys.SPACE.isDown ||
      this.input.activePointer.isDown
    ) {
      this.player.setVelocityY(-600); // Adjust the value as needed
      }
    } else {
      if (
        this.input.activePointer.leftButtonDown() &&
        this.input.activePointer.x > this.sys.game.config.width / 1.5 &&
        this.input.activePointer.y > this.sys.game.config.height / 3
      ) {
        this.player.setVelocityY(-600); // Adjust the value as needed
      }
    }

    this.cameras.main.scrollX = this.player.x - this.cameras.main.width / 2;
     if (IS_TOUCH) {
      this.cameras.main.scrollY = 550;
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

    this.player.setVelocityX(500); // Adjust the value as needed

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
    this.player.setVelocityY(-500);
    this.jumpSound.play();
  }
}
