// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 ferraro
// One browser-unlocked context serves both music and effects.
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
export const audioContext = AudioContextClass ? new AudioContextClass() : null;
const buffers = new Map();
export function loadAudio(url) {
  if (!buffers.has(url)) {
    const pending = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        return response.arrayBuffer();
      })
      .then((data) => audioContext.decodeAudioData(data))
      .catch((error) => {
        buffers.delete(url);
        throw error;
      });
    buffers.set(url, pending);
  }
  return buffers.get(url);
}
export function unlockAudio() {
  if (!audioContext)
    return Promise.reject(new Error("Audio nicht unterstützt"));
  return audioContext.resume();
}
const start = document.querySelector("#audio-start");
function updateGate() {
  start.hidden = audioContext?.state === "running";
  start.textContent = audioContext
    ? "▶ Ton starten"
    : "Audio nicht unterstützt";
  start.disabled = !audioContext;
}
start.addEventListener("click", () => unlockAudio().catch(updateGate));
for (const event of ["pointerdown", "keydown", "click"]) {
  document.addEventListener(
    event,
    () => {
      if (audioContext?.state === "suspended") unlockAudio().catch(updateGate);
    },
    { capture: true },
  );
}
audioContext?.addEventListener("statechange", updateGate);
updateGate();
// Browsers may allow this after a reload; otherwise the gate remains visible.
if (audioContext) unlockAudio().catch(updateGate);
