import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  Filter,
  Zap,
  MessageSquare,
  Settings,
  LogOut,
  File,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock documents
const mockDocuments = [
  {
    id: "1",
    name: "Installation Contract",
    type: "contract",
    date: "2024-01-15",
    size: "2.4 MB",
    status: "signed",
  },
  {
    id: "2",
    name: "System Warranty Certificate",
    type: "warranty",
    date: "2024-01-20",
    size: "1.1 MB",
    status: "active",
  },
  {
    id: "3",
    name: "Building Permit",
    type: "permit",
    date: "2024-01-18",
    size: "856 KB",
    status: "approved",
  },
  {
    id: "4",
    name: "Invoice #INV-2024-001",
    type: "invoice",
    date: "2024-01-25",
    size: "324 KB",
    status: "paid",
  },
  {
    id: "5",
    name: "Technical Specifications",
    type: "technical",
    date: "2024-01-12",
    size: "5.2 MB",
    status: "final",
  },
  {
    id: "6",
    name: "Energy Production Report - January",
    type: "report",
    date: "2024-02-01",
    size: "1.8 MB",
    status: "generated",
  },
];

const documentTypes = [
  { value: "all", label: "All Documents" },
  { value: "contract", label: "Contracts" },
  { value: "warranty", label: "Warranties" },
  { value: "invoice", label: "Invoices" },
  { value: "permit", label: "Permits" },
  { value: "report", label: "Reports" },
];

const Documents = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contract":
        return <FileCheck className="w-5 h-5 text-primary" />;
      case "warranty":
        return <FileText className="w-5 h-5 text-eco-accent" />;
      case "invoice":
        return <File className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      signed: "bg-eco-accent/20 text-primary",
      active: "bg-eco-accent/20 text-primary",
      approved: "bg-eco-accent/20 text-primary",
      paid: "bg-eco-accent/20 text-primary",
      final: "bg-blue-100 text-blue-700",
      generated: "bg-muted text-muted-foreground",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Gabriel SOLAR ENERGY</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <Zap className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/documents"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
              >
                <FileText className="w-5 h-5" />
                Documents
              </Link>
              <Link
                to="/dashboard/appointments"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <Calendar className="w-5 h-5" />
                Appointments
              </Link>
              <Link
                to="/dashboard/messages"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Messages
              </Link>
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-5 h-5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Document Center</h1>
            </div>

            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Documents List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {getTypeIcon(doc.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{doc.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{new Date(doc.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No documents found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
