import "./Menu.css";

function Menu(props: {
  onEcoPointsClick: () => void;
  onOceanTriviaClick: () => void;
  onOurSponsorClick: () => void;
}) {
  return (
    <div className="menu-container">
      <div
        className="bubble-container"
        onClick={() => {
          props.onEcoPointsClick();
        }}
      >
        <img className="bubble-image" alt="" src="images/menu/bubble.png" />
        <img
          className="eco-points-image"
          alt=""
          src="images/menu/eco-points.png"
        />
        <img
          className="eco-points-text-image"
          alt=""
          src="images/menu/eco-points-text.png"
        />
      </div>
      <div
        className="bubble-container"
        onClick={() => {
          props.onOceanTriviaClick();
        }}
      >
        <img className="bubble-image" alt="" src="images/menu/bubble.png" />
        <img
          className="ocean-trivia-image"
          alt=""
          src="images/menu/ocean-trivia.png"
        />
        <img
          className="ocean-trivia-text-image"
          alt=""
          src="images/menu/ocean-trivia-text.png"
        />
      </div>
      <div
        className="bubble-container"
        onClick={() => {
          props.onOurSponsorClick();
        }}
      >
        <img className="bubble-image" alt="" src="images/menu/bubble.png" />
        <img
          className="our-sponsor-image"
          alt=""
          src="images/menu/our-sponsor.png"
        />
        <img
          className="our-sponsor-text-image"
          alt=""
          src="images/menu/our-sponsor-text.png"
        />
      </div>
    </div>
  );
}

export default Menu;
