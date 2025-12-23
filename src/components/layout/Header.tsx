import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Acasă", href: "/" },
  { name: "Sisteme solare", href: "/systems" },
  { name: "Servicii", href: "/services" },
  { name: "Finanțare", href: "/financing" },
  { name: "Proiecte", href: "/projects" },
  { name: "Despre noi", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  }, [logout, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 inset-x-0 w-full transition-all duration-300 z-[10000]",
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white py-4 md:py-6 border-b border-slate-100"
      )}
    >
      <nav
        className="container mx-auto max-w-[1800px] px-4 flex items-center justify-between relative"
        aria-label="Navigație principală"
      >
        {/* LOGO - Optimizat SEO */}
        <Link
          to="/"
          aria-label="Gabriel Solar Energy - Pagina principală"
          className="flex items-center gap-2 shrink-0 group relative z-[10002]"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#1a4925] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <Sun
              className="w-6 h-6 md:w-7 md:h-7 text-white"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-base md:text-xl text-slate-900 uppercase tracking-tighter">
              Gabriel
            </span>
            <span className="font-display font-bold text-[8px] md:text-[10px] text-[#1a4925] tracking-widest uppercase">
              Solar Energy
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Optimizat A11y */}
        <div
          className="hidden xl:flex items-center justify-center flex-1 gap-1 mx-6"
          role="navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              aria-current={
                location.pathname === item.href ? "page" : undefined
              }
              className={cn(
                "whitespace-nowrap px-3 py-2 text-[15px] font-bold rounded-lg transition-all",
                location.pathname === item.href
                  ? "text-[#1a4925] bg-slate-50"
                  : "text-slate-600 hover:text-[#1a4925] hover:bg-slate-50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:block">
            {isAuthenticated ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    aria-label={`Meniu utilizator: ${user?.first_name}`}
                    className="h-11 border-2 border-[#1a4925] text-[#1a4925] font-bold px-5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" aria-hidden="true" />
                    {user?.first_name || "Cont"}
                    <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 z-[10005] bg-white shadow-2xl border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-150"
                  sideOffset={8}
                >
                  {user?.role === "admin" && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer focus:bg-slate-50 rounded-lg"
                    >
                      <Link
                        to="/admin"
                        className="flex items-center py-2.5 font-bold text-[#1a4925]"
                      >
                        <Shield className="w-4 h-4 mr-2" aria-hidden="true" />{" "}
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer focus:bg-slate-50 rounded-lg"
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center py-2.5 font-bold text-slate-700"
                    >
                      <LayoutDashboard
                        className="w-4 h-4 mr-2"
                        aria-hidden="true"
                      />{" "}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-slate-100" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive font-bold py-2.5 cursor-pointer focus:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />{" "}
                    Deconectare
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="h-11 border-2 border-[#1a4925] bg-transparent text-[#1a4925] hover:bg-[#1a4925] hover:text-white font-bold rounded-xl px-6 uppercase text-xs transition-all"
              >
                <Link to="/login">Autentificare</Link>
              </Button>
            )}
          </div>

          {/* Mobile Toggle - Optimizat A11y */}
          <button
            type="button"
            className="xl:hidden relative z-[10002] p-2.5 rounded-xl bg-slate-50 text-[#1a4925] border border-slate-200 active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Închide meniul" : "Deschide meniul"}
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7" aria-hidden="true" />
            ) : (
              <Menu className="w-7 h-7" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Overlay Meniu Mobil */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="xl:hidden fixed inset-0 bg-white z-[10001] flex flex-col pt-24 px-6 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex flex-col space-y-2 pb-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-5 py-4 text-xl font-bold rounded-2xl transition-all",
                  location.pathname === item.href
                    ? "bg-[#1a4925]/10 text-[#1a4925]"
                    : "text-slate-600 active:bg-slate-50"
                )}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-6 border-t border-slate-100 mt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {user?.role === "admin" && (
                    <Button
                      asChild
                      className="w-full h-14 bg-[#1a4925] text-white text-lg font-bold rounded-2xl shadow-md"
                    >
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5 mr-2" aria-hidden="true" />{" "}
                        ADMIN PANEL
                      </Link>
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-14 border-2 border-[#1a4925] text-[#1a4925] text-lg font-bold rounded-2xl"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard
                        className="w-5 h-5 mr-2"
                        aria-hidden="true"
                      />{" "}
                      DASHBOARD
                    </Link>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full h-14 text-destructive text-lg font-bold hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />{" "}
                    DECONECTARE
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full h-16 border-4 border-[#1a4925] bg-white text-[#1a4925] text-xl font-black rounded-2xl shadow-xl"
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn
                      className="w-6 h-6 mr-2 stroke-[3]"
                      aria-hidden="true"
                    />
                    AUTENTIFICARE
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
