import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Edit,
  Trash2,
  Loader2,
  UserPlus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Users,
  Handshake,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import AdminLayout from "@/components/layout/AdminLayout";
import CustomPagination from "@/components/common/CustomPagination";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  property_type: string;
  interest: string;
  message?: string;
  status: string;
  source?: string;
  created_at: string;
  value?: string;
}

const LeadsManagement = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const ITEMS_PER_PAGE = 6;

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    property_type: "",
    interest: "",
    message: "",
    status: "nou",
    source: "Website",
  });

  useEffect(() => {
    fetchLeads();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await adminAPI.getLeads({
        page: currentPage,
        size: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        property_type: typeFilter !== "all" ? typeFilter : undefined,
      });

      if (error) {
        toast({ title: "Eroare", description: error, variant: "destructive" });
        setLeads([]);
      } else {
        setLeads(data?.items || []);
        setTotalPages(data?.total_pages || 1);
        setTotalItems(data?.total_items || 0);
      }
    } catch (e) {
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      property_type: "",
      interest: "",
      message: "",
      status: "nou",
      source: "Website",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      property_type: lead.property_type,
      interest: lead.interest,
      message: lead.message || "",
      status: lead.status,
      source: lead.source || "Website",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.property_type
    ) {
      toast({
        title: "Eroare",
        description: "Completează câmpurile obligatorii.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      const response = selectedLead
        ? await adminAPI.updateLead(selectedLead.id, formData)
        : await adminAPI.createLead(formData);

      if (response.error) {
        toast({
          title: "Eroare",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({ title: "Succes", description: "Lead-ul a fost salvat." });
        setIsDialogOpen(false);
        fetchLeads();
      }
    } catch (e) {
      toast({
        title: "Eroare",
        description: "Eroare la salvare.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLead) return;
    try {
      const { error } = await adminAPI.deleteLead(selectedLead.id);
      if (error) throw new Error(error);
      toast({ title: "Șters", description: "Lead-ul a fost eliminat." });
      setIsDeleteDialogOpen(false);
      fetchLeads();
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await adminAPI.updateLeadStatus(leadId, newStatus);
      if (error) throw new Error(error);
      toast({
        title: "Status actualizat",
        description: `Lead marcat ca ${newStatus}.`,
      });
      fetchLeads();
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      nou: "bg-blue-100 text-blue-700",
      contactat: "bg-yellow-100 text-yellow-700",
      calificat: "bg-cyan-100 text-cyan-700",
      propus: "bg-purple-100 text-purple-700",
      negociere: "bg-orange-100 text-orange-700",
      castigat: "bg-[#1a4925]/10 text-[#1a4925]",
      pierdut: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Gestionare <span className="text-[#1a4925]">Lead-uri</span>
          </h1>
          <Button
            onClick={handleCreate}
            className="bg-[#1a4925] hover:bg-[#1a4925]/90 rounded-xl font-bold"
          >
            <Plus className="w-4 h-4 mr-2" /> Adaugă Lead
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <p className="text-3xl font-black text-slate-900">{totalItems}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Rezultate
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Caută după nume, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-slate-100"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 rounded-xl border-slate-100">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Statusurile</SelectItem>
              <SelectItem value="nou">Nou</SelectItem>
              <SelectItem value="contactat">Contactat</SelectItem>
              <SelectItem value="calificat">Calificat</SelectItem>
              <SelectItem value="propus">Ofertă</SelectItem>
              <SelectItem value="negociere">Negociere</SelectItem>
              <SelectItem value="castigat">Câștigat</SelectItem>
              <SelectItem value="pierdut">Pierdut</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full lg:w-48 rounded-xl border-slate-100">
              <SelectValue placeholder="Toate Tipurile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Tipurile</SelectItem>
              <SelectItem value="Casă rezidențială">
                Casă rezidențială
              </SelectItem>
              <SelectItem value="Clădire comercială">
                Clădire comercială
              </SelectItem>
              <SelectItem value="Unitate industrială">
                Unitate industrială
              </SelectItem>
              <SelectItem value="Agricol / Fermă">Agricol / Fermă</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a4925]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Client
                    </th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-[#1a4925] font-black text-xs">
                            {lead.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {lead.full_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {lead.property_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-xs text-slate-600 font-medium">
                          {lead.email}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lead.phone}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                            getStatusBadge(lead.status)
                          )}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-64 p-2 rounded-2xl shadow-xl border-slate-100"
                          >
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsViewDialogOpen(true);
                              }}
                              className="rounded-xl cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2 text-slate-400" />{" "}
                              Detalii Lead
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2 bg-slate-50" />
                            <p className="px-2 py-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              Schimbă Status
                            </p>

                            <DropdownMenuItem
                              onClick={() => handleStatusChange(lead.id, "nou")}
                              className="rounded-xl cursor-pointer"
                            >
                              <Clock className="w-4 h-4 mr-2 text-blue-500" />{" "}
                              Marchează Nou
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(lead.id, "contactat")
                              }
                              className="rounded-xl cursor-pointer"
                            >
                              <Send className="w-4 h-4 mr-2 text-yellow-500" />{" "}
                              Marchează Contactat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(lead.id, "calificat")
                              }
                              className="rounded-xl cursor-pointer"
                            >
                              <Users className="w-4 h-4 mr-2 text-cyan-500" />{" "}
                              Marchează Calificat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(lead.id, "propus")
                              }
                              className="rounded-xl cursor-pointer"
                            >
                              <FileText className="w-4 h-4 mr-2 text-purple-500" />{" "}
                              Marchează Ofertă
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(lead.id, "negociere")
                              }
                              className="rounded-xl cursor-pointer"
                            >
                              <Handshake className="w-4 h-4 mr-2 text-orange-500" />{" "}
                              Marchează Negociere
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(lead.id, "castigat")
                              }
                              className="rounded-xl cursor-pointer text-[#1a4925] font-bold"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />{" "}
                              Marchează Câștigat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(lead.id, "pierdut")
                              }
                              className="rounded-xl cursor-pointer text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Marchează
                              Pierdut
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2 bg-slate-50" />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedLead(lead);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="rounded-xl cursor-pointer text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Șterge Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Dialog Editare/Creare */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900">
              {selectedLead ? "Editează" : "Adaugă"} Lead
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-wider">
                Nume Complet *
              </Label>
              <Input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-wider">
                Email *
              </Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-wider">
                Telefon *
              </Label>
              <Input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase tracking-wider">
                Tip Proprietate
              </Label>
              <Select
                value={formData.property_type}
                onValueChange={(v) =>
                  setFormData({ ...formData, property_type: v })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casă Rezidențială">
                    Casă Rezidențială
                  </SelectItem>
                  <SelectItem value="Clădire Comercială">
                    Clădire Comercială
                  </SelectItem>
                  <SelectItem value="Unitate Industrială">
                    Unitate Industrială
                  </SelectItem>
                  <SelectItem value="Agricol / Fermă">
                    Agricol / Fermă
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl font-bold"
            >
              Anulează
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1a4925] rounded-xl font-bold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                "Salvează"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detalii Lead */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              Detalii Lead
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="grid grid-cols-2 gap-6 py-6 border-t border-slate-50 mt-4">
              <div>
                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Nume
                </Label>
                <p className="font-bold">{selectedLead.full_name}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Email
                </Label>
                <p className="font-bold text-sm">{selectedLead.email}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Telefon
                </Label>
                <p className="font-bold">{selectedLead.phone}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Tip
                </Label>
                <p className="font-bold">{selectedLead.property_type}</p>
              </div>
              <div className="col-span-2 pt-4 border-t border-slate-50">
                <Label className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Mesaj
                </Label>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  {selectedLead.message || "Fără mesaj suplimentar."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Ștergere */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl">
              Confirmă Ștergerea
            </AlertDialogTitle>
            <AlertDialogDescription>
              Lead-ul lui {selectedLead?.full_name} va fi eliminat definitiv.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl font-bold">
              Anulează
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold"
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default LeadsManagement;
