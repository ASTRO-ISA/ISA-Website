import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import 'yet-another-react-lightbox/styles.css';
import { Trash2, Pencil } from "lucide-react";
import SuggestedBlogTopic from "../blog/SuggestedBlogTopic";
import { useToast } from "@/hooks/use-toast";
import AdminGallerySection from "./AdminGallerySection";
import AdminJobs from "./AdJob";
import AdminCourses from "./AdminCourses";
import AdminWebinars from "./AdminWebinar";
import AdminNewsletterDraft from "./AdminNewsletterDraft";

export default function AdminDashboard() {

    const [events, setEvents] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [EventformData, setEventformData] = useState({
        title: "",
        description: "",
        eventDate: "",
    });
    const [activeTab, setActiveTab] = useState("events");
    const { toast } = useToast();

    // get all events
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
            toast({
                title: "Event updated successfully!"
            })
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
            toast({
                title: "Event deleted successfully!"
            })
            handleEvents();
        } catch (error) {
            console.error("Error deleting event:", error.message);
        }
    };

    useEffect(() => {
        handleEvents();
    }, []);

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
                    <TabsTrigger value="suggestions">Blog Suggestions</TabsTrigger>
                    <TabsTrigger value="courses">Manage Courses</TabsTrigger>
                    <TabsTrigger value="gallery">Manage Gallery</TabsTrigger>
                    <TabsTrigger value="webinar">Manage Webinars</TabsTrigger>
                    <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
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
                                            min={new Date().toISOString().split("T")[0]}
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
                                    <p className="font-semibold"><span className="text-gray-400">Title: </span>{event.title}</p>
                                    <p><span className="text-gray-400">Description: </span>{event.description}</p>
                                    <p className="text-sm text-gray-400">
                                    <span className="text-gray-400">Date: </span>{new Date(event.eventDate).toLocaleDateString()}
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
                    <AdminJobs />
                    </TabsContent>

                    {/* Blog Suggestions */}
                    <TabsContent value="suggestions" className="space-y-6">
                    <SuggestedBlogTopic />
                    </TabsContent>

                    {/* Manage Webinars */}
                    <TabsContent value="webinar" className="space-y-6">
                    <AdminWebinars />
                    </TabsContent>

                    {/* Gallery section */}
                    <TabsContent value="gallery" className="space-y-6">
                    <AdminGallerySection/>
                    </TabsContent>

                     {/* Admin courses */}
                    <TabsContent value="courses" className="space-y-6">
                    <AdminCourses/> 
                    </TabsContent>

                    {/*newsletter */}
                    <TabsContent value="newsletter" className="space-y-6">
                    <AdminNewsletterDraft/> 
                    </TabsContent>

                </Tabs>
            </main>
        </div>
    );
}
