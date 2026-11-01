export const levels = [
  "Geschäftsführung",
  "Oberes Management",
  "Teamleitung",
  "Operatives Team",
];
export const positions = Array.from({ length: 4 }, (_, level) =>
  Array.from({ length: level === 3 ? 20 : 2 ** level }, (_, index) => ({
    id: `${level}-${index}`,
    level,
    index,
    x:
      level === 3
        ? 20.75 + Math.floor(index / 5) * 19.5 + ((index % 5) - 2) * 3.6
        : 50 + (index - (2 ** level - 1) / 2) * (78 / 2 ** level),
    y: level * 25 + 1,
  })),
).flat();
export function children(node) {
  return node.level === 3
    ? []
    : positions.filter(
        (n) =>
          n.level === node.level + 1 &&
          Math.floor(n.index / (n.level === 3 ? 5 : 2)) === node.index,
      );
}
export function createState() {
  return { hits: positions.map(() => 0), reports: 0 };
}
export function totals(state) {
  return levels.map((_, level) =>
    positions.reduce(
      (sum, n, i) => sum + (n.level === level ? state.hits[i] : 0),
      0,
    ),
  );
}

// Manual impulses fan out through the whole subtree; automatic ones usually
// follow a single path, occasionally branching to several direct reports.
export function recipients(node, broadcast = false, random = Math.random) {
  const pool = children(node);
  if (broadcast || pool.length === 0) return pool;
  const count =
    random() < 0.8 ? 1 : 2 + Math.floor(random() * (pool.length - 1));
  const selected = [];
  while (selected.length < count) {
    selected.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return selected;
}

export function averages(state) {
  return totals(state).map(
    (sum, level) =>
      sum / positions.filter((node) => node.level === level).length,
  );
}
