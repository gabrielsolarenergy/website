import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  Image as ImageIcon,
  Save,
  MapPin,
  Zap,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { adminAPI } from "@/lib/api";
import CustomPagination from "@/components/common/CustomPagination";

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  capacity_kw: number;
  panels_count: number;
  investment_value: number;
  status: string;
  image_url: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 6;
const projectCategories = ["Rezidențial", "Comercial", "Industrial", "Agricol"];
const statusOptions = [
  { value: "completed", label: "Finalizat" },
  { value: "in_progress", label: "În Desfășurare" },
  { value: "planning", label: "Planificare" },
];

export const AdminProjectManager = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    capacity_kw: "",
    panels_count: "",
    investment_value: "",
    status: "completed",
    image_url: "",
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await adminAPI.getProjects(
        undefined,
        currentPage,
        ITEMS_PER_PAGE
      );
      if (error) throw new Error(error);
      if (data && data.items) {
        setProjects(data.items);
        setTotalItems(data.total);
      } else {
        setProjects(data || []);
        setTotalItems(data?.length || 0);
      }
    } catch (e: any) {
      toast({
        title: "Eroare încărcare",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage]);

  const handleSave = async () => {
    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.location.trim() ||
      !formData.image_url.trim()
    ) {
      toast({
        title: "Câmpuri lipsă",
        description:
          "Completează Titlul, Categoria, Locația și URL-ul imaginii.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category,
        capacity_kw: parseFloat(formData.capacity_kw) || 0,
        panels_count: parseInt(formData.panels_count) || 0,
        investment_value: parseFloat(formData.investment_value) || 0,
        status: formData.status,
        image_url: formData.image_url.trim(),
      };

      const result = editingProject
        ? await adminAPI.updateProject(editingProject.id, projectData)
        : await adminAPI.createProject(projectData);

      if (result.error) throw new Error(result.error);
      toast({
        title: "Succes",
        description: editingProject ? "Proiect actualizat." : "Proiect creat.",
      });
      setIsEditorOpen(false);
      fetchProjects();
    } catch (e: any) {
      toast({
        title: "Eroare la salvare",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      category: "",
      capacity_kw: "",
      panels_count: "",
      investment_value: "",
      status: "completed",
      image_url: "",
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      location: project.location || "",
      category: project.category || "",
      capacity_kw: project.capacity_kw?.toString() || "0",
      panels_count: project.panels_count?.toString() || "0",
      investment_value: project.investment_value?.toString() || "0",
      status: project.status || "completed",
      image_url: project.image_url || "",
    });
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur ștergi acest proiect?")) return;
    try {
      const { error } = await adminAPI.deleteProject(id);
      if (error) throw new Error(error);
      toast({ title: "Șters" });
      fetchProjects();
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Caută în pagina curentă..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#1a4925] hover:bg-[#1a4925]/90 rounded-xl font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Adaugă Proiect
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#1a4925]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative bg-slate-100">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase text-[#1a4925] shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 line-clamp-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" /> {project.location}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center gap-1 text-[#1a4925] font-bold text-sm">
                      <Zap className="w-3 h-3" /> {project.capacity_kw} kW
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 0 && (
            <div className="mt-8 border-t pt-8">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <p className="text-center text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest">
                Pagina {currentPage} din {totalPages} — Total: {totalItems}{" "}
                proiecte
              </p>
            </div>
          )}
        </>
      )}

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent
          /* 1. Eliminăm overflow-y-auto de pe containerul principal pentru a nu avea scroll dublu.
       2. Adăugăm flex flex-col pentru a separa Header, Content și Footer.
       3. p-0 pentru a controla padding-ul separat pe fiecare secțiune.
    */
          className="sm:max-w-2xl w-[95vw] rounded-[2rem] p-0 border-none shadow-2xl bg-white flex flex-col focus:outline-none overflow-hidden"
          style={{
            /* Limităm înălțimea la 85% din ecran pentru a lăsa spațiu 
         atât pentru header-ul tău de sus, cât și pentru marginea de jos.
      */
            maxHeight: "85vh",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100, // Ne asigurăm că stă peste header
          }}
        >
          {/* HEADER-UL MODALULUI - Fix sus */}
          <DialogHeader className="p-8 pb-4 border-b bg-white">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-[#1a4925]">
              Editor Proiect
            </DialogTitle>
          </DialogHeader>

          {/* ZONA DE CONȚINUT - Singura care face SCROLL */}
          <div className="flex-grow overflow-y-auto p-8 pt-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Titlu Proiect *
                </Label>
                <Input
                  className="rounded-xl border-slate-200 focus:ring-primary"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Categorie *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Alege..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Locație *
                </Label>
                <Input
                  className="rounded-xl border-slate-200"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Capacitate (kW)
                </Label>
                <Input
                  type="number"
                  className="rounded-xl border-slate-200"
                  value={formData.capacity_kw}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity_kw: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Nr. Panouri
                </Label>
                <Input
                  type="number"
                  className="rounded-xl border-slate-200"
                  value={formData.panels_count}
                  onChange={(e) =>
                    setFormData({ ...formData, panels_count: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  URL Imagine (Link) *
                </Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-10 rounded-xl border-slate-200"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Descriere
                </Label>
                <Textarea
                  className="rounded-2xl min-h-[120px] resize-none border-slate-200"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* FOOTER-UL MODALULUI - Fix jos (Sticky) */}
          <DialogFooter className="p-8 py-6 border-t bg-slate-50/50 flex flex-row gap-3 sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsEditorOpen(false)}
              disabled={isSaving}
              className="flex-1 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
            >
              Anulează
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-[#1a4925] hover:bg-[#0e2a15] text-white rounded-xl font-bold shadow-lg shadow-green-900/20"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <Save className="mr-2 w-4 h-4" />
              )}
              Salvează Proiectul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
