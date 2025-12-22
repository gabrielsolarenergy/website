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
import { solarAPI } from "@/lib/api"; // Importă API-ul

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
  const articlesPerPage = 6; // Am mărit numărul per pagină pentru datele de pe server

  const headerHeight = useHeaderHeight();
  const filterSectionRef = useAutofocus<HTMLElement>([selectedCategory]);

  // --- FETCH DATE DE PE SERVER ---
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        // Presupunem că API-ul acceptă query params pentru filtrare și căutare
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

  // --- LOGICĂ FILTRARE ȘI PAGINARE ---
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
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Articolul recomandat (Featured) - cel mai recent din "Toate postările"
  const featuredArticle = articles.length > 0 ? articles[0] : null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollTarget = filterSectionRef.current
      ? filterSectionRef.current.offsetTop - headerHeight
      : 500;
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800&auto=format&fit=crop";
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden font-sans">
        <div className="absolute inset-0 z-0">
          <img
            src={blogHeroImage}
            alt="Blog Gabriel Solar"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32 px-4 sm:px-0">
          <div className="max-w-4xl mx-auto md:mx-0">
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <Star className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                Actualizat săptămânal cu noutăți solar
              </span>
            </div>

            <h1 className="font-display font-bold text-white mb-6 animate-fade-up animation-delay-100 leading-[1.1] tracking-tight text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]">
              <span className="block">Alimentează-ți viitorul:</span>
              <span className="text-gradient-diagonal block md:inline">
                {" "}
                Idei și noutăți.
              </span>
            </h1>

            <p className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up animation-delay-200 text-base md:text-xl md:text-white/80 font-medium">
              Descoperă ultimele tendințe în tehnologia fotovoltaică, ghiduri de
              economisire și analize detaliate.
            </p>

            <div className="max-w-md animate-fade-up animation-delay-300">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Caută în articole..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-md transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section
        ref={filterSectionRef}
        className="py-4 bg-background border-b border-border sticky z-40 shadow-sm"
        style={{ top: `${headerHeight}px` }}
        tabIndex={-1}
      >
        <div className="container-section px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article Section */}
      {!isLoading &&
        !searchQuery &&
        selectedCategory === "Toate postările" &&
        currentPage === 1 &&
        featuredArticle && (
          <section className="section-padding bg-background pb-0">
            <div className="container-section px-4">
              <div className="flex items-center gap-2 mb-8 text-primary font-black uppercase tracking-tighter text-sm">
                <Star className="w-5 h-5 fill-accent text-accent" />{" "}
                Recomandarea Săptămânii
              </div>
              <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
                <div className="relative aspect-video lg:aspect-auto min-h-[400px]">
                  <img
                    src={featuredArticle.image_url || featuredArticle.image}
                    alt={featuredArticle.title}
                    onError={handleImageError}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-8 left-8">
                    <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {featuredArticle.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 lg:p-16 flex flex-col justify-center bg-slate-50/50">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-slate-900 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">
                    {featuredArticle.excerpt}
                  </p>
                  <Button
                    variant="hero"
                    className="w-fit h-14 px-8 text-lg shadow-xl"
                    asChild
                  >
                    <Link
                      to={`/blog/${featuredArticle.slug || featuredArticle.id}`}
                    >
                      Citește articolul <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Latest Articles Grid */}
      <section className="section-padding bg-background min-h-[400px]">
        <div className="container-section px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              {searchQuery
                ? `REZULTATE PENTRU: ${searchQuery.toUpperCase()}`
                : "ULTIMELE ARTICOLE"}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-medium">
                Se încarcă articolele...
              </p>
            </div>
          ) : currentArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {currentArticles.map((article, index) => (
                <article
                  key={article.id}
                  className="group flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={article.image_url || article.image}
                      alt={article.title}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary shadow-sm uppercase tracking-tighter">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        {new Date(
                          article.created_at || article.date
                        ).toLocaleDateString("ro-RO")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {article.read_time || article.readTime || "5 min"}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold mb-4 group-hover:text-primary transition-colors leading-snug text-slate-900">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-1 font-medium leading-relaxed">
                      {article.excerpt}
                    </p>
                    <Link
                      to={`/blog/${article.slug || article.id}`}
                      className="text-primary font-black text-xs flex items-center gap-2 group/link uppercase tracking-widest border-t pt-6"
                    >
                      Citește mai mult
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <p className="text-2xl font-bold text-slate-400 mb-4">
                Nu am găsit articole care să se potrivească.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("Toate postările");
                  setSearchQuery("");
                }}
                className="rounded-xl font-bold"
              >
                Resetează toate filtrele
              </Button>
            </div>
          )}

          {!isLoading && totalPages > 0 && (
            <div className="mt-20">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest">
                Pagina {currentPage} din {totalPages}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
