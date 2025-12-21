import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  CalendarX,
  Calendar,
  MapPin,
  Phone,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ServiceRequestData, ServiceType } from "./ServiceRequestForm";

interface UserRequestsListProps {
  requests: any[]; // Am pus any pentru a accepta atât camelCase cât și snake_case
  onViewRequest?: (request: ServiceRequestData) => void;
  onAcceptReschedule?: (requestId: string) => void;
}

const serviceTypeLabels: Record<ServiceType, string> = {
  consultatie: "Consultație",
  oferta: "Cerere ofertă",
  instalare: "Instalare",
  mentenanta: "Mentenanță",
  reparatie: "Reparație",
};

const statusConfig = {
  pending: {
    label: "În așteptare",
    icon: Clock,
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  accepted: {
    label: "Acceptată",
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Respinsă",
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  rescheduled: {
    label: "Reprogramare propusă",
    icon: CalendarX,
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
};

// Funcție helper pentru formatarea sigură a datei
const formatDate = (dateValue: any) => {
  if (!dateValue) return "N/A";
  try {
    const d = new Date(dateValue);
    return isNaN(d.getTime())
      ? "Dată invalidă"
      : d.toLocaleDateString("ro-RO", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  } catch (e) {
    return "Eroare dată";
  }
};

export const UserRequestsList: React.FC<UserRequestsListProps> = ({
  requests,
  onViewRequest,
  onAcceptReschedule,
}) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">Nu ai cereri active</h3>
        <p className="text-sm text-muted-foreground">
          Cererile tale de servicii vor apărea aici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        // Fallback-uri pentru denumirile din backend (snake_case)
        const currentStatus = (request.status ||
          "pending") as keyof typeof statusConfig;
        const status = statusConfig[currentStatus] || statusConfig.pending;
        const StatusIcon = status.icon;

        // Identificăm data preferată și data creării indiferent de format (camel vs snake)
        const prefDate = request.preferred_date || request.preferredDate;
        const prefTime = request.preferred_time || request.preferredTime;
        const creationDate = request.created_at || request.createdAt;
        const newDate = request.new_proposed_date || request.newProposedDate;

        return (
          <div
            key={request.id}
            className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="outline" className="font-medium text-xs">
                    {serviceTypeLabels[request.type as ServiceType] ||
                      request.type}
                  </Badge>
                  <Badge
                    className={cn(
                      "gap-1 text-[10px] uppercase font-bold",
                      status.className
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {formatDate(prefDate)} la{" "}
                      {prefTime || "Ora nespecificată"}
                    </span>
                  </div>
                  {request.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{request.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{request.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Trimis pe {formatDate(creationDate)}</span>
                  </div>
                </div>

                {/* Admin Response */}
                {(request.admin_response || request.adminResponse) && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary/20">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                      Răspuns admin:
                    </p>
                    <p className="text-sm text-slate-700">
                      {request.admin_response || request.adminResponse}
                    </p>
                  </div>
                )}

                {/* Reschedule proposal */}
                {currentStatus === "rescheduled" && newDate && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-tighter">
                          Nouă dată propusă de admin:
                        </p>
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                          {formatDate(newDate)}
                        </p>
                        <Button
                          size="sm"
                          className="mt-2 h-8 bg-orange-600 hover:bg-orange-700"
                          onClick={() => onAcceptReschedule?.(request.id)}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                          Acceptă noua dată
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 rounded-full"
                onClick={() => onViewRequest?.(request as ServiceRequestData)}
              >
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
