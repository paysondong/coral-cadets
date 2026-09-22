import "./Menu.css";

type MenuProps = {
  onEcoPointsClick: () => void;
  onOceanTriviaClick: () => void;
  onOurSponsorClick: () => void;
  onAboutClick: () => void;
};

function Menu(props: MenuProps) {
  return (
    <nav className="reef-menu" aria-label="Coral Cadet extras">
      <button className="reef-menu__item" onClick={props.onEcoPointsClick}>
        <span className="reef-menu__dot reef-menu__dot--gold" />
        Reef score
      </button>
      <button className="reef-menu__item" onClick={props.onOceanTriviaClick}>
        <span className="reef-menu__dot reef-menu__dot--aqua" />
        Ocean cards
      </button>
      <button className="reef-menu__item" onClick={props.onAboutClick}>
        <span className="reef-menu__dot reef-menu__dot--coral" />
        About
      </button>
      <button className="reef-menu__item reef-menu__item--quiet" onClick={props.onOurSponsorClick}>
        Support
      </button>
    </nav>
  );
}

export default Menu;
