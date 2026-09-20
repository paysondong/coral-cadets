import { createRef, useEffect, useState } from "react";
import * as Phaser from "phaser";

import "./Game.css";
import InformationBoard from "./information-board/InformationBoard";
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

const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var game: Phaser.Game;

function Game() {
  const canvasRef = createRef<HTMLCanvasElement>();

  const [aboutUsButtonHidden, setAboutUsButtonHidden] = useState(false);
  const [playButtonHidden, setPlayButtonHidden] = useState(false);

  const [informationBoardHidden, setInformationBoardHidden] = useState(true);
  const [aboutUsPanelHidden, setAboutUsPanelHidden] = useState(true);
  const [ecoPointsPanelHidden, setEcoPointsPanelHidden] = useState(true);
  const [oceanTriviaPanelHidden, setOceanTriviaPanelHidden] = useState(true);
  const [ourSponsorPanelHidden, setOurSponsorPanelHidden] = useState(true);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");

  const buttonSound = new Audio("audio/button.mp3");

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: isMobile ? window.screen.width : window.innerHeight / 2,
      height: isMobile ? window.screen.height : window.innerHeight,
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
      canvas: canvasRef.current!!,
    };

    game = new Phaser.Game(config);
    console.log(game);
  }, []);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timer = setInterval(() => {
      if ((game.scene.getScene("SceneLevel1") as SceneLevel1).loaded) {
        loaded();
      }
      setCount(count + 1);
    }, 500);

    return () => {
      clearInterval(timer);
    };    
  }, [count, loading])

  useEffect(() => {
    setLoadingText(`Loading${".".repeat(count % 4)}`);
  }, [count]);

  const loaded = () => {
    setLoading(false);
  }

  const body = (
    <>
      <Menu
        onEcoPointsClick={() => {
          buttonSound.play();
          setEcoPointsPanelHidden(false);
        }}
        onOceanTriviaClick={() => {
          buttonSound.play();
          setOceanTriviaPanelHidden(false);
        }}
        onOurSponsorClick={() => {
          buttonSound.play();
          setOurSponsorPanelHidden(false);
        }}
      />

      {aboutUsButtonHidden ? null : (
        <img
          src="images/about-us.png"
          alt=""
          className="about-us"
          onClick={() => {
            buttonSound.play();
            setAboutUsPanelHidden(false);
          }}
        />
      )}

      {playButtonHidden ? null : (
        <>
          <img
            src="images/play.png"
            alt=""
            className="play"
            onClick={() => {
              if ((game.scene.getScene("SceneLevel1") as SceneLevel1).loaded) {
                buttonSound.play();
                (game.scene.getScene("SceneLevel1") as SceneLevel1).play();
                setAboutUsButtonHidden(true);
                setPlayButtonHidden(true);
              }
            }}
          />
          <img
            src="images/earn-eco-points.webp"
            alt=""
            className="earn-eco-points"
          />
        </>
      )}

      {informationBoardHidden ? null : (
        <InformationBoard
          onCloseClick={() => {
            buttonSound.play();
            setInformationBoardHidden(true);
          }}
        />
      )}
      {aboutUsPanelHidden ? null : (
        <AboutUsPanel
          onCloseClick={() => {
            buttonSound.play();
            setAboutUsPanelHidden(true);
          }}
        />
      )}
      {ecoPointsPanelHidden ? null : (
        <EcoPointsPanel
          onCloseClick={() => {
            buttonSound.play();
            setEcoPointsPanelHidden(true);
          }}
        />
      )}
      {oceanTriviaPanelHidden ? null : (
        <OceanTriviaPanel
          onCloseClick={() => {
            buttonSound.play();
            setOceanTriviaPanelHidden(true);
          }}
        />
      )}
      {ourSponsorPanelHidden ? null : (
        <OurSponsorPanel
          onCloseClick={() => {
            buttonSound.play();
            setOurSponsorPanelHidden(true);
          }}
        />
      )}
    </>
  )

  const loadingBody = (
    <div>
          <img
            src="images/loading_background.png"
            alt=""
            className="loading-body"
          />
          <div
            className="loading-text">
              {loadingText}
          </div>

    </div>
  )

  return (
    <div className="app">
      <canvas className="scene" ref={canvasRef} />
      {
        loading ? loadingBody : body
      }
    </div>
  );
}

export default Game;
