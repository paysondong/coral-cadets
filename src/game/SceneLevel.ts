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
import { CONTEXT, MatchSummary } from "./LevelUtils";
import { getGameViewport } from "./Layout";
import { getSavedTheme, REEF_THEMES, ReefTheme, ReefThemeId, THEME_EVENT } from "./theme/Theme";

const reefVerses = [
  "A new rhythm appears in the reef.",
  "Small patterns become living landscapes.",
  "The current remembers every beautiful chain.",
  "Order, chance, and colour bloom together.",
  "The reef grows where patterns meet.",
  "A quiet symmetry moves through the water.",
  "Life returns one brilliant move at a time.",
  "Every chain leaves a trace of light.",
  "The reef is never finished — only becoming.",
];

export class SceneLevel extends Phaser.Scene {
  private fishes: Array<Phaser.GameObjects.Sprite> = [];
  public level: Level | null;
  private levelCount: number;
  private shouldPlay: boolean;
  private score: number = 0;
  private pointText?: Phaser.GameObjects.Text;
  public movesText?: Phaser.GameObjects.Text;
  private levelText?: Phaser.GameObjects.Text;
  private bloomLabel?: Phaser.GameObjects.Text;
  private bloomBarFill?: Phaser.GameObjects.Rectangle;
  private bloomEnergy = 0;
  private reefBloomCount = 0;
  private goalTexts: Phaser.GameObjects.Text[] = [];
  private goalIcons: Phaser.GameObjects.Image[] = [];
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
  public loaded = false;
  public showWin = false;
  private started = false;
  private moveLimit: number;
  private reefTheme: ReefTheme = getSavedTheme();
  private backgroundImage?: Phaser.GameObjects.Image;
  private vignetteGraphics?: Phaser.GameObjects.Graphics;
  private ambientFieldGraphics?: Phaser.GameObjects.Graphics;
  private ambientRayGraphics?: Phaser.GameObjects.Graphics;
  private ambientBubbles: Phaser.GameObjects.Arc[] = [];

  private colorHex(value: number) {
    return `#${value.toString(16).padStart(6, "0")}`;
  }

  private onThemeChange = (event: Event) => {
    const detail = (event as CustomEvent<{ themeId?: ReefThemeId }>).detail;
    if (!detail?.themeId) return;
    this.reefTheme = REEF_THEMES[detail.themeId];
    this.applyThemeToEnvironment();
  };

  private applyThemeToEnvironment() {
    const theme = this.reefTheme.phaser;
    this.cameras.main.setBackgroundColor(theme.gameBackground);
    this.backgroundImage?.setTint(theme.backgroundTint);

    if (this.vignetteGraphics) {
      this.vignetteGraphics.clear();
      this.vignetteGraphics.fillStyle(theme.vignette, 0.17);
      this.vignetteGraphics.fillRect(0, 0, this.screenWidth, this.screenHeight);
    }

    if (this.ambientFieldGraphics) {
      const field = this.ambientFieldGraphics;
      field.clear();
      const centerX = this.screenWidth * 0.77;
      const centerY = 220 * constant.SCALE;
      const goldenAngle = Phaser.Math.DegToRad(137.507764);
      for (let i = 0; i < 34; i++) {
        const radius = Math.sqrt(i + 1) * 13 * constant.SCALE;
        const angle = goldenAngle * i;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        field.fillStyle(i % 5 === 0 ? theme.gold : theme.accent, i % 5 === 0 ? 0.18 : 0.11);
        field.fillCircle(x, y, Math.max(1, (2 + (i % 3)) * constant.SCALE));
      }
    }

    if (this.ambientRayGraphics) {
      const ray = this.ambientRayGraphics;
      ray.clear();
      ray.fillStyle(theme.ray, 0.035);
      ray.fillTriangle(
        this.screenWidth * 0.22,
        0,
        this.screenWidth * 0.42,
        0,
        this.screenWidth * 0.68,
        this.screenHeight * 0.7
      );
    }

    this.ambientBubbles.forEach((bubble) => bubble.setFillStyle(theme.bubble, 0.16));
  }

  public addScore(score: number) {
    this.score += score;
    this.pointText?.setText(this.score.toLocaleString());
    if (this.pointText) {
      this.tweens.add({
        targets: this.pointText,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 80,
        yoyo: true,
      });
    }
  }

  public playSound(sound?: Phaser.Sound.BaseSound) {
    if (!sound || this.disableSoundImage?.visible) return;
    sound.play();
  }

