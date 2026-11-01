export const levels = [
  "Geschäftsführung",
  "Oberes Management",
  "Teamleitung",
  "Operatives Team",
];
export const positions = Array.from({ length: 4 }, (_, level) =>
  Array.from({ length: 2 ** level }, (_, index) => ({
    id: `${level}-${index}`,
    level,
    index,
    x: 50 + (index - (2 ** level - 1) / 2) * (78 / 2 ** level),
    y: level * 25 + 1,
  })),
).flat();
export function children(node) {
  return node.level === 3
    ? []
    : positions.filter(
        (n) =>
          n.level === node.level + 1 && Math.floor(n.index / 2) === node.index,
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
