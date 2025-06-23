import { Calendar, MapPin, Clock, Users, Video } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

//   const event = {
//     title: "Geminid Meteor Shower Observation Night",
//     date: "December 14, 2023",
//     time: "9:00 PM - 2:00 AM",
//     location: "Observatory Hill, Bhopal",
//     type: "In-person",
//     hostedBy: {
//       name: "Aarav Verma",
//       linkedin: "https://linkedin.com/in/aaravverma",
//     },
//     presentedBy: "ISA Astronomy Club",
//     attendees: 75,
//     image: "https://images.unsplash.com/photo-1534222190540-49b9de934701?w=900",
//     description:
//       "Join us for a night of stargazing to observe one of the year's best meteor showers with professional telescopes and guidance.",
//   };

const EventDetails = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <div className="min-h-screen bg-space-dark text-white pt-20 px-4 md:px-16">
      <img
        src={`http://localhost:3000/${event.thumbnail}`}
        alt={event.title}
        className="w-full max-h-[500px] object-cover rounded-xl mb-6"
      />

      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-400 text-lg mb-8">{event.description}</p>

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
            <a
              href={event.hostedBy.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-space-accent hover:underline"
            >
              <ul>
                {event.hostedBy.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            </a>
          </div>
          <div>
            <h3 className="font-semibold text-white">Presented by:</h3>
            <p className="text-gray-300">{event.presentedBy}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleRegister(userInfo?.user._id)}
        disabled={event.registeredUsers.includes(String(userInfo?.user._id))}
        className="bg-space-purple/30 hover:bg-space-purple/50 text-white px-6 py-3 rounded-md transition"
      >
        {event.registeredUsers.includes(String(userInfo?.user._id))
          ? "Already Registered"
          : "Register for this Event"}
      </button>

      <div className="mt-6">
        <Link to="/events" className="text-space-light hover:underline text-sm">
          ← Back to All Events
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;
