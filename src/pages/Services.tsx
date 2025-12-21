import { Link } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Wrench,
  Zap,
  FileCheck,
  HardHat,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import installationImage from "@/assets/installation-team.jpg";
import residentialImage from "@/assets/residential-solar.jpg";

const processSteps = [
  {
    icon: FileCheck,
    title: "Evaluarea locației",
    duration: "Ziua 1",
    description:
      "Inginerii noștri vizitează proprietatea pentru a evalua starea acoperișului, orientarea, umbrirea și infrastructura electrică.",
  },
  {
    icon: Settings,
    title: "Proiectare personalizată",
    duration: "Zilele 2-5",
    description:
      "Creăm un design personalizat al sistemului, optimizat pentru proprietatea dumneavoastră și nevoile energetice, folosind software avansat de modelare.",
  },
  {
    icon: Shield,
    title: "Permise și aprobări",
    duration: "Zilele 6-14",
    description:
      "Ne ocupăm de toate actele, autorizațiile de construire, acordurile de interconectare cu utilitățile și alte aprobări necesare în numele dumneavoastră.",
  },
  {
    icon: HardHat,
    title: "Instalare profesională",
    duration: "Zilele 15-17",
    description:
      "Tehnicienii noștri certificați instalează sistemul cu precizie; instalările rezidențiale sunt finalizate de obicei în 1-2 zile.",
  },
  {
    icon: Zap,
    title: "Inspecție și activare",
    duration: "Zilele 18-21",
    description:
      "După trecerea inspecției oficiale și aprobarea furnizorului de utilități, sistemul este pus în funcțiune și începe să genereze energie curată.",
  },
  {
    icon: Wrench,
    title: "Monitorizare și suport",
    duration: "Continuu",
    description:
      "Monitorizăm sistemul 24/7 și oferim suport pentru întreținere pentru a asigura performanța optimă timp de peste 25 de ani.",
  },
];

const certifications = [
  {
    name: "Certificat NABCEP",
    description:
      "Consiliul Nord-American al Practicienilor Certificați în Energie",
  },
  {
    name: "Electricieni autorizați",
    description: "Contractori electrici autorizați de stat",
  },
  {
    name: "Certificat OSHA",
    description: "Administrația pentru Sănătate și Siguranță Ocupațională",
  },
  {
    name: "Certificat de producător",
    description: "Instruiți direct de producătorii de panouri Tier-1",
  },
];

const warranties = [
  {
    title: "Garanția panourilor",
    duration: "25 ani",
    description:
      "Producție garantată de cel puțin 80% după 25 de ani. Acoperă defectele de fabricație și degradarea prematură.",
  },
  {
    title: "Garanția invertorului",
    duration: "12-25 ani",
    description:
      "Acoperire completă pentru înlocuire în caz de defecțiune. Garanții extinse disponibile pentru invertoarele de tip string.",
  },
  {
    title: "Garanția manoperei",
    duration: "10 ani",
    description:
      "Acoperă orice problemă legată de calitatea instalării, inclusiv penetrările acoperișului și conexiunile electrice.",
  },
  {
    title: "Garanția performanței",
    duration: "5 ani",
    description:
      "Garantăm că sistemul va produce în limita a 5% din randamentul estimat sau vom compensa diferența.",
  },
];

