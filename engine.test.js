import test from "node:test";
import assert from "node:assert/strict";
import { positions, children, createState, totals } from "./engine.js";
test("Ein Impuls von oben trifft 2, 4 und 20 Untergebene, niemals die Spitze", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    children(n).forEach(hit);
  }
  children(positions[0]).forEach(hit);
  assert.deepEqual(totals(state), [0, 2, 4, 20]);
});
test("Mittleres Management reicht nur im eigenen Teilbaum weiter", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    children(n).forEach(hit);
  }
  children(positions[1]).forEach(hit);
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
