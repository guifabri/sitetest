import { initNav } from "./nav.js";
import { initAudio } from "./audio.js";
import { initAccordion } from "./accordion.js";
import { initGallery } from "./gallery.js";
import { initWeather } from "./weather.js";
import { initForm } from "./form.js";
import { initReveal } from "./reveal.js";

document.documentElement.classList.add("js");

document.getElementById("year").textContent = new Date().getFullYear();

async function loadWeatherConfig() {
  try {
    const url = new URL("./config.local.js", import.meta.url);
    const response = await fetch(url, { method: "HEAD" });

    if (response.ok) {
      const { OPENWEATHER_API_KEY } = await import("./config.local.js");
      return OPENWEATHER_API_KEY;
    }
  } catch {
    // Si no existe la config local, usamos la version de repositorio.
  }

  const { OPENWEATHER_API_KEY } = await import("./config.js");
  return OPENWEATHER_API_KEY;
}

initNav();
initAudio();
initAccordion();
initGallery();
initForm();
initReveal();
loadWeatherConfig()
  .then((key) => initWeather(key || ""))
  .catch(() => initWeather(""));
