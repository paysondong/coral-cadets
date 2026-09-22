import "./AboutUsPanel.css";

function AboutUsPanel(props: { onCloseClick: () => void }) {
  return (
    <div className="reef-modal-layer" onMouseDown={props.onCloseClick}>
      <section className="reef-modal reef-about" onMouseDown={(event) => event.stopPropagation()}>
        <button className="reef-modal__close" onClick={props.onCloseClick} aria-label="Close">×</button>
        <div className="reef-modal__eyebrow">ABOUT THE REEF</div>
        <h2>CORALCADET</h2>
        <p>
          A match game about colour, rhythm and a reef that becomes more alive as your patterns get better.
        </p>
        <div className="reef-about__formula">PLAY × PATTERN × BLOOM</div>
        <p className="reef-modal__quiet">
          Mathematics lives in the chains, symmetry and growth. The ocean lives in the art — neither needs to become homework.
        </p>
      </section>
    </div>
  );
}

export default AboutUsPanel;
