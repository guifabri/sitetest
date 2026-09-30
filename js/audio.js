export function initAudio() {
  const button = document.getElementById("audio-btn");
  const audio = document.getElementById("bgm");
  const volume = document.getElementById("volume");
  if (!button || !audio) return;

  const applyVolume = () => {
    audio.volume = Number(volume?.value ?? 100) / 100;
  };

  const unavailable = () => {
    button.hidden = true;
    if (volume) volume.closest(".volume")?.remove();
  };

  applyVolume();
  volume?.addEventListener("input", applyVolume);

  const playAudio = async () => {
    try {
      await audio.play();
    } catch (error) {
      if (error.name !== "NotAllowedError") unavailable();
    }
  };

  playAudio();

  button.addEventListener("click", async () => {
    if (button.getAttribute("aria-pressed") === "true") {
      audio.pause();
      return;
    }
    await playAudio();
  });

  audio.addEventListener("play", () => button.setAttribute("aria-pressed", "true"));
  audio.addEventListener("pause", () => button.setAttribute("aria-pressed", "false"));
  audio.addEventListener("error", unavailable);
}
