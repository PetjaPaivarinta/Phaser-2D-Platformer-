class World extends Phaser.Scene
{
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;    
    }

    
    preload()
    {
        var width = this.cameras.main.width;
var height = this.cameras.main.height; // Corrected typo

    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();

    progressBox.fillRect(width / 2 - 30, height / 2 - 30, 2, 2);
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '22px monospace',
            fill: '#ddddd'
        }
    });

    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '22px monospace',
            fill: '#ddddd'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '22px monospace',
            fill: '#ddddd'

        }
    });
    assetText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(width / 2 - 160, height / 2 - 30, 320 * value, 50);
    });
    
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

   this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        console.log("dwdwdw")
    });
        this.load.image('start player', 'Assets/Images/1st Player img.png');
        this.load.image('second player', 'Assets/Images/2nd Player img.png');
        this.load.image('coin', 'Assets/Images/coin.png');

        for (let i = 0; i < 100; i++) {
            this.load.image('coin' + i, 'Assets/Images/coin.png');
        }


        // load tilemap
        this.load.tilemapTiledJSON('map', 'Assets/tilemaps/exported.json');

        // load the tileset image
        this.load.image('tiles', 'Assets/tilemaps/map.png');
    }

    create()
    {

        this.counter = 0;

        // is grounded
        this.isPlayerOnGround = false;

        // load the tilemap stuff
        const map = this.make.tilemap({ key: 'map' });

        // add the tileset image to the map
        const tileset = map.addTilesetImage('spritesheet', 'tiles');

        // create the layers
       const layer = map.createLayer('Tile Layer 1', tileset, 0, +200);


        //this.physics.add.collider(this.player, layer); // THIS BREAKS CODE DO NOT RUN
        layer.setCollisionBetween(0, 100);

        // create the score text and set it to follow the camera
        this.scoreText = this.add.text(this.sys.game.config.width / 3, this.sys.game.config.height / 2.8, 'Score: 0', { fontSize: '200px', fill: '#000' });
        this.scoreText.setScrollFactor(0);     
        this.scoreText.setDepth(1);
        this.scoreText.setScale(0.1);


            // create the player
            this.player = this.physics.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 1.5, 'start player');
            this.player.setGravityY(400)
            this.player.setScale(0.2)

            this.physics.add.collider(this.player, layer, () => {
                this.isPlayerOnGround = true;
            }, null , this);

            // camera follow player
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setZoom(2.5);

            // make the camera move on x axis when the player moves on x axis
            this.cameras.main.setLerp(0.1, 0.1);

            // create the coin
            this.coin = this.physics.add.image(this.sys.game.config.width / 2 + 200, this.sys.game.config.height / 1.5, 'coin');
            this.coin.setGravityY(400);

            this.coin.setBounce(0.6);
            this.coin.setInteractive();
            this.coin.setScale(0.5);
            this.physics.add.collider(this.coin, layer)

            this.score = 0;

        }

    update () {

        this.counter++;

        // destroy coin, increase score, and update score text
        if (this.physics.overlap(this.player, this.coin)) {
            this.coin.destroy();
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        }

        // move the player left and right
        if (this.input.keyboard.addKey('A').isDown) {
            this.player.x -= 5;
            // swap the player image
            if (this.counter % 25 === 0) {
            this.player.setTexture('second player');
        }
        }
        if (this.input.keyboard.addKey('D').isDown) {
            this.player.x += 5;
            // swap the player image continuously when moving
            if (this.counter % 25 === 0) {
                this.player.setTexture('start player');
            }
        }
        if (this.input.keyboard.addKey('Space').isDown && this.isPlayerOnGround) {
            // jump
            this.jump();
            this.isPlayerOnGround = false;
        }
    
    }
    jump() {
        this.player.setVelocityY(-400);
}
}
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 36,
    backgroundColor: '#3498db',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Menu, World],
};


const game = new Phaser.Game(config);