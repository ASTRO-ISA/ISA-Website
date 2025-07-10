import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";


const EventDetails = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  // const [userInfo, setUserInfo] = useState(user);
  console.log("kdsjk", userInfo);

  // //registering a user for event
  const handleRegister = async (userId) => {
    const res = axios
      .patch(`http://localhost:3000/api/v1/events/register/${id}/${userId}`)
      .then((res) => {
        fetchEvent();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error regstering user for event", err);
        setLoading(false);
      });
  };

  // get event from database
  const fetchEvent = () => {
    const res = axios
      .get(`http://localhost:3000/api/v1/events/${id}`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const deleteEvent = async (id) => {
    setDeleting(true);
    try {
        await axios.delete(`http://localhost:3000/api/v1/events/${id}`, {
            withCredentials: true,
        });
        toast({
            title: "Event deleted successfully!"
        })
        navigate('/events')
        setDeleting(false)
    } catch (error) {
      setDeleting(false)
        console.error("Error deleting event:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100 mb-4"></div>
        <p className="text-gray-100">Loading event for you...</p>
      </div>
    );
  }
  if (!event)
    return (
      <p className="min-h-screen flex flex-col items-center justify-center h-64">
        Event not found.
      </p>
    );

  // to show the date in readable format
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // to set time in readable format
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
            {/* Event Thumbnail */}
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full max-h-[500px] object-cover rounded-xl mb-6"
            />
    
            {/* Event Title and Description */}
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
              onClick={() => handleRegister(userInfo?.user._id)}
              disabled={event.registeredUsers.includes(String(userInfo?.user._id))}
              className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold
                ${
                  event.registeredUsers.includes(String(userInfo.user._id))
                    ? 'bg-space-purple/30 hover:bg-space-purple/50 cursor-not-allowed'
                    : 'bg-space-accent hover:bg-space-accent/80'
                }`}
            >
              {event.registeredUsers.includes(String(userInfo?.user._id))
                ? "Already Registered"
                : "Register for this Event"}
            </button>
    
            {/* Back Link */}
            {/* <div className="mt-6 mb-6">
              <Link to="/events" className="text-space-light hover:underline text-sm">
                ← Back to All Events
              </Link>
            </div> */}

            <div>{userInfo && event.createdBy._id === userInfo.user?._id && (
              <div>
                <hr className="mb-3"/>
          <button
            onClick={() => deleteEvent(event._id)}
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
          >
          {deleting? <Spinner/> : "Delete Event"}
          </button>
          </div>
          )} </div>
          </div>
        </main>
      </div>
    );
};

export default EventDetails;
