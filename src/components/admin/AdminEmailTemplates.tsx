import React, { useState } from "react";
import {
  Mail,
  Eye,
  Copy,
  Check,
  Edit,
  Code,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  html: string;
  variables: string[];
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: "verify_email",
    name: "Verificare Email",
    subject: "Activează-ți contul Gabriel Solar",
    description: "Trimis după înregistrare pentru verificarea adresei de email",
    variables: ["first_name", "verify_link"],
    html: `<div style="background-color: #f4f7f6; padding: 30px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
        <tr>
            <td align="center" style="padding: 40px 20px; background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">GABRIEL SOLAR</h1>
                <p style="color: #c8e6c9; margin: 5px 0 0 0; font-size: 14px; text-transform: uppercase;">Energie curată pentru viitor</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <h2 style="color: #2c3e50; margin-top: 0;">Salut, {{ first_name }}! 👋</h2>
                <p style="color: #546e7a; line-height: 1.6; font-size: 16px;">
                    Ne bucurăm să te avem alături! Pentru a activa contul tău pe platforma <strong>Gabriel Solar Energy</strong>, te rugăm să confirmi adresa de email apăsând butonul de mai jos.
                </p>
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                    <tr>
                        <td align="center">
                            <a href="{{ verify_link }}" style="background-color: #4caf50; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(76,175,80,0.2);">
                                ACTIVEAZĂ CONTUL ACUM
                            </a>
                        </td>
                    </tr>
                </table>
                <p style="color: #90a4ae; font-size: 13px; text-align: center;">
                    Link-ul este valabil 24 de ore. Dacă nu ai creat acest cont, poți ignora acest mesaj.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #fcfdfd; border-top: 1px solid #edf2f4; text-align: center;">
                <p style="color: #b0bec5; font-size: 12px; margin: 0;">
                    © 2025 Gabriel Solar Energy | România <br>
                    Sustenabilitate prin Tehnologie
                </p>
            </td>
        </tr>
    </table>
</div>`,
  },
  {
    id: "reset_password",
    name: "Resetare Parolă",
    subject: "Resetare parolă Gabriel Solar",
    description: "Trimis când utilizatorul solicită resetarea parolei",
    variables: ["first_name", "reset_link"],
    html: `<div style="background-color: #fefefe; padding: 30px; font-family: 'Segoe UI', sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border: 1px solid #eee; border-radius: 16px;">
        <tr>
            <td style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 50px;">🔒</span>
                </div>
                <h2 style="color: #2c3e50; text-align: center;">Resetare Parolă</h2>
                <p style="color: #546e7a; font-size: 16px; line-height: 1.6;">
                    Salut, <strong>{{ first_name }}</strong>. Am primit o solicitare de resetare a parolei pentru contul tău. Dacă tu ai făcut această cerere, apasă butonul de mai jos:
                </p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href="{{ reset_link }}" style="background-color: #d32f2f; color: #ffffff; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: bold; display: inline-block;">
                        RESETEAZĂ PAROLA
                    </a>
                </div>
                <p style="color: #f44336; font-size: 12px; background-color: #fff5f5; padding: 10px; border-radius: 5px; text-align: center;">
                    Link-ul expiră în 15 minute din motive de securitate.
                </p>
            </td>
        </tr>
    </table>
</div>`,
  },
  {
    id: "contact_notification",
    name: "Notificare Contact",
    subject: "🚀 Lead Nou de pe Site",
    description: "Trimis adminilor când cineva completează formularul de contact",
    variables: ["full_name", "email", "phone", "interest", "message"],
    html: `<div style="background-color: #eceff1; padding: 30px; font-family: 'Segoe UI', sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 30px; background-color: #1976d2; border-radius: 8px 8px 0 0;">
                <h2 style="color: #ffffff; margin: 0;">🚀 Lead Nou de pe Site</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px;">
                <table width="100%" style="border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #78909c; font-size: 14px;">CLIENT</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #263238; font-weight: bold; text-align: right;">{{ full_name }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #78909c; font-size: 14px;">EMAIL</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #1976d2; font-weight: bold; text-align: right;">{{ email }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #78909c; font-size: 14px;">TELEFON</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #263238; font-weight: bold; text-align: right;">{{ phone }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #78909c; font-size: 14px;">INTERES</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #f0f4f8; color: #388e3c; font-weight: bold; text-align: right;">{{ interest }}</td>
                    </tr>
                </table>
                <div style="margin-top: 25px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #1976d2;">
                    <strong style="color: #455a64; display: block; margin-bottom: 8px;">MESAJ CLIENT:</strong>
                    <p style="color: #546e7a; font-style: italic; margin: 0; line-height: 1.5;">"{{ message }}"</p>
                </div>
            </td>
        </tr>
    </table>
</div>`,
  },
];

