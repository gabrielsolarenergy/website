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

// Imagine pentru fundal Hero
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

  // --- FETCH DATE ---
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await solarAPI.getBlogPosts();
        if (error) throw new Error(error);

        // NORMALIZARE: Mapăm coloana 'featured_image' din Python la 'displayImage'
        const normalizedData = (data || []).map((art: any) => ({
          ...art,
          displayImage:
            art.featured_image || // Numele coloanei din modelul tău SQLAlchemy
            art.image_url ||
            art.cover_image ||
            "",
          displayExcerpt:
            art.excerpt ||
            (art.content ? art.content.substring(0, 150) + "..." : ""),
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

  // --- HELPER IMAGINE (Link din Bucket Railway) ---
  const getArticleImage = (article: any) => {
    const img = article.displayImage;

    // 1. Dacă nu există imagine, punem un placeholder de calitate
    if (!img)
      return "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800";

    // 2. Dacă este URL de Bucket (începe cu http), îl returnăm direct
    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }

    // 3. Dacă este Base64
    if (
      typeof img === "string" &&
      img.length > 100 &&
      !img.startsWith("data:")
    ) {
      return `data:image/jpeg;base64,${img}`;
    }

    return img;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800";
  };

  // --- FILTRARE ---
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Toate postările" ||
      article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.displayExcerpt &&
        article.displayExcerpt
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage) || 1;
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollTarget = filterSectionRef.current
      ? filterSectionRef.current.offsetTop - (headerHeight + 20)
      : 500;
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={blogHeroImage}
            alt="Blog background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/80 md:to-transparent" />
        </div>
        <div className="container-section relative z-10 w-full pt-20 px-4">
          <div className="max-w-4xl">
            <h1 className="font-display font-bold text-white mb-6 leading-tight text-4xl md:text-6xl lg:text-7xl">
              Alimentează-ți viitorul: <br />
              <span className="text-accent">Idei și noutăți.</span>
            </h1>
            <div className="max-w-md relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Caută în articole..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section
        ref={filterSectionRef}
        className="py-4 bg-background border-b border-border sticky z-40 shadow-sm"
        style={{ top: `${headerHeight}px` }}
      >
        <div className="container-section px-4">
          <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 md:justify-center no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Articole */}
      <section className="py-12 bg-background">
        <div className="container-section px-4">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tighter">
            {searchQuery
              ? `Rezultate pentru: ${searchQuery}`
              : "Ultimele articole"}
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={getArticleImage(article)}
                      alt={article.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {new Date(article.created_at).toLocaleDateString(
                          "ro-RO"
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 5 min
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                      {article.displayExcerpt}
                    </p>
                    <Link
                      to={`/blog/${article.slug || article.id}`}
                      className="text-primary font-bold text-xs flex items-center gap-1 uppercase tracking-wider mt-auto border-t pt-4"
                    >
                      Citește mai mult <ChevronRight className="w-4 h-4" />
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
