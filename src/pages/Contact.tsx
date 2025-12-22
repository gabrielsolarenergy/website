import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Imagine optimizată
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

const propertyTypes = [
  "Casă rezidențială",
  "Clădire comercială",
  "Unitate industrială",
  "Agricol / Fermă",
];
const interests = [
  "Instalație nouă",
  "Upgrade sistem",
  "Mentenanță",
  "Finanțare",
];

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Obligatoriu"),
  lastName: z.string().trim().min(1, "Obligatoriu"),
  email: z.string().trim().email("Email invalid"),
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
      // Logică API aici
      toast({ title: "Cerere trimisă!", description: "Revenim în 24h." });
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
      <div className="overflow-x-hidden w-full">
        {" "}
        {/* Container anti-scroll orizontal */}
        {/* Hero Section - Full Responsive */}
        <section className="relative min-h-[500px] lg:min-h-[70vh] flex items-center bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img
              src={contactHeroImage}
              alt="Contact Gabriel Solar Energy"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="1080"
            />
            <div className="absolute inset-0 bg-black/70 md:bg-gradient-to-r md:from-slate-900 md:via-slate-900/80 md:to-transparent" />
          </div>

          <div className="container mx-auto relative z-10 px-4 pt-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-md border border-accent/30 px-4 py-1.5 rounded-full mb-6">
                <Phone className="w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  Suport 24/7
                </span>
              </div>
              <h1 className="font-display font-bold text-white mb-6 leading-[1.1] text-4xl sm:text-5xl lg:text-7xl">
                Obțineți oferta{" "}
                <span className="text-accent">solară gratuită.</span>
              </h1>
              <p className="text-white/80 mb-8 text-lg md:text-xl max-w-xl">
                Sunteți gata să economisiți? Experții noștri vă vor oferi o
                ofertă personalizată în 24 de ore.
              </p>
            </div>
          </div>
        </section>
        {/* Form & Sidebar Grid - Full Responsive */}
        <section className="py-16 md:py-24 bg-slate-50 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Form Column */}
              <div className="lg:col-span-8 order-2 lg:order-1">
                <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100">
                  <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">
                    Solicită Oferta
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Prenume *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={cn(
                          "w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20",
                          errors.firstName && "border-destructive"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Nume *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={cn(
                          "w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20",
                          errors.lastName && "border-destructive"
                        )}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 md:col-span-1">
                      <label
                        htmlFor="email"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2 md:col-span-1">
                      <label
                        htmlFor="phone"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Telefon *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="propertyType"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Proprietate *
                      </label>
                      <select
                        id="propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                      >
                        <option value="">Selectați...</option>
                        {propertyTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="interest"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Interes *
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                      >
                        <option value="">Selectați...</option>
                        {interests.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label
                        htmlFor="message"
                        className="text-xs font-black uppercase text-slate-400"
                      >
                        Mesaj (Opțional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        variant="accent"
                        size="xl"
                        className="w-full h-16 rounded-2xl font-black text-lg transition-all hover:scale-[1.01] active:scale-95"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Se trimite..."
                        ) : (
                          <span className="flex items-center gap-3">
                            TRIMITE SOLICITAREA <Send className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Info Column */}
              <aside className="lg:col-span-4 order-1 lg:order-2 space-y-6">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                      <info.icon
                        className="w-6 h-6 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 mb-1">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p
                          key={i}
                          className="text-sm text-slate-500 font-medium leading-relaxed"
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
        {/* Localizare - Ierarhie optimizată SEO */}
        <section className="bg-white py-12 px-4 text-center border-t border-slate-100">
          <div className="container mx-auto">
            <h2 className="font-display text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Localizare Sediu
            </h2>
            <p className="text-slate-500 font-medium mb-8">
              Dumbrăveni Nicolae labis nr 46, Suceava
            </p>
            <div className="h-[300px] md:h-[450px] bg-slate-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
              <MapPin
                className="w-12 h-12 text-primary animate-bounce relative z-10"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-slate-900/5" />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
