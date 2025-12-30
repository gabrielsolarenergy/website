import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminProjectManager } from "@/components/admin/AdminProjectManager";
import { AdminBlogManager } from "@/components/admin/AdminBlogManager";
import { AdminEmailTemplates } from "@/components/admin/AdminEmailTemplates";
import { AdminLeadsViewer } from "@/components/admin/AdminLeadsViewer";
import { AdminCalendarManager } from "@/components/admin/AdminCalendarManager";
import { AdminRequestsManager } from "@/components/admin/AdminRequestsManager";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminChatPanel from "@/components/chat/AdminChatPanel";

const ContentManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestionare conținut</h1>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="bg-card border flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="requests">Cereri clienți</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="projects">Proiecte</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="chat">Mesaje</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-6">
            <AdminRequestsManager />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <AdminProjectManager />
          </TabsContent>

          <TabsContent value="blog" className="mt-6">
            <AdminBlogManager />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <AdminCalendarManager />
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <AdminChatPanel />
          </TabsContent>

          <TabsContent value="leads" className="mt-6">
            <AdminLeadsViewer />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <AdminEmailTemplates />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
