import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import SuggestedBlogTopic from "./blog/SuggestedBlogTopic";

export default function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [activeTab, setActiveTab] = useState("events");

    // States for editing events and jobs
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingJobId, setEditingJobId] = useState(null);

    // Form Data for Events and Jobs
    const [eventFormData, setEventFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
    });
    const [jobFormData, setJobFormData] = useState({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        documentUrl: "",
    });
    const [newEventFormData, setNewEventFormData] = useState({
      title:"",
      description:"",
      eventDate:"",
      location:"",
      eventType:"",
      presentedBy:"",
      type:"",
      status:""
    });
    const [newJobFormData, setNewJobFormData] = useState({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        documentUrl: "",
    });

    // Fetch Events and Jobs
    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/events", {
                withCredentials: true,
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error.message);
        }
    };

    const fetchJobs = async () => {
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
        fetchEvents();
        fetchJobs();
    }, []);

    // Event Handlers
    const handleEventFormChange = (e) => {
        setEventFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleNewEventFormChange = (e) => {
        let name = e.target.name;
        let value = e.target.value
        setNewEventFormData((prev) => ({
            ...prev,
            [name]:value
        }));
    };

    const handleEditEventClick = (event) => {
        setEditingEventId(event._id);
        setEventFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate.split("T")[0],
        });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3000/api/v1/events/${editingEventId}`,
                eventFormData,
                { withCredentials: true }
            );
            alert("Event updated successfully!");
            setEditingEventId(null);
            fetchEvents();
        } catch (error) {
            console.error("Error updating event:", error.message);
        }
    };

    const handleCancelEventEdit = () => {
        setEditingEventId(null);
        setEventFormData({ title: "", description: "", eventDate: "" });
    };

    const handleCreateEvent = async () => {
        try {
            await axios.post("http://localhost:3000/api/v1/events/create", newEventFormData, {
                withCredentials: true,
            });
            alert("Event created successfully!");
            setNewEventFormData({  title:"",
      description:"",
      eventDate:"",
      location:"",
      eventType:"",
      presentedBy:"",
      type:"",
      status:"" });
            fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error.message);
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/events/${id}`, {
                withCredentials: true,
            });
            alert("Event deleted successfully!");
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error.message);
        }
    };

    // Job Handlers
    const handleJobFormChange = (e) => {
        setJobFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleNewJobFormChange = (e) => {
        setNewJobFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditJobClick = (job) => {
        setEditingJobId(job._id);
        setJobFormData({
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
            await axios.patch(
                `http://localhost:3000/api/v1/jobs/${editingJobId}`,
                jobFormData,
                { withCredentials: true }
            );
            alert("Job updated successfully!");
            setEditingJobId(null);
            fetchJobs();
        } catch (error) {
            console.error("Error updating job:", error.message);
        }
    };

    const handleCancelJobEdit = () => {
        setEditingJobId(null);
        setJobFormData({ title: "", role: "", description: "", applyLink: "", documentUrl: "" });
    };

    const handleCreateJob = async () => {
        try {
            await axios.post("http://localhost:3000/api/v1/jobs", newJobFormData, {
                withCredentials: true,
            });
            alert("Job created successfully!");
            setNewJobFormData({ title: "", role: "", description: "", applyLink: "", documentUrl: "" });
            fetchJobs();
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
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job:", error.message);
        }
    };

    return (
        <div className="min-h-screen bg-space-dark text-white">
            <main className="container mx-auto px-4 pt-24 pb-16">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 bg-space-purple/20">
                        <TabsTrigger value="events">Manage Events</TabsTrigger>
                        <TabsTrigger value="jobs">Manage Jobs</TabsTrigger>
                        <TabsTrigger value="suggestions">Blog Suggestions</TabsTrigger>
                    </TabsList>

                    {/* Manage Events */}
                      
   <TabsContent value="events" className="space-y-6">
                        <Card className="bg-space-purple/10 border-space-purple/30">
                            <CardHeader>
                                <CardTitle>Create New Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleCreateEvent();
                                    }}
                                    className="space-y-4"
                                >
                                    <input
                                        type="text"
                                        name="title"
                                        value={newEventFormData.title}
                                        onChange={handleNewEventFormChange}
                                        placeholder="Event Title"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                    <textarea
                                        name="description"
                                        value={newEventFormData.description}
                                        onChange={handleNewEventFormChange}
                                        placeholder="Event Description"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={newEventFormData.eventDate}
                                        onChange={handleNewEventFormChange}
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                     <textarea
                                        name="location"
                                        value={newEventFormData.location}
                                        onChange={handleNewEventFormChange}
                                        placeholder="location"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                     <textarea
                                        name="eventType"
                                        value={newEventFormData.eventType}
                                        onChange={handleNewEventFormChange}
                                        placeholder="Event type"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                     <textarea
                                        name="presentedBy"
                                        value={newEventFormData.presentedBy}
                                        onChange={handleNewEventFormChange}
                                        placeholder="presentedBy"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                     <textarea
                                        name="type"
                                        value={newEventFormData.type}
                                        onChange={handleNewEventFormChange}
                                        placeholder="type"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                     <textarea
                                        name="status"
                                        value={newEventFormData.status}
                                        onChange={handleNewEventFormChange}
                                        placeholder="status"
                                        className="w-full p-2 rounded bg-gray-800 text-white"
                                        required
                                    ></textarea>
                                    <Button type="submit" className="w-full">
                                        Create Event
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <ul className="space-y-4">
                            {events.map((event) => (
                                <li key={event._id} className="p-4 border bg-space-purple/20 rounded">
                                    {editingEventId === event._id ? (
                                        <form onSubmit={handleUpdateEvent} className="space-y-2">
                                            <input
                                                type="text"
                                                name="title"
                                                value={eventFormData.title}
                                                onChange={handleEventFormChange}
                                                placeholder="Event Title"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            />
                                            <textarea
                                                name="description"
                                                value={eventFormData.description}
                                                onChange={handleEventFormChange}
                                                placeholder="Event Description"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            ></textarea>
                                            <input
                                                type="date"
                                                name="eventDate"
                                                value={eventFormData.eventDate}
                                                onChange={handleEventFormChange}
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            />
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
                    </TabsContent>

                  
                    {/* Manage Jobs */}
                    <TabsContent value="jobs" className="space-y-6">
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

                        <ul className="space-y-4">
                            {jobs.map((job) => (
                                <li key={job._id} className="p-4 border bg-space-purple/20 rounded">
                                    {editingJobId === job._id ? (
                                        <form onSubmit={handleUpdateJob} className="space-y-2">
                                            <input
                                                type="text"
                                                name="title"
                                                value={jobFormData.title}
                                                onChange={handleJobFormChange}
                                                placeholder="Job Title"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="role"
                                                value={jobFormData.role}
                                                onChange={handleJobFormChange}
                                                placeholder="Job Role"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            />
                                            <textarea
                                                name="description"
                                                value={jobFormData.description}
                                                onChange={handleJobFormChange}
                                                placeholder="Job Description"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            ></textarea>
                                            <input
                                                type="url"
                                                name="applyLink"
                                                value={jobFormData.applyLink}
                                                onChange={handleJobFormChange}
                                                placeholder="Apply Link"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            />
                                            <input
                                                type="url"
                                                name="documentUrl"
                                                value={jobFormData.documentUrl}
                                                onChange={handleJobFormChange}
                                                placeholder="Document URL"
                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <Button type="submit">Save</Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleCancelJobEdit}
                                                    variant="outline"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
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
                                                    onClick={() => handleDeleteJob(job._id)}
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
                    </TabsContent>

                    {/* Blog Suggestions */}
                    <TabsContent value="suggestions" className="space-y-6">
                        <SuggestedBlogTopic />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
