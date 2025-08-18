import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "./UserProfile";
import UserSettings from "./UserSettings";
import UserEvents from "./UserEvents";
import UserBlogs from "./UserBlogs";
import UserResearchPaper from "./UserResearchPaper";
import Submissions from "./Submissions";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header Section */}
        <UserProfile />

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 mt-8"
        >
          <TabsList className="grid w-full h-15 grid-cols-2 grid-rows-2 sm:grid-cols-5 sm:grid-rows-1 bg-space-purple/20">
            <TabsTrigger value="events">Registered Events</TabsTrigger>
            <TabsTrigger value="blogs">My Blogs</TabsTrigger>
            <TabsTrigger value="research_papers">
              My Research Papers
            </TabsTrigger>
            <TabsTrigger value="submissions">
              Submissions
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <UserEvents />
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <UserBlogs />
          </TabsContent>

          {/* Research Paper Tab */}
          <TabsContent value="research_papers" className="space-y-6">
            <UserResearchPaper />
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <Submissions />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <UserSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
