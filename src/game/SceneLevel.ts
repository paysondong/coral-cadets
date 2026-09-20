import { constant } from "./Constant";
import { Level } from "./Level";
import { Level1 } from "./Level1";
import { Level2 } from "./Level2";
import { Level3 } from "./Level3";
import { Level4 } from "./Level4";
import { Level5 } from "./Level5";
import { Level6 } from "./Level6";
import { Level7 } from "./Level7";
import { Level8 } from "./Level8";
import { Level9 } from "./Level9";

const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const topics = [
  ["Every year, about 8 million", "tons of plastic waste enters", "our oceans causing great ", "harm to marine life."],
  ["Coral reefs are important", "habitats for marine life, ", "but many are now threatened", "by ocean acidification and ", "global warming"],
  ["Overfishing can disrupt the", "balance of marine ecosystems", "severely affecting the quantity", "and diversity of marine species"],
  ["The ocean absorbs carbon dioxide", "from the atmosphere, leading to ", "ocean acidification, which", "threatens the survival of many", "marine creatures, particularly", "corals and shellfish"],
  ["Establishing marine protected", "areas is an important means of ", "protecting marine life and ", "ecosystems, providing a habitat ", "free from human interference"],
  ["Marine litter not only affects", "the ocean landscape but can", "also be mistakenly ingested", "by marine life, causing injury", "and even death"],
  ["Greenhouse gases produced by", "the burning of fossil fuels", "are the main cause of ", "rising ocean temperatures and ", "acidification"],
  ["Ocean noise pollution can", "interfere with the navigation,", "food-seeking, breeding, and ", "other activities of marine life"],
  ["Many marine creatures, such as", "dolphins, turtles, and whales, ", "are endangered due to human", "activities and need our protection"],
  ["We can protect marine life by", "choosing sustainable ocean", "activities, such as observing rather", "than touching marine life, not ", "leaving garbage on the beach,", "and choosing sustainable marine", "products"],
  ["Corals are an important part of", "marine ecosystems, providing", "habitats, and helping protect", "coastlines from erosion"],
  ["Marine debris, especially plastic", "waste, poses a serious threat", "to marine life, as they can ", "mistakenly ingest these materials"],
];

export class SceneLevel extends Phaser.Scene {
  private fishes: Array<Phaser.GameObjects.Sprite> = [];
  public level: Level | null;
  private levelCount: number;
  private shouldPlay: boolean;
  private score: number = 0;
  private pointText?: Phaser.GameObjects.Text;
  public movesText?: Phaser.GameObjects.Text;
  private pointProgress?: Phaser.GameObjects.Image;
  private pointProgressFrame?: Phaser.GameObjects.Image;
  private levelTexture: string;
  private stars: Phaser.GameObjects.Image[] = [];
  private starPositions: number[] = [100, 500, 1000];
  private musicImage?: Phaser.GameObjects.Image;
  private disableMusicImage?: Phaser.GameObjects.Image;
  private soundImage?: Phaser.GameObjects.Image;
  private disableSoundImage?: Phaser.GameObjects.Image;
  private screenWidth: number;
  private screenHeight: number;
  private backgroundMusic?: Phaser.Sound.BaseSound;
  public dropSound?: Phaser.Sound.BaseSound;
  public swapSound?: Phaser.Sound.BaseSound;
  public elinimateSound?: Phaser.Sound.BaseSound;
  public loaded: boolean = false;
  public showWin: boolean = false;

  public addScore(score: number) {
    this.score += score;
    this.pointText?.setText(`${this.score}`);
    this.pointProgress?.setCrop(0, 0, (Math.min(this.score, constant.MAX_POINT_PROGRESS) / constant.MAX_POINT_PROGRESS) * this.pointProgress!.width, this.pointProgress.height);
    // this.pointProgress?.setScale((constant.SCALE * (Math.min(this.score, constant.MAX_POINT_PROGRESS) / constant.MAX_POINT_PROGRESS)) / 773 * 905, (constant.SCALE * 905) / 773);
    let i = 0;
    while (i !== this.stars.length) {
      if (this.starPositions[i] < this.score) {
        this.stars[i].setAlpha(1);
      } 
      i += 1;
    }
  }

  public playSound(sound: Phaser.Sound.BaseSound) {
    if (this.disableSoundImage?.visible) {
      return;
    }

    sound.play();
  }

