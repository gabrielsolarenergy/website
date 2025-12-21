import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Stări pentru gestionarea procesului
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Se verifică link-ul de activare...");

  // Folosim un ref pentru a preveni apelul dublu în React Strict Mode
  const verificationStarted = useRef(false);

  // Extragem token-ul din URL (ex: ?token=abc...)
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Link-ul de activare lipsește sau este invalid.");
        return;
      }

      try {
        // Schimbăm adresa către URL-ul tău de producție Railway
        const response = await fetch(
          `https://server-production-da32.up.railway.app/api/v1/auth/verify-email?token=${token}`,
          { method: "GET" }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Contul tău a fost activat cu succes!");
          toast({
            title: "Activare reușită",
            description: "Te poți autentifica acum în platformă.",
          });
          // Redirecționăm automat după 3 secunde
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(
            data.detail || "Link-ul a expirat sau a fost deja folosit."
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage("Eroare de conexiune cu serverul.");
      }
    };

    if (!verificationStarted.current) {
      verificationStarted.current = true;
      verifyAccount();
    }
  }, [token, navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center animate-fade-up font-sans">
        {/* Iconița Dinamică */}
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
              status === "loading"
                ? "bg-primary/10 border-primary/20"
                : status === "success"
                ? "bg-green-500/10 border-green-500/20"
                : "bg-red-500/10 border-red-500/20"
            }`}
          >
            {status === "loading" && (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
            )}
            {status === "error" && (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>

          <h1 className="text-3xl font-bold font-display">
            {status === "loading"
              ? "Verificăm Contul"
              : status === "success"
              ? "Activare Reușită!"
              : "Eroare Activare"}
          </h1>

          <p className="text-muted-foreground text-lg font-sans">{message}</p>
        </div>

        {/* Butoane de acțiune în caz de eroare */}
        {status === "error" && (
          <div className="pt-4 space-y-4">
            <Button
              onClick={() => navigate("/register")}
              className="w-full h-12 rounded-xl font-bold"
            >
              Înapoi la înregistrare
            </Button>
          </div>
        )}

        {status === "success" && (
          <Button
            onClick={() => navigate("/login")}
            className="w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white"
          >
            Mergi la Login
          </Button>
        )}

        <div className="pt-8">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            GABRIEL SOLAR ENERGY
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
