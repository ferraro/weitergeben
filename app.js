import { positions, levels, children, createState, totals } from "./engine.js";
const $ = (s) => document.querySelector(s);
let state = createState(),
  automatic = true,
  enabledSound = false,
  elapsed = 0,
  previous = performance.now(),
  clock = 0,
  queue = [];
const nodes = new Map(),
  sounds = {},
  activeAudio = new Set();
const colors = ["#304e46", "#637b67", "#a3ae83", "#e78961"];
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
  button.className = "monkey";
  button.style.left = `${n.x}%`;
  button.style.top = `${n.y}%`;
  button.dataset.id = n.id;
  button.setAttribute(
    "aria-label",
    `${levels[n.level]} ${n.index + 1}: ${n.level === 3 ? "reagieren" : "Druck weitergeben"}`,
  );
  button.innerHTML = `${art(n.level)}<span class="name">${["CHEFETAGE", "MANAGEMENT", "TEAMLEAD", "TEAM"][n.level]}</span><span class="count">0</span>`;
  button.addEventListener("click", () => strike(n));
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
$("#stats").innerHTML = levels
  .map(
    (label, i) =>
      `<div class="stat"><div class="stat-label"><span>${label}</span><strong id="stat-${i}">0</strong></div><div class="bar" style="--bar:${colors[i]}"><span id="bar-${i}"></span></div></div>`,
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
function strike(n) {
  if (n.level === 3) {
    say(n, "Wohin denn noch?");
    return;
  }
  animate(nodes.get(n.id), "swing");
  if (Math.random() < 0.3) say(n, phrases[n.level]);
  children(n).forEach((c, i) => schedule(260 + i * 90, () => receive(c)));
}
function receive(n) {
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
  if (n.level < 3) schedule(440, () => strike(n));
}
function render() {
  const sums = totals(state),
    max = Math.max(1, ...sums);
  $("#total").textContent = sums
    .reduce((a, b) => a + b, 0)
    .toLocaleString("de-DE");
  sums.forEach((n, i) => {
    $(`#stat-${i}`).textContent = n;
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
};
$("#sound").onclick = () => {
  enabledSound = !enabledSound;
  $("#sound").textContent = enabledSound ? "Ton an" : "Ton aus";
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
$("#reset").onclick = () => {
  state = createState();
  queue = [];
  elapsed = 0;
  activeAudio.forEach((a) => a.pause());
  activeAudio.clear();
  document.querySelectorAll(".bubble,.pop").forEach((el) => el.remove());
  nodes.forEach((el) => {
    el.classList.remove("hit", "swing");
    el.querySelector(".count").textContent = "0";
  });
  $(".bin").classList.remove("shred");
  $("#complaint-paper").classList.remove("flying");
  $("#report").disabled = false;
  $("#report-status").textContent = "Der Dienstweg ist offen. Theoretisch.";
  $("#quote").textContent = "„Wir geben das nur weiter.“";
  render();
};
function frame(now) {
  const delta = Math.min(now - previous, 100);
  previous = now;
  if (!document.hidden) {
    clock += delta;
    elapsed += delta;
    const ready = queue.filter((e) => e.at <= clock);
    queue = queue.filter((e) => e.at > clock);
    ready.forEach((e) => e.fn());
    if (automatic && elapsed >= Number($("#speed").value)) {
      elapsed = 0;
      const r = Math.random();
      const level = r < 0.65 ? 0 : r < 0.87 ? 1 : 2;
      const candidates = positions.filter((n) => n.level === level);
      strike(candidates[Math.floor(Math.random() * candidates.length)]);
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
