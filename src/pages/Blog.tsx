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
        setArticles(data || []);
      } catch (err: any) {
        setError(err.message || "Nu s-au putut încărca articolele.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // --- HELPER IMAGINE (Rezolvă problema afișării) ---
  const getArticleImage = (article: any) => {
    return article.featured_image || article.image_url || article.image;
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800&auto=format&fit=crop";
  };

  // --- FILTRARE ---
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "Toate postările" ||
      article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.excerpt &&
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
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
            alt="Blog"
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

      {/* Category Filters (RESPONSIVE: Scroll orizontal pe mobil) */}
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
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {!isLoading &&
        !searchQuery &&
        selectedCategory === "Toate postările" &&
        currentPage === 1 &&
        featuredArticle && (
          <section className="py-12 bg-background">
            <div className="container-section px-4">
              <div className="flex items-center gap-2 mb-6 text-primary font-bold uppercase text-xs tracking-widest">
                <Star className="w-4 h-4 fill-accent text-accent" /> Recomandare
              </div>
              <div className="grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl">
                <div className="relative aspect-video lg:aspect-auto min-h-[300px]">
                  <img
                    src={getArticleImage(featuredArticle)}
                    alt={featuredArticle.title}
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-accent font-bold text-xs uppercase mb-3">
                    {featuredArticle.category}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-muted-foreground mb-8 line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                  <Button variant="hero" className="w-fit" asChild>
                    <Link
                      to={`/blog/${featuredArticle.slug || featuredArticle.id}`}
                    >
                      Citește articolul <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Articles Grid (RESPONSIVE: 1 coloană mobil, 2 tableta, 3 desktop) */}
      <section className="py-12 bg-background">
        <div className="container-section px-4">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-tighter">
            {searchQuery
              ? `Rezultate pentru: ${searchQuery}`
              : "Ultimele articole"}
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : currentArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentArticles.map((article, index) => (
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
                        {new Date(
                          article.created_at || article.date
                        ).toLocaleDateString("ro-RO")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{" "}
                        {article.read_time || "5 min"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                      {article.excerpt}
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
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
              <p className="text-slate-500">
                Nu am găsit articole care să corespundă criteriilor.
              </p>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-16">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
