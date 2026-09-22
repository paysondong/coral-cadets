import { useState } from "react";
import "./OceanTriviaPanel.css";

const cards = [
  "Coral reefs shelter an extraordinary amount of ocean life.",
  "A reef is architecture made by living organisms.",
  "Tiny changes in temperature can stress coral communities.",
  "Healthy reefs soften waves before they reach the coast.",
  "Many reef relationships are partnerships, not competitions.",
  "Plastic can travel enormous distances before reaching a reef.",
  "Fish movement helps connect different parts of a reef ecosystem.",
  "Coral growth often creates branching, repeating geometry.",
  "No two reefs grow into exactly the same shape.",
  "A diverse reef can respond to change in more than one way.",
  "The most interesting natural patterns mix order with variation.",
  "A reef is less like a machine and more like a living conversation.",
];

function OceanTriviaPanel(props: { onCloseClick: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const unlockCount = Number(localStorage.getItem("unlock_count") || 0);

  return (
    <div className="reef-modal-layer" onMouseDown={props.onCloseClick}>
      <section className="reef-modal ocean-cards" onMouseDown={(event) => event.stopPropagation()}>
        <button className="reef-modal__close" onClick={props.onCloseClick} aria-label="Close">×</button>
        <div className="reef-modal__eyebrow">OCEAN CARDS</div>
        <h2>{selectedTopic === null ? "Found in the reef" : `CARD ${String(selectedTopic + 1).padStart(2, "0")}`}</h2>

        {selectedTopic === null ? (
          <div className="ocean-cards__grid">
            {cards.map((_, index) => {
              const unlocked = index <= unlockCount;
              return (
                <button
                  key={index}
                  className={`ocean-card ${unlocked ? "" : "ocean-card--locked"}`}
                  disabled={!unlocked}
                  onClick={() => setSelectedTopic(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="ocean-card-detail">
            <div className="ocean-card-detail__mark">≈</div>
            <p>{cards[selectedTopic]}</p>
            <button onClick={() => setSelectedTopic(null)}>BACK TO CARDS</button>
          </div>
        )}
      </section>
    </div>
  );
}

export default OceanTriviaPanel;