export const AdminEmailTemplates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(
    null
  );
  const [editedHtml, setEditedHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedHtml(template.html);
  };

  const handleSave = () => {
    if (!selectedTemplate) return;

    setTemplates(
      templates.map((t) =>
        t.id === selectedTemplate.id ? { ...t, html: editedHtml } : t
      )
    );
    toast({
      title: "Template salvat!",
      description: "Modificările au fost salvate. Copiază codul pentru backend.",
    });
  };

  const handleCopy = async (html: string, id: string) => {
    await navigator.clipboard.writeText(html);
    setCopiedId(id);
    toast({
      title: "Copiat!",
      description: "Codul HTML a fost copiat în clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePreview = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  // Replace variables with sample data for preview
  const getPreviewHtml = (html: string) => {
    return html
      .replace(/\{\{\s*first_name\s*\}\}/g, "Ion")
      .replace(/\{\{\s*full_name\s*\}\}/g, "Ion Popescu")
      .replace(/\{\{\s*email\s*\}\}/g, "ion@example.com")
      .replace(/\{\{\s*phone\s*\}\}/g, "+40 722 123 456")
      .replace(/\{\{\s*interest\s*\}\}/g, "Instalație Nouă")
      .replace(/\{\{\s*message\s*\}\}/g, "Sunt interesat de un sistem solar pentru casa mea.")
      .replace(/\{\{\s*verify_link\s*\}\}/g, "#")
      .replace(/\{\{\s*reset_link\s*\}\}/g, "#");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Template-uri Email
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Editează template-urile și copiază codul HTML pentru a-l folosi în
          backend (EMAIL_TEMPLATES dict).
        </p>

        <div className="grid gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{template.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.variables.map((v) => (
                    <span
                      key={v}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-mono"
                    >
                      {`{{ ${v} }}`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(template)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(template)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editează
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(template.html, template.id)}
                >
                  {copiedId === template.id ? (
                    <Check className="w-4 h-4 mr-1 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 mr-1" />
                  )}
                  {copiedId === template.id ? "Copiat" : "Copiază"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selectedTemplate && !isPreviewOpen && (
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Editor: {selectedTemplate.name}
            </h3>
            <Button onClick={() => setSelectedTemplate(null)} variant="ghost">
              Închide
            </Button>
          </div>

          <Tabs defaultValue="code">
            <TabsList>
              <TabsTrigger value="code">Cod HTML</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="mt-4">
              <Textarea
                value={editedHtml}
                onChange={(e) => setEditedHtml(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                placeholder="Codul HTML al template-ului..."
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <div className="border border-border rounded-lg p-4 bg-white">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPreviewHtml(editedHtml),
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>Salvează Modificările</Button>
            <Button
              variant="outline"
              onClick={() => handleCopy(editedHtml, "edited")}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiază pentru Backend
            </Button>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Preview: {selectedTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="border border-border rounded-lg p-4 bg-white mt-4">
            <div
              dangerouslySetInnerHTML={{
                __html: selectedTemplate
                  ? getPreviewHtml(selectedTemplate.html)
                  : "",
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEmailTemplates;
