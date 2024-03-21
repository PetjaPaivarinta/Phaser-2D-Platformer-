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
    }

    create()
    {
            // create the player
            this.player = this.physics.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 1.5, 'start player');
            this.player.setGravityY(300);
            this.player.setCollideWorldBounds(true);
        }

    update () {
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
        this.player.setVelocityY(-300);
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
    scene: World,
};


const game = new Phaser.Game(config);