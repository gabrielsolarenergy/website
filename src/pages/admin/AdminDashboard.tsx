import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  UserPlus,
  DollarSign,
  Calendar,
  ChevronRight,
  Loader2,
  FileText,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminAPI } from "@/lib/api";
import AdminLayout from "@/components/layout/AdminLayout";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeadsThisWeek: 0,
    conversionRate: 0,
    revenue: 0,
    activeUsers: 0,
    totalProjects: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [leadsResult, usersResult, projectsResult] = await Promise.all([
        adminAPI.getLeads(),
        adminAPI.getUsers(),
        adminAPI.getProjects(),
      ]);

      const leads = leadsResult.data || [];
      const users = usersResult.data || [];
      const projects = projectsResult.data || [];

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newLeadsThisWeek = leads.filter(
        (lead: any) => new Date(lead.created_at) >= weekAgo
      ).length;

      const wonLeads = leads.filter((l: any) => l.status === "won").length;
      const conversionRate =
        leads.length > 0 ? Math.round((wonLeads / leads.length) * 100) : 0;

      const totalRevenue = leads
        .filter((l: any) => l.status === "won")
        .reduce((sum: number, l: any) => {
          const value = parseFloat(l.value?.replace(/[€,\s]/g, "") || "0");
          return sum + value;
        }, 0);

      const activeUsers = users.filter(
        (u: any) => (u.status || "active") === "active"
      ).length;

      setStats({
        totalLeads: leads.length,
        newLeadsThisWeek,
        conversionRate,
        revenue: totalRevenue,
        activeUsers,
        totalProjects: projects.length,
      });

      // Get recent leads (last 5)
      const sortedLeads = [...leads]
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);
      setRecentLeads(sortedLeads);

      // Generate recent activity from leads and projects
      const activities: any[] = [];
      sortedLeads.slice(0, 3).forEach((lead: any) => {
        activities.push({
          id: `lead-${lead.id}`,
          action: "Lead nou trimis",
          details: `${lead.full_name} - ${lead.property_type}`,
          time: formatTimeAgo(new Date(lead.created_at)),
        });
      });

      const recentProjects = [...projects]
        .sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 2);

      recentProjects.forEach((project: any) => {
        activities.push({
          id: `project-${project.id}`,
          action: "Proiect creat",
          details: project.title,
          time: formatTimeAgo(new Date(project.created_at)),
        });
      });

      setRecentActivity(activities.slice(0, 4));
    } catch (e) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele dashboard-ului.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Acum ${diffMins} ${diffMins === 1 ? "minut" : "minute"}`;
    } else if (diffHours < 24) {
      return `Acum ${diffHours} ${diffHours === 1 ? "oră" : "ore"}`;
    } else if (diffDays === 1) {
      return "Ieri";
    } else if (diffDays < 7) {
      return `Acum ${diffDays} zile`;
    } else {
      return date.toLocaleDateString("ro-RO");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      contacted:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      qualified: "bg-eco-accent/20 text-primary",
      proposal:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      won: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      lost: "bg-destructive/10 text-destructive",
    };
    return styles[status] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Grilă Statistici */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              {stats.newLeadsThisWeek > 0 && (
                <span className="text-xs text-eco-accent font-medium">
                  +{stats.newLeadsThisWeek} săptămâna aceasta
                </span>
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalLeads}</p>
            <p className="text-sm text-muted-foreground">Total Lead-uri</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {stats.totalProjects}
            </p>
            <p className="text-sm text-muted-foreground">Total Proiecte</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead-uri Recente */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Lead-uri Recente</h2>
              <Link to="/admin/leads">
                <Button variant="ghost" size="sm">
                  Vezi Tot
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentLeads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nu există lead-uri recente</p>
                </div>
              ) : (
                recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary shrink-0">
                      {lead.full_name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {lead.full_name || "Necunoscut"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {lead.property_type || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${getStatusBadge(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activitate Recentă */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Activitate Recentă</h2>

            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nu există activitate recentă</p>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.details}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Acțiuni Rapide */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Acțiuni Rapide</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              asChild
            >
              <Link to="/admin/leads">
                <UserPlus className="w-5 h-5" />
                <span>Adaugă Lead</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              asChild
            >
              <Link to="/admin/content">
                <FileText className="w-5 h-5" />
                <span>Articol Nou</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              asChild
            >
              <Link to="/admin/users">
                <Users className="w-5 h-5" />
                <span>Adaugă User</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              asChild
            >
              <Link to="/admin/content">
                <Zap className="w-5 h-5" />
                <span>Proiect Nou</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
