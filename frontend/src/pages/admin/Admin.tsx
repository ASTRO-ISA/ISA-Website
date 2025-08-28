import { useState } from "react";
import api from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllBlogs from "./AllBlogs";
import AllEvents from "./AllEvents";
import AllResearchPapers from "./AllResearchPapers";
import SuggestedBlogTopic from "../blog/SuggestedBlogTopicAdmin";
import ApprovedBlogSuggestions from "../blog/ApprovedBlogSuggestions";
import AdminGallerySection from "./AdminGallerySection";
import AdminJobs from "./AdJob";
import AdminCourses from "./AdminCourses";
import AdminWebinars from "./AdminWebinar";
import AdminNewsletterDraft from "./AdminNewsletterDraft";
import AdminEvents from "./AdminEvents";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("events");

  // Fetch research papers
  const fetchPapers = async () => {
    const res = await api.get("/research-papers");
    return res.data;
  };

  const { data: papers = [], isLoading } = useQuery({
    queryKey: ["research-paper"],
    queryFn: fetchPapers,
  });

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage Content, Events, and Opportunities
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <div className="mb-6 bg-space-purple/20 rounded">
            <TabsList className="grid h-full w-full grid-cols-2 grid-rows-2 sm:grid-cols-6 sm:grid-rows-1">
              <TabsTrigger value="events">Manage Events</TabsTrigger>
              <TabsTrigger value="training">Manage Jobs</TabsTrigger>
              <TabsTrigger value="papers">Research Papers</TabsTrigger>
              <TabsTrigger value="suggestions">Blog</TabsTrigger>
              <TabsTrigger value="courses">Manage Courses</TabsTrigger>
              <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
              <TabsTrigger value="webinar">Manage Webinars</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            </TabsList>
          </div>

          {/* Manage Events */}
          <TabsContent value="events" className="space-y-6">
            <AllEvents />
            <AdminEvents />
          </TabsContent>

          {/* Manage Jobs */}
          <TabsContent value="training" className="space-y-6">
            <AdminJobs />
          </TabsContent>

          {/* Research Papers */}
          <TabsContent value="papers" className="space-y-6">
            <AllResearchPapers papers={papers}/>
          </TabsContent>

          {/* Blog Suggestions */}
          <TabsContent value="suggestions" className="space-y-6">
            <AllBlogs />
            <hr />
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

          {/* Admin Courses */}
          <TabsContent value="courses" className="space-y-6">
            <AdminCourses />
          </TabsContent>

          {/* Newsletter */}
          <TabsContent value="newsletter" className="space-y-6">
            <AdminNewsletterDraft />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
