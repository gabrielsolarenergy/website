import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Award,
  Shield,
  Heart,
  Target,
  Leaf,
  Linkedin,
  Mail,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import installationImage from "@/assets/installation-team.jpg";

const milestones = [
  {
    year: "2010",
    title: "Fondarea companiei",
    description:
      "Am pornit cu viziunea de a face energia solară accesibilă tuturor",
  },
  {
    year: "2013",
    title: "100 de instalații",
    description: "Am atins prima noastră etapă majoră",
  },
  {
    year: "2016",
    title: "Divizia comercială",
    description: "Ne-am extins pe piețele comerciale și industriale",
  },
  {
    year: "2019",
    title: "Certificare NABCEP Gold",
    description: "Am primit certificarea de aur pentru excelență",
  },
  {
    year: "2022",
    title: "Peste 500 de proiecte",
    description: "Am depășit pragul de 500 de instalații finalizate cu succes",
  },
  {
    year: "2024",
    title: "15 MW instalați",
    description: "Etapă importantă în capacitatea totală instalată",
  },
];

const values = [
  {
    icon: Target,
    title: "Excelență",
    description:
      "Urmărim cele mai înalte standarde în fiecare instalație, folosind doar componente de top și profesioniști certificați.",
  },
  {
    icon: Heart,
    title: "Clientul pe primul loc",
    description:
      "Succesul dumneavoastră este prioritatea noastră. Oferim prețuri transparente, recomandări oneste și suport pe viață.",
  },
  {
    icon: Leaf,
    title: "Sustenabilitate",
    description:
      "Ne angajăm să reducem emisiile de carbon și să creăm un viitor mai curat pentru generațiile următoare.",
  },
  {
    icon: Shield,
    title: "Integritate",
    description:
      "Operăm cu transparență totală, fără a face compromisuri la calitate sau promisiuni false.",
  },
];

const team = [
  {
    name: "Michael Thompson",
    role: "Fondator & CEO",
    bio: "Peste 20 de ani în energie regenerabilă. Fost executiv la Tesla Energy.",
  },
  {
    name: "Sarah Chen",
    role: "Director Tehnologic (CTO)",
    bio: "Inginer solar cu peste 50 de proiecte de anvergură realizate la nivel mondial.",
  },
  {
    name: "David Rodriguez",
    role: "Director de Operațiuni",
    bio: "Instalator certificat NABCEP cu 15 ani de experiență în domeniu.",
  },
  {
    name: "Emily Watson",
    role: "Relații Clienți",
    bio: "Dedicată să asigure că fiecare client obține economii maxime la energie.",
  },
];

const certifications = [
  { name: "Certificat NABCEP", logo: "NABCEP" },
  { name: "Tesla Powerwall", logo: "Tesla" },
  { name: "SunPower Elite", logo: "SunPower" },
  { name: "Partener EnergyStar", logo: "EnergyStar" },
  { name: "Rating BBB A+", logo: "BBB A+" },
  { name: "Certificat LEED", logo: "LEED" },
];

