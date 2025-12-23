import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Facebook,
  Copy,
  CheckCircle2,
  Loader2,
  Star,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { solarAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      try {
        const { data } = await solarAPI.getBlogPost(slug || "");
        if (data) setPost(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostData();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    toast({ title: "Link copiat!" });
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading)
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </div>
      </Layout>
    );
  if (!post)
    return (
      <Layout>
        <div className="text-center py-20">
          <Button onClick={() => navigate("/blog")}>Înapoi la Blog</Button>
        </div>
      </Layout>
    );

  return (
    <Layout>
      {/* Header Secțiune */}
      <header className="bg-slate-50 border-b border-slate-100 pt-10 pb-10">
        <div className="container-section px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary mb-6 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" /> Înapoi la Blog
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-white border border-slate-200 text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
              <span className="flex items-center gap-2 text-slate-900 font-bold">
                <User className="w-4 h-4" />{" "}
                {post.author?.name || "Gabriel Solar"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />{" "}
                {new Date(post.created_at).toLocaleDateString("ro-RO")}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-section px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Imaginea Principală */}
          <div className="rounded-[2rem] overflow-hidden shadow-2xl mb-12 border-4 border-white">
            <img
              src={post.featured_image || post.image_url}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* 1. TAG-URILE (Acum sunt PRIMELE sub imagine) */}
          {post.tags && (
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest mr-2">
                <Tag className="w-4 h-4" /> Cuvinte cheie:
              </div>
              {String(post.tags)
                .split(",")
                .map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-black border border-slate-200 uppercase tracking-tighter"
                  >
                    #{tag.trim()}
                  </span>
                ))}
            </div>
          )}

          {/* 2. CONȚINUTUL (aaaaaaaaaaaaaaaaaaaabcd apare SUB TAGS) */}
          <div className="prose prose-slate prose-lg max-w-none mb-12">
            <div
              className="text-slate-700 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 3. SHARE (La final, curat și modern) */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Îți place articolul?
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                <Facebook className="w-4 h-4 text-[#1877F2]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={handleCopyLink}
              >
                {isCopied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Share2 className="w-4 h-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