  private getLevel = (level: number) => {
    switch(level) {
      case 1:
        return new Level1(this, this.callback);
      case 2:
        return new Level2(this, this.callback);
      case 3:
        return new Level3(this, this.callback);
      case 4:
        return new Level4(this, this.callback);
      case 5:
        return new Level5(this, this.callback);
      case 6:
        return new Level6(this, this.callback);
      case 7:
        return new Level7(this, this.callback);
      case 8:
        return new Level8(this, this.callback);
      case 9:
        return new Level9(this, this.callback);
    }
    return null;
  }

  private callback = () => {
    if (this.showWin) {
      return;
    }
    const moves = parseInt(this.movesText!!.text) - 1;
    if (moves === 0 && this.level?.isClear()) {
      let oldScoreValue = localStorage.getItem("ecoScore");
      let oldScore = 0;
      if (oldScoreValue) {
        oldScore = parseInt(oldScoreValue);
      }

      let unlockCount = localStorage.getItem("unlock_count");
      if (!unlockCount) {
        unlockCount = "0";
      }
      const count = parseInt(unlockCount, 10);
      localStorage.setItem("ecoScore", oldScore + this.score + "");
      localStorage.setItem("unlock_count", `${count + 1}`);
      if (this.levelCount === 9) {
        this.level = this.getLevel(this.levelCount);
        this.score = 0;
        this.shouldPlay = true;
        this.backgroundMusic?.stop();
        this.scene.start(`SceneLevel${this.levelCount}`, {});
      }
      this.win();
    } else if (moves === 0) {
      this.failed();
    } else {
      this.movesText!!.setText(moves.toString());
    }
  };

  constructor(levelCount: number, levelTexture: string, shouldPlay: boolean = true) {
    super();
    this.levelCount = levelCount;
    this.levelTexture = levelTexture;
    this.screenWidth = isMobile ? window.screen.width : window.innerHeight / 2,
    this.screenHeight = isMobile ? window.screen.height : window.innerHeight,
    this.shouldPlay = shouldPlay;
    Phaser.Scene.call(this, { key: `SceneLevel${this.levelCount}` });
    this.level = this.getLevel(levelCount);
  }

  preload() {
    this.load.image(constant.TEXTURE_KEY_BACKGROUND, "images/background.png");
    this.load.image(constant.TEXTURE_KEY_BACK_ARROW, "images/back-arrow.png");
    this.load.image(constant.TEXTURE_KEY_MUSIC, "images/music.png");
    this.load.image(constant.TEXTURE_KEY_MICROPHONE, "images/microphone.png");
    this.load.image(
      constant.TEXTURE_KEY_DISABLE_AUDIO,
      "images/disable-audio.png"
    );
    this.load.image(constant.TEXTURE_KEY_MOVES_FRAME, "images/moves-frame.png");
    this.load.image(constant.TEXTURE_KEY_POINT_FRAME, "images/point-frame.png");
    this.load.image(
      constant.TEXTURE_KEY_POINT_PROGRESS_FRAME,
      "images/point-progress-frame.png"
    );
    this.load.image(
      constant.TEXTURE_KEY_POINT_PROGRESS,
      "images/point-progress.png"
    );
    this.load.image(constant.TEXTURE_KEY_STAR, "images/star.png");
    this.load.image(this.levelTexture, `images/level-${this.levelCount}.png`);
    this.load.image(
      constant.TEXTURE_KEY_GAME_AREA_CELL,
      "images/game-area-cell.png"
    );

    this.load.spritesheet(
      constant.TEXTURE_KEY_NPC_STATIC,
      "images/sprite-sheet/npc-static.png",
      {
        frameWidth: 89,
        frameHeight: 89,
      }
    );
    this.load.spritesheet(
      constant.TEXTURE_KEY_HINT_BUBBLE,
      "images/sprite-sheet/hint-bubble.png",
      {
        frameWidth: 96,
        frameHeight: 60,
      }
    );
    this.load.spritesheet(
      constant.TEXTURE_KEY_PINK_FISH,
      "images/sprite-sheet/pink-fish.png",
      {
        frameWidth: 159,
        frameHeight: 137,
      }
    );
    this.load.spritesheet(
      constant.TEXTURE_KEY_FISH_4,
      "images/sprite-sheet/fish-4.png",
      {
        frameWidth: 246,
        frameHeight: 144,
      }
    );
    this.load.spritesheet(
      constant.TEXTURE_KEY_JELLYFISH,
      "images/sprite-sheet/jellyfish.png",
      {
        frameWidth: 190,
        frameHeight: 357,
      }
    );
    this.load.spritesheet(
      constant.TEXTURE_KEY_DISAPPEAR,
      "images/sprite-sheet/disappear.png",
      {
        frameWidth: 119,
        frameHeight: 103,
      }
    );

    this.load.image(constant.TEXTURE_KEY_ITEM_1, "images/items/1.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_2, "images/items/2.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_3, "images/items/3.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_4, "images/items/4.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_5, "images/items/5.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_6, "images/items/6.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_7, "images/items/7.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_8, "images/items/8.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_9, "images/items/9.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_10, "images/items/10.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_11, "images/items/11.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_12, "images/items/12.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_13, "images/items/13.png");
    this.load.image(constant.TEXTURE_KEY_ITEM_14, "images/items/14.png");
    this.load.image(constant.TEXTURE_KEY_FAILED, "images/failed.png");
    this.load.image(constant.TEXTURE_KEY_VICTORY, "images/victory.png");
    this.load.image(constant.TEXTURE_KEY_RETRY, "images/retry.png");
    this.load.image(constant.TEXTURE_KEY_NEXT, "images/next.png");
    this.load.audio(constant.BACKGROUND_MUSIC, "audio/background.mp3");
    this.load.audio(constant.DROP_SOUND, "audio/drop.mp3");
    this.load.audio(constant.SWAP_SOUND, "audio/swap.mp3");
    this.load.audio(constant.ELIMINATE_SOUND, "audio/eliminate.mp3")
    console.log("Loaded");
  }

