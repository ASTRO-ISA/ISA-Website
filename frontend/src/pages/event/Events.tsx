import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
// import StarBackground from "@/components/StarBackground";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, userInfo } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // to check if the user is logged in before writing the blog, if the user is not logged in, he cannot write blog
  const handleWriteClick = () => {
    if (isLoggedIn) {
      // checking using auth context isLoggedIn state
      navigate("/host-event");
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to host an event.",
      });
    }
  };

  // //registering a user for event
  const handleRegister = async (userId, eventId) => {
    const res = axios
      .patch(
        `http://localhost:3000/api/v1/events/register/${eventId}/${userId}`
      )
      .then((res) => {
        // setting a particular event as registered, since we are registering from the events page so to update the button to 'alredy registerd'
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? {
                  ...event,
                  registeredUsers: [...event.registeredUsers, String(userId)],
                }
              : event
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error regstering user for event", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const res = axios
      .get("http://localhost:3000/api/v1/events")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events", err);
      });
  }, []);

  // to get external launches (from api)
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/launches");
        setLaunches(res.data);
      } catch (err) {
        console.error("Error fetching blogs from api", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  // we got all events from which we are making types here
  const communityEvents = events.filter((event) => event.type === "community");
  const astronomicalEvents = events.filter(
    (event) => event.type === "astronomical"
  );

  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const completedEvents = events.filter(
    (event) => event.status === "completed"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100 mb-4"></div>
        <p className="text-gray-100">Loading events for you...</p>
      </div>
    );
  }
  // if(events.length === 0) return <p className="min-h-screen flex flex-col items-center justify-center h-64">Nothing to see here right now!</p>

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
      {/* <StarBackground /> */}

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Astronomical Events & Meetups
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay updated with upcoming astronomical phenomena and ISA club
            events.
          </p>
        </div>

        {/* Upcoming ISA Events */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming ISA Club Events</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming events */}
            {loading ? (
              <p>Loading...</p>
            ) : events.length === 0 ? (
              <p>Nothing to see here right now!</p>
            ) : (
              (showAll ? events : events.slice(0, 3)).map(
                (
                  event // for time being using just events
                ) => (
                  <div className="cosmic-card overflow-hidden group">
                    <Link to={`/events/${event._id}`} key={event._id}>
                      <div className="h-48 overflow-hidden">
                        <img
                          loading="lazy"
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5">
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
                    </Link>
                    <button
                      onClick={() =>
                        handleRegister(userInfo?.user._id, event._id)
                      }
                      disabled={event.registeredUsers.includes(
                        String(userInfo?.user._id)
                      )}
                      className={`w-full py-2 transition-colors
                 ${
                   event.registeredUsers.includes(String(userInfo.user._id))
                     ? "bg-space-purple/30 hover:bg-space-purple/50 cursor-not-allowed"
                     : "bg-space-accent"
                 }`}
                    >
                      {event.registeredUsers.includes(
                        String(userInfo?.user._id)
                      )
                        ? "Registered"
                        : "Register for this Event"}
                    </button>
                  </div>
                )
              )
            )}
          </div>

          {/* View all events button */}
          {/* if there are no events, no need to show the see all events button */}
          {launches.length > 6 && !showAll && (
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

        {/* We need astronomical events section here */}

        {/* launches */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Upcoming Launches</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming events */}
            {launches.length === 0 ? (
              <p>Nothing to see here right now!</p>
            ) : (
              (showAll ? launches : launches.slice(0, 6)).map(
                (
                  launch // for time being using just events
                ) => (
                  <Link to={`/events/${launch.id}`} key={launch.id}>
                    <div className="cosmic-card overflow-hidden group">
                      <div className="h-48 overflow-hidden">
                        <img
                          loading="lazy"
                          src={launch.image?.image_url}
                          alt={launch.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold mb-3">
                          {launch.name}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(launch.window_start)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(launch.window_start)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{launch.launch_service_provider?.name}</span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">
                          {launch.mission?.description
                            ?.split(" ")
                            .slice(0, 20)
                            .join(" ")}
                          ...
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {/* View all events button */}
          {/* if there are no events, no need to show the see all events button */}
          {launches.length > 6 && !showAll && (
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

        {/* Astronomical Calendar */}
        {/* <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Launch Calendar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showAll? launches : launches.slice(0, 6).map((launch) => (
              <Link
              to={`/events/${launch.id}`}
              key={launch.id}
              >
              <div className="cosmic-card p-5 hover:transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-space-accent/20 text-space-accent flex items-center justify-center font-bold">
                    {formatDate(launch.window_start).split(' ')[0]}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-400">{formatTime(launch.window_start)}</div>
                    <h3 className="font-semibold">{launch.name}</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{launch.mission?.description?.split(" ").slice(0, 20).join(" ")}</p>
              </div>
              </Link>
            ))}
          </div>
        </section> */}

        {/* Host Your Own Event */}
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">
                Host Your Own Stargazing Event
              </h2>
              <p className="text-gray-300 mb-6">
                ISA Club members can organize their own astronomical observation
                events with our equipment and guidance. Share your passion for
                astronomy with others!
              </p>
              <ul className="text-gray-400 mb-6 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Access to telescopes and observation equipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Guidance from experienced club members</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Promotion through ISA Club channels</span>
                </li>
              </ul>
              <button
                className="bg-space-accent hover:bg-space-accent/80 text-white px-5 py-2 rounded transition-colors"
                onClick={handleWriteClick}
              >
                Host an Event
              </button>
            </div>
            <div className="md:w-1/3">
              <img
                loading="lazy"
                src="https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?q=80&w=500"
                alt="Stargazing Event"
                className="rounded-lg h-auto w-full"
              />
            </div>
          </div>
        </section>
      </main>
      {/*<Footer /> */}
    </div>
  );
};

export default Events;
