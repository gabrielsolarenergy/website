import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Home,
  Building2,
  Factory,
  Zap,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useHeaderHeight } from "@/hooks/use-header-height";
import { useAuth } from "@/contexts/AuthContext";
import residentialImage from "@/assets/residential-solar.jpg";

const systems = [
  {
    id: "starter",
    name: "Starter Home",
    type: "Rezidențial",
    power: "4 kW",
    production: "400-500 kWh/lună",
    suitable: "Case mici, 1-2 dormitoare",
    priceRange: "8.000€ - 12.000€",
    features: [
      "10 panouri solare",
      "Invertor string",
      "Garanție 25 ani",
      "Monitorizare mobilă",
    ],
    popular: false,
  },
  {
    id: "family",
    name: "Family Home",
    type: "Rezidențial",
    power: "8 kW",
    production: "800-1.000 kWh/lună",
    suitable: "Case medii, 3-4 dormitoare",
    priceRange: "16.000€ - 22.000€",
    features: [
      "20 panouri solare",
      "Micro-invertoare",
      "Garanție 25 ani",
      "Pregătit pentru baterie",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Estate",
    type: "Rezidențial",
    power: "12 kW",
    production: "1.200-1.500 kWh/lună",
    suitable: "Case mari, 5+ dormitoare",
    priceRange: "24.000€ - 32.000€",
    features: [
      "30 panouri solare",
      "Micro-invertoare",
      "Stocare baterii",
      "Suport premium",
    ],
    popular: false,
  },
  {
    id: "small-business",
    name: "Small Business",
    type: "Comercial",
    power: "50 kW",
    production: "5.000-6.500 kWh/lună",
    suitable: "Birouri, magazine retail",
    priceRange: "80.000€ - 120.000€",
    features: [
      "120 panouri solare",
      "Invertoare comerciale",
      "Monitorizare energie",
      "Mentenanță",
    ],
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    type: "Comercial",
    power: "200 kW",
    production: "20.000-26.000 kWh/lună",
    suitable: "Birouri mari, centre comerciale",
    priceRange: "280.000€ - 400.000€",
    features: [
      "500 panouri solare",
      "Invertor centralizat",
      "Peak shaving",
      "Suport dedicat",
    ],
    popular: true,
  },
  {
    id: "industrial",
    name: "Industrial Scale",
    type: "Industrial",
    power: "1 MW+",
    production: "100.000+ kWh/lună",
    suitable: "Fabrici, depozite",
    priceRange: "Ofertă personalizată",
    features: [
      "1.000+ panouri",
      "Proiectare custom",
      "Export în rețea",
      "Monitorizare 24/7",
    ],
    popular: false,
  },
];

const comparisonData = [
  {
    feature: "Dimensiunea sistemului",
    residential: "4-12 kW",
    commercial: "50-500 kW",
    industrial: "1 MW+",
  },
  {
    feature: "Număr de panouri",
    residential: "10-30",
    commercial: "120-1.200",
    industrial: "1.000+",
  },
  {
    feature: "Timp de instalare",
    residential: "1-2 zile",
    commercial: "1-2 săptămâni",
    industrial: "1-3 luni",
  },
  {
    feature: "Garanție",
    residential: "25 ani",
    commercial: "25 ani",
    industrial: "25 ani",
  },
  {
    feature: "Perioada amortizare",
    residential: "5-7 ani",
    commercial: "4-6 ani",
    industrial: "3-5 ani",
  },
];

const faqs = [
  {
    question: "Cât durează panourile solare?",
    answer:
      "Panourile solare moderne durează 25-30 de ani sau mai mult, cu o eficiență de peste 80% garantată.",
  },
  {
    question: "Ce se întâmplă în zilele noroase?",
    answer:
      "Panourile produc energie și când e nor, dar la o capacitate mai mică (10-25%).",
  },
  {
    question: "De cât spațiu pe acoperiș am nevoie?",
    answer: "Un sistem rezidențial mediu are nevoie de aproximativ 20-40 mp.",
  },
];

const typeIcons = {
  Rezidențial: Home,
  Comercial: Building2,
  Industrial: Factory,
};

export default function Systems() {
  const [filter, setFilter] = useState<string>("Toate");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const headerHeight = useHeaderHeight();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const filterSectionRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (type: string) => {
    setFilter(type);
    if (filterSectionRef.current) {
      window.scrollTo({
        top: filterSectionRef.current.offsetTop - headerHeight,
        behavior: "smooth",
      });
    }
  };

  const handleOfferRedirect = () => {
    if (isAuthenticated) {
      window.location.href = "http://localhost:8081/dashboard";
    } else {
      navigate("/auth?mode=login&returnTo=dashboard");
    }
  };

  const filteredSystems =
    filter === "Toate" ? systems : systems.filter((s) => s.type === filter);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={residentialImage}
            alt="Sisteme Solare Gabriel"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32">
          <div className="max-w-4xl mx-auto md:mx-0">
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <Zap className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium">
                Soluții solare premium pentru orice nevoie
              </span>
            </div>

            <h1 className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]">
              <span className="block">Energia soarelui,</span>
              <span className="text-gradient-diagonal block md:inline">
                Ajustată pentru tine.
              </span>
            </h1>

            <p className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200 text-base md:text-xl md:text-white/80">
              Găsește configurația solară ideală pentru proprietatea ta.
              Eficiență maximă, costuri reduse și independență energetică
              garantată.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section
        ref={filterSectionRef}
        className="sticky z-[45] w-full border-b border-border bg-background/95 backdrop-blur-sm"
        style={{ top: `${headerHeight}px` }}
      >
        <div className="container-section">
          <div className="flex min-h-[64px] items-center justify-start md:justify-center flex-wrap gap-2 py-2">
            {["Toate", "Rezidențial", "Comercial", "Industrial"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`filter-tab inline-flex items-center justify-center transition-all px-6 py-2 rounded-full font-bold text-sm ${
                  filter === type
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type !== "Toate" &&
                  (() => {
                    const Icon = typeIcons[type as keyof typeof typeIcons];
                    return <Icon className="w-4 h-4 mr-1.5" />;
                  })()}
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Systems Grid */}
      {/* <section className="section-padding bg-slate-50/50">
        <div className="container-section px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
            {filteredSystems.map((system, index) => {
              const Icon = typeIcons[system.type as keyof typeof typeIcons];
              return (
                <div
                  key={system.id}
                  className={`relative project-card animate-fade-up h-full flex flex-col bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all ${
                    system.popular
                      ? "ring-2 ring-accent border-accent/20"
                      : "border-slate-200"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    overflow: "visible",
                  }}
                >
                  {system.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-accent text-accent-foreground text-xs font-black px-5 py-2 rounded-full shadow-lg border-2 border-white">
                      CEL MAI POPULAR
                    </div>
                  )}

                  <div className="p-8 flex flex-col h-full flex-grow">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="badge-eco mb-3 flex items-center bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          <Icon className="w-3 h-3 mr-1.5" />
                          {system.type}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-slate-900">
                          {system.name}
                        </h3>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                        <Gauge className="w-6 h-6 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
                        <span className="text-slate-500 font-medium">
                          Putere sistem
                        </span>
                        <span className="font-bold text-slate-900 text-lg">
                          {system.power}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
                        <span className="text-slate-500 font-medium">
                          Producție est.
                        </span>
                        <span className="font-bold text-slate-900">
                          {system.production}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 text-sm">
                        <span className="text-slate-500 font-medium">
                          Potrivit pentru
                        </span>
                        <span className="font-bold text-slate-900 text-right">
                          {system.suitable}
                        </span>
                      </div>
                    </div>

                    <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="text-3xl font-display font-black text-primary mb-1">
                        {system.priceRange}
                      </div>
                      <p className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">
                        *Estimare înainte de subvenții Casa Verde
                      </p>
                    </div>

                    <ul className="space-y-3 mb-10 flex-grow">
                      {system.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                        >
                          <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      variant={system.popular ? "accent" : "outline"}
                      className="w-full h-14 rounded-xl font-bold text-lg cursor-pointer"
                      onClick={handleOfferRedirect}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Cere ofertă <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="section-padding bg-white border-t">
        <div className="container-section max-w-4xl mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold mb-12">
            Întrebări frecvente
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50"
                >
                  <span className="font-bold">{faq.question}</span>
                  {expandedFaq === index ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedFaq === index && (
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