  create() {
    this.background();

    this.fish();

    this.initSound();

    if (this.shouldPlay) {
      this.play();
    }

    this.loaded = true;
  }

  win() {
    this.showWin = true;
    const win = this.add.image(
      this.screenWidth / 2,
      this.screenHeight / 2 - 100,
      constant.TEXTURE_KEY_VICTORY,
    );
    win.setScale(0.3);
    const count = parseInt(localStorage.getItem("unlock_count")!, 10);
    let idx = count;
    if (count >= 12) {
      idx = Math.floor(Math.random() * 12);
    }
    const text = this.add.text(
      win.x,
      win.y + 20,
      topics[idx]
    )
    text.setFontSize(18);
    text.setColor("black");
    text.setFontFamily("calibri");
    text.setAlign("center");
    text.displayOriginX = text.width / 2;
    const next = this.add.image(
      win.x,
      win.y + 200,
      constant.TEXTURE_KEY_NEXT,
    )
    next.setScale(0.25);
    next.setInteractive();
    next.on("pointerdown", () => {
      this.backgroundMusic?.stop();
      this.scene.start(`SceneLevel${this.levelCount + 1}`, {});
    });
  }

  failed() {
    this.showWin = true;
    const failed = this.add.image(
      this.screenWidth / 2,
      this.screenHeight / 2 - 100,
      constant.TEXTURE_KEY_FAILED,
    );
    const retry = this.add.image(
      failed.x,
      failed.y + 60,
      constant.TEXTURE_KEY_RETRY,
    );
    let scale;
    if (
      this.screenWidth / this.screenHeight <
      failed.width / failed.height
    ) {
      scale = this.screenHeight / failed.height;
    } else {
      scale = this.screenWidth / failed.width;
    }
    failed.setScale(0.25);
    retry.setScale(0.25);
    retry.setInteractive();
    retry.on("pointerdown",() => {
      this.level = this.getLevel(this.levelCount);
      this.score = 0;
      this.shouldPlay = true;
      this.backgroundMusic?.stop();
      this.scene.start(`SceneLevel${this.levelCount}`, {});
    });
  }

  initSound() {
    this.dropSound = this.sound.add(constant.DROP_SOUND);
    this.swapSound = this.sound.add(constant.SWAP_SOUND);
    this.elinimateSound = this.sound.add(constant.ELIMINATE_SOUND);
    this.backgroundMusic = this.sound.add(constant.BACKGROUND_MUSIC);
    (this.backgroundMusic as Phaser.Sound.WebAudioSound).setLoop(true);
  }

