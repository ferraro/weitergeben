import test from "node:test";
import assert from "node:assert/strict";
import { positions, children, createState, totals } from "./engine.js";
test("Ein Impuls von oben trifft 2, 4 und 8 Untergebene, niemals die Spitze", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    children(n).forEach(hit);
  }
  children(positions[0]).forEach(hit);
  assert.deepEqual(totals(state), [0, 2, 4, 8]);
});
test("Mittleres Management reicht nur im eigenen Teilbaum weiter", () => {
  const state = createState();
  function hit(n) {
    state.hits[positions.indexOf(n)]++;
    children(n).forEach(hit);
  }
  children(positions[1]).forEach(hit);
  assert.deepEqual(totals(state), [0, 0, 2, 4]);
  assert.equal(state.hits[positions.findIndex((n) => n.id === "3-7")], 0);
});
test("Die unterste Ebene kann nichts weiterreichen; Reset beginnt leer", () => {
  positions
    .filter((n) => n.level === 3)
    .forEach((n) => assert.deepEqual(children(n), []));
  assert.deepEqual(totals(createState()), [0, 0, 0, 0]);
});