  public setupGoalHud(types: number[], target: number) {
    this.goalIcons.forEach((icon) => icon.destroy());
    this.goalTexts.forEach((text) => text.destroy());
    this.goalIcons = [];
    this.goalTexts = [];

    const y = 382 * constant.SCALE;
    const centers = [440, 730];

    centers.forEach((cx, index) => {
      const panel = this.add.graphics();
      panel.fillStyle(this.reefTheme.phaser.panel, 0.74);
      panel.lineStyle(Math.max(1, 2 * constant.SCALE), this.reefTheme.phaser.accent, 0.26);
      panel.fillRoundedRect(
        (cx - 112) * constant.SCALE,
        318 * constant.SCALE,
        224 * constant.SCALE,
        128 * constant.SCALE,
        34 * constant.SCALE
      );
      panel.strokeRoundedRect(
        (cx - 112) * constant.SCALE,
        318 * constant.SCALE,
        224 * constant.SCALE,
        128 * constant.SCALE,
        34 * constant.SCALE
      );

      const icon = this.add.image(
        (cx - 52) * constant.SCALE,
        y,
        `item-${types[index]}`
      );
      icon.setScale((78 * constant.SCALE) / icon.width);
      this.goalIcons.push(icon);

      const text = this.add.text(
        (cx + 8) * constant.SCALE,
        (y / constant.SCALE - 23) * constant.SCALE,
        `0 / ${target}`,
        {
          fontFamily: "Arial, sans-serif",
          fontSize: `${34 * constant.SCALE}px`,
          fontStyle: "bold",
          color: this.colorHex(this.reefTheme.phaser.accentAlt),
        }
      );
      this.goalTexts.push(text);
    });
  }

  public updateGoalHud(counts: number[], target: number) {
    counts.forEach((count, index) => {
      const text = this.goalTexts[index];
      if (!text) return;
      text.setText(`${count} / ${target}`);
      this.tweens.add({
        targets: text,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 90,
        yoyo: true,
      });
      const icon = this.goalIcons[index];
      if (icon) {
        const baseScale = icon.scaleX;
        this.tweens.add({
          targets: icon,
          scaleX: baseScale * 1.08,
          scaleY: baseScale * 1.08,
          duration: 90,
          yoyo: true,
        });
      }
    });
  }

  public onInvalidMove() {
    this.cameras.main.shake(70, 0.0016);
    this.showFloatingLabel("TRY ANOTHER CURRENT", this.reefTheme.phaser.accentAlt, 0.75);
  }

  public onBoardShift() {
    this.cameras.main.flash(180, 92, 74, 122, false);
    this.showFloatingLabel("CURRENT SHIFT", this.reefTheme.phaser.accent, 0.9);
  }

  public onMatchResolved(
    summary: MatchSummary,
    cascade: number,
    score: number,
    context: CONTEXT
  ) {
    const x = context.startX + summary.center.j * (context.cellWidth + context.dividerWidth);
    const y = context.startY + summary.center.i * (context.cellWidth + context.dividerWidth);

    this.matchRipple(x, y, summary.pattern);

    if (summary.pattern === "pulse") {
      this.showPatternLabel("PULSE", "+" + score, this.reefTheme.phaser.accentAlt);
    } else if (summary.pattern === "golden") {
      this.showPatternLabel("φ BLOOM", "+" + score, this.reefTheme.phaser.gold);
    } else if (summary.pattern === "symmetry") {
      this.showPatternLabel("SYMMETRY WAVE", "+" + score, this.reefTheme.phaser.violet);
    } else if (cascade > 1) {
      this.showPatternLabel(`CHAIN ×${cascade}`, `+${score}`, this.reefTheme.phaser.accent);
    }

    let gain = summary.cleared * 4 + summary.specialCleared * 3 + cascade * 3;
    if (summary.maxLineLength >= 5) gain += 15;
    if (summary.hasCross) gain += 12;
    this.addBloom(gain);
  }

  public onCascadeComplete(cascade: number) {
    if (![3, 5, 8].includes(cascade)) return;
    const bonus = cascade * 90;
    this.addScore(bonus);
    this.addBloom(10 + cascade * 2);
    this.showPatternLabel(
      `FIBONACCI FLOW · ${cascade}`,
      `+${bonus}`,
      this.reefTheme.phaser.gold,
      1.1
    );
  }

