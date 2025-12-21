import { useEffect, useState } from "react";

/**
 * Hook care calculează înălțimea header-ului în funcție de scrollY
 * Header-ul se micșorează când scrollY > 20 (py-3 md:py-4 -> py-2)
 * Măsurăm efectiv înălțimea din DOM pentru precizie maximă
 */
export function useHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState(73); // Valoare default aproximativă

  useEffect(() => {
    const calculateHeaderHeight = () => {
      // Căutăm elementul header în DOM
      const headerElement = document.querySelector("header[class*='fixed']");
      
      if (headerElement) {
        // Măsurăm efectiv înălțimea header-ului
        const height = headerElement.getBoundingClientRect().height;
        setHeaderHeight(height);
      } else {
        // Fallback: estimare bazată pe scroll și screen size
        const isScrolled = window.scrollY > 20;
        const isMobile = window.innerWidth < 768;
        const isMedium = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Înălțimea aproximativă a conținutului header-ului (logo + nav)
        const contentHeight = isMobile ? 40 : 50;
        
        // Padding-ul se schimbă în funcție de scroll
        const padding = isScrolled 
          ? 16 // py-2 = 0.5rem * 2 = 16px
          : isMedium 
            ? 24 // py-3 = 0.75rem * 2 = 24px pe tablet
            : 32; // py-4 = 1rem * 2 = 32px pe desktop
        
        // Border bottom = 1px
        const borderHeight = 1;
        
        const totalHeight = contentHeight + padding + borderHeight;
        setHeaderHeight(totalHeight);
      }
    };

    // Calculăm imediat după ce DOM-ul este gata
    const timeoutId = setTimeout(calculateHeaderHeight, 0);

    // Ascultăm evenimentele de scroll și resize
    window.addEventListener("scroll", calculateHeaderHeight, { passive: true });
    window.addEventListener("resize", calculateHeaderHeight);

    // Folosim MutationObserver pentru a detecta schimbări în clasele header-ului
    const headerElement = document.querySelector("header[class*='fixed']");
    let observer: MutationObserver | null = null;

    if (headerElement) {
      observer = new MutationObserver(calculateHeaderHeight);
      observer.observe(headerElement, {
        attributes: true,
        attributeFilter: ["class"],
        childList: false,
        subtree: false,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", calculateHeaderHeight);
      window.removeEventListener("resize", calculateHeaderHeight);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return headerHeight;
}

