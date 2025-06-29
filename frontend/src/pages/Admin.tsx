import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Trash2, Pencil, Plus } from "lucide-react";
import SuggestedBlogTopic from "./blog/SuggestedBlogTopic";

export default function AdminDashboard() {
    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingJobId, setEditingJobId] = useState(null);
    const [EventformData, setEventformData] = useState({
        title: "",
        description: "",
        eventDate: "",
    });
    const [jobsFormData, setJobsFormData] = useState({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        documentUrl: "",
    });
    const [newJobFormData, setNewJobFormData] = useState({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        documentUrl: "",
    });
    const [activeTab, setActiveTab] = useState("events");

    // Fetch events and jobs from API
    const handleEvents = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/events/", {
                withCredentials: true,
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error.message);
        }
    };

    const handleJobs = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/jobs", {
                withCredentials: true,
            });
            setJobs(response.data.data);
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
        }
    };

    useEffect(() => {
        handleEvents();
        handleJobs();
    }, []);

    // Event Handlers
    const handleEditEventClick = (event) => {
        setEditingEventId(event._id);
        setEventformData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate.split("T")[0],
        });
    };

    const handleEventChange = (e) => {
        setEventformData({ ...EventformData, [e.target.name]: e.target.value });
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3000/api/v1/events/${editingEventId}`,
                EventformData,
                { withCredentials: true }
            );
            alert("Event updated successfully!");
            setEditingEventId(null);
            setEventformData({ title: "", description: "", eventDate: "" });
            handleEvents();
        } catch (error) {
            console.error("Error updating event:", error.message);
        }
    };

    const handleCancelEventEdit = () => {
        setEditingEventId(null);
        setEventformData({ title: "", description: "", eventDate: "" });
    };

    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/events/${id}`, {
                withCredentials: true,
            });
            alert("Event deleted successfully!");
            handleEvents();
        } catch (error) {
            console.error("Error deleting event:", error.message);
        }
    };

    // Job Handlers
    const handleJobFormChange = (e) => {
        setJobsFormData({ ...jobsFormData, [e.target.name]: e.target.value });
    };

    const handleNewJobFormChange = (e) => {
        setNewJobFormData({ ...newJobFormData, [e.target.name]: e.target.value });
    };

    const handleEditJobClick = (job) => {
        setEditingJobId(job.id);
        setJobsFormData({
            title: job.title,
            role: job.role,
            description: job.description,
            applyLink: job.applyLink,
            documentUrl: job.documentUrl,
        });
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/v1/jobs/${editingJobId}`, jobsFormData, {
                withCredentials: true,
            });
            alert("Job updated successfully!");
            setEditingJobId(null);
            setJobsFormData({ title: "", role: "", description: "", applyLink: "", documentUrl: "" });
            handleJobs();
        } catch (error) {
            console.error("Error updating job:", error.message);
        }
    };

    const handleCancelJobEdit = () => {
        setEditingJobId(null);
        setJobsFormData({ title: "", role: "", description: "", applyLink: "", documentUrl: "" });
    };

    const handleCreateJob = async () => {
        try {
            await axios.post("http://localhost:3000/api/v1/jobs", newJobFormData, {
                withCredentials: true,
            });
            alert("Job created successfully!");
            setNewJobFormData({ title: "", role: "", description: "", applyLink: "", documentUrl: "" });
            handleJobs();
        } catch (error) {
            console.error("Error creating job:", error.message);
        }
    };

    const handleDeleteJob = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/jobs/${id}`, {
                withCredentials: true,
            });
            alert("Job deleted successfully!");
            handleJobs();
        } catch (error) {
            console.error("Error deleting job:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-space-dark text-white">
            <main className="container mx-auto px-4 pt-24 pb-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Admin</h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Manage Content, Events, and Opportunities
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-space-purple/20">
                        <TabsTrigger value="events">Manage Events</TabsTrigger>
                        <TabsTrigger value="training">Manage Jobs</TabsTrigger>
                        <TabsTrigger value="suggestions">Blog Suggestions</TabsTrigger>
                    </TabsList>

                    {/* Manage Events */}
                    <TabsContent value="events" className="space-y-6">
    <Card className="bg-space-purple/10 border-space-purple/30">
        <CardHeader>
            <CardTitle>Manage Events</CardTitle>
        </CardHeader>
        <CardContent>
            {events.length === 0 ? (
                <p className="text-gray-400">No events available.</p>
            ) : (
                <ul className="space-y-4">
                    {events.map((event) => (
                        <li
                            key={event._id}
                            className="p-4 border bg-space-purple/20 rounded"
                        >
                            {editingEventId === event._id ? (
                                <form onSubmit={handleEventSubmit} className="space-y-2">
                                    <label>
                                        Title:
                                        <input
                                            type="text"
                                            name="title"
                                            value={EventformData.title}
                                            onChange={handleEventChange}
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            required
                                        />
                                    </label>
                                    <label>
                                        Description:
                                        <textarea
                                            name="description"
                                            value={EventformData.description}
                                            onChange={handleEventChange}
                                            rows={4}
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            required
                                        ></textarea>
                                    </label>
                                    <label>
                                        Event Date:
                                        <input
                                            type="date"
                                            name="eventDate"
                                            value={EventformData.eventDate}
                                            onChange={handleEventChange}
                                            className="w-full p-2 rounded bg-gray-800 text-white"
                                            required
                                        />
                                    </label>
                                    <div className="flex gap-2">
                                        <Button type="submit">Save</Button>
                                        <Button
                                            type="button"
                                            onClick={handleCancelEventEdit}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="font-semibold">{event.title}</p>
                                    <p>{event.description}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(event.eventDate).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleEditEventClick(event)}
                                            variant="outline"
                                        >
                                            <Pencil className="w-4 h-4 mr-1" /> Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleDeleteEvent(event._id)}
                                            variant="destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                                        </Button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </CardContent>
    </Card>
</TabsContent>

                    {/* Manage Jobs */}
                    <TabsContent value="training" className="space-y-6">
                        <Card className="bg-space-purple/10 border-space-purple/30">
                            <CardHeader>
                                <CardTitle>Create New Job</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleCreateJob();
                                    }}
                                    className="space-y-4"
                                >
                                    <input
                                        type="text"
                                        name="title"
                                        value={newJobFormData.title}
                                        onChange={handleNewJobFormChange}
                                        placeholder="Job Title"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="role"
                                        value={newJobFormData.role}
                                        onChange={handleNewJobFormChange}
                                        placeholder="Job Role"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                    <textarea
                                        name="description"
                                        value={newJobFormData.description}
                                        onChange={handleNewJobFormChange}
                                        placeholder="Job Description"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                    <input
                                        type="url"
                                        name="applyLink"
                                        value={newJobFormData.applyLink}
                                        onChange={handleNewJobFormChange}
                                        placeholder="Apply Link"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                    <input
                                        type="url"
                                        name="documentUrl"
                                        value={newJobFormData.documentUrl}
                                        onChange={handleNewJobFormChange}
                                        placeholder="Document URL"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                    <Button type="submit" className="w-full">
                                        Create Job
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                        {/* Job Listing */}
                        <ul className="space-y-4">
                            {jobs.map((job) => (
                                <li key={job.id} className="p-4 border bg-space-purple/20 rounded">
                                    <p className="font-semibold">{job.title}</p>
                                    <p>{job.role}</p>
                                    <p>{job.description}</p>
                                    <p>{job.applyLink}</p>
                                    <p>{job.documentUrl}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleEditJobClick(job)}
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
                    </TabsContent>

                    {/* Blog Suggestions */}
                    <SuggestedBlogTopic />
                </Tabs>
            </main>
        </div>
    );
}