  private background() {
    const background = this.add.image(
      this.screenWidth / 2,
      this.screenHeight / 2,
      constant.TEXTURE_KEY_BACKGROUND
    );

    let scale;
    if (
      this.screenWidth / this.screenHeight <
      background.width / background.height
    ) {
      scale = this.screenHeight / background.height;
    } else {
      scale = this.screenWidth / background.width;
    }
    background.setScale(scale, scale);
  }

  private fish() {
    {
      const fish = this.createFish(constant.TEXTURE_KEY_PINK_FISH)!;
      const randomX = Math.floor(Math.random() * this.screenWidth);
      const randomY = Math.floor(Math.random() * this.screenHeight);
      fish.setX(randomX);
      fish.setY(randomY);
      console.log(isMobile)
      this.fishes.push(fish);
    }
    {
      const fish = this.createFish(constant.TEXTURE_KEY_FISH_4)!;
      const randomX = Math.floor(Math.random() * this.screenWidth);
      const randomY = Math.floor(Math.random() * this.screenHeight);
      fish.setX(randomX);
      fish.setY(randomY);
      this.fishes.push(fish);
    }
    {
      const fish = this.createFish(constant.TEXTURE_KEY_JELLYFISH)!;
      const randomX = Math.floor(Math.random() * this.screenWidth);
      const randomY = Math.floor(Math.random() * this.screenHeight);
      fish.setX(randomX);
      fish.setY(randomY);
      this.fishes.push(fish);
    }

    this.time.addEvent({
      delay: 67,
      loop: true,
      callback: () => {
        for (let index = 0; index < this.fishes.length; index++) {
          const fish = this.fishes[index];
          if (fish.x > fish.displayWidth / 2 + this.screenWidth) {
            fish.setFlipX(true);
          } else if (fish.x < -fish.displayWidth / 2) fish.setFlipX(false);

          if (fish.flipX) {
            fish.setX(fish.x - 1.2);
          } else {
            fish.setX(fish.x + 1.2);
          }

          {
            const randomChoice = Math.random() < 0.5 ? -1 : 1;
            fish.setY(fish.y + randomChoice * 1);
          }
        }
      },
    });
  }

  private createFish(fishString: string) {
    if (fishString === constant.TEXTURE_KEY_PINK_FISH) {
      this.anims.create({
        key: constant.ANIMATION_KEY_PINK_FISH,
        frames: this.anims.generateFrameNumbers(
          constant.TEXTURE_KEY_PINK_FISH,
          {
            start: 0,
            end: 3,
          }
        ),
        frameRate: 4,
        repeat: -1,
      });

      const pinkFish = this.add.sprite(0, 0, constant.TEXTURE_KEY_PINK_FISH);
      pinkFish.anims.play(constant.ANIMATION_KEY_PINK_FISH);
      pinkFish.setScale(constant.SCALE);

      return pinkFish;
    } else if (fishString === constant.TEXTURE_KEY_FISH_4) {
      this.anims.create({
        key: constant.ANIMATION_KEY_FISH_4,
        frames: this.anims.generateFrameNumbers(constant.TEXTURE_KEY_FISH_4, {
          start: 0,
          end: 4,
        }),
        frameRate: 5,
        repeat: -1,
      });

      const fish4 = this.add.sprite(0, 0, constant.TEXTURE_KEY_FISH_4);
      fish4.anims.play(constant.ANIMATION_KEY_FISH_4);
      fish4.setScale(constant.SCALE);

      return fish4;
    } else if (fishString === constant.TEXTURE_KEY_JELLYFISH) {
      this.anims.create({
        key: constant.ANIMATION_KEY_JELLYFISH,
        frames: this.anims.generateFrameNumbers(
          constant.TEXTURE_KEY_JELLYFISH,
          {
            start: 0,
            end: 19,
          }
        ),
        frameRate: 20,
        repeat: -1,
      });

      const jellyfish = this.add.sprite(0, 0, constant.TEXTURE_KEY_JELLYFISH);
      jellyfish.anims.play(constant.ANIMATION_KEY_JELLYFISH);
      jellyfish.setScale(constant.SCALE);

      return jellyfish;
    }
  }

  public play() {
    this.backArrow();

    this.music();
    this.microphone();

    this.moves();

    this.hint();

    this.point();

    this.level!.gameArea();

    this.backgroundMusic?.play();
  }

