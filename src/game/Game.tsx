import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";

import "./Game.css";
import OurSponsorPanel from "./our-sponsor/OurSponsorPanel";
import Menu from "./menu/Menu";
import OceanTriviaPanel from "./ocean-trivia/OceanTriviaPanel";
import AboutUsPanel from "./about-us/AboutUsPanel";
import EcoPointsPanel from "./eco-points/EcoPointsPanel";

import { SceneLevel1 } from "./SceneLevel1";
import { SceneLevel2 } from "./SceneLevel2";
import { SceneLevel3 } from "./SceneLevel3";
import { SceneLevel4 } from "./SceneLevel4";
import { SceneLevel5 } from "./SceneLevel5";
import { SceneLevel6 } from "./SceneLevel6";
import { SceneLevel7 } from "./SceneLevel7";
import { SceneLevel8 } from "./SceneLevel8";
import { SceneLevel9 } from "./SceneLevel9";
import { getGameViewport } from "./Layout";

function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const buttonSoundRef = useRef<HTMLAudioElement | null>(null);

  const [started, setStarted] = useState(false);
  const [startLevel] = useState(() => {
    const completed = Number(localStorage.getItem("unlock_count") || 0);
    return completed >= 9 ? 1 : Math.min(9, Math.max(1, completed + 1));
  });
  const [aboutUsPanelHidden, setAboutUsPanelHidden] = useState(true);
  const [ecoPointsPanelHidden, setEcoPointsPanelHidden] = useState(true);
  const [oceanTriviaPanelHidden, setOceanTriviaPanelHidden] = useState(true);
  const [ourSponsorPanelHidden, setOurSponsorPanelHidden] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buttonSoundRef.current = new Audio("audio/button.mp3");
    buttonSoundRef.current.volume = 0.45;

    if (!canvasRef.current || gameRef.current) return;
    const viewport = getGameViewport();
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: viewport.width,
      height: viewport.height,
      scene: [
        SceneLevel1,
        SceneLevel2,
        SceneLevel3,
        SceneLevel4,
        SceneLevel5,
        SceneLevel6,
        SceneLevel7,
        SceneLevel8,
        SceneLevel9,
      ],
      canvas: canvasRef.current,
      backgroundColor: "#02131f",
      antialias: true,
      render: {
        powerPreference: "high-performance",
      },
    };

    gameRef.current = new Phaser.Game(config);

    const timer = window.setInterval(() => {
      const scene = gameRef.current?.scene.getScene("SceneLevel1") as SceneLevel1 | undefined;
      if (scene?.loaded) {
        setLoading(false);
        window.clearInterval(timer);
      }
    }, 180);

    return () => {
      window.clearInterval(timer);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const clickSound = () => {
    const sound = buttonSoundRef.current;
    if (!sound) return;
    sound.currentTime = 0;
    void sound.play().catch(() => undefined);
  };

  const startGame = () => {
    const scene = gameRef.current?.scene.getScene("SceneLevel1") as SceneLevel1 | undefined;
    if (!scene?.loaded || !gameRef.current) return;
    clickSound();
    if (startLevel === 1) {
      scene.play();
    } else {
      gameRef.current.scene.stop("SceneLevel1");
      gameRef.current.scene.start(`SceneLevel${startLevel}`);
    }
    setStarted(true);
  };

  return (
    <main className="coral-stage">
      <div className="coral-stage__ambient" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="game-shell" aria-label="Coral Cadet game">
        <canvas className="scene" ref={canvasRef} />
        <div className="game-shell__glass" aria-hidden="true" />

        {loading ? (
          <div className="reef-loading">
            <div className="reef-loading__spiral" aria-hidden="true">
              {Array.from({ length: 21 }).map((_, index) => (
                <i key={index} style={{ "--i": index } as React.CSSProperties} />
              ))}
            </div>
            <div className="reef-loading__brand">CORALCADET</div>
            <div className="reef-loading__copy">Growing the reef…</div>
          </div>
        ) : !started ? (
          <>
            <div className="reef-landing">
              <div className="reef-landing__index">REEF {String(startLevel).padStart(2, "0")} / 09 · PATTERN REEF</div>
              <div className="reef-landing__mark" aria-hidden="true">
                <span className="reef-landing__orbit reef-landing__orbit--one" />
                <span className="reef-landing__orbit reef-landing__orbit--two" />
                <span className="reef-landing__core" />
              </div>
              <h1>CORALCADET</h1>
              <p className="reef-landing__subtitle">Pattern Reef</p>
              <p className="reef-landing__statement">
                Match colour. Build chains. Let the reef bloom.
              </p>
              <button className="reef-play" onClick={startGame}>
                <span>{startLevel === 1 ? "DIVE IN" : `CONTINUE · REEF ${String(startLevel).padStart(2, "0")}`}</span>
                <b>→</b>
              </button>
              <div className="reef-landing__rules">
                <span>3 · MATCH</span>
                <span>4 · PULSE</span>
                <span>5 · φ BLOOM</span>
                <span>3→5→8 · FLOW</span>
              </div>
            </div>

            <Menu
              onEcoPointsClick={() => {
                clickSound();
                setEcoPointsPanelHidden(false);
              }}
              onOceanTriviaClick={() => {
                clickSound();
                setOceanTriviaPanelHidden(false);
              }}
              onOurSponsorClick={() => {
                clickSound();
                setOurSponsorPanelHidden(false);
              }}
              onAboutClick={() => {
                clickSound();
                setAboutUsPanelHidden(false);
              }}
            />
          </>
        ) : null}

        {aboutUsPanelHidden ? null : (
          <AboutUsPanel
            onCloseClick={() => {
              clickSound();
              setAboutUsPanelHidden(true);
            }}
          />
        )}
        {ecoPointsPanelHidden ? null : (
          <EcoPointsPanel
            onCloseClick={() => {
              clickSound();
              setEcoPointsPanelHidden(true);
            }}
          />
        )}
        {oceanTriviaPanelHidden ? null : (
          <OceanTriviaPanel
            onCloseClick={() => {
              clickSound();
              setOceanTriviaPanelHidden(true);
            }}
          />
        )}
        {ourSponsorPanelHidden ? null : (
          <OurSponsorPanel
            onCloseClick={() => {
              clickSound();
              setOurSponsorPanelHidden(true);
            }}
          />
        )}
      </section>
    </main>
  );
}

export default Game;
