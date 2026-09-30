export function initAccordion() {
  const acc = document.querySelector(".acc");
  if (!acc) return;

  acc.addEventListener("click", (event) => {
    const trigger = event.target.closest(".acc__trigger");
    if (!trigger) return;

    const item = trigger.closest(".acc__item");
    const open = trigger.getAttribute("aria-expanded") === "true";

    trigger.setAttribute("aria-expanded", String(!open));
    item.classList.toggle("is-open", !open);
  });
}
