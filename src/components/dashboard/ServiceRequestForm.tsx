import React, { useState } from "react";
import {
  FileText,
  Upload,
  X,
  Send,
  Calendar,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserCalendarView } from "./UserCalendarView";

export type ServiceType =
  | "consultatie"
  | "oferta"
  | "instalare"
  | "mentenanta"
  | "reparatie";

interface ServiceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: ServiceType;
  onSubmit: (data: ServiceRequestData) => void;
}

export interface ServiceRequestData {
  id: string;
  type: ServiceType;
  preferredDate: Date | null;
  preferredTime: string;
  location: string;
  phone: string;
  description: string;
  photos: File[];
  status: "pending" | "accepted" | "rejected" | "rescheduled";
  createdAt: Date;
  adminResponse?: string;
  newProposedDate?: Date;
}

const serviceLabels: Record<ServiceType, { title: string; description: string }> = {
  consultatie: {
    title: "Consultație Gratuită",
    description: "Programează o consultație cu experții noștri pentru evaluarea proprietății tale.",
  },
  oferta: {
    title: "Cerere Ofertă Personalizată",
    description: "Încarcă poze și detalii pentru a primi o ofertă personalizată.",
  },
  instalare: {
    title: "Cerere Instalare",
    description: "Solicită instalarea unui sistem fotovoltaic.",
  },
  mentenanta: {
    title: "Programare Mentenanță",
    description: "Programează o vizită de mentenanță pentru sistemul tău.",
  },
  reparatie: {
    title: "Cerere Reparație",
    description: "Raportează o problemă și programează o intervenție tehnică.",
  },
};

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  isOpen,
  onClose,
  serviceType,
  onSubmit,
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    preferredTime: "09:00",
    location: "",
    phone: "",
    description: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).slice(0, 5 - photos.length);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast({
        title: "Selectează o dată",
        description: "Te rugăm să selectezi o dată preferată din calendar.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone) {
      toast({
        title: "Completează telefonul",
        description: "Numărul de telefon este necesar pentru a te contacta.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: ServiceRequestData = {
        id: Date.now().toString(),
        type: serviceType,
        preferredDate: selectedDate,
        preferredTime: formData.preferredTime,
        location: formData.location,
        phone: formData.phone,
        description: formData.description,
        photos,
        status: "pending",
        createdAt: new Date(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      onSubmit(requestData);
      toast({
        title: "Cerere trimisă!",
        description: "Vei primi un răspuns în curând.",
      });
      onClose();
      
      // Reset form
      setSelectedDate(null);
      setPhotos([]);
      setFormData({
        preferredTime: "09:00",
        location: "",
        phone: "",
        description: "",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut trimite cererea. Încearcă din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceInfo = serviceLabels[serviceType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {serviceInfo.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{serviceInfo.description}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Calendar */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Selectează data preferată *
            </Label>
            <UserCalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          {/* Time preference */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Ora preferată
              </Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) =>
                  setFormData({ ...formData, preferredTime: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                Telefon *
              </Label>
              <Input
                placeholder="+40 712 345 678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Locație / Adresă
            </Label>
            <Input
              placeholder="Orașul, strada, numărul..."
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descriere / Detalii</Label>
            <Textarea
              placeholder="Descrie cererea ta în detaliu..."
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Photo upload (for oferta/reparatie) */}
          {(serviceType === "oferta" || serviceType === "reparatie") && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                Încarcă fotografii (max 5)
              </Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={photos.length >= 5}
                />
                <label
                  htmlFor="photo-upload"
                  className={`flex flex-col items-center gap-2 cursor-pointer ${
                    photos.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click pentru a încărca sau trage fișierele aici
                  </span>
                </label>

                {photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border"
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Anulează
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Se trimite...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Trimite Cererea
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
