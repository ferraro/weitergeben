// Local Suno tracks. Nothing plays or downloads until the user enables music.
export function createMusicPlayer(button, status, initialSituation) {
  const titles = {
    everyday: "Dienst nach Vorschrift",
    quarter: "Alle müssen liefern",
    crisis: "Die Kreditlinie",
  };
  const tracks = new Map();
  let enabled = false,
    selected = initialSituation,
    revision = 0,
    frame;
  const volume = 0.2;
  function trackFor(key) {
    if (!tracks.has(key)) {
      const audio = document.createElement("audio");
      audio.src = `assets/music/${key}.mp3`;
      audio.preload = "none";
      audio.loop = true;
      audio.volume = 0;
      audio.dataset.music = key;
      document.body.append(audio);
      tracks.set(key, audio);
    }
    return tracks.get(key);
  }
  function pauseAll() {
    revision++;
    cancelAnimationFrame(frame);
    tracks.forEach((audio) => {
      audio.pause();
      audio.volume = 0;
    });
  }
  function updateButton() {
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = enabled ? "♫ Musik an" : "♫ Musik aus";
  }
  async function transition() {
    const attempt = ++revision;
    cancelAnimationFrame(frame);
    if (!enabled || document.hidden) {
      pauseAll();
      return;
    }
    const key = selected;
    const next = trackFor(key);
    status.textContent = `Musik lädt: ${titles[key]} …`;
    try {
      await next.play();
      if (attempt !== revision) {
        if (!enabled || document.hidden || selected !== key) next.pause();
        return;
      }
      status.textContent = `♫ ${titles[key]} · Suno`;
      const start = performance.now();
      const from = new Map(
        [...tracks].map(([name, audio]) => [name, audio.volume]),
      );
      function fade(now) {
        if (attempt !== revision) return;
        const progress = Math.min(1, (now - start) / 1400);
        tracks.forEach((audio, name) => {
          const target = name === key ? volume : 0;
          audio.volume = from.get(name) + (target - from.get(name)) * progress;
          if (progress === 1 && name !== key) {
            audio.pause();
            audio.currentTime = 0;
          }
        });
        if (progress < 1) frame = requestAnimationFrame(fade);
      }
      frame = requestAnimationFrame(fade);
    } catch {
      if (attempt !== revision) return;
      enabled = false;
      pauseAll();
      updateButton();
      status.textContent =
        "Musik konnte nicht starten. Mit „Musik aus“ erneut versuchen.";
    }
  }
  button.addEventListener("click", () => {
    enabled = !enabled;
    updateButton();
    if (enabled) transition();
    else {
      pauseAll();
      status.textContent = "Musik ausgeschaltet.";
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseAll();
    else if (enabled) transition();
  });
  return {
    setSituation(key) {
      if (!(key in titles) || key === selected) return;
      selected = key;
      if (enabled) transition();
    },
  };
}