  private addBloom(amount: number) {
    this.bloomEnergy = Math.min(100, this.bloomEnergy + amount);
    this.updateBloomBar();
    if (this.bloomEnergy >= 100) {
      this.bloomEnergy = 0;
      this.updateBloomBar();
      this.triggerReefBloom();
    }
  }

  private updateBloomBar() {
    if (!this.bloomBarFill) return;
    const width = 760 * constant.SCALE;
    this.bloomBarFill.setDisplaySize(width * (this.bloomEnergy / 100), 8 * constant.SCALE);
    this.bloomBarFill.setAlpha(this.bloomEnergy > 0 ? 0.95 : 0.35);
    this.bloomLabel?.setText(this.bloomEnergy >= 70 ? "BLOOM READY" : "BLOOM");
  }

  private triggerReefBloom() {
    const bonus = 300;
    this.addScore(bonus);
    this.cameras.main.flash(260, 86, 255, 220, false);
    this.spawnGoldenField();
    this.growCoralSignature();
    this.showPatternLabel("REEF BLOOM", `+${bonus}`, 0xffdc76, 1.25);
  }

  private matchRipple(x: number, y: number, pattern: MatchSummary["pattern"]) {
    const colors: Record<MatchSummary["pattern"], number> = {
      match: this.reefTheme.phaser.accent,
      pulse: this.reefTheme.phaser.accentAlt,
      golden: this.reefTheme.phaser.gold,
      symmetry: this.reefTheme.phaser.violet,
    };
    const color = colors[pattern];

    for (let ring = 0; ring < 2; ring++) {
      const circle = this.add.circle(x, y, 16 * constant.SCALE, color, 0);
      circle.setStrokeStyle(Math.max(1, 3 * constant.SCALE), color, 0.75);
      this.tweens.add({
        targets: circle,
        scale: 3.2 + ring * 1.1,
        alpha: 0,
        duration: 360 + ring * 90,
        ease: "Quad.easeOut",
        onComplete: () => circle.destroy(),
      });
    }

    const count = pattern === "match" ? 7 : 13;
    const goldenAngle = Phaser.Math.DegToRad(137.507764);
    for (let i = 0; i < count; i++) {
      const radius = (20 + i * 6) * constant.SCALE;
      const angle = goldenAngle * i;
      const dot = this.add.circle(x, y, (3 + (i % 3)) * constant.SCALE, color, 0.85);
      this.tweens.add({
        targets: dot,
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        alpha: 0,
        scale: 0.2,
        duration: 360 + i * 12,
        ease: "Cubic.easeOut",
        onComplete: () => dot.destroy(),
      });
    }
  }

  private showPatternLabel(
    title: string,
    detail: string,
    color: number,
    scale = 1
  ) {
    const colorHex = `#${color.toString(16).padStart(6, "0")}`;
    const titleText = this.add.text(
      this.screenWidth / 2,
      530 * constant.SCALE,
      title,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: `${44 * constant.SCALE * scale}px`,
        fontStyle: "bold",
        color: colorHex,
        stroke: "#02131d",
        strokeThickness: Math.max(2, 7 * constant.SCALE),
      }
    );
    titleText.setOrigin(0.5);

