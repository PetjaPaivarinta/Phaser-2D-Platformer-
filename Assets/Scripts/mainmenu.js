class MainMenu extends Phaser.Scene {
  preload() {}

  create() {
    // add title text
    this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2 - 300,
        "Main Menu",
        {
          fontFamily: "Comic Sans",
          fontSize: "120px",
          color: "#ffffff",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(1);
    // make a black box bigger than the screen
    this.add
      .rectangle(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        this.sys.game.config.width,
        this.sys.game.config.height,
        0
      )
      .setOrigin(0.5)
      .setDepth(0);
    // add box around text
    this.box = this.add
      .rectangle(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        300,
        100,
        "595959"
      )
      .setOrigin(0.5);
    // set depth of text to be above
    let text = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "Start",
        {
          fontFamily: "Comic Sans",
          fontSize: "100px",
          color: "#ffffff",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(1);
  }

  update() {
    // if you click inside the box variable then it will change the hex color of the box
    if (
      this.input.activePointer.x > this.sys.game.config.width / 2 - 150 &&
      this.input.activePointer.x < this.sys.game.config.width / 2 + 150 &&
      this.input.activePointer.y > this.sys.game.config.height / 2 - 50 &&
      this.input.activePointer.y < this.sys.game.config.height / 2 + 50
    ) {
      this.box.setFillStyle(808080);
      if (
        this.input.keyboard.checkDown(
          this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
          500
        )
      ) {
        this.scene.start("iceWorld");
      }
    } else {
      this.box.setFillStyle("595959");
    }
    // if you click inside the box variable then it will change the scene
    if (
      this.input.activePointer.leftButtonDown() &&
      this.input.activePointer.x > this.sys.game.config.width / 2 - 150 &&
      this.input.activePointer.x < this.sys.game.config.width / 2 + 150 &&
      this.input.activePointer.y > this.sys.game.config.height / 2 - 50 &&
      this.input.activePointer.y < this.sys.game.config.height / 2 + 50
    ) {
      this.scene.start("GDWorld");
    }
  }
}
