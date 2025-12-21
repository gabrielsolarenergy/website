import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Shield, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const TwoFactorSetup = () => {
  const { user, setup2FA, verify2FA } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupLoading, setIsSetupLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.two_factor_enabled) {
      navigate("/dashboard");
      return;
    }

    const initSetup = async () => {
      const result = await setup2FA();
      setIsSetupLoading(false);

      if (result.success) {
        setQrCode(result.qrCode || null);
        setSecret(result.secret || null);
      } else {
        toast({
          title: "Setup Failed",
          description: result.error || "Could not initialize 2FA setup.",
          variant: "destructive",
        });
      }
    };

    initSetup();
  }, [user, navigate, setup2FA, toast]);

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const result = await verify2FA(code);
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      toast({
        title: "2FA Enabled!",
        description: "Two-factor authentication is now active.",
      });
      setTimeout(() => navigate("/dashboard"), 2000);
    } else {
      toast({
        title: "Verification Failed",
        description: result.error || "Invalid code. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">2FA Enabled!</h1>
          <p className="text-muted-foreground mb-6">
            Your account is now protected with two-factor authentication.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sun className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Gabriel Solar</span>
        </Link>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Setup 2FA</h1>
            <p className="text-muted-foreground">
              Scan the QR code with Google Authenticator or any TOTP app.
            </p>
          </div>

          {isSetupLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Setting up 2FA...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* QR Code */}
              {qrCode && (
                <div className="flex justify-center">
                  <div className="p-4 bg-background rounded-xl border border-border">
                    <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>
              )}

              {/* Secret Key */}
              {secret && (
                <div className="space-y-2">
                  <Label>Manual Entry Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={secret}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleCopySecret}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification Form */}
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-widest font-mono"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Enable 2FA"}
                </Button>
              </form>

              <div className="text-center">
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  Skip for Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;
