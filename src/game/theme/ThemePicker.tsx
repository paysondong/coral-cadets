import { REEF_THEMES, ReefThemeId } from "./Theme";
import "./ThemePicker.css";

type ThemePickerProps = {
  value: ReefThemeId;
  onChange: (theme: ReefThemeId) => void;
};

export default function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="reef-skins" aria-label="Choose reef skin">
      <div className="reef-skins__label">REEF SKIN</div>
      <div className="reef-skins__options">
        {(Object.keys(REEF_THEMES) as ReefThemeId[]).map((themeId) => {
          const theme = REEF_THEMES[themeId];
          const selected = value === themeId;
          return (
            <button
              type="button"
              key={themeId}
              className={`reef-skin${selected ? " reef-skin--active" : ""}`}
              onClick={() => onChange(themeId)}
              aria-pressed={selected}
              title={theme.description}
            >
              <span className="reef-skin__swatches" aria-hidden="true">
                {theme.swatches.map((color) => (
                  <i key={color} style={{ background: color }} />
                ))}
              </span>
              <span>{theme.name.replace(" Reef", "")}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