  private backArrow() {
    const backArrow = this.add.image(0, 0, constant.TEXTURE_KEY_BACK_ARROW);
    backArrow.setScale((constant.SCALE * 40) / 35);
    backArrow.setX(68 * constant.SCALE + backArrow.displayWidth / 2);
    backArrow.setY(50 * constant.SCALE + backArrow.displayHeight / 2);
    backArrow.setInteractive();
    backArrow.on(
      "pointerdown",
      (image: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) => {
        window.location.reload();
      },
    )
  }

  private music() {
    this.musicImage = this.add.image(0, 0, constant.TEXTURE_KEY_MUSIC);
    this.musicImage.setScale((constant.SCALE * 70) / 60);
    this.musicImage.setX(964 * constant.SCALE + this.musicImage.displayWidth / 2);
    this.musicImage.setY(41 * constant.SCALE + this.musicImage.displayHeight / 2);
    this.musicImage.setInteractive();
    const parent = this;
    this.musicImage.on(
      "pointerdown",
      (image: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) => {
        parent.disableMusicImage?.setVisible(!parent.disableMusicImage.visible);
        if (!parent.disableMusicImage?.visible) {
          this.backgroundMusic?.play();
        } else {
          this.backgroundMusic?.stop();
        }
      },
    );

    this.disableMusicImage = this.add.image(
      0,
      0,
      constant.TEXTURE_KEY_DISABLE_AUDIO
    );
    this.disableMusicImage.setScale((constant.SCALE * 49) / 42);
    this.disableMusicImage.setX(999 * constant.SCALE + this.disableMusicImage.displayWidth / 2);
    this.disableMusicImage.setY(64 * constant.SCALE + this.disableMusicImage.displayHeight / 2);
    this.disableMusicImage.setVisible(false);
  }

  private microphone() {
    this.soundImage = this.add.image(0, 0, constant.TEXTURE_KEY_MICROPHONE);
    this.soundImage.setScale((constant.SCALE * 63) / 54);
    this.soundImage.setX(1067 * constant.SCALE + this.soundImage.displayWidth / 2);
    this.soundImage.setY(36 * constant.SCALE + this.soundImage.displayHeight / 2);

    this.soundImage.setInteractive();
    const parent = this;
    this.soundImage.on(
      "pointerdown",
      (image: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) => {
        parent.disableSoundImage?.setVisible(!parent.disableSoundImage.visible);
      },
    );

    this.disableSoundImage = this.add.image(
      0,
      0,
      constant.TEXTURE_KEY_DISABLE_AUDIO
    );
    this.disableSoundImage.setScale((constant.SCALE * 49) / 42);
    this.disableSoundImage.setX(1095 * constant.SCALE + this.disableSoundImage.displayWidth / 2);
    this.disableSoundImage.setY(64 * constant.SCALE + this.disableSoundImage.displayHeight / 2);
    this.disableSoundImage.setVisible(false);
  }

  private moves() {
    const movesFrame = this.add.image(0, 0, constant.TEXTURE_KEY_MOVES_FRAME);
    movesFrame.setScale((constant.SCALE * 249) / 212);
    movesFrame.setX(19 * constant.SCALE + movesFrame.displayWidth / 2);
    movesFrame.setY(248 * constant.SCALE + movesFrame.displayHeight / 2);

    let movesTitle = this.add.text(0, 0, "Moves", {
      fontFamily: "calibri",
      fontSize: `${58 * constant.SCALE}px`,
      fontStyle: "bold",
      color: "#ffffff",
    });
    movesTitle.setX(61 * constant.SCALE);
    movesTitle.setY(295 * constant.SCALE);

    this.movesText = this.add.text(0, 0, `${constant.MAX_MOVE}`, {
      fontFamily: "calibri",
      fontSize: `${100 * constant.SCALE}px`,
      fontStyle: "bold",
      color: "#ffffff",
      align: "center",
      fixedWidth: 164 * constant.SCALE,
    });
    this.movesText.setX(61 * constant.SCALE);
    this.movesText.setY(356 * constant.SCALE);
  }

