class FinishScreen extends Phaser.Scene {
  constructor() {
    super({ key: "FinishScreen" });
  }
  preload() {}

  create() {

    this.PBScore = 0;
    // add title text

    if (IS_TOUCH) {
      this.cameras.main.setZoom(0.6);
    }
    this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2 - 300,
        "YOU WON",
        {
          fontFamily: "Impact",
          fontSize: "120px",
          color: "#FFFF00",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(1);
    // make a black box bigger than the screen
    this.add
      .rectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        this.sys.game.config.width,
        this.sys.game.config.height,
        0
      )
      .setOrigin(0.5)
      .setDepth(0)
    .setScale(100, 20)
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
        "Try Again",
        {
          fontFamily: "Impact",
          fontSize: "80px",
          color: "#ffffff",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(2);
    
     this.PBText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2 - 100,
        "",
        {
          fontFamily: "Impact",
          fontSize: "80px",
          color: "#FFFF00",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(2);
      this.PBText.setText("Personal Best: " + this.PBScore)
    if (scoreManager.score == 0) {
      this.scoreText.setText("Git Gud");
    }

    this.scoreText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2 + 200,
        "",
        {
          fontFamily: "Impact",
          fontSize: "80px",
          color: "#FFFF00",
          fontWeight: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(2);
   if (scoreManager.getScore() > this.PBScore) {
  this.PBText.setText("New Personal Best: " + scoreManager.getScore())
} else {
  this.scoreText.setText("Total Score: " + scoreManager.getScore())
};
    if (scoreManager.score == 0) {
      this.scoreText.setText("You ass kid LVL try FINALf");
    }


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
        this.scene.start("GameScene");
        scoreManager.score = 0;
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
      this.scene.start("GameScene");
      scoreManager.score = 0;
    }
  }
}
