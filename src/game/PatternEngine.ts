export type PatternPoint = { i: number; j: number };
export type PatternKind = "match" | "pulse" | "golden" | "symmetry";

export type PatternGeometry = {
  lines: PatternPoint[][];
  naturalPoints: PatternPoint[];
  clearPoints: PatternPoint[];
  maxLineLength: number;
  cross: PatternPoint | null;
  focus: PatternPoint;
  pattern: PatternKind;
};

function key(point: PatternPoint) {
  return `${point.i}:${point.j}`;
}

export function collectMatchLines(types: number[][]): PatternPoint[][] {
  const lines: PatternPoint[][] = [];

  for (let i = 0; i < types.length; i++) {
    let start = 0;
    while (start < types[i].length) {
      const type = types[i][start];
      let end = start + 1;
      while (end < types[i].length && types[i][end] === type) end++;
      if (type > 0 && end - start >= 3) {
        lines.push(
          Array.from({ length: end - start }, (_, offset) => ({ i, j: start + offset }))
        );
      }
      start = end;
    }
  }

  const width = types[0]?.length ?? 0;
  for (let j = 0; j < width; j++) {
    let start = 0;
    while (start < types.length) {
      const type = types[start][j];
      let end = start + 1;
      while (end < types.length && types[end][j] === type) end++;
      if (type > 0 && end - start >= 3) {
        lines.push(
          Array.from({ length: end - start }, (_, offset) => ({ i: start + offset, j }))
        );
      }
      start = end;
    }
  }

  return lines;
}

export function findCross(lines: PatternPoint[][]): PatternPoint | null {
  const horizontal = lines.filter(
    (line) => line.length > 1 && line.every((point) => point.i === line[0].i)
  );
  const vertical = lines.filter(
    (line) => line.length > 1 && line.every((point) => point.j === line[0].j)
  );

  for (const h of horizontal) {
    const hKeys = new Set(h.map(key));
    for (const v of vertical) {
      const intersection = v.find((point) => hKeys.has(key(point)));
      if (intersection) return intersection;
    }
  }
  return null;
}

function addIfPlayable(
  types: number[][],
  target: Map<string, PatternPoint>,
  i: number,
  j: number
) {
  if ((types[i]?.[j] ?? -1) > 0) target.set(`${i}:${j}`, { i, j });
}

export function analyzePattern(types: number[][]): PatternGeometry | null {
  const lines = collectMatchLines(types);
  if (lines.length === 0) return null;

  const natural = new Map<string, PatternPoint>();
  lines.flat().forEach((point) => natural.set(key(point), point));
  const clear = new Map(natural);
  const sorted = [...lines].sort((a, b) => b.length - a.length);
  const maxLineLength = sorted[0].length;
  const cross = findCross(lines);
  let focus = cross ?? sorted[0][Math.floor(sorted[0].length / 2)];

  if (maxLineLength >= 5) {
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        addIfPlayable(types, clear, focus.i + di, focus.j + dj);
      }
    }
  } else if (maxLineLength === 4) {
    addIfPlayable(types, clear, focus.i - 1, focus.j);
    addIfPlayable(types, clear, focus.i + 1, focus.j);
    addIfPlayable(types, clear, focus.i, focus.j - 1);
    addIfPlayable(types, clear, focus.i, focus.j + 1);
  }

  if (cross) {
    focus = cross;
    addIfPlayable(types, clear, cross.i - 1, cross.j - 1);
    addIfPlayable(types, clear, cross.i - 1, cross.j + 1);
    addIfPlayable(types, clear, cross.i + 1, cross.j - 1);
    addIfPlayable(types, clear, cross.i + 1, cross.j + 1);
  }

  let pattern: PatternKind = "match";
  if (maxLineLength === 4) pattern = "pulse";
  if (maxLineLength >= 5) pattern = "golden";
  if (cross) pattern = "symmetry";

  return {
    lines,
    naturalPoints: [...natural.values()],
    clearPoints: [...clear.values()],
    maxLineLength,
    cross,
    focus,
    pattern,
  };
}

export function scorePattern(
  geometry: Pick<PatternGeometry, "clearPoints" | "naturalPoints" | "maxLineLength" | "cross">,
  cascade: number
) {
  const specialCleared = Math.max(0, geometry.clearPoints.length - geometry.naturalPoints.length);
  let base = geometry.clearPoints.length * 18;
  if (geometry.maxLineLength === 4) base += 70;
  if (geometry.maxLineLength >= 5) base += 170;
  if (geometry.cross) base += 130;
  base += specialCleared * 12;
  return Math.round(base * (1 + (cascade - 1) * 0.45));
}

export type PossibleMove = {
  from: PatternPoint;
  to: PatternPoint;
};

export function findPossibleMove(types: number[][]): PossibleMove | null {
  const copy = types.map((row) => [...row]);
  const directions = [
    [0, 1],
    [1, 0],
  ];

  for (let i = 0; i < copy.length; i++) {
    for (let j = 0; j < copy[i].length; j++) {
      if (copy[i][j] <= 0) continue;
      for (const [di, dj] of directions) {
        const ni = i + di;
        const nj = j + dj;
        if ((copy[ni]?.[nj] ?? -1) <= 0) continue;
        [copy[i][j], copy[ni][nj]] = [copy[ni][nj], copy[i][j]];
        const makesMatch = analyzePattern(copy) !== null;
        [copy[i][j], copy[ni][nj]] = [copy[ni][nj], copy[i][j]];
        if (makesMatch) {
          return { from: { i, j }, to: { i: ni, j: nj } };
        }
      }
    }
  }
  return null;
}
