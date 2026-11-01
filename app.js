// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 ferraro
import { createMusicPlayer } from "./music.js";
import {
  positions,
  levels,
  children,
  recipients,
  createState,
  totals,
  averages,
  situations,
  impulseSource,
} from "./engine.js";
const $ = (s) => document.querySelector(s);
let state = createState(),
  automatic = true,
  enabledSound = true,
  elapsed = 0,
  previous = performance.now(),
  clock = 0,
  queue = [];
let situation = situations[$("#speed").value];
const music = createMusicPlayer(
  $("#music"),
  $("#music-status"),
  $("#speed").value,
);
const nodes = new Map(),
  sounds = {},
  activeAudio = new Set();
const colors = [
  "#304e46",
  "#637b67",
  "#a3ae83",
  "#e78961",
  "#6885a8",
  "#30353f",
];
const phrases = [
  "„Wir müssen effizienter werden.“",
  "„Das kommt von ganz oben.“",
  "„Ich gebe das nur weiter.“",
  "„Wir sind doch eine Familie.“",
];
function art(level) {
  return `<svg viewBox="0 0 110 110" aria-hidden="true"><ellipse cx="55" cy="101" rx="31" ry="5" fill="#7e8d6b" opacity=".2"/><path d="M38 82v16h12V86m10-4v16h12V85" fill="#39433c" stroke="#29382f" stroke-width="3"/><path d="M35 62q20-10 40 0l7 27H28z" fill="${colors[level]}" stroke="#344737" stroke-width="2"/><path d="m46 60 9 23 10-23" fill="#f7efdc"/><path d="m55 64-4 7 4 12 4-12z" fill="#d8603c"/><path d="M34 69 23 82" stroke="#795838" stroke-width="10" stroke-linecap="round"/><g class="mallet"><path d="M75 69 89 53" stroke="#795838" stroke-width="10" stroke-linecap="round"/><path d="m85 60 12-35" stroke="#aa8050" stroke-width="7" stroke-linecap="round"/><rect x="82" y="14" width="28" height="19" rx="9" fill="#c79358" stroke="#72583b" stroke-width="2"/><path d="m88 19 16 4" stroke="#e7ba7a" stroke-width="3" stroke-linecap="round"/></g><circle cx="27" cy="39" r="12" fill="#805c3e"/><circle cx="83" cy="39" r="12" fill="#805c3e"/><circle cx="27" cy="39" r="7" fill="#d8ac7b"/><circle cx="83" cy="39" r="7" fill="#d8ac7b"/><path d="M27 38C26 5 83 4 83 38v10c0 30-56 30-56 0z" fill="#805c3e" stroke="#5b4633" stroke-width="2"/><path d="M34 36c-1-14 15-16 21-7 7-9 22-7 22 7v14c0 23-43 23-43 0z" fill="#e6be8c"/><ellipse cx="55" cy="53" rx="17" ry="12" fill="#efcfa0"/><ellipse cx="44" cy="38" rx="3" ry="4" fill="#2c352b"/><ellipse cx="66" cy="38" rx="3" ry="4" fill="#2c352b"/><path d="M51 48h8M45 58q10 ${level === 3 ? "-6" : "7"} 20 0" fill="none" stroke="#6f5137" stroke-width="2.5" stroke-linecap="round"/>${level === 0 ? '<path d="m32 24 1-14 10 5L54 3l10 12 13-5 1 15" fill="#e5b852" stroke="#9a773b" stroke-width="2"/>' : ""}${level === 2 ? '<path d="M33 34h20v13H33zm24 0h20v13H57zm-4 5h4" fill="none" stroke="#344737" stroke-width="2"/>' : ""}</svg>`;
}
positions.forEach((n) => {
  const button = document.createElement("button");
  button.className = n.level === 3 ? "monkey team-member" : "monkey";
  button.style.left = `${n.x}%`;
  button.style.top = `${n.y}%`;
  button.dataset.id = n.id;
  button.setAttribute(
    "aria-label",
    `${n.level === 3 ? `Team ${Math.floor(n.index / 5) + 1}, Mitglied ${(n.index % 5) + 1}` : `${levels[n.level]} ${n.index + 1}`}: ${n.level === 3 ? "reagieren" : "Druck weitergeben"}`,
  );
  button.innerHTML = `${art(n.level)}<span class="name">${["CHEFETAGE", "MANAGEMENT", "TEAMLEAD", "TEAM"][n.level]}</span><span class="count">0</span>`;
  button.addEventListener("click", () => strike(n, true));
  $("#stage").append(button);
  nodes.set(n.id, button);
  children(n).forEach((c) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", n.x * 8);
    line.setAttribute("y1", (n.y / 100) * 580 + 91);
    line.setAttribute("x2", c.x * 8);
    line.setAttribute("y2", (c.y / 100) * 580 + 22);
    $("#connections").append(line);
  });
});
const customer = document.createElement("button");
customer.id = "customer";
customer.className = "monkey customer";
customer.setAttribute("aria-label", "Kunde: zufälligen Ansprechpartner bonken");
customer.innerHTML = `${art(4)}<span class="name">KUNDE ↗</span><span class="customer-hint">Klicken: Druck machen</span>`;
$("#stage").append(customer);
const customerPhrases = [
  "Das hatten Sie uns zugesagt!",
  "Wir brauchen das noch heute.",
  "Ist doch nur eine kleine Änderung.",
];
const banker = document.createElement("button");
banker.id = "banker";
banker.className = "monkey banker";
banker.setAttribute("aria-label", "Banker: nur den Chef bonken");
const bankerArt = art(5).replace(
  "</svg>",
  `<path d="M33 22h45M39 21V2h32v19" fill="#252a32" stroke="#151a21" stroke-width="4" stroke-linecap="round"/><path d="M40 15h30" stroke="#b79852" stroke-width="4"/><circle cx="66" cy="38" r="10" fill="#d8e8ee" fill-opacity=".2" stroke="#d5af54" stroke-width="2.5"/><path d="M76 38q12 26-7 37" fill="none" stroke="#d5af54" stroke-width="1.5"/><path d="m47 66 8 4-8 4zm16 0-8 4 8 4z" fill="#252a32"/><path d="M41 82q10 12 22 0" fill="none" stroke="#d5af54" stroke-width="1.5"/></svg>`,
);
banker.innerHTML = `${bankerArt}<span class="name">BANKER ↙</span><span class="customer-hint">Nur zur Chefetage</span>`;
$("#stage").append(banker);
const bankerPhrases = [
  "Die Kreditlinie läuft aus!",
  "Wir erwarten mehr Rendite!",
  "Die Sicherheiten reichen nicht!",
];
banker.addEventListener("click", bankerStrike);
function bankerStrike() {
  externalStrike(banker, positions[0], "Banker", bankerPhrases);
}
customer.addEventListener("click", customerStrike);
function customerStrike() {
  if (customer.disabled) return;
  const target = positions[Math.floor(Math.random() * positions.length)];
  externalStrike(customer, target, "Kunde", customerPhrases);
}
function externalStrike(actor, target, label, phrases) {
  if (actor.disabled) return;
  actor.disabled = true;
  animate(actor, "swing");
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  $("#customer-status").textContent =
    `${label}: „${phrase}“ → ${target.level === 3 ? `Team ${Math.floor(target.index / 5) + 1}, Mitglied ${(target.index % 5) + 1}` : levels[target.level]}`;
  const stageRect = $("#stage").getBoundingClientRect();
  const from = actor.getBoundingClientRect();
  const to = nodes.get(target.id).getBoundingClientRect();
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.classList.add("customer-pressure");
  if (actor === banker) line.classList.add("banker-pressure");
  line.setAttribute(
    "x1",
    ((from.left + from.width / 2 - stageRect.left) / stageRect.width) * 800,
  );
  line.setAttribute(
    "y1",
    ((from.top + 40 - stageRect.top) / stageRect.height) * 580,
  );
  line.setAttribute(
    "x2",
    ((to.left + to.width / 2 - stageRect.left) / stageRect.width) * 800,
  );
  line.setAttribute(
    "y2",
    ((to.top + to.height / 2 - stageRect.top) / stageRect.height) * 580,
  );
  $("#connections").append(line);
  schedule(300, () => receive(target));
  schedule(1000, () => {
    line.remove();
    actor.disabled = false;
  });
}
$("#stats").innerHTML = levels
  .map(
    (label, i) =>
      `<div class="stat"><div class="stat-label"><span>${label}</span><strong id="stat-${i}">0,00</strong></div><div class="bar" style="--bar:${colors[i]}"><span id="bar-${i}"></span></div></div>`,
  )
  .join("");
