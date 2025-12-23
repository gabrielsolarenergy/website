import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, GuestRoute } from "@/components/guards/ProtectedRoute";
import { cn } from "@/lib/utils";

// Componente Globale de Layout și Navigație
import { Header } from "@/components/layout/Header";
import ChatWidget from "./components/chat/ChatWidget";
import WhatsAppButton from "./components/chat/WhatsAppButton";

// Pagini Publice
import Home from "./pages/Home";
import Systems from "./pages/Systems";
import Services from "./pages/Services";
import Financing from "./pages/Financing";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Pagini Autentificare
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import TwoFactorSetup from "./pages/auth/TwoFactorSetup";

// Dashboard Utilizator
import UserDashboard from "./pages/dashboard/UserDashboard";
import Profile from "./pages/dashboard/Profile";
import Documents from "./pages/dashboard/Documents";
import Messages from "./pages/dashboard/Messages";
import Appointments from "./pages/dashboard/Appointments";

// Panou Administrare
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeadsManagement from "./pages/admin/LeadsManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import AdminChatPanel from "./components/chat/AdminChatPanel";

const queryClient = new QueryClient();

/**
 * AppContent gestionează logica vizuală globală.
 */
const AppContent = () => {
  const location = useLocation();

  // Rutele unde ascundem complet Header-ul (Auth flow)
  const isAuthPath = [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname);

  // Verificăm dacă suntem în panoul de admin
  const isAdminPath = location.pathname.startsWith("/admin");

  // Pagini care au Hero Section (unde imaginea de fundal intră sub header)
  const hasHeroPath = [
    "/",
    "/systems",
    "/services",
    "/financing",
    "/projects",
    "/about",
    "/blog",
    "/contact",
  ].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header-ul este vizibil peste tot, mai puțin pe rutele de Login/Register */}
      {!isAuthPath && <Header />}

      <main
        className={cn(
          "flex-grow",
          // Adăugăm padding-ul pt-20 (pentru a evita suprapunerea sub Header-ul fix)
          // dacă NU suntem pe o pagină cu Hero și NU suntem pe o rută de Auth
          !hasHeroPath && !isAuthPath ? "pt-20 md:pt-28" : ""
        )}
      >
        <Routes>
          {/* --- RUTE PUBLICE --- */}
          <Route path="/" element={<Home />} />
          <Route path="/systems" element={<Systems />} />
          <Route path="/services" element={<Services />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />

          {/* --- RUTE AUTENTIFICARE --- */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- DASHBOARD UTILIZATOR --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/2fa-setup"
            element={
              <ProtectedRoute>
                <TwoFactorSetup />
              </ProtectedRoute>
            }
          />

          {/* --- PANOU ADMIN --- */}
          {/* Redirecționare automată de la /admin la /admin/leads */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Navigate to="/admin/leads" replace />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <LeadsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <ContentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <UsersManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
                    Conversații{" "}
                    <span className="text-primary">Live Support</span>
                  </h1>
                  <AdminChatPanel />
                </div>
              </ProtectedRoute>
            }
          />

          {/* --- 404 --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Widget-urile de chat rămân vizibile pe site-ul public, dashboard și admin (conform cerinței) */}
      {!isAuthPath && (
        <>
          <ChatWidget />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
