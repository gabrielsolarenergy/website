import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calculator,
  Percent,
  DollarSign,
  TrendingUp,
  Check,
  Building,
  CreditCard,
  PiggyBank,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import residentialImage from "@/assets/residential-solar.jpg"; // Poți înlocui cu orice altă poză din assets

const incentives = [
  {
    icon: Percent,
    title: "Credit Fiscal Federal (ITC)",
    value: "30%",
    description:
      "Deduceți 30% din costul instalării sistemului solar din taxele federale. Nu există o limită maximă pentru valoarea acestuia.",
    link: "Vezi cerințele →",
  },
  {
    icon: Building,
    title: "Subvenții de Stat și Locale",
    value: "Până la $5.000",
    description:
      "Multe state oferă subvenții suplimentare în numerar care pot fi combinate cu creditele federale pentru economii maxime.",
    link: "Verifică statul tău →",
  },
  {
    icon: TrendingUp,
    title: "Contorizare Netă",
    value: "100%",
    description:
      "Câștigați credite pe factura de utilități pentru surplusul de energie generat de panouri și trimis înapoi în rețea.",
    link: "Cum funcționează →",
  },
];

const financingOptions = [
  {
    type: "Achiziție cu numerar",
    icon: PiggyBank,
    badge: "Cele mai bune economii pe termen lung",
    highlight: "100%",
    highlightLabel: "Proprietate",
    features: [
      "Maximizați creditele fiscale și subvențiile",
      "Fără rate lunare sau dobânzi",
      "Cel mai mare ROI pe termen lung",
      "Crește imediat valoarea casei",
    ],
  },
  {
    type: "Credit Solar",
    icon: CreditCard,
    badge: "Cea mai populară alegere",
    highlight: "2.99%",
    highlightLabel: "DAE începând de la",
    features: [
      "Dețineți sistemul cu avans de 0%",
      "Plăți lunare adesea mai mici decât factura de curent",
      "Eligibil pentru credite fiscale și stimulente",
      "Termeni flexibili: 5-25 ani",
    ],
    popular: true,
  },
  {
    type: "Leasing / PPA",
    icon: FileText,
    badge: "Economii fără bătăi de cap",
    highlight: "$0",
    highlightLabel: "Cost inițial",
    features: [
      "Mentenanța și reparațiile sunt incluse",
      "Costuri lunare de energie previzibile",
      "Plătiți doar pentru energia produsă",
      "Monitorizare cu garanție de performanță",
    ],
  },
];

const faqs = [
  {
    question: "Mă calific pentru creditul fiscal de 30%?",
    answer:
      "Majoritatea proprietarilor de case și afaceri se califică pentru Creditul Fiscal Federal pentru Investiții (ITC). Trebuie să dețineți sistemul (nu să îl închiriați) și să aveți obligații fiscale suficiente. Creditul poate fi reportat pentru anii fiscali viitori dacă este necesar.",
  },
  {
    question: "Ce se întâmplă dacă mă mut?",
    answer:
      "Energia solară crește valoarea casei! Studiile arată că locuințele cu panouri se vând cu 4% mai scump. Dacă dețineți sistemul, acesta se transferă noului proprietar. Pentru sisteme în leasing, vă ajutăm să transferați contractul sau să achitați soldul la vânzare.",
  },
  {
    question: "Există penalități pentru plata anticipată a creditului?",
    answer:
      "Nu! Creditele noastre solare nu au penalități de plată anticipată. Puteți achita soldul oricând pentru a economisi la dobândă fără taxe suplimentare.",
  },
  {
    question: "Pot combina mai multe stimulente?",
    answer:
      "Da! Creditul fiscal federal poate fi combinat cu subvențiile de stat, stimulentele de la furnizorii de utilități și contorizarea netă. Echipa noastră vă va ajuta să cumulați toate beneficiile disponibile.",
  },
];

const partners = ["SunFinance", "GreenBank", "EcoCredit", "SolarSecure"];

