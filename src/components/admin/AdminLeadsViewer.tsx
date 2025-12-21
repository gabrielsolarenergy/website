import React, { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  User,
  Eye,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { adminAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import CustomPagination from "@/components/common/CustomPagination";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  property_type: string;
  interest: string;
  message: string;
  status: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { value: "all", label: "Toate" },
  { value: "new", label: "Nou" },
  { value: "contacted", label: "Contactat" },
  { value: "qualified", label: "Calificat" },
  { value: "proposal", label: "Propunere" },
  { value: "won", label: "Câștigat" },
  { value: "lost", label: "Pierdut" },
];

export const AdminLeadsViewer = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Mock data for demo
  const mockLeads: Lead[] = [
    {
      id: "1",
      full_name: "Ion Popescu",
      email: "ion.popescu@example.com",
      phone: "+40 722 123 456",
      property_type: "Casă Rezidențială",
      interest: "Instalație Nouă",
      message: "Sunt interesat de un sistem solar pentru casa mea de 150mp. Am acoperiș orientat spre sud.",
      status: "new",
      created_at: "2024-12-19T10:30:00Z",
    },
    {
      id: "2",
      full_name: "Maria Ionescu",
      email: "maria.ionescu@company.ro",
      phone: "+40 733 456 789",
      property_type: "Clădire Comercială",
      interest: "Opțiuni de Finanțare",
      message: "Avem o clădire de birouri și vrem să aflăm despre opțiunile de finanțare disponibile.",
      status: "contacted",
      created_at: "2024-12-18T14:15:00Z",
    },
    {
      id: "3",
      full_name: "SC Green Energy SRL",
      email: "office@greenenergy.ro",
      phone: "+40 744 789 012",
      property_type: "Unitate Industrială",
      interest: "Instalație Nouă",
      message: "Dorim o ofertă pentru o instalație de 500kW pe hala noastră industrială.",
      status: "proposal",
      created_at: "2024-12-17T09:00:00Z",
    },
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await adminAPI.getLeads();
      if (data && data.length > 0) {
        setLeads(data);
      } else {
        setLeads(mockLeads);
      }
    } catch (e) {
      setLeads(mockLeads);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await adminAPI.updateLeadStatus(leadId, newStatus);
      setLeads(
        leads.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
      toast({
        title: "Status actualizat",
        description: "Statusul lead-ului a fost actualizat.",
      });
    } catch (e) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza statusul.",
        variant: "destructive",
      });
    }
  };

  // Filter and paginate
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      qualified: "bg-cyan-100 text-cyan-700",
      proposal: "bg-purple-100 text-purple-700",
      won: "bg-primary/20 text-primary",
      lost: "bg-destructive/10 text-destructive",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.label || status;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Caută după nume, email sau telefon..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Leads List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : paginatedLeads.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">Niciun lead găsit</h3>
          <p className="text-sm text-muted-foreground">
            Nu există lead-uri care să corespundă filtrelor selectate.
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Interes
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                    Data
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-foreground">
                            {lead.full_name}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {lead.property_type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-primary hover:underline"
                          >
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">{lead.interest}</td>
                    <td className="px-4 py-4">
                      <Select
                        value={lead.status}
                        onValueChange={(value) =>
                          handleStatusChange(lead.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                              lead.status
                            )}`}
                          >
                            {getStatusLabel(lead.status)}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions
                            .filter((s) => s.value !== "all")
                            .map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(lead.created_at).toLocaleDateString("ro-RO")}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Detalii
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Lead Detail Dialog */}
      <Dialog
        open={!!selectedLead}
        onOpenChange={() => setSelectedLead(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalii Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedLead.full_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedLead.property_type}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="font-medium"
                  >
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Interes</p>
                  <p className="font-medium">{selectedLead.interest}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {new Date(selectedLead.created_at).toLocaleString("ro-RO")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Mesaj</p>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm">{selectedLead.message || "—"}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" asChild>
                  <a href={`mailto:${selectedLead.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Trimite Email
                  </a>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a href={`tel:${selectedLead.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Sună
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeadsViewer;
