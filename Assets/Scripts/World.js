class World extends Phaser.Scene
{
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload()
    {
        
    }

    create()
    {

    }

}
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 36,
    scene: World,
};


const game = new Phaser.Game(config);