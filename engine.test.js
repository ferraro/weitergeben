import test from "node:test";
import assert from "node:assert/strict";
import {
  positions,
  children,
  recipients,
  createState,
  totals,
  averages,
  situations,
  impulseSource,
} from "./engine.js";
test("Ein manueller Impuls von oben trifft 2, 4 und 20 Untergebene, niemals die Spitze", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    recipients(n, true).forEach(hit);
  }
  recipients(positions[0], true).forEach(hit);
  assert.deepEqual(totals(state), [0, 2, 4, 20]);
});
test("Mittleres Management reicht nur im eigenen Teilbaum weiter", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    recipients(n, true).forEach(hit);
  }
  recipients(positions[1], true).forEach(hit);
  assert.deepEqual(totals(state), [0, 0, 2, 10]);
  assert.equal(state.hits[positions.findIndex((n) => n.id === "3-19")], 0);
});
test("Die unterste Ebene kann nichts weiterreichen; Reset beginnt leer", () => {
  positions
    .filter((n) => n.level === 3)
    .forEach((n) => assert.deepEqual(children(n), []));
  assert.deepEqual(totals(createState()), [0, 0, 0, 0]);
});

test("Jeder Teamlead führt genau fünf eigene Teammitglieder", () => {
  const teams = positions.filter((n) => n.level === 2).map(children);
  assert.deepEqual(
    teams.map((team) => team.length),
    [5, 5, 5, 5],
  );
  assert.equal(new Set(teams.flat().map((n) => n.id)).size, 20);
});

test("Automatischer Druck kann einem einzelnen Weg nach unten folgen", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    recipients(n, false, () => 0).forEach(hit);
  }
  recipients(positions[0], false, () => 0).forEach(hit);
  assert.deepEqual(totals(state), [0, 1, 1, 1]);
});
test("Automatische Mehrfachtreffer bleiben eindeutig und im eigenen Team", () => {
  const lead = positions.find((n) => n.id === "2-1");
  const values = [0.9, 0, 0.9, 0];
  const targets = recipients(lead, false, () => values.shift());
  assert.equal(targets.length, 2);
  assert.equal(new Set(targets).size, 2);
  assert.ok(targets.every((n) => children(lead).includes(n)));
  assert.equal(recipients(lead, true).length, 5);
  assert.deepEqual(recipients(positions.at(-1)), []);
});

test("Durchschnitt pro Person berücksichtigt die Größe jeder Job-Kategorie", () => {
  const state = createState();
  [9, 87, 214, 1110].forEach((sum, level) => {
    state.hits[positions.findIndex((n) => n.level === level)] = sum;
  });
  assert.deepEqual(averages(state), [9, 43.5, 53.5, 55.5]);
  assert.deepEqual(averages(createState()), [0, 0, 0, 0]);
});

test("Situationen verteilen Teamtreffer deutlich unterschiedlich", () => {
  const lead = positions.find((n) => n.level === 2);
  for (const [key, expected] of [
    ["everyday", [80, 15, 5]],
    ["quarter", [15, 15, 70]],
    ["crisis", [20, 15, 65]],
  ]) {
    const bins = [0, 0, 0];
    for (let i = 0; i < 100; i++) {
      let first = true;
      const targets = recipients(
        lead,
        false,
        () => {
          if (first) {
            first = false;
            return (i + 0.5) / 100;
          }
          return 0;
        },
        situations[key],
      );
      bins[targets.length === 1 ? 0 : targets.length === 5 ? 2 : 1]++;
      assert.equal(new Set(targets).size, targets.length);
    }
    assert.deepEqual(bins, expected);
    assert.equal(recipients(lead, true, () => 0, situations[key]).length, 5);
  }
});
test("Krise erhöht externe Impulse, Quartalsendspurt fokussiert die Chefetage", () => {
  for (const profile of Object.values(situations)) {
    const counts = new Map();
    for (let i = 0; i < 100; i++) {
      const source = impulseSource(profile, () => (i + 0.5) / 100);
      counts.set(source, (counts.get(source) || 0) + 1);
    }
    assert.deepEqual(
      ["customer", "banker", 0, 1, 2].map((s) => counts.get(s)),
      profile.sources.map((p) => Math.round(p * 100)),
    );
  }
});
