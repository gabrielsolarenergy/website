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
    <footer
      className="bg-[#1a4925] text-white border-t border-[#1a4925]"
      role="contentinfo"
    >
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column - Optimizat SEO */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-3 mb-6 group"
              aria-label="Gabriel Solar Energy - Pagina principală"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <Sun className="w-6 h-6 text-[#1a4925]" aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-white tracking-tight uppercase">
                  GABRIEL
                </span>
                <span className="font-display font-bold text-sm text-white/80 tracking-widest group-hover:text-white transition-colors uppercase">
                  SOLAR ENERGY
                </span>
              </div>
            </Link>

            <p className="text-white/70 text-sm mb-6 max-w-xs leading-relaxed">
              Lideri în soluții fotovoltaice premium, transformând fiecare
              acoperiș într-o sursă de energie curată și inepuizabilă.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#1a4925] transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={`Urmăriți Gabriel Solar Energy pe ${social.name}`}
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links - FIX Contrast */}
          <div>
            <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-white">
              Companie
            </h2>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      aria-hidden="true"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-white">
              Servicii
            </h2>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                      aria-hidden="true"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - FIX Names & Labels */}
          <div>
            <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-white">
              Contact
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm group">
                <MapPin
                  className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <address className="text-white/70 leading-relaxed not-italic">
                  Dumbrăveni Nicolae labis nr 46,
                  <br />
                  Suceava, România
                </address>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <Phone
                  className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="tel:+40741811364"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Sunați-ne la +40 741 811 364"
                >
                  +40 741 811 364
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <Mail
                  className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:gabrielsolarenergyy@gmail.com"
                  className="text-white/70 hover:text-white transition-colors truncate"
                  aria-label="Trimiteți email la gabrielsolarenergyy@gmail.com"
                >
                  gabrielsolarenergyy@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Optimizat pentru conformitate juridică */}
      <div className="border-t border-white/10 bg-[#143d1f]/50">
        <div className="container px-4 py-6 mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} GABRIEL SOLAR ENERGY Inc. Toate
            drepturile rezervate.
          </p>
          <nav className="flex items-center gap-6" aria-label="Link-uri legale">
            <Link
              to="/privacy"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Politică Confidențialitate
            </Link>
            <Link
              to="/terms"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Termeni și Condiții
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
