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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { solarAPI } from "@/lib/api";

// Mock data for demo
const mockPost = {
  id: "1",
  title: "Merită panourile solare în 2024? O analiză cost-beneficiu",
  slug: "panouri-solare-2024",
  content: `
    <p>În ultimii ani, energia solară a devenit din ce în ce mai accesibilă pentru proprietarii de locuințe și afaceri din România. Cu programe de finanțare precum Casa Verde și scăderea continuă a costurilor tehnologiei, tot mai mulți români se întreabă: merită investiția în panouri solare?</p>
    
    <h2>Costurile inițiale</h2>
    <p>Un sistem fotovoltaic rezidențial tipic de 5-10 kW poate costa între 4.000 și 12.000 de euro, în funcție de calitatea echipamentelor și complexitatea instalării. Cu toate acestea, programul Casa Verde poate acoperi până la 90% din aceste costuri pentru persoanele eligibile.</p>
    
    <h2>Economiile pe termen lung</h2>
    <p>Un sistem de 10 kW poate genera aproximativ 12.000-14.000 kWh pe an în România. La prețurile actuale ale energiei, aceasta se traduce în economii de 1.500-2.000 de euro anual. Fără subvenții, perioada de recuperare a investiției este de 6-8 ani; cu Casa Verde, poate fi de doar 1-2 ani.</p>
    
    <h2>Beneficii suplimentare</h2>
    <ul>
      <li>Independență energetică față de fluctuațiile prețurilor</li>
      <li>Creșterea valorii proprietății cu 3-5%</li>
      <li>Reducerea amprentei de carbon cu 4-5 tone CO₂ anual</li>
      <li>Posibilitatea de a vinde surplusul de energie în rețea</li>
    </ul>
    
    <h2>Concluzie</h2>
    <p>Da, panourile solare merită investiția în 2024, mai ales cu subvențiile disponibile. Este o investiție care se amortizează rapid și oferă beneficii financiare și de mediu pe termen lung.</p>
  `,
  excerpt:
    "O defalcare detaliată a costurilor de instalare, a programelor de tip Casa Verde și proiecții de economii pe termen lung pentru proprietari.",
  category: "ROI și Finanțe",
  tags: ["energie solară", "Casa Verde", "economii", "investiții"],
  readTime: "8 min lectură",
  author: {
    name: "Gabriel Solar Team",
    avatar: null,
  },
  created_at: "2024-12-10",
  featured_image:
    "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200",
  views_count: 1250,
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await solarAPI.getBlogPost(slug || "");
        if (data) {
          setPost(data);
        } else {
          // Use mock data for demo
          setPost(mockPost);
        }
      } catch (e) {
        setPost(mockPost);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Articol negăsit</h1>
            <Button onClick={() => navigate("/blog")}>
              Înapoi la Blog
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Link */}
      <div className="bg-background border-b border-border">
        <div className="container-section py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[21/9] max-h-[500px] overflow-hidden">
        <img
          src={post.featured_image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="container-section py-12">
        <div className="max-w-3xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="badge-eco">{post.category}</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author?.name || "Gabriel Solar Team"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.created_at).toLocaleDateString("ro-RO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime || "5 min lectură"}</span>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-8 pt-8 border-t border-border">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-4 mt-8">
            <span className="text-muted-foreground flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Distribuie:
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="section-padding gradient-hero">
        <div className="container-section text-center">
          <h2 className="font-display text-3xl font-bold text-hero-foreground mb-4">
            Vrei să afli mai multe despre energia solară?
          </h2>
          <p className="text-hero-foreground/80 mb-8 max-w-xl mx-auto">
            Echipa noastră de experți este gata să îți ofere o consultanță
            gratuită și personalizată.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Solicită o ofertă gratuită</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
