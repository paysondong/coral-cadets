export type ReefThemeId = "classic" | "sunset" | "moon";

export type ReefTheme = {
  id: ReefThemeId;
  name: string;
  description: string;
  swatches: [string, string, string];
  phaser: {
    gameBackground: string;
    backgroundTint: number;
    vignette: number;
    panel: number;
    panelLine: number;
    accent: number;
    accentAlt: number;
    muted: number;
    gold: number;
    violet: number;
    bubble: number;
    ray: number;
    success: number;
    failure: number;
    coralSignature: number[];
  };
};

export const THEME_STORAGE_KEY = "coralcadets_theme";
export const THEME_EVENT = "coralcadets:theme-change";

export const REEF_THEMES: Record<ReefThemeId, ReefTheme> = {
  classic: {
    id: "classic",
    name: "Classic Reef",
    description: "Aqua currents and warm coral light.",
    swatches: ["#76fff1", "#ffd474", "#ff8d7b"],
    phaser: {
      gameBackground: "#02131f",
      backgroundTint: 0xd8ffff,
      vignette: 0x00121d,
      panel: 0x041c2a,
      panelLine: 0x76fff1,
      accent: 0x76fff1,
      accentAlt: 0x72d9ff,
      muted: 0x77bcc7,
      gold: 0xffd474,
      violet: 0xd08cff,
      bubble: 0xb9fffb,
      ray: 0xa9fff8,
      success: 0x70ffe9,
      failure: 0xff8b8b,
      coralSignature: [0xff8e83, 0x7cfff0, 0xffd36f, 0xd08cff],
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset Reef",
    description: "Coral orange, violet dusk, and warm gold.",
    swatches: ["#ff8268", "#a58cff", "#ffd27a"],
    phaser: {
      gameBackground: "#151329",
      backgroundTint: 0xffd7da,
      vignette: 0x120d22,
      panel: 0x241934,
      panelLine: 0xff9b87,
      accent: 0xff9b87,
      accentAlt: 0xb69bff,
      muted: 0xb7a6c9,
      gold: 0xffd27a,
      violet: 0xa58cff,
      bubble: 0xffe9df,
      ray: 0xffd8c9,
      success: 0xffc77e,
      failure: 0xff7b8d,
      coralSignature: [0xff8268, 0xa58cff, 0xffd27a, 0xff6f9c],
    },
  },
  moon: {
    id: "moon",
    name: "Moon Reef",
    description: "Indigo water, pearl light, and quiet gold.",
    swatches: ["#8fa2ff", "#fff6ef", "#e9bc62"],
    phaser: {
      gameBackground: "#090b1b",
      backgroundTint: 0xd8ddff,
      vignette: 0x050717,
      panel: 0x151a35,
      panelLine: 0xa7b4ff,
      accent: 0xa7b4ff,
      accentAlt: 0xe6e9ff,
      muted: 0x9ca6c8,
      gold: 0xe9bc62,
      violet: 0x9a87e8,
      bubble: 0xf4f2ff,
      ray: 0xdce1ff,
      success: 0xd6dcff,
      failure: 0xff8d9c,
      coralSignature: [0xa7b4ff, 0xff9a85, 0xe9bc62, 0xb79df2],
    },
  },
};

export function isReefThemeId(value: string | null): value is ReefThemeId {
  return value === "classic" || value === "sunset" || value === "moon";
}

export function getSavedThemeId(): ReefThemeId {
  if (typeof window === "undefined") return "classic";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isReefThemeId(saved) ? saved : "classic";
}

export function getSavedTheme(): ReefTheme {
  return REEF_THEMES[getSavedThemeId()];
}

export function saveTheme(id: ReefThemeId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { themeId: id } }));
}
