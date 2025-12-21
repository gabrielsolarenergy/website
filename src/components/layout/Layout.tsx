import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieConsent } from "@/components/common/CookieConsent";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Auto-focus main content on route change
  useEffect(() => {
    // Scroll to top and focus main content
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main 
        ref={mainRef}
        className="flex-1" 
        id="main-content"
        tabIndex={-1}
        aria-label="Conținut principal"
      >
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
