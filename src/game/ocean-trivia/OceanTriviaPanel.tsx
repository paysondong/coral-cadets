import { useState } from "react";
import "./OceanTriviaPanel.css";

function OceanTriviaPanel(props: { onCloseClick: () => void }) {
  const [selectedTopic, setSelectedTopic] = useState<number | null>();

  const buttonSound = new Audio("audio/button.mp3");

  const changeSelectedTopic = (value: number | null) => {
    buttonSound.play();
    let unlockCount = localStorage.getItem("unlock_count");
    if (!unlockCount) {
      unlockCount = "0";
    }

    const count = parseInt(unlockCount, 10);
    if (count < value! - 1) {
      return;
    }
    setSelectedTopic(value);
  };

  const getTopic = (id: number) => {
    let unlockCount = localStorage.getItem("unlock_count");
    if (!unlockCount) {
      unlockCount = "0";
    }

    const count = parseInt(unlockCount, 10);

    let className = "ocean-trivia-panel-topic-container";

    if (id - 1 > count) {
      className += " ocean-trivia-panel-topic-container-disabled"
    }

    return (
      <div className={className} onClick={() => changeSelectedTopic(id)}>
        <img width="64" src="images/game-area-cell.png" alt=""/>
        <div>{id}</div>
      </div>
    );
  }

  const topics = [
    "Every year, about 8 million tons of plastic waste enters our oceans, causing great harm to marine life.",
    "Coral reefs are important habitats for marine life, but many are now threatened by ocean acidification and global warming",
    "Overfishing can disrupt the balance of marine ecosystems, severely affecting the quantity and diversity of marine species",
    "The ocean absorbs carbon dioxide from the atmosphere, leading to ocean acidification, which threatens the survival of many marine creatures, particularly corals and shellfish",
    "Establishing marine protected areas is an important means of protecting marine life and ecosystems, providing a habitat free from human interference",
    "Marine litter not only affects the ocean landscape but can also be mistakenly ingested by marine life, causing injury and even death",
    "Greenhouse gases produced by the burning of fossil fuels are the main cause of rising ocean temperatures and acidification",
    "Ocean noise pollution can interfere with the navigation, food-seeking, breeding, and other activities of marine life",
    "Many marine creatures, such as dolphins, turtles, and whales, are endangered due to human activities and need our protection",
    "We can protect marine life by choosing sustainable ocean activities, such as observing rather than touching marine life, not leaving garbage on the beach, and choosing sustainable marine products",
    "Corals are an important part of marine ecosystems, providing habitats and helping protect coastlines from erosion",
    "Marine debris, especially plastic waste, poses a serious threat to marine life, as they can mistakenly ingest these materials",
  ];

  return (
    <div className="ocean-trivia-panel">
      <img
        src="images/menu/information-board-background.png"
        className="ocean-trivia-panel-background"
        alt=""
      />

      <img
        src="images/menu/information-board-close.png"
        className="ocean-trivia-panel-close"
        alt=""
        onClick={() => {
          buttonSound.play();
          props.onCloseClick();
        }}
      />

      <img
        src="images/menu/ocean-trivia-panel-title.png"
        className="ocean-trivia-panel-title"
        alt=""
      />
      {
        !selectedTopic && (
          <table className="ocean-trivia-panel-topics">
            <tbody>
              <tr>
                <td>
                  {getTopic(1)}
                </td>
                <td>
                  {getTopic(2)}
                </td>
                <td>
                  {getTopic(3)}
                </td>
                <td>
                  {getTopic(4)}
                </td>
              </tr>
              <tr>
                <td>
                  {getTopic(5)}
                </td>
                <td>
                  {getTopic(6)}
                </td>
                <td>
                  {getTopic(7)}
                </td>
                <td>
                  {getTopic(8)}
                </td>
              </tr>
              <tr>
                <td>
                  {getTopic(9)}
                </td>
                <td>
                  {getTopic(10)}
                </td>
                <td>
                  {getTopic(11)}
                </td>
                <td>
                  {getTopic(12)}
                </td>
              </tr>
            </tbody>
          </table>
        )
      }

      {
        selectedTopic && (
          <>
            <div className="ocean-trivia-panel-topic">
              {topics[selectedTopic - 1]}
            </div>
            <img
              src="images/menu/information-board-close.png"
              className="ocean-trivia-panel-topic-close"
              alt=""
              onClick={() => {
                buttonSound.play();
                setSelectedTopic(null);
              }}
            />
          </>
        )
      }

    </div>
  );
}

export default OceanTriviaPanel;
