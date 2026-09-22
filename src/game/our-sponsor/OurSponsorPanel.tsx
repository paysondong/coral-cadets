import "./OurSponsorPanel.css";

function OurSponsorPanel(props: { onCloseClick: () => void }) {
  return (
    <div className="reef-modal-layer" onMouseDown={props.onCloseClick}>
      <section className="reef-modal reef-support" onMouseDown={(event) => event.stopPropagation()}>
        <button className="reef-modal__close" onClick={props.onCloseClick} aria-label="Close">×</button>
        <div className="reef-modal__eyebrow">REEF PARTNER</div>
        <h2>Reefscapers</h2>
        <p>The original project connects its playful reef world with people doing real coral restoration work.</p>
        <button className="reef-support__button" onClick={() => window.open("https://reefscapers.com", "_blank", "noopener,noreferrer")}>VISIT REEFSCAPERS ↗</button>
      </section>
    </div>
  );
}

export default OurSponsorPanel;
