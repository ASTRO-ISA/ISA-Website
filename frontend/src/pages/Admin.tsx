// AdminDashboard.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Calendar,
  Briefcase,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";
import SuggestedBlogTopic from "./blog/SuggestedBlogTopic";

// temporary items just to see the page

const events = [
  { id: 1, name: "Astronomy Night", date: "2025-07-01" },
  { id: 2, name: "Lunar Workshop", date: "2025-08-15" },
];

const jobs = [
  { id: 1, title: "Frontend Dev", company: "SpaceX", location: "Remote" },
  { id: 2, title: "Mission Planner", company: "ISRO", location: "India" },
];

const handleDeleteEvent = (id) => {
  console.log("Delete event", id);
};

const handleUpdateEvent = (event) => {
  console.log("Edit event", event);
};

const handleDeleteJob = (id) => {
  console.log("Delete job", id);
};

const handleUpdateJob = (job) => {
  console.log("Edit job", job);
};

const handleCreateJob = () => {
  console.log("Create job");
};

// below commented code: if we use this we have to pass props from main app.tsx or we can create a admin panel container, OR we use use context provider
// export default function AdminDashboard({ suggestions, events, jobs, handleDeleteEvent, handleUpdateEvent, handleDeleteJob, handleUpdateJob, handleCreateJob }) {
export default function AdminDashboard() {
  // just to see the working page
  const [activeTab, setActiveTab] = React.useState("suggestions");

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* <h1 className="text-4xl font-bold mb-8 text-space-accent">Admin Panel</h1> */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage Content, Events, and Opportunities
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 bg-space-purple/20">
            <TabsTrigger value="training">Manage Jobs</TabsTrigger>
            <TabsTrigger value="events">Manage Events</TabsTrigger>
            <TabsTrigger value="suggestions">Blog Suggestions</TabsTrigger>
          </TabsList>

          {/* Manage Jobs */}
          <TabsContent value="training" className="space-y-6">
            <Card className="bg-space-purple/10 border-space-purple/30">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Job Posts</CardTitle>
                <Button onClick={handleCreateJob}>
                  <Plus className="w-4 h-4 mr-1" /> Create Job
                </Button>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <p className="text-gray-400">No job posts available.</p>
                ) : (
                  <ul className="space-y-4">
                    {jobs.map((job) => (
                      <li
                        key={job.id}
                        className="p-4 border border-space-purple/30 rounded bg-space-purple/20"
                      >
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-gray-400">
                          {job.company} | {job.location}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateJob(job)}
                            variant="outline"
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Events */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-space-purple/10 border-space-purple/30">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-gray-400">No events found.</p>
                ) : (
                  <ul className="space-y-4">
                    {events.map((event) => (
                      <li
                        key={event.id}
                        className="p-4 border border-space-purple/30 rounded bg-space-purple/20"
                      >
                        <p className="font-semibold">{event.name}</p>
                        <p className="text-sm text-gray-400">{event.date}</p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateEvent(event)}
                            variant="outline"
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            variant="destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Suggestions */}
          <SuggestedBlogTopic />
        </Tabs>
      </main>
    </div>
  );
}
