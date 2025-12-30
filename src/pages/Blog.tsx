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
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await solarAPI.getBlogPosts();
        if (error) throw new Error(error);

        const normalizedData = (data || []).map((art: any) => ({
          ...art,
          imageUrl:
            art.featured_image || art.image_url || art.cover_image || "",
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

  const getArticleImage = (article: any) => {
    const src = article.imageUrl;
    if (!src)
      return "https://images.unsplash.com/photo-1509391366360-feaffa64829b?q=80&w=800";
    if (typeof src === "string" && src.startsWith("http")) return src;
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
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.displayExcerpt.toLowerCase().includes(searchQuery.toLowerCase());
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
      {/* 1. HERO SECTION - Stilul Original */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
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
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md focus:ring-2 focus:ring-accent outline-none transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FILTRE CATEGORII - Stil Sticky cu Scroll Orizontal */}
      <section
        ref={filterSectionRef}
        className="py-4 bg-background border-b border-border sticky z-40 shadow-sm transition-all"
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

      {/* 3. FEATURED ARTICLE - Stil Premium */}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl"
              >
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
                  <p className="text-muted-foreground mb-8 line-clamp-3 leading-relaxed">
                    {featuredArticle.displayExcerpt}
                  </p>
                  <Button variant="hero" className="w-fit" asChild>
                    <Link
                      to={`/blog/${featuredArticle.slug || featuredArticle.id}`}
                    >
                      Citește articolul <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

      {/* 4. GRID ARTICOLE - Stil Grid cu Carduri Animate */}
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
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {currentArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col h-full"
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
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              article.created_at || Date.now()
                            ).toLocaleDateString("ro-RO")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 5 min
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1 leading-relaxed">
                          {article.displayExcerpt}
                        </p>
                        <Link
                          to={`/blog/${article.slug || article.id}`}
                          className="text-primary font-bold text-xs flex items-center gap-1 uppercase tracking-wider mt-auto border-t pt-4 group-hover:gap-2 transition-all"
                        >
                          Citește mai mult <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {currentArticles.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
                  <p className="text-slate-500 font-medium">
                    Nu am găsit articole care să corespundă criteriilor.
                  </p>
                </div>
              )}

              {/* 5. PAGINARE */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-16">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
