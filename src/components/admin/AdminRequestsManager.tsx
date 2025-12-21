import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  CalendarX,
  Calendar,
  MapPin,
  Phone,
  User,
  Mail,
  Image as ImageIcon,
  MessageSquare,
  Filter,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { adminAPI } from "@/lib/api";

const serviceTypeLabels: Record<string, string> = {
  consultatie: "Consultație",
  oferta: "Cerere Ofertă",
  instalare: "Instalare",
  mentenanta: "Mentenanță",
  reparatie: "Reparație",
};

const statusConfig = {
  pending: {
    label: "În așteptare",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-800",
  },
  accepted: {
    label: "Acceptată",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Respinsă",
    icon: XCircle,
    className: "bg-red-100 text-red-800",
  },
  rescheduled: {
    label: "Reprogramată",
    icon: CalendarX,
    className: "bg-orange-100 text-orange-800",
  },
};

export const AdminRequestsManager = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State Paginare ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- State Filtre ---
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // --- State Dialog Răspuns ---
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseType, setResponseType] = useState<
    "accept" | "reject" | "reschedule"
  >("accept");
  const [responseMessage, setResponseMessage] = useState("");
  const [newDate, setNewDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Funcția care apelează backend-ul cu filtrele selectate
  const fetchAllRequests = async () => {
    setIsLoading(true);
    try {
      // Trimitem parametrii către adminAPI. Aceasta va face un GET către /admin/all?service_type=...&status=...
      const { data, error } = await adminAPI.getAllServiceRequests(
        filterType,
        filterStatus
      );

      if (error) throw new Error(error);
      setRequests(data || []);
    } catch (err: any) {
      toast({
        title: "Eroare sincronizare",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Re-executăm fetch-ul de fiecare dată când se schimbă filterType sau filterStatus
  useEffect(() => {
    fetchAllRequests();
  }, [filterType, filterStatus]);

  // Logica de paginare (pe datele deja filtrate de backend)
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const currentItems = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSendResponse = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      const payload = {
        status:
          responseType === "accept"
            ? "accepted"
            : responseType === "reject"
            ? "rejected"
            : "rescheduled",
        admin_response: responseMessage,
        new_proposed_date: responseType === "reschedule" ? newDate : undefined,
      };
      const { error } = await adminAPI.respondToServiceRequest(
        selectedRequest.id,
        payload
      );
      if (error) throw new Error(error);

      toast({
        title: "Succes!",
        description: "Răspunsul a fost trimis către client.",
      });
      setIsResponseDialogOpen(false);
      fetchAllRequests(); // Reîncărcăm lista după acțiune
    } catch (err: any) {
      toast({
        title: "Eroare",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#1a4925]" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Filtre */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl border shadow-sm">
        <Filter className="w-4 h-4 text-[#1a4925]" />
        <Select
          value={filterType}
          onValueChange={(v) => {
            setFilterType(v);
            setCurrentPage(1); // Resetăm la prima pagină la schimbarea filtrului
          }}
        >
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Tip serviciu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate serviciile</SelectItem>
            {Object.entries(serviceTypeLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filterStatus}
          onValueChange={(v) => {
            setFilterStatus(v);
            setCurrentPage(1); // Resetăm la prima pagină la schimbarea filtrului
          }}
        >
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate statusurile</SelectItem>
            <SelectItem value="pending">În așteptare</SelectItem>
            <SelectItem value="accepted">Acceptate</SelectItem>
            <SelectItem value="rejected">Respinse</SelectItem>
            <SelectItem value="rescheduled">Reprogramate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listă Cereri */}
      <div className="space-y-4">
        {currentItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed p-12 text-center text-slate-400">
            Nu există cereri care să corespundă filtrelor.
          </div>
        ) : (
          currentItems.map((request) => {
            const status =
              statusConfig[request.status as keyof typeof statusConfig] ||
              statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={request.id}
                className="bg-white rounded-3xl border p-6 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-[#1a4925]">
                        {serviceTypeLabels[request.type] || request.type}
                      </Badge>
                      <Badge
                        className={cn(
                          "gap-1 uppercase font-bold text-[10px]",
                          status.className
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                      <span className="text-[11px] font-bold text-slate-400 ml-auto">
                        ID: {request.id.slice(0, 8)}
                      </span>
                    </div>

                    {/* Date Client */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#1a4925]" />
                        <div>
                          <p className="text-[10px] uppercase font-black text-slate-400">
                            Client
                          </p>
                          <p className="text-sm font-bold">
                            {request.user
                              ? `${request.user.first_name} ${request.user.last_name}`
                              : "Utilizator necunoscut"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-[#1a4925]" />
                        <div>
                          <p className="text-[10px] uppercase font-black text-slate-400">
                            Email
                          </p>
                          <p className="font-bold truncate">
                            {request.user?.email || "Nespecificat"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Phone className="w-4 h-4 text-[#1a4925]" />
                        <div>
                          <p className="text-[10px] uppercase font-black text-slate-400">
                            Telefon
                          </p>
                          <p className="font-bold">{request.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(request.preferred_date).toLocaleDateString(
                            "ro-RO"
                          )}{" "}
                          | {request.preferred_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.location}</span>
                      </div>
                    </div>

                    {/* Galerie Foto */}
                    {request.photos && request.photos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Atașamente (
                          {request.photos.length})
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {request.photos.map((url: string, idx: number) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 hover:border-[#1a4925] transition-all group bg-slate-50"
                            >
                              <img
                                src={url}
                                alt={`Atașament ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/100x100?text=Error";
                                }}
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="w-4 h-4 text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.admin_response && (
                      <div className="p-3 bg-slate-50 border-l-4 border-[#1a4925] rounded-r-xl text-xs italic text-slate-600">
                        Răspuns Admin: {request.admin_response}
                      </div>
                    )}
                  </div>

                  {/* Butoane Acțiuni */}
                  {request.status === "pending" && (
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <Button
                        className="bg-[#1a4925] hover:bg-[#1a4925]/90 rounded-xl"
                        onClick={() => {
                          setSelectedRequest(request);
                          setResponseType("accept");
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> Acceptă
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => {
                          setSelectedRequest(request);
                          setResponseType("reschedule");
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <CalendarX className="w-4 h-4 mr-2" /> Reprogramează
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-100 rounded-xl hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          setSelectedRequest(request);
                          setResponseType("reject");
                          setIsResponseDialogOpen(true);
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Respinge
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Componentă Paginare */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-8 h-8 rounded-lg",
                  currentPage === page && "bg-[#1a4925] hover:bg-[#1a4925]/90"
                )}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Modal Răspuns */}
      <Dialog
        open={isResponseDialogOpen}
        onOpenChange={setIsResponseDialogOpen}
      >
        <DialogContent className="rounded-3xl max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Răspuns către {selectedRequest?.user?.first_name || "Client"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {responseType === "reschedule" && (
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-slate-400">
                  Noua dată propusă
                </Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-slate-400">
                Mesaj (opțional)
              </Label>
              <Textarea
                placeholder="Detalii suplimentare despre decizie..."
                rows={4}
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="rounded-2xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isSubmitting}
              onClick={handleSendResponse}
              className={cn(
                "w-full rounded-xl",
                responseType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#1a4925] hover:bg-[#1a4925]/90"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <MessageSquare className="w-4 h-4 mr-2" />
              )}
              Trimite Răspuns
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
