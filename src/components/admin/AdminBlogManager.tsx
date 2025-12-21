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
import { adminAPI } from "@/lib/api";
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

  // --- State pentru Paginare Server-Side ---
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
    tags: "", // Îl ținem ca string pentru input
    featured_image: "",
    is_published: false,
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Presupunem că getBlogPosts acceptă paginare (page, size)
      const { data, error } = await adminAPI.getBlogPosts();
      if (error) throw new Error(error);

      // Adaptare pentru formatul obiectului returnat de server { items, total }
      if (data && data.items) {
        setPosts(data.items);
        setTotalItems(data.total);
      } else {
        setPosts(data || []);
        setTotalItems(data?.length || 0);
      }
    } catch (e: any) {
      toast({
        title: "Eroare",
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
      !formData.category
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
      const postData = {
        ...formData,
        // CONVERSIE: String -> Array pentru DB (Coloana JSON)
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        is_published: publish,
      };

      const result = editingPost
        ? await adminAPI.updateBlogPost(editingPost.id, postData)
        : await adminAPI.createBlogPost(postData);

      if (result.error) throw new Error(result.error);

      toast({
        title: "Succes",
        description: publish ? "Articol publicat!" : "Salvat cu succes.",
      });
      setIsEditorOpen(false);
      fetchPosts();
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

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      category: post.category,
      // CONVERSIE: Array -> String pentru Input
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      featured_image: post.featured_image || "",
      is_published: post.is_published,
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
      featured_image: "",
      is_published: false,
    });
    setIsEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur ștergi acest articol?")) return;
    try {
      const { error } = await adminAPI.deleteBlogPost(id);
      if (error) throw new Error(error);
      toast({ title: "Șters", description: "Articolul a fost eliminat." });
      fetchPosts();
    } catch (e: any) {
      toast({
        title: "Eroare",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  // Filtrare locală simplă pentru search în pagina curentă
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Caută în blog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#1a4925] hover:bg-[#1a4925]/90 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" /> Articol Nou
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#1a4925]" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative bg-slate-100">
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon />
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      post.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
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
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-xs text-slate-400">
                      {post.views_count} vizualizări
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          window.open(`/blog/${post.slug}`, "_blank")
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
              Editor Blog
            </DialogTitle>
            <DialogDescription>
              Creează sau editează conținutul pentru blogul Gabriel Solar
              Energy.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                Titlu Articol *
              </Label>
              <Input
                className="rounded-xl"
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
                  <SelectTrigger className="rounded-xl">
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
                  className="rounded-xl"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="solar, baterii, economii"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                Rezumat (Excerpt)
              </Label>
              <Textarea
                className="rounded-xl"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                Imagine Principală (URL)
              </Label>
              <Input
                className="rounded-xl"
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                Conținut (HTML / Text) *
              </Label>
              <Textarea
                className="rounded-2xl min-h-[300px] font-mono text-sm"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsEditorOpen(false)}
              disabled={isSaving}
            >
              Anulează
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="rounded-xl font-bold"
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}{" "}
              Salvează Ciornă
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="bg-[#1a4925] px-8 rounded-xl font-bold"
            >
              Publică Articolul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogManager;
