import "./EcoPointsPanel.css";

function EcoPointsPanel(props: { onCloseClick: () => void }) {
  const points = Number(localStorage.getItem("ecoScore") || 0);
  return (
    <div className="reef-modal-layer" onMouseDown={props.onCloseClick}>
      <section className="reef-modal reef-score" onMouseDown={(event) => event.stopPropagation()}>
        <button className="reef-modal__close" onClick={props.onCloseClick} aria-label="Close">×</button>
        <div className="reef-modal__eyebrow">REEF SCORE</div>
        <div className="reef-score__number">{points.toLocaleString()}</div>
        <div className="reef-score__rule" />
        <p>Every clean chain adds to the reef. Long matches, symmetry and cascading patterns grow it faster.</p>
      </section>
    </div>
  );
}

export default EcoPointsPanel;
