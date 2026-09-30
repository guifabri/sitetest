const CACHE_KEY = "fc:clima";
const CACHE_TTL = 30 * 60 * 1000;
const ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

const CITIES = [
  { name: "Ciudad de Mexico", lat: 19.4326, lon: -99.1332 },
  { name: "Guadalajara",      lat: 20.6738, lon: -103.344 },
  { name: "Monterrey",        lat: 25.6866, lon: -100.3161 },
  { name: "Buenos Aires",     lat: -34.6037, lon: -58.3816 },
  { name: "Madrid",           lat: 40.4168, lon: -3.7038 }
];

const ICONS = {
  sun:   '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
  cloud: '<path d="M7.2 18.5h9.6a3.9 3.9 0 0 0 .4-7.8 5.6 5.6 0 0 0-10.7-1.2 4.1 4.1 0 0 0 .7 9z"/>',
  rain:  '<path d="M7.2 15.5h9.6a3.9 3.9 0 0 0 .4-7.8 5.6 5.6 0 0 0-10.7-1.2 4.1 4.1 0 0 0 .7 9z"/><path d="M9.4 18.4l-.9 2.3M14.6 18.4l-.9 2.3"/>',
  storm: '<path d="M7.2 14.5h9.6a3.9 3.9 0 0 0 .4-7.8 5.6 5.6 0 0 0-10.7-1.2 4.1 4.1 0 0 0 .7 9z"/><path d="M13 16.2l-3.2 4.5h2.7l-1 3.2 3.5-4.9h-2.6z"/>',
  snow:  '<path d="M7.2 15.5h9.6a3.9 3.9 0 0 0 .4-7.8 5.6 5.6 0 0 0-10.7-1.2 4.1 4.1 0 0 0 .7 9z"/><path d="M8.6 19.2h.01M12 21.4h.01M15.4 19.2h.01" stroke-width="2.6"/>',
  fog:   '<path d="M7.2 14.5h9.6a3.9 3.9 0 0 0 .4-7.8 5.6 5.6 0 0 0-10.7-1.2 4.1 4.1 0 0 0 .7 9z"/><path d="M4.5 18h15M7 21.2h10"/>'
};

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.7",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

function iconName(code, isDay) {
  if (code >= 200 && code < 300) return "storm";
  if (code >= 300 && code < 600) return "rain";
  if (code >= 600 && code < 700) return "snow";
  if (code >= 700 && code < 800) return "fog";
  if (code === 800) return isDay ? "sun" : "cloud";
  return "cloud";
}

function svgFor(code, isDay) {
  const attrs = Object.entries(STROKE).map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<svg viewBox="0 0 24 24" ${attrs} aria-hidden="true" focusable="false">${ICONS[iconName(code, isDay)]}</svg>`;
}

function readCache() {
  try {
    const hit = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
    return hit && Date.now() - hit.ts < CACHE_TTL ? hit.data : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* sin cuota o modo privado: el clima simplemente no se cachea */
  }
}

function askBrowser() {
  if (!("geolocation" in navigator)) return Promise.reject(new Error("sin soporte"));
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 600000,
      enableHighAccuracy: false
    });
  });
}

async function requestWeather({ lat, lon }, key) {
  const url = `${ENDPOINT}?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeatherMap respondio ${res.status}`);
  const json = await res.json();
  const [info] = json.weather;
  return {
    temp: json.main.temp,
    code: info.id,
    isDay: info.icon.endsWith("d"),
    desc: info.description
  };
}

function createChip() {
  const root = document.getElementById("weather");
  const chip = {
    root,
    icon: root.querySelector(".weather__icon"),
    temp: root.querySelector(".weather__temp"),
    desc: root.querySelector(".weather__desc")
  };

  const show = (data) => {
    chip.picker?.remove();
    chip.root.querySelectorAll("[hidden]").forEach((node) => (node.hidden = false));
    chip.icon.innerHTML = svgFor(data.code, data.isDay);
    chip.temp.textContent = `${Math.round(data.temp)}°C`;
    chip.desc.textContent = data.desc;
  };

  const showPicker = (onPick) => {
    if (chip.picker) return;
    chip.root.querySelectorAll("span").forEach((node) => (node.hidden = true));

    const select = document.createElement("select");
    select.className = "weather__fallback";
    select.setAttribute("aria-label", "Elige una ciudad para ver el clima");
    select.append(new Option("Usar mi ciudad", ""));
    CITIES.forEach((c) => select.append(new Option(c.name, `${c.lat},${c.lon}`)));
    select.addEventListener("change", () => {
      const [lat, lon] = select.value.split(",").map(Number);
      if (!Number.isNaN(lat)) onPick({ lat, lon });
    });

    chip.root.append(select);
    chip.picker = select;
  };

  return { ...chip, show, showPicker };
}

export async function initWeather(key) {
  const root = document.getElementById("weather");
  if (!root) return;

  const chip = createChip();
  const reveal = () => chip.root.classList.add("is-ready");

  const load = async (coords) => {
    try {
      const data = await requestWeather(coords, key);
      writeCache(data);
      chip.show(data);
    } catch {
      chip.showPicker(load);
    }
    reveal();
  };

  const cached = readCache();
  if (cached) {
    chip.show(cached);
    reveal();
    return;
  }

  if (!key) {
    chip.showPicker(load);
    reveal();
    return;
  }

  try {
    const pos = await askBrowser();
    await load({ lat: pos.coords.latitude, lon: pos.coords.longitude });
  } catch {
    chip.showPicker(load);
    reveal();
  }
}
