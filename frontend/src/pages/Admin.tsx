import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

import { Pencil, Trash2 } from "lucide-react";
import SuggestedBlogTopic from "./blog/SuggestedBlogTopic";

export default function AdminDashboard() {
    const [events, setEvents] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingJobId, setEditingJobId] = useState(null);
    const [eventFormData, setEventFormData] = useState({
        title: "",
        description: "",
        date: "",
    });
    const [jobFormData, setJobFormData] = useState({
        title: "",
        description: "",
        date: "",
    });
    const [activeTab, setActiveTab] = useState("events");

    // Fetch events from API
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

    // Fetch jobs from API
    const handleFetchJobs = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/jobs/", {
                withCredentials: true,
            });
            setJobs(response.data.data);
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
        }
    };

    useEffect(() => {
        handleEvents();
        handleFetchJobs();
    }, []);

    // Handle Edit Button Click for Events
    const handleEditEventClick = (event) => {
        setEditingEventId(event._id);
        setEventFormData({
            title: event.title,
            description: event.description,
            date: event.eventDate.split("T")[0],
        });
    };

    // Handle Edit Button Click for Jobs
    const handleEditJobClick = (job) => {
        setEditingJobId(job._id);
        setJobFormData({
            title: job.title,
            description: job.description,
            date: job.jobDate.split("T")[0],
        });
    };

    // Handle Input Change for Events
    const handleEventChange = (e) => {
        setEventFormData({ ...eventFormData, [e.target.name]: e.target.value });
    };

    // Handle Input Change for Jobs
    const handleJobChange = (e) => {
        setJobFormData({ ...jobFormData, [e.target.name]: e.target.value });
    };

    // Submit Updated Event Details
    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3000/api/v1/events/${editingEventId}`,
                eventFormData,
                { withCredentials: true }
            );
            alert("Event updated successfully!");
            setEditingEventId(null);
            handleEvents();
        } catch (error) {
            console.error("Error updating event:", error.message);
        }
    };

    // Submit Updated Job Details
    const handleSubmitJob = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3000/api/v1/jobs/${editingJobId}`,
                jobFormData,
                { withCredentials: true }
            );
            alert("Job updated successfully!");
            setEditingJobId(null);
            handleFetchJobs();
        } catch (error) {
            console.error("Error updating job:", error.message);
        }
    };

    // Cancel Editing for Events
    const handleCancelEvent = () => {
        setEditingEventId(null);
        setEventFormData({ title: "", description: "", date: "" });
    };

    // Cancel Editing for Jobs
    const handleCancelJob = () => {
        setEditingJobId(null);
        setJobFormData({ title: "", description: "", date: "" });
    };

    // Handle Delete Event
    const handleDeleteEvent = async (_id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/events/${_id}`, {
                withCredentials: true,
            });
            alert("Event deleted successfully!");
            handleEvents();
        } catch (error) {
            console.error("Error deleting event:", error.message);
        }
    };

    // Handle Delete Job
    const handleDeleteJob = async (_id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/jobs/${_id}`, {
                withCredentials: true,
            });
            alert("Job deleted successfully!");
            handleFetchJobs();
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
                                <CardTitle>Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {events.length === 0 ? (
                                    <p className="text-gray-400">No events found.</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {events.map((event) => (
                                            <li
                                                key={event._id}
                                                className="p-4 border border-space-purple/30 rounded bg-space-purple/20"
                                            >
                                                {editingEventId === event._id ? (
                                                    <form onSubmit={handleSubmitEvent} className="space-y-2">
                                                        <label>
                                                            Title:
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                value={eventFormData.title}
                                                                onChange={handleEventChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            />
                                                        </label>
                                                        <label>
                                                            Description:
                                                            <textarea
                                                                name="description"
                                                                value={eventFormData.description}
                                                                onChange={handleEventChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            ></textarea>
                                                        </label>
                                                        <label>
                                                            Date:
                                                            <input
                                                                type="date"
                                                                name="date"
                                                                value={eventFormData.date}
                                                                onChange={handleEventChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            />
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <Button type="submit" >
                                                                Save
                                                            </Button>
                                                            <Button type="button" onClick={handleCancelEvent}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold">{event.title}</p>
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
                                <CardTitle>Available Jobs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {jobs.length === 0 ? (
                                    <p className="text-gray-400">No jobs found.</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {jobs.map((job) => (
                                            <li
                                                key={job._id}
                                                className="p-4 border border-space-purple/30 rounded bg-space-purple/20"
                                            >
                                                {editingJobId === job._id ? (
                                                    <form onSubmit={handleSubmitJob} className="space-y-2">
                                                        <label>
                                                            Title:
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                value={jobFormData.title}
                                                                onChange={handleJobChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            />
                                                        </label>
                                                        <label>
                                                            Description:
                                                            <textarea
                                                                name="description"
                                                                value={jobFormData.description}
                                                                onChange={handleJobChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            ></textarea>
                                                        </label>
                                                        <label>
                                                            Date:
                                                            <input
                                                                type="date"
                                                                name="date"
                                                                value={jobFormData.date}
                                                                onChange={handleJobChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            />
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <Button type="submit" >
                                                                Save
                                                            </Button>
                                                            <Button type="button" onClick={handleCancelJob}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <p className="font-semibold">{job.title}</p>
                                                        <p className="text-sm text-gray-400">
                                                            {job.description}
                                                        </p>
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
