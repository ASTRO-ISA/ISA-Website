import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  // const [launches, setLaunches] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  const userId = userInfo?.user?._id;

  // useEffect(() => {
  //   const res = api
  //     .get(`/events/my-events/${userId}`)
  //     .then((res) => {
  //       const userRegisteredEvents = res.data.filter((event) => {
  //         return event.registeredUsers.some((u) => {
  //           return u._id == userInfo.user._id;
  //         });
  //       });
  //       setEvents(userRegisteredEvents);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching events", err);
  //     });
  // }, [userInfo]);

  const fetchRegisteredEvents = async (userId) => {
    try{
      const res = await api.get(`/events/my-events/${userId}`);
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events");
    }
  }

  useEffect(() => {
    fetchRegisteredEvents(userId);
  }, []);

  if (loading) {
    return (
      <div className="flex-col items-center justify-center h-64">
        <p className="text-gray-100">Loading...</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-8 pb-16">
        {/* Upcoming ISA Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming Events for You</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming events */}
            {loading ? (
              <p>Loading...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-500 italic">
                Nothing to see here right now! Registerd events will appear
                here.
              </p>
            ) : (
              (showAll ? events : events.slice(0, 3)).map((event) => (
                <div
                  key={event._id}
                  className="cosmic-card overflow-hidden group relative flex flex-col"
                >
                  <Link
                    to={`/events/${event._id}`}
                    className="flex-1 flex flex-col"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        loading="lazy"
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          {event.title}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(event.eventDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(event.eventDate)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Users className="h-4 w-4 mr-2 text-space-accent" />
                            <span>
                              {event.registeredUsers.length} attending
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm">
                          {event?.description
                            ?.split(" ")
                            .slice(0, 20)
                            .join(" ")}
                          ...
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* View all events button */}
          {/* if there are no events, no need to show the see all events button */}
          {!showAll && events.length >= 3 && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Events
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserEvents;
