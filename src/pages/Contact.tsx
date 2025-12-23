import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { cn } from "@/lib/utils";

import contactHeroImage from "@/assets/commercial-solar.jpg";
import { solarAPI } from "@/lib/api";

const contactInfo = [
  {
    icon: MapPin,
    title: "Birou",
    details: ["Dumbrăveni Nicolae labis nr 46", "Suceava, România"],
  },
  { icon: Phone, title: "Telefon", details: ["+40 741 811 364"] },
  { icon: Mail, title: "Email", details: ["gabrielsolarenergyy@gmail.com"] },
  {
    icon: Clock,
    title: "Program",
    details: ["Luni - Vineri: 08:00 - 18:00", "Sâmbătă: 08:00 - 14:00"],
  },
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
  const { toast } = useToast();
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
    setErrors({});

    try {
      // 1. Validare locală (Zod)
      contactSchema.parse(formData);

      // 2. Mapping către formatul Backend-ului
      // Curățăm spațiile din telefon pentru a trece de RegEx-ul serverului
      const cleanPhone = formData.phone.replace(/\s/g, "");

      const backendPayload = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: cleanPhone,
        property_type: formData.propertyType,
        interest: formData.interest,
        message: formData.message || "",
      };

      // 3. Trimitere reală
      const response = await solarAPI.sendContactForm(backendPayload);

      if (response.error) {
        throw new Error(
          typeof response.error === "object"
            ? "Date invalide. Verificați telefonul."
            : response.error
        );
      }

      toast({
        title: "Cerere trimisă!",
        description: "Vă contactăm în maximum 24 de ore.",
      });

      // 4. Resetare
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        propertyType: "",
        interest: "",
        message: "",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: any = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          variant: "destructive",
          title: "Eroare la trimitere",
          description: error.message,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="overflow-x-hidden w-full max-w-[100vw]">
        {/* Hero Section */}
        <section className="relative min-h-[450px] lg:min-h-[60vh] flex items-center bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img
              src={contactHeroImage}
              alt="Gabriel Solar Contact"
              className="w-full h-full object-cover opacity-60"
              loading="eager"
              fetchPriority="high"
              width="1920"
              height="1080"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent md:bg-gradient-to-r" />
          </div>

          <div className="container mx-auto relative z-10 px-4">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-white leading-tight text-3xl xs:text-4xl sm:text-5xl lg:text-7xl mb-4">
                Obțineți oferta{" "}
                <span className="text-accent">solară gratuită.</span>
              </h1>
              <p className="text-slate-200 text-base sm:text-lg max-w-xl opacity-90">
                Experții noștri analizează cererea și revin cu o ofertă
                personalizată în maximum 24 de ore.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-8 sm:py-16 md:py-24 bg-slate-50">
          <div className="container mx-auto px-3 sm:px-6 max-w-7xl">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-10">
              <div className="lg:col-span-7 xl:col-span-8 order-1">
                <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-lg border border-slate-100">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
                    Solicită oferta personalizată
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400">
                          Prenume *
                        </label>
                        <input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-primary/20",
                            errors.firstName && "border-destructive"
                          )}
                          placeholder="Ion"
                        />
                        {errors.firstName && (
                          <p className="text-destructive text-[10px] font-bold">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400">
                          Nume *
                        </label>
                        <input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-primary/20",
                            errors.lastName && "border-destructive"
                          )}
                          placeholder="Popescu"
                        />
                        {errors.lastName && (
                          <p className="text-destructive text-[10px] font-bold">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400">
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none",
                            errors.email && "border-destructive"
                          )}
                          placeholder="email@exemplu.ro"
                        />
                        {errors.email && (
                          <p className="text-destructive text-[10px] font-bold">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400">
                          Telefon *
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none",
                            errors.phone && "border-destructive"
                          )}
                          placeholder="07xx xxx xxx"
                        />
                        {errors.phone && (
                          <p className="text-destructive text-[10px] font-bold">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400">
                          Tip Proprietate *
                        </label>
                        <select
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none",
                            errors.propertyType && "border-destructive"
                          )}
                        >
                          <option value="">Selectați tipul</option>
                          {propertyTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        {errors.propertyType && (
                          <p className="text-destructive text-[10px] font-bold">
                            {errors.propertyType}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-black uppercase text-slate-400">
                          Motiv Contact *
                        </label>
                        <select
                          name="interest"
                          value={formData.interest}
                          onChange={handleChange}
                          className={cn(
                            "w-full px-4 py-3 sm:py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none",
                            errors.interest && "border-destructive"
                          )}
                        >
                          <option value="">Selectați motivul</option>
                          {interests.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        {errors.interest && (
                          <p className="text-destructive text-[10px] font-bold">
                            {errors.interest}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* FIELD MESAJ ADAUGAT ÎNAPOI */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="text-[10px] sm:text-xs font-black uppercase text-slate-400"
                      >
                        Mesaj Suplimentar (Opțional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        placeholder="Spuneți-ne mai multe despre proiectul dumneavoastră..."
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      size="xl"
                      className="w-full h-14 sm:h-16 rounded-xl font-black text-base shadow-lg active:scale-95"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Se trimite..."
                      ) : (
                        <span className="flex items-center gap-2">
                          TRIMITE SOLICITAREA <Send className="w-4 h-4" />
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
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-slate-900 text-sm">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-xs text-slate-500 truncate">
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
      </div>
    </Layout>
  );
}
