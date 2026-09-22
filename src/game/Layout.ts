export const DESIGN_WIDTH = 1170;
export const DESIGN_HEIGHT = 2532;

export function getGameViewport() {
  const availableWidth = Math.max(window.innerWidth || DESIGN_WIDTH, 320);
  const availableHeight = Math.max(window.innerHeight || DESIGN_HEIGHT, 560);
  const portraitWidth = Math.min(
    availableWidth,
    availableHeight * (DESIGN_WIDTH / DESIGN_HEIGHT)
  );

  return {
    width: Math.round(portraitWidth),
    height: Math.round(availableHeight),
  };
}

export function unit(value: number) {
  return value * (getGameViewport().width / DESIGN_WIDTH);
}
