import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Zap,
  Leaf,
  PiggyBank,
  Shield,
  Users,
  Award,
  TrendingUp,
  Sun,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-solar.jpg";
import residentialImage from "@/assets/residential-solar.jpg";
import commercialImage from "@/assets/commercial-solar.jpg";
import industrialImage from "@/assets/industrial-solar.jpg";

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

const stats = [
  { value: "500+", label: "Sisteme", icon: Sun },
  { value: "15MW", label: "Energie", icon: Zap },
  { value: "12k", label: "Tone CO₂", icon: Leaf },
  { value: "15", label: "Ani Exp.", icon: Award },
];

const testimonials = [
  {
    name: "Mihai Anderson",
    role: "Proprietar Casă",
    content:
      "GABRIEL SOLAR ENERGY a făcut ca întregul proces să fie extrem de simplu. Facturile au scăzut cu 85%!",
    rating: 5,
  },
  {
    name: "Elena Ionescu",
    role: "Proprietar Afacere",
    content:
      "Echipa a oferit proiecții detaliate care s-au dovedit exacte. Economisim 15.000 RON/lună!",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Manager Proprietăți",
    content:
      "Calitatea muncii și suportul continuu au fost excepționale pentru toate cele 5 locații ale noastre.",
    rating: 5,
  },
];

const partners = [
  "SunPower",
  "LG Solar",
  "Enphase",
  "Tesla",
  "Panasonic",
  "SolarEdge",
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Instalație Solară Gabriel"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32">
          <div className="max-w-4xl mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 px-3 py-1.5 rounded-full mb-6 animate-fade-up">
              <Check className="w-4 h-4 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium">
                Peste 500 de clienți mulțumiți
              </span>
            </div>

            <h1 className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]">
              <span className="block">Transformăm energia,</span>
              <span className="text-gradient-diagonal block md:inline">
                Acoperiș cu acoperiș.
              </span>
            </h1>

            <p className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200 text-base md:text-xl md:text-white/80">
              Valorificați puterea soarelui cu soluțiile noastre solare premium.
              Eficiență, economii masive și sustenabilitate garantată pentru
              casa ta.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up animation-delay-300 mb-12">
              <Button
                variant="hero"
                size="xl"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-base"
              >
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2"
                >
                  Obține o ofertă
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                asChild
                className="w-full sm:w-auto h-14 px-8 border-white/40 text-white hover:bg-white/10"
              >
                <Link to="/projects">Vezi proiectele</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:flex md:flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up animation-delay-400 border-t border-white/10 pt-8">
              {["Avans 0%", "Casa Verde", "Garanție 25 ani"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="bg-accent/20 p-1 rounded-full shrink-0">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-white/90 text-sm md:text-base font-medium whitespace-nowrap">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container-section px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="stat-card p-4 text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              De ce energia solară?
            </h2>
            <p className="text-muted-foreground text-lg">
              Soluții curate pentru casa sau afacerea ta.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="stat-card p-8 text-center group hover:border-accent/30 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <benefit.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-secondary px-4">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Cum funcționează
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative bg-card rounded-2xl p-6 card-shadow animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl font-display font-bold text-accent/10 absolute top-4 right-4">
                  {step.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Types */}
      <section className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Soluții Adaptate
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemTypes.map((system, index) => (
              <div
                key={system.type}
                className="project-card group animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={system.image}
                    alt={system.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="badge-eco mb-3 uppercase text-[10px] tracking-widest">
                    {system.type}
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Solar {system.type}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {system.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {system.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-accent shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/systems">Detalii Proiect</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding gradient-primary text-primary-foreground px-4">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                De ce GABRIEL SOLAR?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Peste 15 ani de experiență și sute de instalații finalizate cu
                succes în toată țara.
              </p>
              <Button
                variant="hero"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link to="/about">Află mai multe</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Award,
                  title: "Certificat",
                  text: "Instalatori autorizați",
                },
                { icon: Shield, title: "25 Ani", text: "Garanție completă" },
                { icon: Users, title: "500+", text: "Clienți fericiți" },
                { icon: TrendingUp, title: "Tier-1", text: "Panouri premium" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
                >
                  <item.icon className="w-7 h-7 text-accent mb-3" />
                  <h3 className="font-display font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-xs">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="stat-card p-6 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Quote className="w-8 h-8 text-accent/20 mb-4" />
                <p className="text-sm italic mb-4">{t.content}</p>
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
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-secondary border-y border-border px-4">
        <div className="container-section">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            {partners.map((p) => (
              <span key={p} className="text-lg font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
