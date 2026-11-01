// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (c) 2026 ferraro
import { audioContext, loadAudio, audioStarted } from "./audio.js";
export function createMusicPlayer(button, status, initialSituation) {
  const titles = {
    everyday: "Dienst nach Vorschrift",
    quarter: "Alle müssen liefern",
    crisis: "Die Kreditlinie",
  };
  let enabled = true,
    selected = initialSituation,
    revision = 0;
  const playing = new Set();
  function stopAll() {
    revision++;
    playing.forEach((track) => {
      track.source.stop();
      track.gain.disconnect();
    });
    playing.clear();
  }
  function describe() {
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = enabled ? "♫ Musik an" : "♫ Musik aus";
    if (!enabled) status.textContent = "Musik ausgeschaltet.";
    else if (!audioStarted)
      status.textContent = "Musik und Effekte starten mit dem Spiel.";
    else if (audioContext?.state !== "running")
      status.textContent =
        "Ton ist eingeschaltet. Falls noch nichts zu hören ist, einmal ins Spiel klicken.";
  }
  async function transition() {
    const attempt = ++revision;
    if (!audioStarted || !enabled || document.hidden || !audioContext) {
      stopAll();
      describe();
      return;
    }
    if (audioContext.state !== "running") {
      describe();
      return;
    }
    const key = selected;
    if ([...playing].some((t) => t.key === key && !t.retiring)) return;
    status.textContent = `Musik lädt: ${titles[key]} …`;
    try {
      const buffer = await loadAudio(`assets/music/${key}.mp3`);
      if (
        attempt !== revision ||
        !enabled ||
        document.hidden ||
        audioContext.state !== "running"
      )
        return;
      const now = audioContext.currentTime;
      for (const track of playing) {
        if (track.retiring) continue;
        track.retiring = true;
        track.gain.gain.cancelAndHoldAtTime(now);
        track.gain.gain.linearRampToValueAtTime(0, now + 1.4);
        track.source.stop(now + 1.4);
      }
      const source = audioContext.createBufferSource();
      const gain = audioContext.createGain();
      source.buffer = buffer;
      source.loop = true;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 1.4);
      source.connect(gain).connect(audioContext.destination);
      const track = { key, source, gain, retiring: false };
      playing.add(track);
      source.onended = () => {
        playing.delete(track);
        gain.disconnect();
      };
      source.start();
      status.textContent = `♫ ${titles[key]} · Suno`;
    } catch {
      if (attempt !== revision) return;
      status.textContent =
        "Musik konnte nicht geladen werden. Musik aus- und wieder einschalten, um erneut zu laden.";
    }
  }
  button.addEventListener("click", () => {
    enabled = !enabled;
    describe();
    if (enabled) transition();
    else stopAll();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAll();
    else if (enabled) transition();
  });
  audioContext?.addEventListener("statechange", () => {
    describe();
    if (audioContext.state === "running" && enabled) transition();
  });
  document.addEventListener("audioactivated", transition);
  describe();
  return {
    setSituation(key) {
      if (!(key in titles) || key === selected) return;
      selected = key;
      if (enabled) transition();
    },
  };
}
