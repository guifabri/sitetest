export function initNav() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  if (!burger || !menu) return;

  const FOCUSABLE = "a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex='-1'])";

  const isOpen = () => burger.getAttribute("aria-expanded") === "true";

  const setOpen = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
    menu.classList.toggle("is-open", open);
  };

  const focusables = () => [...menu.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);

  burger.addEventListener("click", () => {
    const open = !isOpen();
    setOpen(open);
    if (open) focusables()[0]?.focus();
    else burger.focus();
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    burger.focus();
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !isOpen()) return;
    const items = focusables();
    if (!items.length) return;

    const first = items[0];
    const last = items.at(-1);
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  matchMedia("(min-width: 900px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}
