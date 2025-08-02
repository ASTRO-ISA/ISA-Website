import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "yet-another-react-lightbox/styles.css";
import UserJobs from "./UserJobs";
import Courses from "./Courses";
import ResearchPaper from "./researchParper/ResearchPaper";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Training & Certification</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enhance your knowledge and skills in astronomy, space science, and
            technology.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="mb-6 bg-space-purple/20 rounded">
            <TabsList className="grid h-full w-full grid-cols-2 grid-rows-2 sm:grid-cols-3 sm:grid-rows-1">
              <TabsTrigger value="jobs">Jobs & Internships</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="researchPaper">Reserach papers</TabsTrigger>
            </TabsList>
          </div>

          {/* Manage Jobs */}
          <TabsContent value="jobs" className="space-y-6">
            <UserJobs />
          </TabsContent>
          {/* Manage courses */}
          <TabsContent value="courses" className="space-y-6">
            <Courses />
          </TabsContent>
          {/* Manage ReserachPaper */}
          <TabsContent value="researchPaper" className="space-y-6">
            <ResearchPaper />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
