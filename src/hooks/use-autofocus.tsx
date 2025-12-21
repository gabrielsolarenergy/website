import { useEffect, useRef } from "react";

/**
 * Hook pentru autofocus la schimbarea paginii sau la trigger manual
 */
export function useAutofocus<T extends HTMLElement = HTMLElement>(
  dependencies: unknown[] = [],
  delay: number = 0
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
        // Scroll element into view if needed
        ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, dependencies);

  return ref;
}