export default function Financing() {
  const [monthlyBill, setMonthlyBill] = useState(150);
  const [roofExposure, setRoofExposure] = useState("good");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const annualBill = monthlyBill * 12;
  const systemCost = monthlyBill * 100;
  const taxCredit = systemCost * 0.3;
  const netCost = systemCost - taxCredit;
  const annualSavings =
    annualBill *
    (roofExposure === "excellent"
      ? 0.95
      : roofExposure === "good"
      ? 0.85
      : 0.7);
  const paybackYears = netCost / annualSavings;
  const twentyYearSavings = annualSavings * 25 - netCost;
  const co2Offset = Math.round((annualSavings / 12) * 0.4);

  return (
    <Layout>
      {/* Hero Section - Identică cu Home & Systems */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
        {/* Fundalul - Imaginea și Overlay-ul */}
        <div className="absolute inset-0 z-0">
          <img
            src={residentialImage}
            alt="Finanțare Solară Gabriel"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Overlay dual pentru contrast maxim */}
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32">
          <div className="max-w-4xl mx-auto md:mx-0">
            {/* Badge-ul de încredere */}
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <DollarSign className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                Partener oficial al Fondului pentru Energie Verde
              </span>
            </div>

            {/* Titlul - Scalat fluid */}
            <h1
              className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight
              text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]"
            >
              <span className="block">Energie solară care</span>
              <span className="text-gradient-diagonal block md:inline">
                se plătește singură.
              </span>
            </h1>

            {/* Descrierea */}
            <p
              className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200
              text-base md:text-xl md:text-white/80"
            >
              Descoperiți granturi guvernamentale, reduceri fiscale și opțiuni
              de finanțare flexibile, concepute pentru a face energia
              regenerabilă accesibilă pentru orice buget.
            </p>

            {/* Butoanele */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up animation-delay-300">
              <Button
                variant="hero"
                size="xl"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-base"
              >
                <a
                  href="#calculator"
                  className="flex items-center justify-center gap-2"
                >
                  Calculează economiile
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button
                variant="hero-outline"
                size="xl"
                asChild
                className="w-full sm:w-auto h-14 px-8 border-white/40 text-white hover:bg-white/10"
              >
                <a href="#financing">Cum funcționează finanțarea</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Government Incentives */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stimulente guvernamentale și credite fiscale
            </h2>
            <p className="text-muted-foreground text-lg">
              Maximizați investiția profitând de programele federale și statale
              disponibile, create pentru a scădea costul inițial al panourilor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-0">
            {incentives.map((incentive, index) => (
              <div
                key={incentive.title}
                className="stat-card animate-fade-up p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                  <incentive.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-3xl font-display font-bold text-primary mb-2">
                  {incentive.value}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {incentive.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {incentive.description}
                </p>
                <a
                  href="#"
                  className="text-accent font-bold hover:underline text-sm"
                >
                  {incentive.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Options */}
      <section id="financing" className="section-padding bg-secondary">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Finanțare flexibilă pentru toată lumea
            </h2>
            <p className="text-muted-foreground text-lg">
              Alegeți calea care se potrivește obiectivelor dvs. financiare.
              Fiecare opțiune duce la economii.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-4 sm:px-0">
            {financingOptions.map((option, index) => (
              <div
                key={option.type}
                className={`relative bg-card rounded-2xl p-8 card-shadow animate-fade-up ${
                  option.popular ? "ring-2 ring-accent scale-[1.02]" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border-2 border-white">
                    Cea mai populară
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded uppercase">
                    {option.badge}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  {option.type}
                </h3>

                <div className="mb-6">
                  <div className="text-4xl font-display font-black text-primary">
                    {option.highlight}
                  </div>
                  <div className="text-xs font-bold text-slate-400 uppercase mt-1">
                    {option.highlightLabel}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {option.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                    >
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={option.popular ? "accent" : "outline"}
                  className="w-full h-12 rounded-xl font-bold"
                  asChild
                >
                  <Link to="/contact">
                    {option.type === "Achiziție cu numerar"
                      ? "Cere ofertă numerar"
                      : option.type === "Credit Solar"
                      ? "Verifică eligibilitatea"
                      : "Vezi termeni leasing"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section
        id="calculator"
        className="section-padding bg-background px-4 sm:px-0"
      >
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Calculează-ți amortizarea (ROI)
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Vezi cât ai putea economisi în 25 de ani făcând trecerea la
                solar astăzi.
              </p>

              <div className="space-y-8 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div>
                  <label className="block text-sm font-black uppercase text-slate-400 tracking-wider mb-4">
                    Factura electrică lunară (RON)
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-2xl font-black text-primary min-w-[100px]">
                      ${monthlyBill}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <label className="block text-sm font-black uppercase text-slate-400 tracking-wider mb-4">
                    Expunerea la soare a acoperișului
                  </label>
                  <div className="flex gap-3">
                    {["limitată", "bună", "excelentă"].map((exposure) => (
                      <button
                        key={exposure}
                        onClick={() => setRoofExposure(exposure)}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                          roofExposure === exposure
                            ? "bg-primary text-white shadow-lg"
                            : "bg-white text-slate-400 border border-slate-200 hover:border-primary/50"
                        }`}
                      >
                        {exposure}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp className="w-48 h-48" />
              </div>
              <div className="grid grid-cols-2 gap-10 relative z-10">
                <div>
                  <p className="text-primary-foreground/60 text-xs font-bold uppercase mb-2">
                    Economii 25 ani
                  </p>
                  <div className="text-4xl font-display font-black text-accent">
                    ${Math.round(twentyYearSavings).toLocaleString()}
                  </div>
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-xs font-bold uppercase mb-2">
                    Recuperare Investiție
                  </p>
                  <div className="text-4xl font-display font-black">
                    {paybackYears.toFixed(1)} ani
                  </div>
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-xs font-bold uppercase mb-2">
                    Compensare CO₂
                  </p>
                  <div className="text-3xl font-display font-bold">
                    {co2Offset} Tone/an
                  </div>
                </div>
                <div>
                  <p className="text-primary-foreground/60 text-xs font-bold uppercase mb-2">
                    Valoare Casă
                  </p>
                  <div className="text-3xl font-display font-bold">+4.1%</div>
                </div>
              </div>
              <Button
                variant="accent"
                className="w-full h-14 mt-12 text-lg font-black rounded-2xl"
                asChild
              >
                <Link to="/contact">Obține proiecția detaliată</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-secondary">
        <div className="container-section px-4 sm:px-0">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                De la cerere la aprobare
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0 shadow-lg border-4 border-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-foreground mb-2">
                      Consultanță gratuită
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Analizăm factura și acoperișul pentru a proiecta sistemul
                      și planul de finanțare perfect.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0 shadow-lg border-4 border-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-foreground mb-2">
                      Calificare și aplicare
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Echipa noastră se ocupă de toate actele pentru
                      împrumuturi, leasing și cererile pentru stimulente.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0 shadow-lg border-4 border-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-display text-xl font-bold text-foreground mb-2">
                      Instalare și activare
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Odată aprobat, instalăm panourile și pornim economiile.
                      Opțiuni disponibile fără costuri inițiale.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-3xl font-bold text-foreground mb-8">
                Întrebări frecvente
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-800 pr-4">
                        {faq.question}
                      </span>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-accent shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed animate-fade-in font-medium">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero px-4">
        <div className="container-section text-center max-w-4xl mx-auto">
          <div className="badge-eco mx-auto mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md">
            Ești la un pas de independență
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Hai să discutăm despre proiectul tău
          </h2>

          <p className="text-white/80 text-lg md:text-xl mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
            Echipa noastră de experți este gata să îți ofere o consultanță
            gratuită și să îți explice cum poți ajunge la facturi zero.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            {/* Butonul Primar - Solid și Impunător */}
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 h-16 flex items-center justify-center gap-3 bg-white text-[#1a4925] rounded-2xl font-black text-lg shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-[#f8fcf9] hover:-translate-y-1 transition-all duration-300"
            >
              VORBEȘTE CU NOI
              <ArrowRight className="w-6 h-6" />
            </Link>

            {/* Butonul Secundar - Stil Glassmorphism (Contur fin și fundal semi-transparent) */}
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 h-16 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              SOLICITĂ OFERTĂ
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4">
            {[
              "Răspuns în 24h",
              "Fără costuri ascunse",
              "Expertiză tehnică",
            ].map((check) => (
              <div
                key={check}
                className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {check}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