const maintenanceServices = [
  {
    name: "Curățarea panourilor",
    frequency: "Semianual",
    description:
      "Curățare profesională pentru a îndepărta murdăria, praful și resturile",
  },
  {
    name: "Inspecția sistemului",
    frequency: "Anual",
    description:
      "Verificare cuprinzătoare a tuturor componentelor și conexiunilor",
  },
  {
    name: "Analiza performanței",
    frequency: "Trimestrial",
    description: "Revizuire detaliată a datelor de producție a energiei",
  },
  {
    name: "Suport de urgență",
    frequency: "24/7",
    description:
      "Răspuns rapid pentru orice problemă sau defecțiune a sistemului",
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
        {/* Fundalul - Imaginea și Overlay-ul */}
        <div className="absolute inset-0 z-0">
          <img
            src={installationImage}
            alt="Instalare profesională panouri solare"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Overlay dual pentru lizibilitate maximă */}
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32">
          <div className="max-w-4xl mx-auto md:mx-0">
            {/* Badge-ul de încredere */}
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <Award className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium">
                Instalare expertă și mentenanță certificată
              </span>
            </div>

            {/* Titlul - Scalat fluid */}
            <h1 className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]">
              <span className="block">Transformăm energia,</span>
              <span className="text-gradient-diagonal block md:inline">
                Acoperiș cu acoperiș.
              </span>
            </h1>

            {/* Descrierea */}
            <p
              className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200
              text-base md:text-xl md:text-white/80"
            >
              De la evaluarea inițială până la întreținerea continuă,
              profesioniștii noștri certificați se asigură că investiția
              dumneavoastră oferă randament maxim timp de decenii.
            </p>

            {/* Butonul principal */}
            <div className="animate-fade-up animation-delay-300">
              <Button
                variant="hero"
                size="xl"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-lg font-bold"
              >
                <Link to="/contact">
                  Programează o instalare
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Process */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Procesul nostru de instalare
            </h2>
            <p className="text-muted-foreground text-lg">
              O abordare transparentă, pas cu pas, care vă ține informat de la
              început până la sfârșit. Majoritatea instalărilor rezidențiale
              sunt finalizate în termen de 3 săptămâni.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

            <div className="space-y-8 lg:space-y-0">
              {processSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative lg:flex lg:items-center lg:gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`lg:w-1/2 ${
                      index % 2 === 0
                        ? "lg:text-right lg:pr-12"
                        : "lg:text-left lg:pl-12"
                    }`}
                  >
                    <div
                      className={`stat-card inline-block text-left animate-fade-up ${
                        index % 2 === 0 ? "lg:ml-auto" : ""
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                          <step.icon className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <div className="badge-eco mb-2">{step.duration}</div>
                          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="lg:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Certifications */}
      <section className="section-padding bg-secondary">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Siguranță și certificări
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Fiecare membru al echipei noastre de instalare deține
                certificări recunoscute în industrie. Menținem cele mai înalte
                standarde de siguranță și respectăm toate codurile și
                reglementările locale de construcție.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div key={cert.name} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-foreground">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src={residentialImage}
                alt="Instalare solară certificată"
                className="rounded-2xl card-shadow w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 card-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground">
                      Asigurare 100%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Acoperire completă de răspundere civilă
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Acoperire completă prin garanție
            </h2>
            <p className="text-muted-foreground text-lg">
              Investiția dumneavoastră este protejată cu garanții de top în
              industrie pentru toate componentele și manopera.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {warranties.map((warranty, index) => (
              <div
                key={warranty.title}
                className="stat-card text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-display font-bold text-accent mb-2">
                  {warranty.duration}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {warranty.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {warranty.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Section */}
      <section className="section-padding gradient-primary text-primary-foreground">
        <div className="container-section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Întreținere și suport continuu
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Păstrați-vă sistemul la eficiență maximă cu planurile noastre
              cuprinzătoare de întreținere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceServices.map((service, index) => (
              <div
                key={service.name}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 border border-primary-foreground/20"
              >
                <div className="badge-eco mb-3">{service.frequency}</div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {service.name}
                </h3>
                <p className="text-primary-foreground/70 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Află despre planurile de intreținere
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sunteți gata să începeți?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Programați o consultanță gratuită cu experții noștri în instalare.
              Vom evalua proprietatea, vă vom răspunde la întrebări și vă vom
              oferi o ofertă detaliată.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="accent" size="xl" asChild>
                <Link to="/contact">
                  Solicită ofertă gratuită
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline-primary" size="xl" asChild>
                <a href="tel:+15551234567">Sună la (555) 123-4567</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
