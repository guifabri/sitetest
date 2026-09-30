const GROUPS = {
  cards: ".card",
  sections: ".section__head, .split__copy, .split__media, .acc"
};

const SELECTOR = Object.values(GROUPS).join(", ");

function stagger(nodes) {
  nodes.forEach((node, index) => node.style.setProperty("--i", index % 6));
}

export function initReveal() {
  const targets = [...document.querySelectorAll(SELECTOR)];
  if (!targets.length) return;

  stagger(targets);
  targets.forEach((node) => node.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    targets.forEach((node) => observer.observe(node));
    return;
  }

  targets.forEach((node) => node.classList.add("is-visible"));
}
