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
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";


export default function AdminDashboard() {

    const [events, setEvents] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventDate: "",
    });
    const [activeTab, setActiveTab] = useState("events");
    const { toast } = useToast();
    const [pic, setPic] = useState("");
    const [images, setImages] = useState([]);
    // const [lightboxOpen, setLightboxOpen] = useState(false);
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

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

    // const handleGalleryUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //     const formData = new FormData();
    //     formData.append('image', file);
      
    //     try {
    //       const res = await axios
    //         .post('http://localhost:3000/api/v1/gallery',
    //         formData,
    //         {
    //         withCredentials: true
    //         });
    //         console.log(res.data.pic)
    //         setPic(res.data.pic)
    //         toast({title: 'Image uploaded successfully!'})
    //     } catch (error) {
    //       console.error('Error uploading image:', error.message);
    //     }
    //   };

    // const fetchGallery = async () => {
    //     const response = await axios.get("http://localhost:3000/api/v1/gallery");
    //     setImages(response.data);
    // };

    // useEffect(() => {
    //     fetchGallery();
    // }, []);

    const handleDeleteJob = (id) => {
        console.log('Delete job', id);
      };
    
      const handleUpdateJob = (job) => {
        console.log('Edit job', job);
      };
    
      const handleCreateJob = () => {
        console.log('Create job');
      };

      const jobs = [
        { id: 1, title: 'Frontend Dev', company: 'SpaceX', location: 'Remote' },
        { id: 2, title: 'Mission Planner', company: 'ISRO', location: 'India' },
      ];

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
                    {/* Manage Events */}
                    <TabsContent value="events" className="space-y-6 mt-5">
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
