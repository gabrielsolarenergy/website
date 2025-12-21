import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sun,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show2FAInput, setShow2FAInput] = useState(false);

  const { login, setPendingEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(
      email,
      password,
      show2FAInput ? totpCode : undefined
    );

    if (result.success) {
      toast({
        title: "Bine ai revenit!",
        description: "Te-ai autentificat cu succes în platformă.",
      });
      navigate("/dashboard");
    } else if (result.requires2FA) {
      setShow2FAInput(true);
      toast({
        title: "Verificare 2FA necesară",
        description: "Introdu codul din aplicația de autentificare.",
      });
    } else {
      const errorMsg = result.error?.toLowerCase() || "";
      if (errorMsg.includes("verific") || errorMsg.includes("not verified")) {
        toast({
          title: "Cont neactivat",
          description:
            "Te rugăm să verifici adresa de email pentru a activa contul.",
        });
        setPendingEmail(email);
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          title: "Autentificare eșuată",
          description: result.error || "Datele introduse sunt incorecte.",
          variant: "destructive",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-x-hidden font-sans">
      {/* --- Secțiunea Stângă: Design Complex (Vizibilă pe Desktop) --- */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1509391366360-fe5bb65831bb?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />

        <div className="relative z-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-white group w-fit transition-all hover:translate-x-[-4px]"
          >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Înapoi la site-ul principal</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-accent/20 w-fit p-3 rounded-2xl mb-8 animate-pulse">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Gestionează-ți propria{" "}
            <span className="text-accent underline decoration-white/20">
              revoluție solară
            </span>
            .
          </h2>

          <div className="space-y-6">
            {[
              "Monitorizare în timp real a producției tale",
              "Acces securizat la documente și subvenții",
              "Suport tehnic 24/7 dedicat prosumatorilor",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-accent/30 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-lg opacity-90">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <p className="text-white/80 text-sm leading-relaxed">
              "Peste 2,500 de locuințe din România sunt monitorizate zilnic prin
              portalul nostru SOLAR ENERGY."
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-white/40 text-xs tracking-widest uppercase">
            Platformă v2.4.0
          </p>
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} GABRIEL SOLAR ENERGY
          </p>
        </div>
      </div>

      {/* --- Secțiunea Dreaptă: Formular (Full Responsive) --- */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 lg:p-20">
        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Înapoi</span>
        </Link>

        <div className="w-full max-w-md space-y-8 animate-fade-up">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
              <Sun className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Autentificare
              </h1>
              <p className="text-muted-foreground font-sans">
                Bine ai revenit! Te rugăm să introduci datele tale.
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
                  disabled={show2FAInput}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold font-sans text-muted-foreground"
                >
                  Parolă
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Ai uitat parola?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                  required
                  disabled={show2FAInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* 2FA Input */}
            {show2FAInput && (
              <div className="space-y-2 animate-fade-up">
                <Label
                  htmlFor="totp"
                  className="text-sm font-semibold font-sans text-muted-foreground"
                >
                  Cod 2FA (din Google Authenticator)
                </Label>
                <div className="relative group">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="totp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) =>
                      setTotpCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20 text-center text-xl tracking-widest font-mono"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Se conectează...
                </span>
              ) : show2FAInput ? (
                "Verifică Codul"
              ) : (
                "Conectează-te"
              )}
            </Button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <span className="relative bg-background px-4 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Sau
            </span>
          </div>

          <p className="text-center text-sm text-muted-foreground font-sans">
            Nu ai cont?{" "}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline"
            >
              Creează un cont nou
            </Link>
          </p>

          {/* Date Testare */}
        </div>
      </div>
    </div>
  );
};

export default Login;
