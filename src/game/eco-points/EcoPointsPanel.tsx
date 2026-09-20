import "./EcoPointsPanel.css";

function EcoPointsPanel(props: { onCloseClick: () => void }) {
  const buttonSound = new Audio("audio/button.mp3");
  const points = localStorage.getItem("ecoScore");
  return (
    <div className="eco-points-panel">
      <img
        src="images/menu/our-sponsor-panel-background.png"
        className="eco-points-panel-background"
        alt=""
      />

      <img
        src="images/menu/information-board-close.png"
        className="eco-points-panel-close"
        alt=""
        onClick={() => {
          buttonSound.play();
          props.onCloseClick();
        }}
      />

      <img
        src="images/menu/eco-points-panel-title.png"
        className="eco-points-panel-title"
        alt=""
      />

      <img
        src="images/menu/eco-points-panel-button.png"
        className="eco-points-panel-button"
        alt=""
      />

      <img
        src="images/menu/eco-points-panel-button-text.png"
        className="eco-points-panel-button-text"
        alt=""
      />
      <div className="eco-points-score">
        {points ? points : 0}
      </div>
    </div>
  );
}

export default EcoPointsPanel;
