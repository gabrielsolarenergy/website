import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

// Import imagine fundal Hero
import contactHeroImage from "@/assets/commercial-solar.jpg";

const contactInfo = [
  {
    icon: MapPin,
    title: "Vizitați Biroul Nostru",
    details: ["Bd. Energiei nr. 123, Etaj 4", "București, Sector 1, 010101"],
  },
  {
    icon: Phone,
    title: "Sunați-ne",
    details: ["+40 722 000 000", "+40 733 000 000"],
  },
  {
    icon: Mail,
    title: "Trimiteți Email",
    details: [
      "contact@gabriel-solar-energy.com",
      "suport@gabriel-solar-energy.com",
    ],
  },
  {
    icon: Clock,
    title: "Program de Lucru",
    details: ["Luni - Vineri: 08:00 - 18:00", "Sâmbătă: 09:00 - 14:00"],
  },
];

const propertyTypes = [
  "Casă rezidențială",
  "Clădire comercială",
  "Unitate industrială",
  "Agricol / Fermă",
];

const interests = [
  "Instalație nouă",
  "Upgrade sistem existent",
  "Mentenanță / Service",
  "Opțiuni de finanțare",
  "Informații generale",
];

const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Prenumele este obligatoriu")
    .max(50, "Prenume prea lung"),
  lastName: z
    .string()
    .trim()
    .min(1, "Numele este obligatoriu")
    .max(50, "Nume prea lung"),
  email: z
    .string()
    .trim()
    .email("Adresă de email invalidă")
    .max(100, "Email prea lung"),
  phone: z
    .string()
    .trim()
    .min(10, "Numărul de telefon trebuie să aibă cel puțin 10 cifre")
    .max(20, "Număr de telefon prea lung"),
  propertyType: z.string().min(1, "Vă rugăm să selectați tipul proprietății"),
  interest: z.string().min(1, "Vă rugăm să selectați motivul contactului"),
  message: z.string().trim().max(1000, "Mesaj prea lung").optional(),
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
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      contactSchema.parse(formData);
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        property_type: formData.propertyType,
        interest: formData.interest,
        message: formData.message || "Fără mesaj suplimentar",
      };

      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        "https://server-production-da32.up.railway.app/api/v1";

      const response = await fetch(`${API_BASE_URL}/solar/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Cerere trimisă cu succes!",
          description:
            "Echipa Gabriel Solar Energy vă va contacta în maximum 24 de ore.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          propertyType: "",
          interest: "",
          message: "",
        });
      } else {
        throw new Error(data.detail || "Eroare la trimiterea solicitării.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0])
            fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Eroare server",
          description:
            error instanceof Error ? error.message : "A apărut o problemă.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section - Identică cu Home/Systems/Services */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden font-sans">
        {/* Fundalul - Imaginea și Overlay-ul */}
        <div className="absolute inset-0 z-0">
          <img
            src={contactHeroImage}
            alt="Contact Gabriel Solar Energy"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32 px-4 sm:px-0">
          <div className="max-w-4xl mx-auto md:mx-0">
            {/* Badge-ul */}
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <Phone className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                Suport disponibil 24/7
              </span>
            </div>

            {/* Titlul - Scalat fluid */}
            <h1
              className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight
              text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]"
            >
              <span className="block">Obțineți oferta</span>
              <span className="text-gradient-diagonal block md:inline">
                solară gratuită.
              </span>
            </h1>

            {/* Descrierea */}
            <p
              className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200
              text-base md:text-xl md:text-white/80 font-medium"
            >
              Sunteți gata să economisiți cu energia solară? Completați
              formularul de mai jos, iar experții noștri vă vor oferi o ofertă
              personalizată în 24 de ore – complet gratuit, fără nicio
              obligație.
            </p>

            {/* Checkmarks */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 animate-fade-up animation-delay-300 border-t border-white/10 pt-8">
              {[
                { label: "Consultanță gratuită" },
                { label: "Fără obligații" },
                { label: "Răspuns în 24h" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="bg-accent/20 p-1 rounded-full shrink-0">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-white/90 text-sm md:text-base font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-background px-4">
        <div className="container-section">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl">
                <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">
                  Solicită o ofertă gratuită
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        Prenume *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-xl border ${
                          errors.firstName
                            ? "border-destructive"
                            : "border-slate-200"
                        } bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                        placeholder="Ex: Ion"
                      />
                      {errors.firstName && (
                        <p className="text-destructive text-xs mt-1 flex items-center gap-1 font-bold italic">
                          <AlertCircle className="w-3 h-3" /> {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        Nume *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-xl border ${
                          errors.lastName
                            ? "border-destructive"
                            : "border-slate-200"
                        } bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                        placeholder="Ex: Popescu"
                      />
                      {errors.lastName && (
                        <p className="text-destructive text-xs mt-1 flex items-center gap-1 font-bold italic">
                          <AlertCircle className="w-3 h-3" /> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-xl border ${
                          errors.email
                            ? "border-destructive"
                            : "border-slate-200"
                        } bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                        placeholder="ion.popescu@exemplu.ro"
                      />
                      {errors.email && (
                        <p className="text-destructive text-xs mt-1 flex items-center gap-1 font-bold italic">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-xl border ${
                          errors.phone
                            ? "border-destructive"
                            : "border-slate-200"
                        } bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all`}
                        placeholder="0722 000 000"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-xs mt-1 flex items-center gap-1 font-bold italic">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        Tip Proprietate *
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                      >
                        <option value="">Selectați tipul</option>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        Interesat de *
                      </label>
                      <select
                        name="interest"
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                      >
                        <option value="">Selectați motivul</option>
                        {interests.map((interest) => (
                          <option key={interest} value={interest}>
                            {interest}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase text-slate-400 tracking-wider">
                      Detalii suplimentare
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium"
                      placeholder="Spuneți-ne mai multe despre proiectul dvs..."
                    />
                  </div>

                  <Button
                    variant="accent"
                    size="xl"
                    className="w-full h-16 rounded-2xl font-black text-lg shadow-2xl transition-transform active:scale-95"
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
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 mb-1 leading-tight">
                        {info.title}
                      </h3>
                      {info.details.map((detail) => (
                        <p
                          key={detail}
                          className="text-sm text-slate-500 font-medium leading-relaxed"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-primary rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 p-10 opacity-10">
                  <Phone className="w-40 h-40" />
                </div>
                <h3 className="font-display text-xl font-black mb-3 relative z-10">
                  Asistență de urgență
                </h3>
                <p className="text-primary-foreground/70 text-sm mb-6 relative z-10 font-medium leading-relaxed">
                  Sistemul nu funcționează corect? Echipa noastră de urgență
                  este disponibilă 24/7 pentru clienții existenți.
                </p>
                <Button
                  variant="accent"
                  className="w-full h-12 font-black rounded-xl relative z-10"
                  asChild
                >
                  <a
                    href="tel:+40722000000"
                    className="flex items-center justify-center gap-2 italic"
                  >
                    LINIA DE URGENȚĂ <Phone className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="container-section py-12 px-4 text-center">
          <h2 className="font-display text-3xl font-black text-slate-900 mb-4 tracking-tighter">
            LOCALIZARE BIROU
          </h2>
          <p className="text-slate-500 font-medium">
            Bd. Energiei nr. 123, București, Sector 1
          </p>
        </div>
        <div className="h-[450px] bg-slate-200 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 flex items-center justify-center border-t border-slate-100">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
              Harta Interactivă în integrare
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