for (const name of ["bonk", "complaint", "shredder"]) {
  sounds[name] = new Audio(`assets/audio/${name}.mp3`);
  sounds[name].preload = "auto";
}
function sound(name) {
  if (!enabledSound || activeAudio.size >= 10) return;
  const audio = sounds[name].cloneNode();
  audio.volume = name === "bonk" ? 0.24 : 0.4;
  activeAudio.add(audio);
  audio.onended = () => activeAudio.delete(audio);
  audio.play().catch(() => activeAudio.delete(audio));
}
function schedule(delay, fn) {
  queue.push({ at: clock + delay, fn });
}
function animate(el, name, duration = 450) {
  el.classList.remove(name);
  void el.offsetWidth;
  el.classList.add(name);
  schedule(duration, () => el.classList.remove(name));
}
function say(n, text) {
  const el = nodes.get(n.id);
  el.querySelector(".bubble")?.remove();
  const b = document.createElement("span");
  b.className = "bubble";
  b.textContent = text;
  el.append(b);
  schedule(1700, () => b.remove());
}
function strike(n, broadcast = false) {
  if (n.level === 3) {
    say(n, "Wohin denn noch?");
    return;
  }
  animate(nodes.get(n.id), "swing");
  if (Math.random() < 0.3) say(n, phrases[n.level]);
  recipients(n, broadcast, Math.random, situation).forEach((c, i) =>
    schedule(260 + i * 150, () => receive(c, broadcast)),
  );
}
function receive(n, broadcast = false) {
  const idx = positions.indexOf(n);
  state.hits[idx]++;
  const el = nodes.get(n.id);
  el.querySelector(".count").textContent = state.hits[idx];
  animate(el, "hit");
  const pop = document.createElement("span");
  pop.className = "pop";
  pop.textContent = "BONK!";
  el.append(pop);
  schedule(800, () => pop.remove());
  sound("bonk");
  render();
  if (n.level < 3) schedule(440, () => strike(n, broadcast));
}
function render() {
  const sums = totals(state);
  const perPerson = averages(state);
  const max = Math.max(...perPerson) || 1;
  $("#total").textContent = sums
    .reduce((a, b) => a + b, 0)
    .toLocaleString("de-DE");
  perPerson.forEach((n, i) => {
    $(`#stat-${i}`).textContent = n.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    $(`#bar-${i}`).style.width = `${(n / max) * 100}%`;
  });
}
$("#auto").onclick = () => {
  automatic = !automatic;
  $("#auto").setAttribute("aria-pressed", automatic);
  $("#auto").textContent = automatic
    ? "Ⅱ Automatik pausieren"
    : "▶ Automatik starten";
  $("#mode-label").textContent = automatic
    ? "DER BETRIEB LÄUFT"
    : "AUTOMATIK PAUSIERT";
  $("#status-dot").style.background = automatic ? "#628167" : "#d59350";
  elapsed = 0;
  describeSituation();
};
$("#sound").onclick = () => {
  enabledSound = !enabledSound;
  $("#sound").textContent = enabledSound ? "Effekte an" : "Effekte aus";
  $("#sound").setAttribute("aria-pressed", enabledSound);
  if (enabledSound) sound("bonk");
  else {
    activeAudio.forEach((a) => a.pause());
    activeAudio.clear();
  }
};
$("#report").onclick = () => {
  state.reports++;
  $("#report").disabled = true;
  $("#complaint-paper").classList.add("flying");
  $("#report-status").textContent = "Deine Beschwerde nimmt den Dienstweg …";
  sound("complaint");
  schedule(1500, () => {
    $("#complaint-paper").classList.remove("flying");
    animate($(".bin"), "shred");
    sound("shredder");
    $("#report-status").textContent =
      `${state.reports} ${state.reports === 1 ? "Beschwerde wurde" : "Beschwerden wurden"} ordnungsgemäß abgelegt. In Ablage P.`;
    $("#quote").textContent = "„Danke für dein wertvolles Feedback.“";
    $("#report").disabled = false;
  });
};
function clearActivity() {
  queue = [];
  elapsed = 0;
  activeAudio.forEach((a) => a.pause());
  activeAudio.clear();
  document.querySelectorAll(".bubble,.pop").forEach((el) => el.remove());
  nodes.forEach((el) => {
    el.classList.remove("hit", "swing");
    el.querySelector(".count").textContent =
      state.hits[positions.findIndex((n) => nodes.get(n.id) === el)];
  });
  customer.disabled = false;
  customer.classList.remove("swing");
  banker.disabled = false;
  banker.classList.remove("swing");
  document.querySelectorAll(".customer-pressure").forEach((el) => el.remove());
  $("#customer-status").textContent =
    "Druck von außen: Kunde → alle. Banker → nur Chef.";
  $(".bin").classList.remove("shred");
  $("#complaint-paper").classList.remove("flying");
  $("#report").disabled = false;
  $("#report-status").textContent = "Der Dienstweg ist offen. Theoretisch.";
  $("#quote").textContent = "„Wir geben das nur weiter.“";
  render();
}
$("#reset").onclick = () => {
  state = createState();
  clearActivity();
};
function automaticImpulse() {
  const source = impulseSource(situation);
  if (source === "customer") customerStrike();
  else if (source === "banker") bankerStrike();
  else {
    const candidates = positions.filter((n) => n.level === source);
    strike(candidates[Math.floor(Math.random() * candidates.length)]);
  }
}
function describeSituation() {
  $("#situation-status").textContent =
    `${situation.label}: ${situation.description}${automatic ? "" : " Automatik pausiert – Start zum Beobachten."}`;
  $(".workspace").dataset.situation = $("#speed").value;
}
$("#speed").addEventListener("change", () => {
  situation = situations[$("#speed").value];
  music.setSituation($("#speed").value);
  clearActivity();
  describeSituation();
  if (!automatic) return;
  // A deliberate introductory impulse makes the selected scenario visible.
  if ($("#speed").value === "quarter") {
    const leads = positions.filter((n) => n.level === 2);
    const lead = leads[Math.floor(Math.random() * leads.length)];
    strike(lead, true);
    say(lead, "Wir müssen alle liefern!");
  } else if ($("#speed").value === "crisis") {
    bankerStrike();
    customerStrike();
  } else {
    const lead = positions.find((n) => n.level === 2);
    animate(nodes.get(lead.id), "swing");
    schedule(260, () => receive(children(lead)[Math.floor(Math.random() * 5)]));
    say(lead, "Nur eine kleine Aufgabe.");
  }
});
describeSituation();
function frame(now) {
  const delta = Math.min(now - previous, 100);
  previous = now;
  if (!document.hidden) {
    clock += delta;
    elapsed += delta;
    const ready = queue.filter((e) => e.at <= clock);
    queue = queue.filter((e) => e.at > clock);
    ready.forEach((e) => e.fn());
    if (automatic && elapsed >= situation.interval) {
      elapsed = 0;
      automaticImpulse();
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
