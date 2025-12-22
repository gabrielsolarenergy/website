import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Loader2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { solarAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
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
    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Articol negăsit</h1>
            <Button onClick={() => navigate("/blog")}>Înapoi la Blog</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Link - Fixat pentru mobil */}
      <div className="bg-background border-b border-border sticky top-[var(--header-height)] z-20">
        <div className="container-section py-4 px-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la Blog
          </Link>
        </div>
      </div>

      {/* Hero Image Section - REPARATĂ: aspect adaptiv */}
      <div className="relative w-full overflow-hidden bg-slate-900">
        <div className="container-section px-0 md:px-4 md:pt-6">
          <div className="relative aspect-[16/10] md:aspect-[21/9] w-full overflow-hidden md:rounded-[2.5rem] shadow-2xl">
            <img
              src={post.featured_image || post.image_url}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badge peste imagine */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg">
                {post.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container-section py-8 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Title - REPARAT: font-size adaptiv */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          {/* Meta Info - REPARATĂ: flexbox wrap pentru ecrane mici */}
          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-slate-500 mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span>{post.author?.name || "Gabriel Solar Team"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-accent" />
              <time>
                {new Date(post.created_at).toLocaleDateString("ro-RO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-accent" />
              <span>{post.read_time || post.readTime || "5 min lectură"}</span>
            </div>
          </div>

          {/* Main Content - REPARAT: Prose configurat pentru lizibilitate maximă */}
          <div
            className="prose prose-slate prose-lg md:prose-xl max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-img:rounded-[2rem] prose-img:shadow-xl
            prose-strong:text-slate-900 prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-slate-100">
              <Tag className="w-4 h-4 text-slate-400" />
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full text-xs font-bold text-slate-600 cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Section - REPARAT: Design modern */}
          <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-slate-900">
                Ți-a plăcut articolul? Distribuie-l:
              </span>
            </div>
            <div className="flex gap-3">
              {[
                { icon: Facebook, color: "hover:bg-[#1877F2]" },
                { icon: Twitter, color: "hover:bg-[#1DA1F2]" },
                { icon: Linkedin, color: "hover:bg-[#0A66C2]" },
              ].map((Social, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-xl transition-all hover:text-white shadow-sm bg-white",
                    Social.color
                  )}
                >
                  <Social.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Recommended CTA Section - REPARAT: Design mult mai atractiv */}
      <section className="section-padding px-4">
        <div className="container-section">
          <div className="bg-[#1a4925] rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            {/* Elemente decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Gata să treci la{" "}
                <span className="text-accent text-gradient-diagonal">
                  Energie Verde?
                </span>
              </h2>
              <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Alătură-te celor peste 500 de familii care economisesc deja cu
                GABRIEL SOLAR. Oferim consultanță tehnică și ajutor pentru
                dosarul Casa Verde.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full sm:w-auto h-14 px-10 shadow-xl shadow-black/20"
                  asChild
                >
                  <Link to="/contact">Solicită Ofertă Gratuită</Link>
                </Button>
                <div className="flex items-center gap-2 text-white/60 text-sm font-bold uppercase tracking-widest px-4">
                  <Star className="w-4 h-4 text-accent fill-accent" /> Expertiză
                  Garantată
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
