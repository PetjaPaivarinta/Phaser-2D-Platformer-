class World extends Phaser.Scene
{
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;    
    }
    
    preload()
    {
        this.load.image('start player', 'Assets/Images/1st Player img.png');
        this.load.image('second player', 'Assets/Images/2nd Player img.png');
        this.load.image('coin', 'Assets/Images/coin.png');


        // load tilemap
        this.load.tilemapTiledJSON('map', 'Assets/tilemaps/exported tiles.json');

        // load the tileset image
        this.load.image('tiles', 'Assets/tilemaps/map.png');
    }

    create()
    {
        // load the tilemap
        const map = this.make.tilemap({ key: 'map' });

        // add the tileset image to the map
        const tileset = map.addTilesetImage('new tileset grass', 'tiles');

        // create the layers
       const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);

        layer.setCollisionByProperty({ collides: true });

        // create the score text
            this.scoreText = this.add.text(this.cameras.main.scrollX + 10, this.cameras.main.scrollY + 10, 'Score: 0', { fontFamily: 'Comic Sans', fontSize: '100px', color: '#FF0000'});
            this.scoreText.setScrollFactor(0);
            // create the player
            this.player = this.physics.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 1.5, 'start player');
            this.player.setGravityY(400);
            this.player.setCollideWorldBounds(true);
            this.player.setScale(0.2)

            this.physics.add.collider(this.player, layer);

            // camera follow player
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setZoom(2.5);

            // make the camera move on x axis when the player moves on x axis
            this.cameras.main.setLerp(0.1, 0.1);

            // create the coin
            this.coin = this.physics.add.image(300, 500, 'coin');
            this.coin.setGravityY(400);
            this.coin.setCollideWorldBounds(true);
            this.coin.setBounce(0.2);
            this.coin.setInteractive();
            this.coin.setScale(2.5);

            this.score = 0;

        }

    update () {
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
            this.player.setTexture('second player');
        }
        if (this.input.keyboard.addKey('D').isDown) {
            this.player.x += 5;
            // swap the player image continuously when moving
            this.player.setTexture('start player');
        }
        if (this.input.keyboard.addKey('Space').isDown) {
            // jump
            this.jump();
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
    // green background
    backgroundColor: 0x00FF00,
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
    scene: World,
};


const game = new Phaser.Game(config);