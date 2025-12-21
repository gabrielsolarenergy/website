import { Link } from "react-router-dom";
import {
  Sun,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  company: [
    { name: "Despre noi", href: "/about" },
    { name: "Echipa noastră", href: "/about#team" },
    { name: "Cariere", href: "/careers" },
    { name: "Noutăți și presă", href: "/blog" },
  ],
  services: [
    { name: "Solar rezidențial", href: "/systems" },
    { name: "Solar comercial", href: "/systems" },
    { name: "Soluții industriale", href: "/systems" },
    { name: "Mentenanță", href: "/services" },
  ],
  resources: [
    { name: "Calculator solar", href: "/financing#calculator" },
    { name: "Opțiuni finanțare", href: "/financing" },
    { name: "Blog", href: "/blog" },
    { name: "Întrebări frecvente (FAQ)", href: "/systems#faq" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a4925] text-white border-t border-[#1a4925]" role="contentinfo">
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <Sun className="w-6 h-6 text-[#1a4925]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  GABRIEL
                </span>
                <span className="font-display font-bold text-sm text-gray-300 tracking-widest group-hover:text-white transition-colors">
                  SOLAR ENERGY
                </span>
              </div>
            </Link>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
              Conducem tranziția către energia regenerabilă cu soluții solare
              premium pentru clienți rezidențiali și industriali. Certificați și
              de încredere din 2010.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#1a4925] transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-white/90">
              Companie
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-white" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-white/90">
              Servicii
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-white" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-white/90">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm group">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors shrink-0 mt-0.5" />
                <span className="text-gray-300 leading-relaxed">
                  Bd. Energiei nr. 123, Etaj 4
                  <br />
                  București, Sector 1
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors shrink-0" />
                <a
                  href="tel:+40722000000"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +40 722 000 000
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors shrink-0" />
                <a
                  href="mailto:contact@gabriel-solar-energy.com"
                  className="text-gray-300 hover:text-white transition-colors truncate"
                >
                  contact@gabriel-solar.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#143d1f]/50">
        <div className="container px-4 py-6 mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GABRIEL SOLAR ENERGY Inc. Toate
            drepturile rezervate.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Politica de confidențialitate
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Termeni și condiții
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
