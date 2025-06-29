import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
    // ClipboardList,
    // Calendar,
    // Briefcase,
    Trash2,
    Pencil,
    Plus,
  } from "lucide-react";
import SuggestedBlogTopic from "./blog/SuggestedBlogTopic";
import { useToast } from "@/hooks/use-toast";


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
    const [newJobFormData, setNewJobFormData] = useState({
        title: "",
        role: "",
        description: "",
        applyLink: "",
        document: "",
    });
    const [activeTab, setActiveTab] = useState("events");
    const { toast } = useToast();
    const [images, setImages] = useState([]);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

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

    const handleNewJobFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "document") {
            const file = files[0];
            if (
                file &&
                !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(file.type)
            ) {
                alert("Only PDF, DOCX, and DOC files are allowed.");
                return;
            }
            setNewJobFormData({ ...newJobFormData, document: file });
        } else {
            setNewJobFormData({ ...newJobFormData, [name]: value });
        }
    };

    const handleEditJobClick = (job) => {
        setEditingJobId(job.id);
        setNewJobFormData({
            title: job.title,
            role: job.role,
            description: job.description,
            applyLink: job.applyLink,
            document: job.document,
        });
    };

    // not being used
    const handleUpdateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/v1/jobs/${editingJobId}`, newJobFormData, {
                withCredentials: true,
            });
            alert("Job updated successfully!");
            setEditingJobId(null);
            setNewJobFormData({ title: "", role: "", description: "", applyLink: "", document: "" });
            handleJobs();
        } catch (error) {
            console.error("Error updating job:", error.message);
        }
    };

    const handleCancelJobEdit = () => {
        setEditingJobId(null);
        setNewJobFormData({ title: "", role: "", description: "", applyLink: "", document: "" });
    };

    const handleCreateJob = async () => {
        try {
            const formData = new FormData();
            formData.append("title", newJobFormData.title);
            formData.append("role", newJobFormData.role);
            formData.append("description", newJobFormData.description);
            formData.append("applyLink", newJobFormData.applyLink);
            formData.append("document", newJobFormData.document); // assuming you store the File object in `document`
    
            await axios.post("http://localhost:3000/api/v1/jobs", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            alert("Job created successfully!");
            setNewJobFormData({ title: "", role: "", description: "", applyLink: "", document: null });
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

        useEffect(() => {
        const fetchImages = async () => {
          const res = await axios.get("http://localhost:3000/api/v1/gallery", {
            withCredentials: true,
          });
          setImages(
            res.data.map((img) => ({
              src: img.imageUrl,
              caption: img.caption || "",
            }))
          );
        };
        fetchImages();
      }, []);
    
      const handleGalleryUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("image", file);
    
        await axios.post("http://localhost:3000/api/v1/gallery", formData, {
          withCredentials: true,
        });
    
        window.location.reload();
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
                <div className="mb-6 bg-space-purple/20 rounded">
                <TabsList className="grid h-full w-full grid-cols-2 grid-rows-2 sm:grid-cols-4 sm:grid-rows-1">
                    <TabsTrigger value="events">Manage Events</TabsTrigger>
                    <TabsTrigger value="training">Manage Jobs</TabsTrigger>
                    <TabsTrigger value="suggestions">Blog Suggestions</TabsTrigger>
                    <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
                </TabsList>
                </div>

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
                                        className="w-full p-2 mb-2 rounded bg-gray-800 text-white"
                                        required
                                    />
                                    <label htmlFor="document" className="block mt-2">The allowd formats are pdf, docx and doc</label>
                                    <input
                                    type="file"
                                    name="document"
                                    onChange={handleNewJobFormChange}
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
                                <li key={job._id} className="p-4 border bg-space-purple/20 rounded">
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

                    {/* gallery section */}
                    <TabsContent value="gallery" className="space-y-6">
                    <Card className="bg-space-purple/10 border-space-purple/30">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Gallery Uploads</CardTitle>
                        <Button onClick={() => document.getElementById("gallery-upload").click()}>
                        <Plus className="w-4 h-4 mr-1" /> Upload Image
                        </Button>
                        <input
                        type="file"
                        id="gallery-upload"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        />
                    </CardHeader>
                    <CardContent>
                    {images.length === 0 ? (
                        <p className="text-gray-400">No gallery images found.</p>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {images.map((image, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                setOpen(true);
                                setIndex(i);
                                }}
                                className="group overflow-hidden rounded-lg relative animate-fade-in cursor-pointer"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <img
                                src={image.src}
                                alt={image.caption}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white font-medium">{image.caption}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={index}
                            slides={images.map((img) => ({ src: img.src, type: "image" }))}
                        />
                        </>
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
