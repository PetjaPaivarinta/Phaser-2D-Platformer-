import { Scene } from "phaser";

class PreloadScene extends Scene
{

    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload()
    {
        this.load.image('logo', 'Assets/Images/marko.jpg')
    }

    create()
    {
        this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'logo')
    }
}
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 36,
    backgroundColor: 0x0000ff,
    scene: PreloadScene
};

export default PreloadScene