export function initGallery() {
  const grid = document.querySelector(".gallery");
  const dialog = document.getElementById("lightbox");
  if (!grid || !dialog) return;

  const image = dialog.querySelector(".lightbox__img");
  const caption = dialog.querySelector(".lightbox__caption");

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".gallery__btn");
    if (!trigger) return;

    image.src = trigger.dataset.full;
    image.alt = trigger.dataset.alt;
    caption.textContent = trigger.dataset.caption;
    dialog.showModal();
  });

  dialog.addEventListener("click", (event) => {
    const outside = event.target === dialog;
    if (outside || event.target.closest(".lightbox__close")) dialog.close();
  });
}
