/* Progressive enhancement: gently reveal list items as they enter the viewport.
   The CV is fully readable without JavaScript; motion is the only addition. */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;
  if (!("IntersectionObserver" in window)) return;
  if (typeof Element.prototype.animate !== "function") return;

  const items = document.querySelectorAll("main section li");
  if (!items.length) return;

  const EASE = "cubic-bezier(.22,.61,.36,1)";
  const DURATION = 480;
  const STAGGER = 45;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        observer.unobserve(el);

        const step = Number(el.dataset.revealStep || 0);
        el.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          {
            duration: DURATION,
            delay: Math.min(step * STAGGER, 180),
            easing: EASE,
            fill: "both"
          }
        );
      }
    },
    { threshold: 0, rootMargin: "0px 0px 15% 0px" }
  );

  const viewportHeight = window.innerHeight;
  let step = 0;

  for (const el of items) {
    // Skip whatever is already on screen at load, so nothing flashes.
    if (el.getBoundingClientRect().top <= viewportHeight * 0.92) continue;

    el.dataset.revealStep = String(step % 4);
    observer.observe(el);
    step += 1;
  }
})();