    const detailText = this.add.text(
      this.screenWidth / 2,
      584 * constant.SCALE,
      detail,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: `${28 * constant.SCALE}px`,
        fontStyle: "bold",
        color: "#E9FFFF",
        stroke: "#02131d",
        strokeThickness: Math.max(2, 6 * constant.SCALE),
      }
    );
    detailText.setOrigin(0.5);

    [titleText, detailText].forEach((text, index) => {
      text.setAlpha(0);
      text.y += 18 * constant.SCALE;
      this.tweens.add({
        targets: text,
        alpha: 1,
        y: text.y - 18 * constant.SCALE,
        duration: 160,
        yoyo: true,
        hold: 430 + index * 30,
        onComplete: () => text.destroy(),
      });
    });
  }

  private showFloatingLabel(text: string, color: number, alpha = 1) {
    const label = this.add.text(this.screenWidth / 2, 540 * constant.SCALE, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${28 * constant.SCALE}px`,
      fontStyle: "bold",
      color: `#${color.toString(16).padStart(6, "0")}`,
      stroke: "#00131f",
      strokeThickness: Math.max(2, 5 * constant.SCALE),
    });
    label.setOrigin(0.5);
    label.setAlpha(alpha);
    this.tweens.add({
      targets: label,
      y: label.y - 34 * constant.SCALE,
      alpha: 0,
      duration: 520,
      onComplete: () => label.destroy(),
    });
  }

  private growCoralSignature() {
    this.reefBloomCount += 1;
    const graphics = this.add.graphics();
    graphics.setDepth(-8);
    const colors = this.reefTheme.phaser.coralSignature;
    const color = colors[(this.reefBloomCount - 1) % colors.length];
    const baseX = this.reefBloomCount % 2 === 0
      ? this.screenWidth - 92 * constant.SCALE
      : 92 * constant.SCALE;
    const baseY = this.screenHeight - 52 * constant.SCALE;
    const direction = this.reefBloomCount % 2 === 0 ? -1 : 1;

    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      const x2 = x + Math.cos(angle) * length;
      const y2 = y + Math.sin(angle) * length;
      graphics.lineStyle(Math.max(1, (depth + 1) * 1.45 * constant.SCALE), color, 0.5);
      graphics.lineBetween(x, y, x2, y2);
      graphics.fillStyle(color, 0.32);
      graphics.fillCircle(x2, y2, Math.max(1.4, (depth + 1) * 1.7 * constant.SCALE));
      if (depth <= 0) return;
      const next = length * 0.61803398875;
      drawBranch(x2, y2, next, angle - direction * 0.53, depth - 1);
      drawBranch(x2, y2, next * 0.92, angle + direction * 0.69, depth - 1);
    };

    drawBranch(
      baseX,
      baseY,
      118 * constant.SCALE,
      -Math.PI / 2 + direction * 0.12,
      3
    );

    graphics.setAlpha(0);
    this.tweens.add({
      targets: graphics,
      alpha: 0.72,
      duration: 620,
      ease: "Sine.easeOut",
    });
  }

  private spawnGoldenField() {
    const centerX = this.screenWidth / 2;
    const centerY = this.screenHeight * 0.46;
    const goldenAngle = Phaser.Math.DegToRad(137.507764);

    for (let i = 0; i < 34; i++) {
      const radius = Math.sqrt(i + 1) * 34 * constant.SCALE;
      const angle = goldenAngle * i;
      const dot = this.add.circle(
        centerX,
        centerY,
        (2.5 + (i % 4)) * constant.SCALE,
        i % 3 === 0 ? this.reefTheme.phaser.gold : this.reefTheme.phaser.accent,
        0.74
      );
      this.tweens.add({
        targets: dot,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        alpha: 0,
        duration: 720 + i * 10,
        ease: "Cubic.easeOut",
        onComplete: () => dot.destroy(),
      });
    }
  }

  private getLevel = (level: number) => {
    switch (level) {
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
      default:
        return null;
    }
  };

  private callback = () => {
    if (this.showWin) return;

    const moves = Math.max(0, parseInt(this.movesText?.text || "0", 10) - 1);
    this.movesText?.setText(moves.toString());

    if (this.level?.isClear()) {
      this.finishLevel();
      return;
    }

    if (moves <= 0) this.failed();
  };

  private finishLevel() {
    if (this.showWin) return;
    let oldScore = parseInt(localStorage.getItem("ecoScore") || "0", 10);
    let unlockCount = parseInt(localStorage.getItem("unlock_count") || "0", 10);
    localStorage.setItem("ecoScore", `${oldScore + this.score}`);
    localStorage.setItem("unlock_count", `${Math.max(unlockCount, this.levelCount)}`);
    this.win();
  }

  constructor(levelCount: number, levelTexture: string, shouldPlay: boolean = true) {
    super({ key: `SceneLevel${levelCount}` });
    this.levelCount = levelCount;
    this.levelText = undefined;
    const viewport = getGameViewport();
    this.screenWidth = viewport.width;
    this.screenHeight = viewport.height;
    this.shouldPlay = shouldPlay;
    this.moveLimit = constant.MOVE_LIMITS[levelCount - 1] ?? 28;
    this.level = this.getLevel(levelCount);
    void levelTexture;
  }

  preload() {
    this.load.image(constant.TEXTURE_KEY_BACKGROUND, "images/background.png");
    this.load.image(constant.TEXTURE_KEY_BACK_ARROW, "images/back-arrow.png");
    this.load.image(constant.TEXTURE_KEY_MUSIC, "images/music.png");
    this.load.image(constant.TEXTURE_KEY_MICROPHONE, "images/microphone.png");
    this.load.image(constant.TEXTURE_KEY_DISABLE_AUDIO, "images/disable-audio.png");
    this.load.image(constant.TEXTURE_KEY_STAR, "images/star.png");
    this.load.image(`level-${this.levelCount}`, `images/level-${this.levelCount}.png`);
    this.load.image(constant.TEXTURE_KEY_GAME_AREA_CELL, "images/game-area-cell.png");

    this.load.spritesheet(constant.TEXTURE_KEY_PINK_FISH, "images/sprite-sheet/pink-fish.png", {
      frameWidth: 159,
      frameHeight: 137,
    });
    this.load.spritesheet(constant.TEXTURE_KEY_FISH_4, "images/sprite-sheet/fish-4.png", {
      frameWidth: 246,
      frameHeight: 144,
    });
    this.load.spritesheet(constant.TEXTURE_KEY_JELLYFISH, "images/sprite-sheet/jellyfish.png", {
      frameWidth: 190,
      frameHeight: 357,
    });
    this.load.spritesheet(constant.TEXTURE_KEY_DISAPPEAR, "images/sprite-sheet/disappear.png", {
      frameWidth: 119,
      frameHeight: 103,
    });

    for (let i = 1; i <= 14; i++) {
      this.load.image(`item-${i}`, `images/items/${i}.png`);
    }

    this.load.audio(constant.BACKGROUND_MUSIC, "audio/background.mp3");
    this.load.audio(constant.DROP_SOUND, "audio/drop.mp3");
    this.load.audio(constant.SWAP_SOUND, "audio/swap.mp3");
    this.load.audio(constant.ELIMINATE_SOUND, "audio/eliminate.mp3");
  }

  create() {
    this.ambientBubbles = [];
    this.reefTheme = getSavedTheme();
    window.addEventListener(THEME_EVENT, this.onThemeChange);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener(THEME_EVENT, this.onThemeChange);
    });
    this.background();
    this.ambientGeometry();
    this.fish();
    this.initSound();

    if (this.shouldPlay) this.play();
    this.loaded = true;
  }

  public play() {
    if (this.started) return;
    this.started = true;
    this.backArrow();
    this.soundControls();
    this.hud();
    this.level?.gameArea();
    this.backgroundMusic?.play();
  }

  win() {
    this.showWin = true;
    if (
      this.backgroundMusic instanceof Phaser.Sound.WebAudioSound ||
      this.backgroundMusic instanceof Phaser.Sound.HTML5AudioSound
    ) {
      this.backgroundMusic.setVolume(0.55);
    }
    this.showResultCard(true);
  }

  failed() {
    this.showWin = true;
    this.showResultCard(false);
  }

  private showResultCard(success: boolean) {
    const shade = this.add.rectangle(
      this.screenWidth / 2,
      this.screenHeight / 2,
      this.screenWidth,
      this.screenHeight,
      this.reefTheme.phaser.vignette,
      0.62
    );
    shade.setInteractive();

    const cardWidth = Math.min(this.screenWidth * 0.82, 880 * constant.SCALE);
    const cardHeight = 660 * constant.SCALE;
    const cardX = this.screenWidth / 2;
    const cardY = this.screenHeight / 2;

    const card = this.add.graphics();
    card.fillStyle(this.reefTheme.phaser.panel, 0.96);
    card.lineStyle(Math.max(1, 3 * constant.SCALE), success ? this.reefTheme.phaser.success : this.reefTheme.phaser.failure, 0.75);
    card.fillRoundedRect(cardX - cardWidth / 2, cardY - cardHeight / 2, cardWidth, cardHeight, 44 * constant.SCALE);
    card.strokeRoundedRect(cardX - cardWidth / 2, cardY - cardHeight / 2, cardWidth, cardHeight, 44 * constant.SCALE);

    const eyebrow = this.add.text(cardX, cardY - 238 * constant.SCALE, `REEF ${String(this.levelCount).padStart(2, "0")}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${26 * constant.SCALE}px`,
      fontStyle: "bold",
      color: this.colorHex(success ? this.reefTheme.phaser.accent : this.reefTheme.phaser.failure),
    });
    eyebrow.setOrigin(0.5);

    const title = this.add.text(cardX, cardY - 154 * constant.SCALE, success ? "REEF BLOOMED" : "CURRENT BROKE", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${58 * constant.SCALE}px`,
      fontStyle: "bold",
      color: "#FFFFFF",
      align: "center",
    });
    title.setOrigin(0.5);

    const scoreText = this.add.text(cardX, cardY - 52 * constant.SCALE, success ? `${this.score.toLocaleString()} PTS` : "ONE MORE TRY", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${38 * constant.SCALE}px`,
      fontStyle: "bold",
      color: this.colorHex(success ? this.reefTheme.phaser.gold : this.reefTheme.phaser.accentAlt),
    });
    scoreText.setOrigin(0.5);

    const verse = this.add.text(cardX, cardY + 46 * constant.SCALE, success ? reefVerses[(this.levelCount - 1) % reefVerses.length] : "Change the pattern. Find another flow.", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${28 * constant.SCALE}px`,
      color: this.colorHex(this.reefTheme.phaser.muted),
      align: "center",
      wordWrap: { width: cardWidth * 0.75 },
    });
    verse.setOrigin(0.5);

    const button = this.add.rectangle(
      cardX,
      cardY + 210 * constant.SCALE,
      420 * constant.SCALE,
      112 * constant.SCALE,
      success ? this.reefTheme.phaser.accent : this.reefTheme.phaser.accentAlt,
      1
    );
    button.setStrokeStyle(Math.max(1, 2 * constant.SCALE), this.reefTheme.phaser.accentAlt, 0.55);
    button.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(
      cardX,
      cardY + 210 * constant.SCALE,
      success ? (this.levelCount < 9 ? "NEXT REEF" : "SURFACE") : "TRY AGAIN",
      {
        fontFamily: "Arial, sans-serif",
        fontSize: `${31 * constant.SCALE}px`,
        fontStyle: "bold",
        color: "#FFFFFF",
      }
    );
    buttonText.setOrigin(0.5);

    this.tweens.add({
      targets: [card, eyebrow, title, scoreText, verse, button, buttonText],
      alpha: { from: 0, to: 1 },
      duration: 240,
      ease: "Quad.easeOut",
    });

    button.on("pointerover", () => button.setScale(1.03));
    button.on("pointerout", () => button.setScale(1));
    button.on("pointerdown", () => {
      this.backgroundMusic?.stop();
      if (success) {
        if (this.levelCount < 9) {
          this.scene.start(`SceneLevel${this.levelCount + 1}`);
        } else {
          window.location.reload();
        }
      } else {
        this.resetAndRestart();
      }
    });
  }

  private resetAndRestart() {
    this.score = 0;
    this.bloomEnergy = 0;
    this.reefBloomCount = 0;
    this.showWin = false;
    this.started = false;
    this.shouldPlay = true;
    this.goalIcons = [];
    this.goalTexts = [];
    this.level = this.getLevel(this.levelCount);
    this.scene.restart();
  }

  initSound() {
    this.dropSound = this.sound.add(constant.DROP_SOUND, { volume: 0.55 });
    this.swapSound = this.sound.add(constant.SWAP_SOUND, { volume: 0.5 });
    this.elinimateSound = this.sound.add(constant.ELIMINATE_SOUND, { volume: 0.6 });
    this.backgroundMusic = this.sound.add(constant.BACKGROUND_MUSIC, {
      loop: true,
      volume: 0.42,
    });
  }

  private background() {
    const background = this.add.image(this.screenWidth / 2, this.screenHeight / 2, constant.TEXTURE_KEY_BACKGROUND);
    const scale = Math.max(this.screenWidth / background.width, this.screenHeight / background.height);
    background.setScale(scale);
    background.setDepth(-30);
    this.backgroundImage = background;

    const vignette = this.add.graphics();
    vignette.setDepth(-20);
    this.vignetteGraphics = vignette;
    this.applyThemeToEnvironment();
  }

  private ambientGeometry() {
    const field = this.add.graphics();
    field.setDepth(-16);
    this.ambientFieldGraphics = field;
    const centerX = this.screenWidth * 0.77;
    const centerY = 220 * constant.SCALE;
    const goldenAngle = Phaser.Math.DegToRad(137.507764);

    for (let i = 0; i < 34; i++) {
      const radius = Math.sqrt(i + 1) * 13 * constant.SCALE;
      const angle = goldenAngle * i;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      field.fillStyle(i % 5 === 0 ? this.reefTheme.phaser.gold : this.reefTheme.phaser.accent, i % 5 === 0 ? 0.18 : 0.11);
      field.fillCircle(x, y, Math.max(1, (2 + (i % 3)) * constant.SCALE));
    }

    const ray = this.add.graphics();
    ray.setDepth(-17);
    this.ambientRayGraphics = ray;
    ray.fillStyle(this.reefTheme.phaser.ray, 0.035);
    ray.fillTriangle(
      this.screenWidth * 0.22,
      0,
      this.screenWidth * 0.42,
      0,
      this.screenWidth * 0.68,
      this.screenHeight * 0.7
    );

    for (let i = 0; i < 8; i++) {
      const bubble = this.add.circle(
        Phaser.Math.Between(40, Math.max(41, Math.floor(this.screenWidth - 40))),
        Phaser.Math.Between(Math.floor(this.screenHeight * 0.32), Math.floor(this.screenHeight * 0.92)),
        Phaser.Math.Between(2, 6) * constant.SCALE,
        this.reefTheme.phaser.bubble,
        0.16
      );
      bubble.setDepth(-14);
      this.ambientBubbles.push(bubble);
      this.tweens.add({
        targets: bubble,
        y: -20,
        x: bubble.x + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(7000, 13000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000),
      });
    }
  }

  private fish() {
    const fishSpecs: Array<[string, number]> = [
      [constant.TEXTURE_KEY_PINK_FISH, 0.36],
      [constant.TEXTURE_KEY_FISH_4, 0.27],
      [constant.TEXTURE_KEY_JELLYFISH, 0.22],
    ];

    fishSpecs.forEach(([key, alpha]) => {
      const fish = this.createFish(key);
      if (!fish) return;
      fish.setX(Math.random() * this.screenWidth);
      fish.setY(this.screenHeight * (0.18 + Math.random() * 0.58));
      fish.setAlpha(alpha);
      fish.setDepth(-12);
      this.fishes.push(fish);
    });

    this.time.addEvent({
      delay: 54,
      loop: true,
      callback: () => {
        for (const fish of this.fishes) {
          if (fish.x > fish.displayWidth / 2 + this.screenWidth) fish.setFlipX(true);
          if (fish.x < -fish.displayWidth / 2) fish.setFlipX(false);
          fish.x += fish.flipX ? -0.75 : 0.75;
          fish.y += Math.sin((this.time.now + fish.x) * 0.002) * 0.22;
        }
      },
    });
  }

  private createFish(fishString: string) {
    const config: Record<string, { key: string; end: number; rate: number; scale: number }> = {
      [constant.TEXTURE_KEY_PINK_FISH]: { key: constant.ANIMATION_KEY_PINK_FISH, end: 3, rate: 4, scale: 0.7 },
      [constant.TEXTURE_KEY_FISH_4]: { key: constant.ANIMATION_KEY_FISH_4, end: 4, rate: 5, scale: 0.62 },
      [constant.TEXTURE_KEY_JELLYFISH]: { key: constant.ANIMATION_KEY_JELLYFISH, end: 19, rate: 20, scale: 0.52 },
    };
    const spec = config[fishString];
    if (!spec) return undefined;

    if (!this.anims.exists(spec.key)) {
      this.anims.create({
        key: spec.key,
        frames: this.anims.generateFrameNumbers(fishString, { start: 0, end: spec.end }),
        frameRate: spec.rate,
        repeat: -1,
      });
    }

    const fish = this.add.sprite(0, 0, fishString);
    fish.anims.play(spec.key);
    fish.setScale(constant.SCALE * spec.scale);
    return fish;
  }

  private backArrow() {
    const back = this.add.text(58 * constant.SCALE, 54 * constant.SCALE, "‹", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${72 * constant.SCALE}px`,
      color: this.colorHex(this.reefTheme.phaser.accentAlt),
    });
    back.setOrigin(0.5);
    back.setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => window.location.reload());
  }

  private soundControls() {
    this.musicImage = this.add.image(1012 * constant.SCALE, 58 * constant.SCALE, constant.TEXTURE_KEY_MUSIC);
    this.musicImage.setScale((58 * constant.SCALE) / this.musicImage.width);
    this.musicImage.setAlpha(0.9);
    this.musicImage.setInteractive({ useHandCursor: true });

    this.disableMusicImage = this.add.image(1012 * constant.SCALE, 58 * constant.SCALE, constant.TEXTURE_KEY_DISABLE_AUDIO);
    this.disableMusicImage.setScale((42 * constant.SCALE) / this.disableMusicImage.width);
    this.disableMusicImage.setVisible(false);

    this.musicImage.on("pointerdown", () => {
      const disabled = !this.disableMusicImage?.visible;
      this.disableMusicImage?.setVisible(disabled);
      if (disabled) this.backgroundMusic?.pause();
      else this.backgroundMusic?.resume();
    });

    this.soundImage = this.add.image(1101 * constant.SCALE, 58 * constant.SCALE, constant.TEXTURE_KEY_MICROPHONE);
    this.soundImage.setScale((52 * constant.SCALE) / this.soundImage.width);
    this.soundImage.setAlpha(0.9);
    this.soundImage.setInteractive({ useHandCursor: true });

    this.disableSoundImage = this.add.image(1101 * constant.SCALE, 58 * constant.SCALE, constant.TEXTURE_KEY_DISABLE_AUDIO);
    this.disableSoundImage.setScale((42 * constant.SCALE) / this.disableSoundImage.width);
    this.disableSoundImage.setVisible(false);

    this.soundImage.on("pointerdown", () => {
      this.disableSoundImage?.setVisible(!this.disableSoundImage.visible);
    });
  }

  private hud() {
    const topPanel = this.add.graphics();
    topPanel.fillStyle(this.reefTheme.phaser.panel, 0.57);
    topPanel.lineStyle(Math.max(1, 2 * constant.SCALE), this.reefTheme.phaser.panelLine, 0.18);
    topPanel.fillRoundedRect(126 * constant.SCALE, 80 * constant.SCALE, 918 * constant.SCALE, 205 * constant.SCALE, 40 * constant.SCALE);
    topPanel.strokeRoundedRect(126 * constant.SCALE, 80 * constant.SCALE, 918 * constant.SCALE, 205 * constant.SCALE, 40 * constant.SCALE);

    this.levelText = this.add.text(this.screenWidth / 2, 118 * constant.SCALE, `REEF ${String(this.levelCount).padStart(2, "0")}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${24 * constant.SCALE}px`,
      fontStyle: "bold",
      color: this.colorHex(this.reefTheme.phaser.accent),
    });
    this.levelText.setOrigin(0.5);

    const scoreLabel = this.add.text(206 * constant.SCALE, 166 * constant.SCALE, "SCORE", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${23 * constant.SCALE}px`,
      fontStyle: "bold",
      color: this.colorHex(this.reefTheme.phaser.muted),
    });
    scoreLabel.setOrigin(0, 0.5);

    this.pointText = this.add.text(206 * constant.SCALE, 213 * constant.SCALE, "0", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${48 * constant.SCALE}px`,
      fontStyle: "bold",
      color: "#FFFFFF",
    });
    this.pointText.setOrigin(0, 0.5);

    const movesLabel = this.add.text(964 * constant.SCALE, 166 * constant.SCALE, "MOVES", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${23 * constant.SCALE}px`,
      fontStyle: "bold",
      color: this.colorHex(this.reefTheme.phaser.muted),
    });
    movesLabel.setOrigin(1, 0.5);

    this.movesText = this.add.text(964 * constant.SCALE, 213 * constant.SCALE, `${this.moveLimit}`, {
      fontFamily: "Arial, sans-serif",
      fontSize: `${48 * constant.SCALE}px`,
      fontStyle: "bold",
      color: "#FFFFFF",
    });
    this.movesText.setOrigin(1, 0.5);

    this.bloomLabel = this.add.text(this.screenWidth / 2, 494 * constant.SCALE, "BLOOM", {
      fontFamily: "Arial, sans-serif",
      fontSize: `${20 * constant.SCALE}px`,
      fontStyle: "bold",
      color: this.colorHex(this.reefTheme.phaser.muted),
    });
    this.bloomLabel.setOrigin(0.5);

    const bloomTrack = this.add.rectangle(
      this.screenWidth / 2,
      538 * constant.SCALE,
      760 * constant.SCALE,
      8 * constant.SCALE,
      this.reefTheme.phaser.accent,
      0.13
    );
    bloomTrack.setOrigin(0.5);

    this.bloomBarFill = this.add.rectangle(
      this.screenWidth / 2 - 380 * constant.SCALE,
      538 * constant.SCALE,
      1,
      8 * constant.SCALE,
      this.reefTheme.phaser.gold,
      0.95
    );
    this.bloomBarFill.setOrigin(0, 0.5);
    this.updateBloomBar();
  }
}
