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
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, setPendingEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast({
        title: "Termeni necesari",
        description: "Te rugăm să accepți termenii și condițiile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await register({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      location,
    });

    if (result.success || result.requiresVerification) {
      toast({
        title: "Cont creat!",
        description: "Ți-am trimis codul de activare pe email.",
      });
      setPendingEmail(email);
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      const errorMsg = result.error?.toLowerCase() || "";
      if (
        errorMsg.includes("există") ||
        errorMsg.includes("already") ||
        errorMsg.includes("verific")
      ) {
        toast({
          title: "Cont existent",
          description: "Acest cont necesită verificare. Te redirecționăm...",
        });
        setPendingEmail(email);
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast({
          title: "Eroare",
          description: result.error || "Încearcă din nou.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background overflow-x-hidden font-sans">
      {/* --- SECȚIUNEA STÂNGĂ: BRANDING & VALOARE --- */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden flex-col justify-between p-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1509391366360-fe5bb65831bb?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />

        <div className="relative z-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-white group w-fit transition-all hover:translate-x-[-4px]"
          >
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium tracking-tight">Înapoi la site</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-accent/20 w-fit p-4 rounded-2xl mb-8 animate-fade-in shadow-xl shadow-accent/10">
            <Zap className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-6xl font-bold mb-8 leading-[1.1] tracking-tight">
            Gestionează-ți propria{" "}
            <span className="text-accent underline decoration-white/20 underline-offset-8 italic">
              revoluție solară
            </span>
            .
          </h2>

          <div className="space-y-6">
            {[
              "Monitorizare în timp real a producției",
              "Acces securizat la documente și subvenții",
              "Suport tehnic 24/7 pentru prosumatori",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group transition-all hover:translate-x-2"
              >
                <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-accent/30 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-lg opacity-90 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-white/40 text-xs tracking-widest uppercase font-bold">
            Portal Clienți v2.4
          </p>
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} GABRIEL SOLAR ENERGY
          </p>
        </div>
      </div>

      {/* --- SECȚIUNEA DREAPTĂ: FORMULAR --- */}
      <div className="relative flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        {/* Buton Back Mobil */}
        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors z-20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Înapoi</span>
        </Link>

        <div className="w-full max-w-md space-y-10 animate-fade-up">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform">
              <Sun className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Creează cont nou
              </h1>
              <p className="text-muted-foreground font-medium">
                Alătură-te celor peste 500 de familii care produc energie
                curată.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nume & Prenume Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-muted-foreground ml-1"
                >
                  Prenume
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="firstName"
                    placeholder="Ion"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-muted-foreground ml-1"
                >
                  Nume
                </Label>
                <Input
                  id="lastName"
                  placeholder="Popescu"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-muted-foreground ml-1"
              >
                Adresă Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
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

            {/* Telefon & Localitate Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-muted-foreground ml-1"
                >
                  Telefon
                </Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-semibold text-muted-foreground ml-1"
                >
                  Localitate
                </Label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="location"
                    placeholder="Ex: București"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Parolă */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-muted-foreground ml-1"
              >
                Parolă
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-muted/30 border-none transition-all focus:ring-2 focus:ring-primary/20"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full bg-muted",
                      password.length >= i * 2 && "bg-primary"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Termeni & Conditii */}
            <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-2xl border border-muted-foreground/5 transition-all hover:bg-muted/30">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(c) => setAcceptTerms(c as boolean)}
                className="mt-0.5"
              />
              <Label
                htmlFor="terms"
                className="text-xs leading-relaxed text-muted-foreground cursor-pointer select-none"
              >
                Sunt de acord cu{" "}
                <Link
                  to="/terms"
                  className="text-primary font-bold hover:underline"
                >
                  Termenii de utilizare
                </Link>{" "}
                și am citit{" "}
                <Link
                  to="/privacy"
                  className="text-primary font-bold hover:underline"
                >
                  Politica de Confidențialitate
                </Link>
                .
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Sun className="w-5 h-5 animate-spin" /> Se procesează...
                </span>
              ) : (
                "Creează cont gratuit"
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground font-medium">
            Ai deja un cont creat?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              Autentifică-te aici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
