import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Zap,
  DollarSign,
  Calendar,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { solarAPI } from "@/lib/api";
import residentialImage from "@/assets/residential-solar.jpg";
import commercialImage from "@/assets/commercial-solar.jpg";

// Mock data for demo
const mockProject = {
  id: "1",
  title: "Reședința Familie Popescu",
  description: `
    <p>Proiect complet de instalare a unui sistem fotovoltaic rezidențial pentru familia Popescu din București. Sistemul de 10kW acoperă integral necesarul energetic al locuinței și generează surplus care este vândut în rețea.</p>
    
    <h3>Provocări</h3>
    <p>Acoperișul avea o orientare parțial suboptimală, necesitând o proiectare atentă pentru maximizarea producției. Am folosit panouri bifaciale de ultimă generație pentru a compensa.</p>
    
    <h3>Soluția</h3>
    <p>Am instalat 24 de panouri solare monocristaline de 450W fiecare, împreună cu un invertor hybrid și un sistem de stocare de 10kWh. Aceasta permite utilizarea energiei și noaptea sau în zilele cu producție redusă.</p>
    
    <h3>Rezultate</h3>
    <p>După 12 luni de funcționare, sistemul a generat 13.500 kWh, depășind estimările inițiale cu 8%. Familia Popescu a redus factura la energie cu 95% și va recupera investiția în mai puțin de 4 ani.</p>
  `,
  location: "București, Sector 2",
  category: "Rezidențial",
  capacity_kw: 10.8,
  panels_count: 24,
  investment_value: 12500,
  status: "completed",
  completion_date: "2024-06-15",
  image_url: residentialImage,
  images: [residentialImage, commercialImage],
  annual_savings: "€1.850",
  co2_saved: "5.2 tone/an",
  roi_years: "3.8 ani",
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await solarAPI.getProject(id || "");
        if (data) {
          setProject(data);
        } else {
          setProject(mockProject);
        }
      } catch (e) {
        setProject(mockProject);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const images = project?.images?.length > 0 
    ? project.images 
    : [project?.image_url || residentialImage];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Proiect negăsit</h1>
            <Button onClick={() => navigate("/projects")}>
              Înapoi la Proiecte
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
            to="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la Proiecte
          </Link>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="relative aspect-[21/9] max-h-[500px] overflow-hidden bg-muted">
        <img
          src={images[currentImageIndex]}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentImageIndex ? "bg-primary" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6">
          <div className="container-section">
            <span className="badge-eco mb-3">{project.category}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">
                {project.capacity_kw} kW
              </div>
              <div className="text-sm text-muted-foreground">Capacitate</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">
                {project.annual_savings || "€1.500"}
              </div>
              <div className="text-sm text-muted-foreground">
                Economie anuală
              </div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">
                {project.panels_count}
              </div>
              <div className="text-sm text-muted-foreground">Panouri</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="font-display text-2xl font-bold text-foreground">
                {project.roi_years || "4 ani"}
              </div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Despre acest proiect
            </h2>
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-hero">
        <div className="container-section text-center">
          <h2 className="font-display text-3xl font-bold text-hero-foreground mb-4">
            Vrei un proiect similar?
          </h2>
          <p className="text-hero-foreground/80 mb-8 max-w-xl mx-auto">
            Solicită o consultanță gratuită și află cum poți beneficia de
            energia solară.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Solicită o ofertă gratuită</Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/projects">Vezi alte proiecte</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
