import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import {
    // ClipboardList,
    // Calendar,
    // Briefcase,
    Trash2,
    Pencil,
    Plus,
  } from "lucide-react";
import SuggestedBlogTopic from "./blog/SuggestedBlogTopic";

export default function AdminDashboard() {
    const jobs = [
        { id: 1, title: 'Frontend Dev', company: 'SpaceX', location: 'Remote' },
        { id: 2, title: 'Mission Planner', company: 'ISRO', location: 'India' },
      ];

    const [events, setEvents] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
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

    useEffect(() => {
        handleEvents();
    }, []);

    // Handle Edit Button Click
    const handleEditClick = (event) => {
        setEditingEventId(event._id); // Set the event being edited
        setFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate.split("T")[0], // Format date for input field
        });
    };

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Updated Event Details
    const handleSubmit = async (e) => {
        console.log('edit event id', editingEventId);
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:3000/api/v1/events/${editingEventId}`,
                formData,
                { withCredentials: true }
            );
            alert("Event updated successfully!");
            setEditingEventId(null); // Exit edit mode
            handleEvents(); // Refresh events list
        } catch (error) {
            console.error("Error updating event:", error.message);
        }
    };

    // Cancel Editing
    const handleCancel = () => {
        setEditingEventId(null);
        setFormData({ title: "", description: "", eventDate: "" });
    };

    // Handle Delete Event
    const handleDeleteEvent = async (_id) => {
        try {
            await axios.delete(`http://localhost:3000/api/v1/events/${_id}`, {
                withCredentials: true,
            });
            alert("Event deleted successfully!");
            handleEvents(); // Refresh events list
        } catch (error) {
            console.error("Error deleting event:", error.message);
        }
    };

    const handleDeleteJob = (id) => {
        console.log('Delete job', id);
      };
    
      const handleUpdateJob = (job) => {
        console.log('Edit job', job);
      };
    
      const handleCreateJob = () => {
        console.log('Create job');
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
                                                {/* this is to edit event */}
                                                {editingEventId === event._id ? (
                                                    <form onSubmit={handleSubmit} className="space-y-2">
                                                        <label>
                                                            Title:
                                                            <input
                                                                type="text"
                                                                name="title"
                                                                value={formData.title}
                                                                onChange={handleChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white mb-4"
                                                            />
                                                        </label>
                                                        <label>
                                                            Description:
                                                            <textarea
                                                                name="description"
                                                                value={formData.description}
                                                                onChange={handleChange}
                                                                rows={5}
                                                                className="w-full p-2 rounded bg-gray-800 text-white mb-4"
                                                            ></textarea>
                                                        </label>
                                                        <label>
                                                            Date:
                                                            <input
                                                                type="date"
                                                                name="eventDate"
                                                                value={formData.eventDate}
                                                                onChange={handleChange}
                                                                className="w-full p-2 rounded bg-gray-800 text-white"
                                                            />
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <Button type="submit" >
                                                                Save
                                                            </Button>
                                                            <Button type="button" onClick={handleCancel}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>  

                                                        {/* this is for the event view */}
                                                        <p className="font-semibold">{event.title}</p>
                                                        <p className="text-sm text-gray-400">
                                                            {new Date(event.eventDate).toLocaleDateString()}
                                                        </p>
                                                        <div className="flex gap-2 mt-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleEditClick(event)}
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
                                    <p className="text-sm text-gray-400">{job.company} | {job.location}</p>
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

                    {/* Blog Suggestions */}
                    <SuggestedBlogTopic />
                </Tabs>
            </main>
        </div>
    );
}
