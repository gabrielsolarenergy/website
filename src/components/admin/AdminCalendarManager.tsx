import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Mail,
  Phone,
  Info,
  ExternalLink,
  Badge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { adminAPI } from "@/lib/api";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  location: string;
  email: string;
  phone: string;
  color: string;
  type: string;
}

const eventColors = [
  { value: "primary", label: "Verde", class: "bg-[#1a4925]" },
  { value: "blue", label: "Albastru", class: "bg-blue-500" },
  { value: "orange", label: "Portocaliu", class: "bg-orange-500" },
];

const daysOfWeek = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const months = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

export const AdminCalendarManager = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    location: "",
    email: "",
    phone: "",
    color: "primary",
    type: "Intervenție Manuală",
  });

  // --- ÎNCĂRCARE DATE DIN DB ---
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Preluăm toate cererile acceptate din baza de date
      const { data, error } = await adminAPI.getAllServiceRequests(
        undefined,
        "accepted"
      );
      if (error) throw new Error(error);

      const formatted = (data || []).map((req: any) => {
        const d = new Date(req.preferred_date);
        const [h, m] = req.preferred_time.split(":").map(Number);
        d.setHours(h, m);
        return {
          id: req.id,
          title: req.user
            ? `${req.user.first_name} ${req.user.last_name}`
            : req.title || "Client Extern",
          description: req.description || "Fără descriere",
          start: d,
          location: req.location || "Nespecificată",
          email: req.user?.email || req.email || "Fără email",
          phone: req.phone || "Fără telefon",
          color: "primary",
          type: req.type,
        };
      });
      setEvents(formatted);
    } catch (err) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele din server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // --- SALVARE ÎN BAZA DE DATE ---
  const handleManualSave = async () => {
    if (!formData.title || !formData.date) return;
    setIsSaving(true);

    try {
      // Apelăm API-ul pentru a salva permanent programarea
      const { error } = await adminAPI.createCalendarEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        type: formData.type,
      });

      if (error) throw new Error(error);

      // Reîncărcăm datele de la server pentru a include noul eveniment salvat
      await fetchEvents();

      toast({
        title: "Succes",
        description: "Programarea a fost salvată permanent în baza de date.",
      });
      setIsEditorOpen(false);
      // Resetare formular
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        location: "",
        email: "",
        phone: "",
        color: "primary",
        type: "Intervenție Manuală",
      });
    } catch (err) {
      toast({
        title: "Eroare la salvare",
        description: "Nu s-a putut salva în baza de date.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) days.push(new Date(year, month, i));
    return days;
  };

  const getEventsForDate = (date: Date) =>
    events.filter((e) => e.start.toDateString() === date.toDateString());

  const todayEvents = events.filter(
    (e) => e.start.toDateString() === new Date().toDateString()
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header cu Navigare */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-black min-w-[160px] text-center uppercase tracking-tighter">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="font-bold text-[#1a4925]"
              onClick={() => setCurrentDate(new Date())}
            >
              Azi
            </Button>
          </div>
          <Button
            onClick={() => setIsEditorOpen(true)}
            className="bg-[#1a4925] rounded-xl px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> Programare Manuală
          </Button>
        </div>

        {/* Grid Calendar */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 border-b bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {getMonthDays(currentDate).map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "min-h-[130px] p-2 border-b border-r last:border-r-0 transition-colors",
                  day ? "bg-white hover:bg-slate-50/50" : "bg-slate-50/20"
                )}
              >
                {day && (
                  <>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black mb-2",
                        day.toDateString() === new Date().toDateString()
                          ? "bg-[#1a4925] text-white shadow-lg"
                          : "text-slate-400"
                      )}
                    >
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(day).map((event) => (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "px-2 py-1.5 rounded-lg text-[10px] font-bold text-white truncate cursor-help shadow-sm",
                                eventColors.find((c) => c.value === event.color)
                                  ?.class || "bg-primary"
                              )}
                            >
                              {event.start.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              - {event.title}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="p-0 w-80 bg-white border-slate-100 shadow-2xl rounded-2xl overflow-hidden">
                            <div className="bg-[#1a4925] p-4 text-white">
                              <p className="text-[10px] font-black uppercase opacity-60">
                                Detalii Intervenție
                              </p>
                              <h4 className="text-lg font-bold mt-1">
                                {event.title}
                              </h4>
                            </div>
                            <div className="p-4 space-y-3 text-xs">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 font-bold">
                                  <Phone className="w-3 h-3 text-[#1a4925]" />{" "}
                                  {event.phone}
                                </div>
                                <div className="flex items-center gap-2 font-bold">
                                  <Clock className="w-3 h-3 text-[#1a4925]" />{" "}
                                  {event.start.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 font-bold truncate">
                                <Mail className="w-3 h-3 text-[#1a4925]" />{" "}
                                {event.email}
                              </div>
                              <div className="flex items-center gap-2 font-bold">
                                <MapPin className="w-3 h-3 text-[#1a4925]" />{" "}
                                {event.location}
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-50 italic text-slate-500">
                                {event.description}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Secțiunea Intervenții Astăzi */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#1a4925]" /> Programări
              pentru Astăzi
            </h3>
            <Badge className="bg-[#1a4925]">
              {todayEvents.length} Programări
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-5 p-5 rounded-2xl border border-slate-50 bg-slate-50/30"
                >
                  <div className="w-1.5 h-full rounded-full bg-[#1a4925] self-stretch" />
                  <div className="flex-1 space-y-3">
                    <h4 className="text-base font-black text-slate-900">
                      {event.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#1a4925]" />{" "}
                        {event.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#1a4925]" />{" "}
                        {event.start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Mail className="w-3.5 h-3.5 text-[#1a4925]" />{" "}
                        {event.email}
                      </div>
                      <div className="flex items-center gap-2 col-span-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#1a4925]" />{" "}
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm font-bold text-slate-400 italic">
                Nicio intervenție programată pentru azi.
              </p>
            )}
          </div>
        </div>

        {/* Dialog Formular Programare Manuală */}
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="rounded-[2rem] max-w-md p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                Programare Manuală
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">
                  Nume Client
                </Label>
                <Input
                  className="rounded-xl"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Nume..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    Data
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    Ora
                  </Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    Telefon
                  </Label>
                  <Input
                    className="rounded-xl"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="07..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    Email
                  </Label>
                  <Input
                    className="rounded-xl"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">
                  Locație
                </Label>
                <Input
                  className="rounded-xl"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Adresa..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">
                  Descriere
                </Label>
                <Textarea
                  className="rounded-2xl"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>
                Anulează
              </Button>
              <Button
                onClick={handleManualSave}
                disabled={isSaving || !formData.title}
                className="bg-[#1a4925] rounded-xl px-8 font-bold"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin mr-2 w-4 h-4" />
                ) : (
                  <Plus className="mr-2 w-4 h-4" />
                )}{" "}
                Salvează în DB
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};
