import { useState, useEffect } from "react";
import { X, Cookie, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        // If parsing fails, use defaults
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    setShowBanner(false);
    // Initialize analytics/marketing if needed
    initializeServices(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryOnly);
    localStorage.setItem("cookie-consent", JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    initializeServices(preferences);
  };

  const initializeServices = (prefs: typeof preferences) => {
    // Initialize analytics if accepted
    if (prefs.analytics) {
      // Add your analytics initialization here (e.g., Google Analytics)
      console.log("Analytics initialized");
    }
    // Initialize marketing if accepted
    if (prefs.marketing) {
      // Add your marketing tools initialization here
      console.log("Marketing tools initialized");
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner - Responsive și cu spacing pentru widget-uri */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] p-2 sm:p-4 md:p-6 pb-24 sm:pb-24 md:pb-6 animate-in slide-in-from-bottom duration-300">
        <div className="container mx-auto max-w-4xl px-2 sm:px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 p-4 sm:p-6 md:p-8 relative">
            <button
              onClick={handleAcceptNecessary}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Închide"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 pr-6 sm:pr-0">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1a4925]/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a4925]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">
                  Folosim cookie-uri pentru a îmbunătăți experiența ta
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Utilizăm cookie-uri esențiale pentru funcționarea site-ului și
                  cookie-uri opționale pentru analiză și marketing. Poți alege ce
                  tipuri de cookie-uri accepti.
                </p>
                <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="bg-[#1a4925] hover:bg-[#143d1f] text-white text-xs sm:text-sm w-full xs:w-auto"
                    size="sm"
                  >
                    Acceptă toate
                  </Button>
                  <Button
                    onClick={handleAcceptNecessary}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-xs sm:text-sm w-full xs:w-auto"
                  >
                    Doar necesare
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSettings(true);
                      setShowBanner(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 text-xs sm:text-sm w-full xs:w-auto"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Personalizează
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="w-5 h-5" />
              Setări Cookie-uri
            </DialogTitle>
            <DialogDescription>
              Personalizează preferințele tale privind cookie-urile. Poți activa
              sau dezactiva diferite tipuri de cookie-uri.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Cookie-uri necesare
                </h4>
                <p className="text-sm text-gray-600">
                  Aceste cookie-uri sunt esențiale pentru funcționarea site-ului
                  și nu pot fi dezactivate.
                </p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-6 rounded-full bg-[#1a4925] flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Cookie-uri de analiză
                </h4>
                <p className="text-sm text-gray-600">
                  Ne ajută să înțelegem cum interacționezi cu site-ul pentru a
                  îmbunătăți experiența.
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() =>
                    setPreferences({ ...preferences, analytics: !preferences.analytics })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.analytics ? "bg-[#1a4925]" : "bg-gray-300"
                  }`}
                  aria-label="Toggle analytics cookies"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.analytics ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-gray-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Cookie-uri de marketing
                </h4>
                <p className="text-sm text-gray-600">
                  Folosite pentru a personaliza conținutul și reclamă în funcție
                  de interesele tale.
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() =>
                    setPreferences({
                      ...preferences,
                      marketing: !preferences.marketing,
                    })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.marketing ? "bg-[#1a4925]" : "bg-gray-300"
                  }`}
                  aria-label="Toggle marketing cookies"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      preferences.marketing ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowSettings(false);
                setShowBanner(true);
              }}
            >
              Anulează
            </Button>
            <Button onClick={handleSavePreferences} className="bg-[#1a4925] hover:bg-[#143d1f]">
              Salvează preferințele
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

