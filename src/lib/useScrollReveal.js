import { useEffect, useRef } from 'react';

/**
 * Custom hook that uses IntersectionObserver to add a `.revealed` class
 * to an element when it enters the viewport, triggering CSS animations.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1). Default 0.15
 * @param {string} options.rootMargin - Observer root margin. Default '0px 0px -40px 0px'
 * @param {boolean} options.once - Only reveal once (don't re-hide). Default true
 * @returns {React.RefObject}
 */
export default function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (!motionOk) {
      el.classList.add('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('revealed');
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}
