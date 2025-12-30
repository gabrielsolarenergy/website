import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  Image as ImageIcon,
  Save,
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adminAPI, solarAPI } from "@/lib/api";
import CustomPagination from "@/components/common/CustomPagination";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image: string;
  is_published: boolean;
  views_count: number;
  created_at: string;
}

const ITEMS_PER_PAGE = 6;
const categories = [
  "Energie Solară",
  "Tehnologie",
  "Sustenabilitate",
  "ROI și Finanțe",
  "Mentenanță",
  "Noutăți",
];

export const AdminBlogManager = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    is_published: false,
    featured_image: "",
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await solarAPI.getBlogPosts(
        undefined,
        currentPage,
        ITEMS_PER_PAGE
      );
      if (error) throw new Error(error);
      if (data && data.items) {
        setPosts(data.items);
        setTotalItems(data.total);
      } else {
        setPosts(data || []);
        setTotalItems(data?.length || 0);
      }
    } catch (e: any) {
      toast({
        title: "Eroare la încărcare",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handleSave = async (publish: boolean = false) => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category ||
      !formData.featured_image.trim()
    ) {
      toast({
        title: "Eroare",
        description:
          "Completează toate câmpurile obligatorii, inclusiv URL-ul imaginii.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        excerpt: formData.excerpt || "",
        tags: formData.tags, // Trimitem string-ul "tag1, tag2", backend-ul îl va sparge
        is_published: publish ? "true" : "false",
        featured_image: formData.featured_image.trim(),
      };

      const result = editingPost
        ? await adminAPI.updateBlogPost(editingPost.id, payload)
        : await adminAPI.createBlogPost(payload);

      if (result.error) throw new Error(result.error);

      toast({ title: "Succes", description: "Articol actualizat!" });
      setIsEditorOpen(false);
      fetchPosts(); // Reîncărcăm lista ca să dispară eroarea de validare
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      is_published: post.is_published,
      featured_image: post.featured_image,
    });
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      is_published: false,
      featured_image: "",
    });
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sunteți sigur că doriți să ștergeți acest articol?")) return;
    try {
      const { error } = await adminAPI.deleteBlogPost(id);
      if (error) throw new Error(error);
      toast({ title: "Articol șters" });
      fetchPosts();
    } catch (e: any) {
      toast({
        title: "Eroare la ștergere",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border shadow-sm">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Caută în articole..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#1a4925] hover:bg-[#1a4925]/90 rounded-xl font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Articol Nou
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#1a4925] h-8 w-8" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video relative bg-slate-100 overflow-hidden">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      post.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {post.is_published ? "Publicat" : "Ciornă"}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-black text-[#1a4925] uppercase tracking-widest">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {post.views_count} vizualizări
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-primary"
                        onClick={() =>
                          window.open(`/blog/${post.slug}`, "_blank")
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-primary"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalItems > 0 && (
            <div className="mt-8">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <p className="text-center text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest">
                Pagina {currentPage} din {totalPages} — Total {totalItems}{" "}
                articole
              </p>
            </div>
          )}
        </>
      )}

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent
          /* 1. Eliminăm overflow-y-auto de pe containerul principal.
       2. Structură Flexbox verticală pentru a fixa Header-ul și Footer-ul.
    */
          className="max-w-3xl w-[95vw] rounded-[2rem] p-0 border-none shadow-2xl bg-white flex flex-col focus:outline-none overflow-hidden"
          style={{
            maxHeight: "85vh",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        >
          {/* HEADER FIX - Nu se mișcă la scroll */}
          <DialogHeader className="p-8 pb-4 border-b bg-white">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-[#1a4925]">
              Editor Blog
            </DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Creați sau actualizați articolele Gabriel Solar.
            </DialogDescription>
          </DialogHeader>

          {/* ZONA DE CONȚINUT SCROLLABILĂ */}
          <div className="flex-grow overflow-y-auto p-8 pt-6 custom-scrollbar">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Titlu Articol *
                </Label>
                <Input
                  className="rounded-xl border-slate-200 focus:ring-primary"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Tag-uri (separate prin virgulă)
                  </Label>
                  <Input
                    className="rounded-xl border-slate-200"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="solar, roi"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  URL Imagine Copertă *
                </Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-10 rounded-xl border-slate-200"
                    placeholder="https://..."
                    value={formData.featured_image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured_image: e.target.value,
                      })
                    }
                  />
                </div>
                {formData.featured_image && (
                  <div className="mt-4 relative aspect-video w-full rounded-xl overflow-hidden border">
                    <img
                      src={formData.featured_image}
                      className="w-full h-full object-cover"
                      alt="Preview"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/600x400?text=URL+Imagine+Invalid")
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Rezumat (Scurtă descriere)
                </Label>
                <Textarea
                  className="rounded-xl border-slate-200"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Conținut Articol *
                </Label>
                <Textarea
                  className="rounded-2xl min-h-[300px] border-slate-200 leading-relaxed"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Scrie conținutul articolului..."
                />
              </div>
            </div>
          </div>

          {/* FOOTER FIX - Mereu vizibil la baza modalului */}
          <DialogFooter className="p-8 py-6 border-t bg-slate-50/50 flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col sm:flex-row w-full justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsEditorOpen(false)}
                disabled={isSaving}
                className="rounded-xl font-bold text-slate-500 hover:bg-slate-100"
              >
                Anulează
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="rounded-xl font-bold border-slate-200 bg-white"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Salvează Ciornă
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="bg-[#1a4925] hover:bg-[#0e2a15] text-white px-6 rounded-xl font-bold shadow-lg shadow-green-900/20"
                >
                  Publică Articolul
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogManager;
