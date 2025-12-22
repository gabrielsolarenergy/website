import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

import contactHeroImage from "@/assets/commercial-solar.jpg";

const contactInfo = [
  {
    icon: MapPin,
    title: "Birou",
    details: ["Dumbrăveni Nicolae labis nr 46", "Suceava, România"],
  },
  { icon: Phone, title: "Telefon", details: ["+40 741 811 364"] },
  { icon: Mail, title: "Email", details: ["gabrielsolarenergyy@gmail.com"] },
  { icon: Clock, title: "Program", details: ["Luni - Vineri: 08:00 - 18:00"] },
];

const propertyTypes = ["Rezidențial", "Comercial", "Industrial", "Agricol"];
const interests = ["Instalație nouă", "Upgrade", "Mentenanță", "Finanțare"];

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Prenumele este obligatoriu"),
  lastName: z.string().trim().min(1, "Numele este obligatoriu"),
  email: z.string().trim().email("Adresă email invalidă"),
  phone: z.string().trim().min(10, "Minim 10 cifre"),
  propertyType: z.string().min(1, "Selectați tipul"),
  interest: z.string().min(1, "Selectați motivul"),
  message: z.string().trim().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyType: "",
    interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      contactSchema.parse(formData);
      toast({
        title: "Cerere trimisă!",
        description: "Vă contactăm în maximum 24 de ore.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="overflow-x-hidden w-full max-w-[100vw]">
        {/* Hero Section - FIX LCP & CLS */}
        <section className="relative min-h-[450px] lg:min-h-[60vh] flex items-center bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img
              src={contactHeroImage}
              alt="Instalație panouri fotovoltaice comerciale de Gabriel Solar Energy"
              className="w-full h-full object-cover opacity-60"
              loading="eager" // Obligatoriu pentru LCP
              fetchPriority="high" // Prioritate maximă de încărcare
              width="1920" // Fix CLS
              height="1080"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent md:bg-gradient-to-r" />
          </div>

          <div className="container mx-auto relative z-10 px-4">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-white leading-tight text-3xl xs:text-4xl sm:text-5xl lg:text-7xl mb-4">
                Obțineți oferta{" "}
                <span className="text-accent block xs:inline">
                  solară gratuită.
                </span>
              </h1>
              <p className="text-slate-200 text-base sm:text-lg max-w-xl opacity-90">
                Experții noștri analizează cererea și revin cu o ofertă
                personalizată în maximum 24 de ore.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section - FIX A11y */}
        <section className="py-8 sm:py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-3 sm:px-6 max-w-7xl">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-10">
              <div className="lg:col-span-7 xl:col-span-8 order-1">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-lg border border-slate-100">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
                    Solicită Oferta Personalizată
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="firstName"
                          className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                        >
                          Prenume *
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-primary/20",
                            errors.firstName && "border-destructive"
                          )}
                          placeholder="Ex: Ion"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="lastName"
                          className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                        >
                          Nume *
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none",
                            errors.lastName && "border-destructive"
                          )}
                          placeholder="Ex: Popescu"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                          placeholder="email@exemplu.ro"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="phone"
                          className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                        >
                          Telefon *
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                          placeholder="07xx xxx xxx"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="propertyType"
                          className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                        >
                          Tip Proprietate *
                        </label>
                        <select
                          id="propertyType"
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                        >
                          <option value="">Selectați tipul</option>
                          {propertyTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label
                          htmlFor="interest"
                          className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                        >
                          Motiv Contact *
                        </label>
                        <select
                          id="interest"
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className="w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                        >
                          <option value="">Selectați motivul</option>
                          {interests.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <Button
                      variant="accent"
                      size="xl"
                      className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-lg active:scale-95"
                      disabled={isSubmitting}
                      aria-label="Trimite formularul de contact pentru oferta solară"
                    >
                      {isSubmitting ? (
                        "Se trimite..."
                      ) : (
                        <span className="flex items-center gap-2">
                          TRIMITE SOLICITAREA{" "}
                          <Send className="w-4 h-4" aria-hidden="true" />
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              <aside className="lg:col-span-5 xl:col-span-4 order-2 space-y-4 sm:space-y-6">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <info.icon
                        className="w-5 h-5 sm:w-6 sm:h-6 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p
                          key={i}
                          className="text-xs sm:text-sm text-slate-500 truncate"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </section>

        {/* Localizare Section - FIX SEO */}
        <section
          className="bg-white py-10 sm:py-16 border-t border-slate-100"
          aria-labelledby="location-title"
        >
          <div className="container mx-auto px-4 text-center">
            <h2
              id="location-title"
              className="font-display text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight"
            >
              Sediul Gabriel Solar Energy
            </h2>
            <p className="text-slate-500 text-sm mb-8">
              Dumbrăveni Nicolae labis nr 46, Suceava, România
            </p>
            <div className="h-[250px] sm:h-[400px] bg-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center relative">
              <MapPin
                className="w-10 h-10 text-primary animate-bounce z-10"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-slate-900/5 rounded-2xl sm:rounded-3xl" />
            </div>
            <div className="mt-8">
              <Link
                to="/about"
                className="text-primary font-bold hover:underline text-sm md:text-base"
              >
                Citește despre misiunea noastră pentru energie verde
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