  private hint() {
    this.anims.create({
      key: constant.ANIMATION_KEY_NPC_STATIC,
      frames: this.anims.generateFrameNumbers(constant.TEXTURE_KEY_NPC_STATIC, {
        start: 0,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });

    const npcStatic = this.add.sprite(0, 0, constant.TEXTURE_KEY_NPC_STATIC);
    npcStatic.setScale((constant.SCALE * 206) / 89);
    npcStatic.setX((905 + 103) * constant.SCALE);
    npcStatic.setY(180 * constant.SCALE + npcStatic.displayHeight / 2);

    npcStatic.anims.play(constant.ANIMATION_KEY_NPC_STATIC);

    this.anims.create({
      key: constant.ANIMATION_KEY_HINT_BUBBLE,
      frames: this.anims.generateFrameNumbers(
        constant.TEXTURE_KEY_HINT_BUBBLE,
        {
          start: 7,
          end: 7,
        }
      ),
      frameRate: 8,
      repeat: -1,
    });

    const hintBubble = this.add.sprite(0, 0, constant.TEXTURE_KEY_HINT_BUBBLE);
    hintBubble.setScale((constant.SCALE * 415) / 96);
    hintBubble.setX(480 * constant.SCALE + hintBubble.displayWidth / 2);
    hintBubble.setY(25 * constant.SCALE + hintBubble.displayHeight / 2);

    hintBubble.anims.play(constant.ANIMATION_KEY_HINT_BUBBLE);
  }

  private point() {
    const pointFrame = this.add.image(0, 0, constant.TEXTURE_KEY_POINT_FRAME);
    pointFrame.setScale((constant.SCALE * 396) / 338);
    pointFrame.setX(387 * constant.SCALE + pointFrame.displayWidth / 2);
    pointFrame.setY(255 * constant.SCALE + pointFrame.displayHeight / 2);

    this.pointText = this.add.text(0, 0, `${this.score}`, {
      fontFamily: "calibri",
      fontSize: `${74 * constant.SCALE}px`,
      fontStyle: "bold",
      color: "#ffff00",
      align: "center",
      fixedWidth: 396 * constant.SCALE,
    });
    this.pointText.setX(387 * constant.SCALE);
    this.pointText.setY(255 * constant.SCALE + ((148 - 74) / 2) * constant.SCALE);

    this.pointProgressFrame = this.add.image(
      0,
      0,
      constant.TEXTURE_KEY_POINT_PROGRESS_FRAME
    );
    const pointProgressFrame = this.pointProgressFrame;
    pointProgressFrame.setScale((constant.SCALE * 938) / 800);
    pointProgressFrame.setX(
      209 * constant.SCALE + pointProgressFrame.displayWidth / 2
    );
    pointProgressFrame.setY(
      391 * constant.SCALE + pointProgressFrame.displayHeight / 2
    );

    this.pointProgress = this.add.image(
      0,
      0,
      constant.TEXTURE_KEY_POINT_PROGRESS
    );
    this.pointProgress.setScale((constant.SCALE * constant.MAX_POINT_PROGRESS / constant.MAX_POINT_PROGRESS) / 773 * 905, (constant.SCALE * 905) / 773);
    this.pointProgress.displayOriginX = 0
    this.pointProgress.setX(pointProgressFrame.x - pointProgressFrame.displayWidth / 2 + 5.5);
    this.pointProgress.setY(pointProgressFrame.y - 0.5);
    this.pointProgress.setCrop(0,0,0,0);

    // const cropRect = new Phaser.Geom.Rectangle(
    //   0,
    //   0,
    //   pointProgress.width - 200,
    //   pointProgress.height
    // );
    // pointProgress.setCrop(cropRect);

    // Three stars at 100, 500, 1000 position
    this.starPositions.forEach(position => {
      this.stars.push(this.getStar(position));
    })
  }

  private getStar(positiion: number): Phaser.GameObjects.Image {
    const star = this.add.image(0, 0, constant.TEXTURE_KEY_STAR);
    star.setScale((constant.SCALE * 117) / 101);
    star.displayOriginX = 0;
    star.setX(this.pointProgressFrame!.x - this.pointProgressFrame!.displayWidth / 2 + 8 + (positiion * this.pointProgressFrame!.displayWidth / constant.MAX_POINT_PROGRESS) - star.displayWidth / 2);
    star.setY(379 * constant.SCALE + star.displayHeight / 2);
    star.setAlpha(0.5);
    return star;
  }
}
