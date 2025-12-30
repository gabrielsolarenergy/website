import { useState, useEffect } from "react";
import {
  Search,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import CustomPagination from "@/components/common/CustomPagination";
import { Link } from "react-router-dom";
import { useHeaderHeight } from "@/hooks/use-header-height";
import { useAutofocus } from "@/hooks/use-autofocus";
import { solarAPI } from "@/lib/api";

import blogHeroImage from "@/assets/commercial-solar.jpg";

const categories = [
  "Toate postările",
  "Fotovoltaice rezidențial",
  "Soluții industriale",
  "ROI și subvenții",
  "Sfaturi mentenanță",
  "Noutăți companie",
];

export default function Blog() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("Toate postările");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const headerHeight = useHeaderHeight();
  const filterSectionRef = useAutofocus<HTMLElement>([selectedCategory]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await solarAPI.getBlogPosts();
        if (error) throw new Error(error);

        // REPARARE: Normalizare simplificată care prioritizează URL-ul direct
        const normalizedData = (data || []).map((art: any) => ({
          ...art,
          // Prioritizăm featured_image (coloana din Python) și apoi variantele
          imageUrl:
            art.featured_image || art.image_url || art.cover_image || "",
          displayExcerpt:
            art.excerpt ||
            (art.content ? art.content.substring(0, 120) + "..." : ""),
        }));

        setArticles(normalizedData);
      } catch (err: any) {
        setError(err.message || "Nu s-au putut încărca articolele.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // REPARARE: Funcția de afișare a imaginii ignoră acum transformările dacă link-ul e de tip HTTP
  const getArticleImage = (article: any) => {
    const src = article.imageUrl;

    if (!src)
      return "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800";

    // Dacă este URL de Bucket (Railway), îl returnăm exact cum e
    if (typeof src === "string" && src.startsWith("http")) {
      return src;
    }

    // Doar dacă e un string Base64 vechi îi adăugăm prefix
    if (
      typeof src === "string" &&
      src.length > 200 &&
      !src.startsWith("data:")
    ) {
      return `data:image/jpeg;base64,${src}`;
    }

    return src;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800";
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Toate postările" ||
      article.category === selectedCategory;
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage) || 1;
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );
  const featuredArticle = articles.length > 0 ? articles[0] : null;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={blogHeroImage}
            className="w-full h-full object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="container mx-auto relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blog & Noutăți
          </h1>
          <div className="max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Caută articole..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Grid Articole */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={getArticleImage(article)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {new Date(article.created_at).toLocaleDateString(
                          "ro-RO"
                        )}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                      {article.displayExcerpt}
                    </p>
                    <Link
                      to={`/blog/${article.slug || article.id}`}
                      className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      CITEȘTE MAI MULT <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
