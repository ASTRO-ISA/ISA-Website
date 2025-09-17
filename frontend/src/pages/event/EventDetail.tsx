import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/ui/Spinner";

const EventDetails = () => {
  const { slug } = useParams();
  const { userInfo, isLoggedIn } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${slug}`);
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const handleRegister = async (userId) => {
    if (!isLoggedIn) {
      toast({
        title: "Hold on!",
        description: "Please login first to register for the event.",
        variant: "destructive",
      });
      return;
    }

    setLoadingEventId(event._id);
    try {
      await api.patch(`/events/register/${event._id}/${userId}`);
      fetchEvent();
      setLoadingEventId(null);
    } catch (err) {
      console.error("Error registering for event:");
      setLoadingEventId(null);
    }
  };

  const handleUnregister = async (userId) => {
    if (!isLoggedIn) {
      toast({
        title: "Hold on!",
        description: "Please login first to unregister for the event.",
        variant: "destructive",
      });
      return;
    }

    setLoadingEventId(event._id);
    try {
      await api.patch(`/events/unregister/${event._id}/${userId}`);
      fetchEvent();
      setLoadingEventId(null);
    } catch (err) {
      console.error("Error unregistering for event:");
      setLoadingEventId(null);
    }
  };

  // Delete event
  const deleteEvent = async () => {
    setDeleting(true);
    try {
      await api.delete(`/events/${event._id}`);
      toast({ title: "Event deleted successfully!" });
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <p className="text-gray-100">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <p className="min-h-screen flex flex-col items-center justify-center h-64">
        Event not found.
      </p>
    );
  }

  // Format date & time
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4">
      <main className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Thumbnail */}
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full max-h-[500px] object-cover rounded-xl mb-6 aspect-[16/9]"
          />

          {/* Title & Description */}
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <p className="text-gray-400 text-lg mb-8">{event.description}</p>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <Calendar className="h-5 w-5 mr-2 text-space-accent" />
                {formatDate(event.eventDate)}
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="h-5 w-5 mr-2 text-space-accent" />
                {formatTime(event.eventDate)}
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2 text-space-accent" />
                {event.location}
              </div>
              <div className="flex items-center text-gray-400">
                <Users className="h-5 w-5 mr-2 text-space-accent" />
                {event.registeredUsers.length} attending
              </div>
              <div className="flex items-center text-gray-400">
                <Video className="h-5 w-5 mr-2 text-space-accent" />
                {event.eventType}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white">Hosted by:</h3>
                <ul className="text-space-accent list-disc list-inside">
                  {event.hostedBy.map((host, index) => (
                    <p key={index}>{host.name}</p>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">Presented by:</h3>
                <p className="text-gray-300">{event.presentedBy}</p>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={() =>
              event.registeredUsers.some((e) => e._id === userInfo?.user?._id)
                ? handleUnregister(userInfo?.user._id)
                : handleRegister(userInfo?.user?._id)
            }
            className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold
              ${
                isLoggedIn &&
                event.registeredUsers.some((e) => e._id === userInfo?.user._id)
                  ? "bg-space-purple/30 hover:bg-space-purple/50"
                  : "bg-space-accent hover:bg-space-accent/80"
              }`}
          >
            {loadingEventId === event._id ? (
              <Spinner />
            ) : isLoggedIn &&
              event.registeredUsers.some((e) => e._id === userInfo?.user._id) ? (
              "Unregister"
            ) : (
              "Register for this Event"
            )}
          </button>

          {/* Delete button if creator */}
          {userInfo && event.createdBy._id === userInfo.user?._id && (
            <div>
              <hr className="mb-3" />
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this event? This action can't be undone.")) {
                    deleteEvent();
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded mt-2"
              >
                {deleting ? <Spinner /> : "Delete Event"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
