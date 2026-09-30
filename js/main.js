import { initNav } from "./nav.js";
import { initAudio } from "./audio.js";
import { initAccordion } from "./accordion.js";
import { initGallery } from "./gallery.js";
import { initWeather } from "./weather.js";
import { initForm } from "./form.js";
import { initReveal } from "./reveal.js";

document.documentElement.classList.add("js");

document.getElementById("year").textContent = new Date().getFullYear();

initNav();
initAudio();
initAccordion();
initGallery();
initForm();
initReveal();
import("./config.local.js")
  .then(({ OPENWEATHER_API_KEY }) => initWeather(OPENWEATHER_API_KEY))
  .catch(() => initWeather(""));
