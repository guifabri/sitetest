import { initNav } from "./nav.js";
import { initAudio } from "./audio.js";
import { initAccordion } from "./accordion.js";
import { initGallery } from "./gallery.js";
import { initWeather } from "./weather.js";
import { initForm } from "./form.js";
import { initReveal } from "./reveal.js";

async function loadKey() {
  try {
    const { OPENWEATHER_API_KEY } = await import("./config.local.js");
    return OPENWEATHER_API_KEY;
  } catch {
    return "";
  }
}

document.documentElement.classList.add("js");

document.getElementById("year").textContent = new Date().getFullYear();

initNav();
initAudio();
initAccordion();
initGallery();
initForm();
initReveal();
initWeather(await loadKey());
