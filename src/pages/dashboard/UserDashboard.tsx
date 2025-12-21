import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  FileText,
  Calendar,
  Wrench,
  MessageSquare,
  ClipboardList,
  PlusCircle,
  Settings,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserCalendarView } from "@/components/dashboard/UserCalendarView";
import {
  ServiceRequestForm,
  ServiceType,
  ServiceRequestData,
} from "@/components/dashboard/ServiceRequestForm";
import { UserRequestsList } from "@/components/dashboard/UserRequestsList";

// IMPORTĂM API_URL ca named export (cu acolade) pentru a evita eroarea [object Object]
import { serviceAPI, adminAPI, getToken, API_URL } from "@/lib/api";

const serviceOptions: {
  type: ServiceType;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    type: "consultatie",
    label: "Consultație gratuită",
    icon: MessageSquare,
    description: "Programează o consultație cu experții noștri",
  },
  {
    type: "oferta",
    label: "Cerere ofertă",
    icon: FileText,
    description: "Primește o ofertă personalizată",
  },
  {
    type: "instalare",
    label: "Cerere instalare",
    icon: Zap,
    description: "Solicită instalarea unui sistem",
  },
  {
    type: "mentenanta",
    label: "Programare mentenanță",
    icon: Settings,
    description: "Programează o vizită de mentenanță",
  },
  {
    type: "reparatie",
    label: "Cerere reparație",
    icon: Wrench,
    description: "Raportează o problemă tehnică",
  },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "requests" | "calendar"
  >("overview");

  const [profileData, setProfileData] = useState({
    phone: user?.phone_number || "",
    location: user?.location || "",
  });

  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] =
    useState<ServiceType>("consultatie");

  // 1. Încărcare cereri de la API la montarea componentei
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await serviceAPI.getMyRequests();
        if (error) throw new Error(error);
        setUserRequests(data || []);
      } catch (err: any) {
        toast({
          title: "Eroare la încărcare",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, [user, toast]);

  // 2. Salvare Profil (Actualizare număr telefon și locație)
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const { error } = await adminAPI.updateUser(user.id, {
        phone_number: profileData.phone,
        location: profileData.location,
      });
      if (error) throw new Error(error);
      toast({
        title: "Profil actualizat",
        description: "Modificările au fost salvate.",
      });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: "Eroare",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 3. Trimitere Cerere Nouă folosind FormData (suport pentru fișiere binare/imagini)
  const handleSubmitRequest = async (data: ServiceRequestData) => {
    try {
      const formData = new FormData();

      // Adăugăm câmpurile text cerute de backend (snake_case)
      formData.append("type", data.type);
      formData.append("location", data.location);
      formData.append("phone", data.phone);
      formData.append("preferred_time", data.preferredTime);
      formData.append("description", data.description || "");

      // Formatăm data corect pentru Python (ISO String)
      const isoDate =
        data.preferredDate instanceof Date
          ? data.preferredDate.toISOString()
          : data.preferredDate;
      formData.append("preferred_date", isoDate);

      // Adăugăm imaginile în lista 'images' (trebuie să coincidă cu parametrul din Python)
      if (data.photos && data.photos.length > 0) {
        data.photos.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Folosim fetch direct pentru FormData, utilizând string-ul API_URL corect
      const response = await fetch(`${API_URL}/service-requests/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Eroare la trimiterea cererii");
      }

      const newRequest = await response.json();

      // Actualizăm starea locală pentru a afișa cererea imediat
      setUserRequests((prev) => [newRequest, ...prev]);
      setIsRequestFormOpen(false);

      toast({
        title: "Cerere trimisă",
        description:
          "Solicitarea a fost înregistrată cu succes în baza de date.",
      });
    } catch (err: any) {
      toast({
        title: "Eroare Validare",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // 4. Acceptare propunere de reprogramare de la admin
  const handleAcceptReschedule = async (requestId: string) => {
    try {
      const { error } = await serviceAPI.acceptReschedule(requestId);
      if (error) throw new Error(error);

      // Reîncărcăm lista pentru a vedea statusul actualizat
      const { data } = await serviceAPI.getMyRequests();
      setUserRequests(data || []);

      toast({ title: "Confirmat", description: "Noua dată a fost acceptată." });
    } catch (err: any) {
      toast({
        title: "Eroare",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-10 h-10 animate-spin text-[#1a4925]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Titlu și Bun venit */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Salut, {user?.first_name || "Utilizator"}!
          </h1>
          <p className="text-slate-500 font-medium">
            Panoul tău de control Gabriel Solar.
          </p>
        </div>

        {/* Meniu Navigare (Tabs) */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 justify-center sm:justify-start">
          <Button
            variant={activeTab === "overview" ? "default" : "secondary"}
            onClick={() => setActiveTab("overview")}
            className="rounded-full px-6"
          >
            <User className="w-4 h-4 mr-2" /> Profil
          </Button>
          <Button
            variant={activeTab === "requests" ? "default" : "secondary"}
            onClick={() => setActiveTab("requests")}
            className="rounded-full px-6"
          >
            <ClipboardList className="w-4 h-4 mr-2" /> Cereri (
            {userRequests.length})
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "secondary"}
            onClick={() => setActiveTab("calendar")}
            className="rounded-full px-6"
          >
            <Calendar className="w-4 h-4 mr-2" /> Calendar
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Secțiune Profil */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="h-24 bg-[#1a4925]" />
                <div className="px-6 pb-6 -mt-12">
                  <div className="w-24 h-24 bg-white border-4 border-white rounded-3xl flex items-center justify-center text-3xl font-black text-[#1a4925] mb-4 shadow-xl">
                    {user?.first_name?.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-sm text-slate-400 mb-6">{user?.email}</p>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Telefon
                        </Label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="rounded-xl border-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                          Localitate
                        </Label>
                        <Input
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          className="rounded-xl border-slate-100"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          disabled={isSavingProfile}
                          className="flex-1 bg-[#1a4925] rounded-xl h-11"
                        >
                          {isSavingProfile ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Salvează"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="rounded-xl h-11"
                        >
                          Anulează
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <Phone className="w-4 h-4 text-[#1a4925]" />
                        <span className="text-sm font-bold text-slate-700">
                          {profileData.phone || "Nespecificat"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <MapPin className="w-4 h-4 text-[#1a4925]" />
                        <span className="text-sm font-bold text-slate-700">
                          {profileData.location || "Nespecificat"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-2xl border-dashed border-2 font-bold text-[#1a4925] transition-all"
                        onClick={() => setIsEditing(true)}
                      >
                        Editează Profilul
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Secțiune Servicii Rapide */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => {
                      setSelectedServiceType(opt.type);
                      setIsRequestFormOpen(true);
                    }}
                    className="group p-5 bg-white rounded-3xl border border-slate-100 text-left hover:shadow-xl hover:shadow-slate-200/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#1a4925] group-hover:text-white transition-colors">
                      <opt.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      {opt.label}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Ultimele Cereri (Preview) */}
              {userRequests.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                      Ultimele Cereri
                    </h3>
                    <Button
                      variant="link"
                      className="text-[#1a4925] font-bold"
                      onClick={() => setActiveTab("requests")}
                    >
                      Vezi toate
                    </Button>
                  </div>
                  <UserRequestsList
                    requests={userRequests.slice(0, 3)}
                    onAcceptReschedule={handleAcceptReschedule}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                Cererile Mele
              </h2>
              <Button
                onClick={() => {
                  setSelectedServiceType("consultatie");
                  setIsRequestFormOpen(true);
                }}
                className="bg-[#1a4925] rounded-2xl h-11 px-6 font-bold"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Cerere Nouă
              </Button>
            </div>
            <UserRequestsList
              requests={userRequests}
              onAcceptReschedule={handleAcceptReschedule}
            />
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Calendar Intervenții
            </h2>
            <p className="text-slate-400 font-medium mb-8">
              Vizualizează programările tale și disponibilitatea echipei.
            </p>
            <UserCalendarView
              onSelectDate={() => {
                setSelectedServiceType("consultatie");
                setIsRequestFormOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* Formular Modal pentru Cereri Service */}
      <ServiceRequestForm
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
        serviceType={selectedServiceType}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
};

export default UserDashboard;