const stats = [
  { value: "15+", label: "Ani de experiență" },
  { value: "500+", label: "Clienți mulțumiți" },
  { value: "15MW", label: "Capacitate instalată" },
  { value: "98%", label: "Rata de satisfacție" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section - Identică cu Home/Systems/Services/Financing */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden font-sans">
        {/* Fundalul - Imaginea și Overlay-ul */}
        <div className="absolute inset-0 z-0">
          <img
            src={installationImage}
            alt="Echipa Gabriel Solar"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32 px-4 sm:px-0">
          <div className="max-w-4xl mx-auto md:mx-0">
            {/* Badge-ul */}
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <Award className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                Companie de încredere din 2010
              </span>
            </div>

            {/* Titlul - Scalat fluid */}
            <h1
              className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight
              text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]"
            >
              <span className="block">Alimentăm un</span>
              <span className="text-gradient-diagonal block md:inline">
                viitor sustenabil.
              </span>
            </h1>

            {/* Descrierea */}
            <p
              className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200
              text-base md:text-xl md:text-white/80 font-medium"
            >
              De peste 15 ani, GABRIEL SOLAR ENERGY este în prima linie a
              revoluției energiei solare. Am ajutat sute de proprietari de
              locuințe și afaceri să valorifice puterea soarelui.
            </p>

            {/* Statistici în Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-fade-up animation-delay-300 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-display font-black text-accent">
                    {stat.value}
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 font-bold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <h2 className="font-display text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                Povestea noastră
              </h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
                <p>
                  GabrielSolarEnergy a fost înființată în anul 2023 de Vezeteu
                  Petru Gabriel, un pasionat al energiei verzi și al soluțiilor
                  sustenabile pentru viitor. Dorința de a contribui activ la
                  protejarea mediului și la reducerea costurilor energetice a
                  stat la baza creării companiei.
                </p>
                <p>
                  Ne dedicăm furnizării de soluții moderne și eficiente în
                  domeniul energiei solare, adaptate atât pentru clienți
                  rezidențiali, cât și pentru cei comerciali. Punem accent pe
                  calitate, profesionalism și tehnologii de ultimă generație,
                  oferind consultanță personalizată, instalare corectă și suport
                  pe termen lung.
                </p>
                <p>
                  Misiunea noastră este să transformăm energia solară într-o
                  alegere accesibilă și sigură pentru oricine își dorește
                  independență energetică și un impact pozitiv asupra mediului.
                  La GabrielSolarEnergy, credem că viitorul este verde, iar
                  fiecare proiect reprezintă un pas înainte spre un mâine mai
                  curat și mai eficient.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
              <div className="space-y-10 relative">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className="relative pl-12 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute left-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-lg border-4 border-white">
                      {index + 1}
                    </div>
                    <div className="text-accent font-display font-black text-xl mb-1">
                      {milestone.year}
                    </div>
                    <div className="font-display font-bold text-slate-900 text-lg mb-2">
                      {milestone.title}
                    </div>
                    <div className="text-slate-500 text-sm font-medium">
                      {milestone.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section-padding bg-slate-50/50 px-4 border-y">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-black text-slate-900 mb-6">
              Misiunea și valorile
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              Să accelerăm tranziția lumii către energia sustenabilă prin
              facilitarea accesului la energie solară accesibilă, sigură și de
              încredere pentru toată lumea.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-up hover:shadow-xl transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section
      <section id="team" className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-black text-slate-900 mb-6">
              Echipa de conducere
            </h2>
            <p className="text-slate-500 text-xl font-medium">
              Veterani ai industriei și experți în energie regenerabilă dedicați
              succesului dumneavoastră.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="text-center animate-fade-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-48 h-48 rounded-[3rem] bg-slate-100 mx-auto mb-6 transition-transform group-hover:scale-105 duration-500 overflow-hidden border-4 border-white shadow-lg" />
                <h3 className="font-display font-bold text-slate-900 text-xl mb-1">
                  {member.name}
                </h3>
                <div className="text-sm text-accent font-black uppercase tracking-widest mb-4">
                  {member.role}
                </div>
                <p className="text-slate-500 text-sm font-medium mb-6 px-4">
                  {member.bio}
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="#"
                    className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Certifications - Carousel-like look */}
      <section className="py-20 bg-primary px-4">
        <div className="container-section">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-black text-white uppercase tracking-tighter">
              Certificări & Parteneri Tier-1
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 mb-4 flex items-center justify-center font-black text-white text-[10px]">
                  {cert.logo}
                </div>
                <div className="text-white text-[10px] font-black uppercase tracking-widest">
                  {cert.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <h2 className="font-display text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                Angajamentul nostru pentru mediu
              </h2>
              <p className="text-slate-600 text-lg mb-10 font-medium leading-relaxed">
                Dincolo de instalarea panourilor solare, ne-am luat angajamentul
                de a menține practici de business sustenabile la orice nivel al
                operațiunilor noastre.
              </p>
              <ul className="space-y-5">
                {[
                  "Operațiuni neutre de carbon din 2020",
                  "100% energie regenerabilă în sediile noastre",
                  "Flotă de vehicule electrice pentru echipe",
                  "Program propriu de reciclare a panourilor",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-all">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5">
                <Zap className="w-64 h-64" />
              </div>
              <div className="grid grid-cols-2 gap-10 relative z-10">
                <div className="text-center p-4">
                  <div className="text-5xl font-display font-black text-accent mb-2">
                    12k
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tone CO₂ evitate
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-5xl font-display font-black text-accent mb-2">
                    15MW
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Capacitate verde
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-5xl font-display font-black text-accent mb-2">
                    500+
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Proiecte active
                  </div>
                </div>
                <div className="text-center p-4">
                  <div className="text-5xl font-display font-black text-accent mb-2">
                    100%
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Reciclabil
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
    </Layout>
  );
}
