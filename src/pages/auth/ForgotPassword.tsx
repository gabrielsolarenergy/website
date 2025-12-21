import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await forgotPassword(email);
    setIsLoading(false);

    // Întotdeauna setăm succesul ca fiind adevărat pentru securitate (email enumeration prevention)
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-x-hidden font-sans">
      {/* --- Secțiunea Stângă: Design Complex (Identic cu Login) --- */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1509391366360-fe5bb65831bb?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />

        <div className="relative z-10">
          <Link
            to="/login"
            className="flex items-center gap-2 text-white group w-fit transition-all hover:translate-x-[-4px]"
          >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Înapoi la autentificare</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-accent/20 w-fit p-3 rounded-2xl mb-8 animate-pulse">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Recuperează accesul la{" "}
            <span className="text-accent underline decoration-white/20">
              energia ta verde
            </span>
            .
          </h2>

          <div className="space-y-6">
            {[
              "Proces de recuperare securizat și rapid",
              "Protecție avansată a datelor personale",
              "Asistență tehnică pentru accesul în cont",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-accent/30 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-lg opacity-90">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-white/40 text-xs tracking-widest uppercase">
            Securitate Portal v2.4.0
          </p>
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} GABRIEL SOLAR ENERGY
          </p>
        </div>
      </div>

      {/* --- Secțiunea Dreaptă: Formular --- */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 lg:p-20">
        <Link
          to="/login"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Înapoi</span>
        </Link>

        <div className="w-full max-w-md space-y-8 animate-fade-up">
          {!isSuccess ? (
            <>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
                  <Mail className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Ai uitat parola?
                  </h1>
                  <p className="text-muted-foreground font-sans">
                    Introdu adresa de e-mail și îți vom trimite un link pentru
                    a-ți reseta parola.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold font-sans text-muted-foreground"
                  >
                    Adresă de Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nume@exemplu.ro"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Se trimite...
                    </span>
                  ) : (
                    "Trimite link-ul de resetare"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center shadow-xl shadow-accent/10">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Verifică-ți e-mailul
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Dacă există un cont asociat adresei{" "}
                  <span className="font-bold text-foreground">{email}</span>,
                  vei primi un link de resetare în câteva momente.
                </p>
              </div>
              <div className="w-full pt-4 space-y-4">
                <Button
                  asChild
                  className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  <Link to="/login">Înapoi la autentificare</Link>
                </Button>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Încearcă o altă adresă de e-mail
                </button>
              </div>
            </div>
          )}

          <p className="text-center lg:text-left text-sm text-muted-foreground font-sans pt-4">
            Îți amintești parola?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
            >
              Conectează-te aici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
