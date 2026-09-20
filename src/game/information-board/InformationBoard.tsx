import "./InformationBoard.css";

function InformationBoard(props: { onCloseClick: () => void }) {
  return (
    <div className="information-board">
      <img
        src="images/menu/information-board-background.png"
        className="information-board-background"
        alt=""
      />

      <img
        src="images/menu/information-board-close.png"
        alt=""
        className="information-board-close"
        onClick={() => {
          props.onCloseClick();
        }}
      />

      <img
        src="images/menu/information-board-title.png"
        alt=""
        className="information-board-title"
      />

      <img
        src="images/menu/information-board-content.png"
        alt=""
        className="information-board-content"
      />
    </div>
  );
}

export default InformationBoard;
