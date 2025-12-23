import { Link, useNavigate } from "react-router-dom";
import { Suspense } from "react";

// IMPORTURI DIRECTE: Reducem ~140KB de JavaScript neutilizat
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Check from "lucide-react/dist/esm/icons/check";
import Sun from "lucide-react/dist/esm/icons/sun";
import Zap from "lucide-react/dist/esm/icons/zap";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import PiggyBank from "lucide-react/dist/esm/icons/piggy-bank";
import Shield from "lucide-react/dist/esm/icons/shield";
import Users from "lucide-react/dist/esm/icons/users";
import Award from "lucide-react/dist/esm/icons/award";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import Star from "lucide-react/dist/esm/icons/star";
import Quote from "lucide-react/dist/esm/icons/quote";

import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

import heroImage from "@/assets/hero-solar.webp";
import residentialImage from "@/assets/residential-solar.webp";
import commercialImage from "@/assets/commercial-solar.webp";
import industrialImage from "@/assets/industrial-solar.webp";

// DATELE TALE COMPLETE - FARA ELIMINARI
const benefits = [
  {
    icon: PiggyBank,
    title: "Facturi mai mici",
    description:
      "Reduceți costurile cu electricitatea cu până la 90% cu sistemele noastre de înaltă eficiență.",
  },
  {
    icon: Leaf,
    title: "Energie verde",
    description:
      "Alimentați-vă casa sau afacerea cu energie 100% curată și regenerabilă de la soare.",
  },
  {
    icon: Shield,
    title: "Subvenții (Casa Verde)",
    description:
      "Profită de creditele fiscale și de stimulentele locale pentru a-ți maximiza economiile.",
  },
];

const steps = [
  {
    step: "01",
    title: "Consultanță",
    description:
      "Analizăm nevoile de energie și oferim o soluție solară personalizată.",
  },
  {
    step: "02",
    title: "Proiectare",
    description:
      "Inginerii noștri proiectează aspectul optim pentru producție maximă.",
  },
  {
    step: "03",
    title: "Instalare",
    description:
      "Tehnicienii noștri instalează sistemul rapid, de obicei în doar 1-2 zile.",
  },
  {
    step: "04",
    title: "Suport",
    description:
      "Garanție de 25 de ani, cu monitorizare și întreținere incluse.",
  },
];

const systemTypes = [
  {
    type: "rezidențial",
    image: residentialImage,
    description:
      "Perfect pentru case de toate dimensiunile. Creșteți valoarea proprietății imediat.",
    features: [
      "Sisteme de 4-12 kW",
      "Montaj pe acoperiș",
      "Stocare în baterii",
    ],
  },
  {
    type: "comercial",
    image: commercialImage,
    description:
      "Reduceți costurile operaționale și demonstrați angajamentul față de sustenabilitate.",
    features: [
      "Sisteme de 50-500 kW",
      "Acoperișuri plate",
      "Monitorizare avansată",
    ],
  },
  {
    type: "industrial",
    image: industrialImage,
    description:
      "Soluții la scară largă pentru fabrici și depozite cu cerințe energetice ridicate.",
    features: [
      "Sisteme peste 500 kW",
      "Integrare în rețea",
      "Management consum",
    ],
  },
];

const testimonials = [
  {
    name: "Mihai Andreiescu",
    role: "Proprietar Casă",
    content:
      "GABRIEL SOLAR ENERGY a făcut ca întregul proces să fie extrem de simplu. Facturile au scăzut cu 85%!",
  },
  {
    name: "Elena Ionescu",
    role: "Proprietar Afacere",
    content:
      "Echipa a oferit proiecții detaliate care s-au dovedit exacte. Economisim 15.000 RON/lună!",
  },
  {
    name: "David Iftime",
    role: "Manager Proprietăți",
    content:
      "Calitatea muncii și suportul continuu au fost excepționale pentru toate cele 5 locații ale noastre.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* HERO: Fix LCP discovery & Forced Reflow */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <picture>
            <source
              media="(max-width: 480px)"
              srcSet="/assets/hero-solar-mobile.webp"
            />
            <img
              src={heroImage}
              alt="Instalație panouri solare premium Gabriel Solar Energy"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="1080"
            />
          </picture>
          <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-3 py-1.5 rounded-full mb-6">
              <Check className="w-4 h-4 text-accent" />
              <span className="text-white text-xs md:text-sm font-medium">
                Peste 500 de clienți mulțumiți în România
              </span>
            </div>
            <h1 className="font-display font-bold text-white mb-6 text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem] leading-tight">
              Transformăm energia, <br />
              <span className="text-accent">Acoperiș cu acoperiș.</span>
            </h1>
            <p className="text-white/90 mb-10 max-w-xl text-lg md:text-xl">
              Valorificați puterea soarelui cu soluții solare premium.
              Eficiență, economii masive și sustenabilitate garantată pentru
              casa ta.
            </p>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="h-14 px-8"
            >
              Obține o ofertă <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* LAZY LOADING: Toate sectiunile grele sunt amanate pentru FCP rapid */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-slate-100" />}>
        {/* Stats */}
        <section className="py-10 bg-background border-b border-border">
          <div className="container-section grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: "500+", l: "Sisteme", i: Sun },
              { v: "15MW", l: "Energie", i: Zap },
              { v: "12k", l: "Tone CO₂", i: Leaf },
              { v: "15", l: "Ani Exp.", i: Award },
            ].map((s) => (
              <div key={s.l} className="p-4 text-center">
                <s.i className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {s.v}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="section-padding bg-background px-4">
          <div className="container-section grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-8 text-center border border-border/50 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <b.icon className="w-14 h-14 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="section-padding bg-secondary px-4">
          <div className="container-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative bg-card rounded-2xl p-6 border shadow-sm"
              >
                <div className="text-5xl font-bold text-accent/10 absolute top-4 right-4">
                  {s.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-4 text-white font-bold">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* System Types */}
        <section className="section-padding bg-background px-4">
          <div className="container-section grid grid-cols-1 md:grid-cols-3 gap-8">
            {systemTypes.map((s) => (
              <div
                key={s.type}
                className="group rounded-2xl border bg-card overflow-hidden shadow-sm"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.type}
                    width="640"
                    height="360"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 uppercase text-accent">
                    Solar {s.type}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {s.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {s.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-accent" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/systems">Detalii proiect</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding bg-background px-4 border-t">
          <div className="container-section grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 border border-border/50 rounded-2xl shadow-sm"
              >
                <Quote className="w-8 h-8 text-accent/20 mb-4" />
                <p className="text-sm italic mb-4">"{t.content}"</p>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                  ))}
                </div>
                <div className="font-bold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="py-12 bg-secondary border-y border-border">
          <div className="container-section flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {[
              "SunPower",
              "LG Solar",
              "Enphase",
              "Tesla",
              "Panasonic",
              "SolarEdge",
            ].map((p) => (
              <span key={p} className="text-lg font-bold text-foreground">
                {p}
              </span>
            ))}
          </div>
        </section>
      </Suspense>
    </Layout>
  );
}
