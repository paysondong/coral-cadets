import "./AboutUsPanel.css";

function AboutUsPanel(props: { onCloseClick: () => void }) {
  return (
    <div className="about-us-panel">
      <img
        src="images/menu/about-us-panel-background.png"
        className="about-us-panel-background"
        alt=""
      />

      <img
        src="images/menu/information-board-close.png"
        className="about-us-panel-close"
        alt=""
        onClick={() => {
          props.onCloseClick();
        }}
      />

      <img
        src="images/menu/about-us-panel-title.png"
        className="about-us-panel-title"
        alt=""
      />

      <img
        src="images/menu/about-us-panel-content.png"
        className="about-us-panel-content"
        alt=""
      />
    </div>
  );
}

export default AboutUsPanel;
