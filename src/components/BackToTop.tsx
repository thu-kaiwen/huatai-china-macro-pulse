import { useEffect, useState } from "react";

const visibilityThreshold = 480;

export function BackToTop() {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > visibilityThreshold);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!isVisible) {
    return null;
  }

  function returnToTop() {
    const reducedMotion = typeof window.matchMedia === "function"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      aria-label="回到顶部"
      className="back-to-top"
      onClick={returnToTop}
      type="button"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
