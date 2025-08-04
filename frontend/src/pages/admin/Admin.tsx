import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import "yet-another-react-lightbox/styles.css";
import { Trash2, Pencil } from "lucide-react";
import SuggestedBlogTopic from "../blog/SuggestedBlogTopic";
 
import  ApprovedBlogSuggestions from  "../blog/ApprovedBlogSuggestions"
import { useToast } from "@/hooks/use-toast";
import AdminGallerySection from "./AdminGallerySection";
import AdminJobs from "./AdJob";
import AdminCourses from "./AdminCourses";
import AdminWebinars from "./AdminWebinar";
import AdminNewsletterDraft from "./AdminNewsletterDraft";
import AdminEvents from "./AdminEvents";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage Content, Events, and Opportunities
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-5"
        >
          <div className="mb-6 bg-space-purple/20 rounded">
            <TabsList className="grid h-full w-full grid-cols-2 grid-rows-2 sm:grid-cols-6 sm:grid-rows-1">
              <TabsTrigger value="events">Manage Events</TabsTrigger>
              <TabsTrigger value="training">Manage Jobs</TabsTrigger>
              <TabsTrigger value="suggestions">Blog Suggestions</TabsTrigger>
              <TabsTrigger value="courses">Manage Courses</TabsTrigger>
              <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
              <TabsTrigger value="webinar">Manage Webinars</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>
          </div>

          {/* Manage Events */}
          <TabsContent value="events" className="space-y-6">
            <AdminEvents />
          </TabsContent>

          {/* Manage Jobs */}
          <TabsContent value="training" className="space-y-6">
            <AdminJobs />
          </TabsContent>

          {/* Blog Suggestions */}
          <TabsContent value="suggestions" className="space-y-6">
            <SuggestedBlogTopic />
              <ApprovedBlogSuggestions /> 
          </TabsContent>

          {/* Manage Webinars */}
          <TabsContent value="webinar" className="space-y-6">
            <AdminWebinars />
          </TabsContent>

          {/* Gallery section */}
          <TabsContent value="gallery" className="space-y-6">
            <AdminGallerySection />
          </TabsContent>

          {/* Admin courses */}
          <TabsContent value="courses" className="space-y-6">
            <AdminCourses />
          </TabsContent>

          {/*newsletter */}
          <TabsContent value="newsletter" className="space-y-6">
            <AdminNewsletterDraft />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
