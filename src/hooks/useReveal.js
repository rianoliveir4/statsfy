import { useEffect, useRef } from "react";

/**
 * Fade-up de entrada (estilos em [data-reveal] no globals.css).
 * O que já está visível ao montar entra direto; o resto espera o scroll.
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.classList.add("in");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
