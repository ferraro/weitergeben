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
export let audioStarted = false;
export function unlockAudio() {
  audioStarted = true;
  const result = audioContext
    ? audioContext.resume()
    : Promise.reject(new Error("Audio nicht unterstützt"));
  document.dispatchEvent(new Event("audioactivated"));
  return result;
}
for (const event of ["pointerdown", "keydown", "click"]) {
  document.addEventListener(
    event,
    () => {
      if (audioStarted && audioContext?.state === "suspended") {
        audioContext.resume().catch(() => {});
      }
    },
    { capture: true },
  );
}
