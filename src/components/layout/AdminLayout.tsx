import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  User as UserIcon,
  Menu,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Adaugă această linie dacă lipsește
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Lead-uri", href: "/admin/leads", icon: Users },
    { name: "Utilizatori", href: "/admin/users", icon: UserIcon },
    { name: "Conținut", href: "/admin/content", icon: FileText },
  ];

  const SidebarContent = () => (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              isActive
                ? "bg-[#1a4925] text-white shadow-md font-bold"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
      <DropdownMenuSeparator className="my-4" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full font-bold"
      >
        <LogOut className="w-5 h-5" />
        Deconectare
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Admin Nav Trigger - Apare doar pe mobil */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#1a4925]" />
            <span className="font-black text-slate-900 uppercase tracking-tighter text-sm">
              Meniu Admin
            </span>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-2 border-[#1a4925] text-[#1a4925] font-bold"
              >
                <Menu className="w-5 h-5 mr-2" /> Navigare
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] rounded-r-[2rem]">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left font-black text-2xl tracking-tighter text-[#1a4925] uppercase">
                  Gabriel <span className="text-slate-900">Admin</span>
                </SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar - Rămâne neschimbat, ascuns pe mobil */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sticky top-32 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">
                Navigare Principală
              </p>
              <SidebarContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{children || <Outlet />}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
