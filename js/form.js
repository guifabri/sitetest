const STORE_KEY = "fc:visitante";

const RULES = {
  nombre: {
    test: (value) => value.trim().length >= 2,
    message: "Escribe tu nombre."
  },
  email: {
    test: (value) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value),
    message: "Revisa el correo: falta el @ o el dominio."
  },
  telefono: {
    test: (value) => value.replace(/\D/g, "").length >= 8,
    message: "El telefono necesita al menos 8 digitos."
  }
};

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function initForm() {
  const form = document.getElementById("form");
  const notice = document.getElementById("form-notice");
  const clear = document.getElementById("clear-data");
  if (!form) return;

  const say = (text, kind) => {
    notice.textContent = text;
    notice.dataset.kind = kind;
    notice.hidden = false;
  };

  const errorFor = (name) => form.querySelector(`#${name}-err`);
  const inputFor = (name) => form.elements.namedItem(name);

  const setError = (name, message) => {
    const input = inputFor(name);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    errorFor(name).textContent = message;
  };

  form.addEventListener("input", (event) => {
    const name = event.target.name;
    if (name in RULES && inputFor(name).getAttribute("aria-invalid") === "true") {
      setError(name, RULES[name].test(event.target.value) ? "" : RULES[name].message);
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const failed = Object.keys(RULES)
      .map((name) => {
        const rule = RULES[name];
        const value = inputFor(name).value;
        const message = rule.test(value) ? "" : rule.message;
        setError(name, message);
        return message ? name : null;
      })
      .filter(Boolean);

    if (failed.length) {
      say("Revisa los campos marcados para continuar.", "info");
      inputFor(failed[0]).focus();
      return;
    }

    const data = Object.fromEntries(
      Object.keys(RULES).map((name) => [name, inputFor(name).value.trim()])
    );

    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
    } catch {
      say("No pudimos guardar tus datos en este navegador, pero la solicitud se envio.", "info");
      return;
    }

    say(`Gracias ${data.nombre.split(" ")[0]}, te contactamos para confirmar tu turno.`, "ok");
    restore();
  });

  function restore() {
    const saved = read();
    if (!saved) return;

    Object.keys(RULES).forEach((name) => {
      if (saved[name]) inputFor(name).value = saved[name];
    });

    clear.hidden = false;
  }

  clear?.addEventListener("click", () => {
    localStorage.removeItem(STORE_KEY);
    form.reset();
    Object.keys(RULES).forEach((name) => setError(name, ""));
    clear.hidden = true;
    notice.hidden = true;
    inputFor("nombre").focus();
  });

  restore();
}
