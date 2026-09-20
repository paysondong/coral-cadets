import "./OurSponsorPanel.css";

function OurSponsorPanel(props: { onCloseClick: () => void }) {
  return (
    <div className="our-sponsor-panel">
      <img
        src="images/menu/our-sponsor-panel-background.png"
        className="our-sponsor-panel-background"
        alt=""
      />

      <img
        src="images/menu/information-board-close.png"
        className="our-sponsor-panel-close"
        alt=""
        onClick={() => {
          props.onCloseClick();
        }}
      />

      <img
        src="images/menu/our-sponsor-panel-title.png"
        className="our-sponsor-panel-title"
        alt=""
      />

      <img
        src="images/menu/our-sponsor-panel-text-1.png"
        className="our-sponsor-panel-text-1"
        alt=""
      />

      <img
        src="images/menu/our-sponsor-panel-text-2.png"
        className="our-sponsor-panel-text-2"
        alt=""
      />

      <img
        onClick={() => {
          window.open("https://reefscapers.com");
        }}
        src="images/menu/our-sponsor-panel-text-website.png"
        className="our-sponsor-panel-text-website"
        alt=""
      />

      <img
        src="images/menu/our-sponsor-panel-button.png"
        className="our-sponsor-panel-button"
        alt=""
        onClick={() => {
          window.open("https://reefscapers.com");
        }}
      />

      <img
        src="images/menu/our-sponsor-panel-button-text.png"
        className="our-sponsor-panel-button-text"
        alt=""
        onClick={() => {
          window.open("https://reefscapers.com");
        }}
      />
    </div>
  );
}

export default OurSponsorPanel;
