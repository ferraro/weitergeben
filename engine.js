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

export const situations = {
  everyday: {
    label: "Normaler Arbeitstag",
    interval: 3400,
    single: [0.8, 0.8, 0.8],
    multiple: 0.15,
    sources: [0.2, 0.05, 0.25, 0.25, 0.25],
    description: "Vereinzelter Druck: meist trifft es eine Person.",
  },
  quarter: {
    label: "Quartalsendspurt",
    interval: 1900,
    single: [0.35, 0.35, 0.15],
    multiple: 0.15,
    sources: [0.1, 0.05, 0.55, 0.15, 0.15],
    description:
      "Alle müssen liefern: Teamleads treffen zu 70 % ihr ganzes Team.",
  },
  crisis: {
    label: "Krisenmodus",
    interval: 850,
    single: [0.2, 0.2, 0.2],
    multiple: 0.15,
    sources: [0.35, 0.3, 0.2, 0.1, 0.05],
    description:
      "Druck von außen: Kunden und Banker treiben breite Schlagwellen an.",
  },
};
export function impulseSource(profile, random = Math.random) {
  let roll = random();
  const names = ["customer", "banker", 0, 1, 2];
  for (let i = 0; i < names.length; i++) {
    roll -= profile.sources[i];
    if (roll < 0) return names[i];
  }
  return 2;
}
// Profiles are explicit game assumptions, not measured incident rates.
export function recipients(
  node,
  broadcast = false,
  random = Math.random,
  profile = situations.everyday,
) {
  const pool = children(node);
  if (broadcast || pool.length === 0) return pool;
  const roll = random();
  const single = profile.single[node.level];
  if (roll >= single + profile.multiple) return pool;
  const count =
    roll < single
      ? 1
      : Math.min(
          pool.length,
          2 + Math.floor(random() * Math.max(1, pool.length - 2)),
        );
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
