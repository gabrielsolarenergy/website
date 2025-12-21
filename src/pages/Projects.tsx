import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Zap,
  Home,
  Building2,
  Factory,
  Tractor,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import CustomPagination from "@/components/common/CustomPagination";
import { useHeaderHeight } from "@/hooks/use-header-height";
import { useAutofocus } from "@/hooks/use-autofocus";
import { solarAPI } from "@/lib/api";

// Imaginea de fundal pentru Hero
import heroProjectsImage from "@/assets/industrial-solar.jpg";

const stats = [
  { value: "500+", label: "Clienți mulțumiți", icon: Home },
  { value: "15MW", label: "Energie generată", icon: Zap },
  { value: "12k Tone", label: "CO₂ evitat", icon: Factory },
  { value: "15 Ani", label: "Experiență", icon: Building2 },
];

export default function Projects() {
  // --- State pentru date de pe server ---
  const [projects, setProjects] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State Filtre & Paginare ---
  const [filter, setFilter] = useState<string>("Toate Proiectele");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const headerHeight = useHeaderHeight();

  const categories = [
    "Toate Proiectele",
    "Rezidențial",
    "Comercial",
    "Industrial",
    "Agricol",
  ];

  // --- Fetch date de pe server ---
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Trimitem categoria și pagina curentă către backend
      const { data, error } = await solarAPI.getProjects(
        filter,
        currentPage,
        projectsPerPage
      );

      if (error) throw new Error(error);

      // Mapăm datele conform structurii noi de la backend ({ items, total, ... })
      setProjects(data.items || []);
      setTotalItems(data.total || 0);
    } catch (err: any) {
      setError(err.message || "Nu s-au putut încărca proiectele.");
    } finally {
      setIsLoading(false);
    }
  };

  // Re-executăm fetch-ul când se schimbă filtrul sau pagina
  useEffect(() => {
    fetchProjects();
  }, [filter, currentPage]);

  const totalPages = Math.ceil(totalItems / projectsPerPage) || 1;
  const filterSectionRef = useAutofocus<HTMLElement>([filter]);

  const handleFilterChange = (category: string) => {
    setFilter(category);
    setCurrentPage(1); // Resetăm la prima pagină la schimbarea categoriei
  };

  const scrollToContent = () => {
    const scrollTarget = filterSectionRef.current
      ? filterSectionRef.current.offsetTop - headerHeight
      : 500;
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroProjectsImage}
            alt="Portofoliu Gabriel Solar"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-hero md:via-hero/80 md:to-transparent" />
        </div>

        <div className="container-section relative z-10 w-full pt-28 pb-12 md:py-32">
          <div className="max-w-4xl mx-auto md:mx-0 text-center md:text-left">
            <div className="badge-eco mb-6 inline-flex items-center animate-fade-up">
              <Zap className="w-4 h-4 mr-2 text-accent shrink-0" />
              <span className="text-white text-xs md:text-sm font-medium">
                Sustenabilitate dovedită prin rezultate
              </span>
            </div>

            <h1 className="font-display font-bold text-white mb-6 animate-fade-up leading-[1.1] tracking-tight text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem]">
              <span className="block">O amprentă verde,</span>
              <span className="text-gradient-diagonal block md:inline">
                Pentru generații întregi.
              </span>
            </h1>

            <p className="text-white/90 mb-10 max-w-xl leading-relaxed animate-fade-up mx-auto md:mx-0 text-base md:text-xl">
              De la sisteme rezidențiale eficiente la parcuri industriale de
              mare capacitate. Vedeți cum transformăm energia solară în economii
              reale.
            </p>

            <Button
              variant="hero"
              size="xl"
              asChild
              className="h-14 px-8 text-lg font-bold"
            >
              <Link to="/contact">
                Începe proiectul tău
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container-section px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center animate-fade-up">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="font-display text-3xl font-black text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground uppercase font-bold tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section
        ref={filterSectionRef}
        className="py-4 bg-background sticky z-40 border-b border-border shadow-sm"
        style={{ top: `${headerHeight}px` }}
        tabIndex={-1}
      >
        <div className="container-section flex flex-wrap gap-2 px-4 justify-center md:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilterChange(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid Content */}
      <section className="section-padding bg-slate-50/50 min-h-[500px]">
        <div className="container-section px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-slate-500 font-medium">
                Se încarcă proiectele...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-red-500 font-bold mb-6">{error}</p>
              <Button onClick={() => fetchProjects()} variant="outline">
                Încearcă din nou
              </Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-200">
                      <img
                        src={project.image_url || "/placeholder-project.jpg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                          {project.category}
                        </span>
                        {project.is_featured && (
                          <span className="bg-accent px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-sm">
                            Proiect de Top
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-display text-xl font-bold mb-1 text-slate-900">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mb-6 font-medium">
                        <MapPin className="w-4 h-4 text-accent" />{" "}
                        {project.location}
                      </p>
                      <div className="flex justify-between pt-6 border-t border-slate-50 text-sm">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1">
                            Capacitate
                          </p>
                          <strong className="text-slate-900 text-lg">
                            {project.capacity_kw} kW
                          </strong>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1">
                            Status
                          </p>
                          <strong className="text-accent text-lg capitalize">
                            {project.status === "completed"
                              ? "Finalizat"
                              : "În lucru"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicator de paginare (afișat mereu dacă există rezultate) */}
              {projects.length > 0 && (
                <div className="mt-20">
                  <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      scrollToContent();
                    }}
                  />
                  <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest">
                    Pagina {currentPage} din {totalPages} ({totalItems} proiecte
                    în total)
                  </p>
                </div>
              )}

              {projects.length === 0 && !isLoading && (
                <div className="text-center py-32 text-slate-400 font-medium">
                  Nu am găsit proiecte pentru această categorie momentan.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-hero px-4 text-white">
        <div className="container-section max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] p-10 md:p-16 border border-white/20 shadow-2xl relative overflow-hidden text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="flex-1">
                <h2 className="font-display text-3xl md:text-5xl font-black mb-6 leading-tight">
                  Treceți pe energie curată azi.
                </h2>
                <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">
                  Vreți un sistem precum cele de mai sus? Obțineți o consultanță
                  gratuită și o analiză de eficiență energetică.
                </p>
              </div>
              <Button
                variant="hero"
                size="xl"
                asChild
                className="h-16 px-10 text-lg font-black shadow-2xl shrink-0"
              >
                <Link to="/contact">
                  OBȚINE O OFERTĂ
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
