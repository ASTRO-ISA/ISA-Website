import {
  Calendar,
  MapPin,
  Clock,
  Users,
  MoreHorizontal,
  Share,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/Spinner";
import AstronomyCalendar from "./AstronomyCalendar";

// import StarBackground from "@/components/StarBackground";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [launches, setLaunches] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const { isLoggedIn, userInfo, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Something went wrong fetching events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // to check if the user is logged in before writing the blog, if the user is not logged in, he cannot write blog
  const handleWriteClick = () => {
    if (isLoggedIn) {
      // checking using auth context isLoggedIn state
      navigate("/host-event");
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to host an event.",
        variant: "destructive",
      });
    }
  };

  // //registering a user for event
  const handleRegister = async (userId, eventId) => {
    if (isLoggedIn) {
      setLoadingEventId(eventId);
      try {
        const res = await api.patch(`/events/register/${eventId}/${userId}`);

        // Update the event locally
        // setEvents((prevEvents) =>
        //   prevEvents.map((event) =>
        //     event._id === eventId
        //       ? {
        //           ...event,
        //           registeredUsers: [
        //             ...event.registeredUsers,
        //             // ensure we add in the same format
        //             typeof userId === "object"
        //               ? userId
        //               : { _id: String(userId) },
        //           ],
        //         }
        //       : event
        //   )
        // );
        fetchEvents();
        setLoading(false);
        setLoadingEventId(null);
      } catch (err) {
        console.error("Error registering user for event.", err);
        setLoading(false);
        setLoadingEventId(null);
      }
    } else {
      toast({
        title: "Hold on!",
        description: "Please login first to register for the event.",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (userId, eventId) => {
    setLoadingEventId(eventId);
    try {
      await api.patch(`/events/unregister/${eventId}/${userId}`);
      fetchEvents();
      setLoadingEventId(null);
    } catch (err) {
      toast({
        title: "Can't unregister.",
        description:
          "There seems to be a problem unregistering, please try again after some time.",
        variant: "destructive",
      });
      setLoadingEventId(null);
    }
  };

  const handleAddToNewsletter = async (event) => {
    try {
      await api.post(
        "/newsletter/draft/add",
        {
          type: "event",
          id: event._id,
        },
        { withCredentials: true }
      );
      toast({ title: "Added to newsletter draft!" });
    } catch (err) {
      toast({
        title: "Failed to add to draft",
        variant: "destructive",
      });
    }
  };

  // to get external launches (from api)
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const res = await api.get("/launches");
        setLaunches(res.data);
      } catch (err) {
        console.error("Error fetching launches from api", err);
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

  const userId = userInfo?.user._id;

  const getStatus = (eventDate) => {
    return new Date(eventDate) > new Date() ? "Upcoming" : "Completed";
  };

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
              (showAll ? events : events.slice(0, 3)).map((event) => (
                <div
                  key={event._id}
                  className="cosmic-card overflow-hidden group relative flex flex-col"
                >
                  <Link
                    to={`/events/${event.slug}`}
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
                        <span
                          className={`${
                            new Date(event.eventDate) > new Date()
                              ? "text-space-accent"
                              : "text-space-purple"
                          } uppercase text-xs font-bold tracking-widest mb-2`}
                        >
                          {new Date(event.eventDate) > new Date()
                            ? "Upcoming"
                            : "Completed"}
                        </span>
                        {/* <p className={`uppercase text-xs font-bold tracking-widest text-space-accent mb-2`}>{getStatus(event.eventDate)}</p> */}
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
                  <div className="absolute top-3 right-3 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="text-white bg-black/40 hover:bg-black/60 rounded-full p-1">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black border border-gray-800 text-white text-sm shadow-xl">
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.share
                              ? navigator.share({
                                  title: event.title,
                                  text: "Check out this event!",
                                  url: `${window.location.origin}/events/${event._id}`,
                                })
                              : alert("Sharing not supported on this browser.")
                          }
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Share size={14} /> Share
                        </DropdownMenuItem>
                        {isLoggedIn && isAdmin ? (
                          <DropdownMenuItem
                            onClick={() => handleAddToNewsletter(event)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Mail size={14} /> Add to Newsletter
                          </DropdownMenuItem>
                        ) : (
                          ""
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <button
                    onClick={() =>
                      event.registeredUsers.some(
                        (e) => e._id === userInfo?.user?._id
                      )
                        ? handleUnregister(userInfo?.user._id, event._id)
                        : handleRegister(userInfo?.user?._id, event._id)
                    }
                    className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold
                      ${
                        isLoggedIn &&
                        event.registeredUsers.some(
                          (e) => e._id === userInfo?.user._id
                        )
                          ? "bg-space-purple/30 hover:bg-space-purple/50"
                          : "bg-space-accent hover:bg-space-accent/80"
                      }`}
                  >
                    {loadingEventId === event._id ? (
                      <Spinner />
                    ) : isLoggedIn &&
                      event.registeredUsers.some(
                        (e) => e._id === userInfo?.user._id
                      ) ? (
                      "Unregister"
                    ) : (
                      "Register for this Event"
                    )}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* View all events button */}
          {/* if there are no events, no need to show the see all events button */}
          {events.length > 3 && !showAll && (
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
              (showAll ? launches : launches.slice(0, 3)).map(
                (
                  launch // for time being using just events
                ) => (
                  // <Link to={launch.url} key={launch.url}>
                  <div
                    className="cosmic-card overflow-hidden group flex flex-col min-h-[28rem]"
                    key={launch.name}
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden">
                      <img
                        loading="lazy"
                        src={launch.image?.image_url}
                        alt={launch.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-3 min-h-[3rem]">
                          {launch.name}
                        </h3>

                        <div className="space-y-2 mb-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(launch.window_start)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(launch.window_start)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{launch.launch_service_provider?.name}</span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm line-clamp-3">
                          {launch.mission?.description
                            ?.split(" ")
                            .slice(0, 30)
                            .join(" ")}
                          ...
                        </p>
                      </div>
                    </div>
                  </div>
                  // </Link>
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
        <section className=" mb-20">
          <h2 className="  text-2xl font-bold mb-8">Astronomical Calendar</h2>
          <AstronomyCalendar />
        </section>

        {/* Host Your Own Event */}
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Host Your Own Event</h2>
              <p className="text-gray-300 mb-6">
                ISA Club members can organize their own astronomical events with
                our equipment and guidance. Share your passion for astronomy
                with others!
              </p>
              <ul className="text-gray-400 mb-6 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-space-accent"></div>
                  <span>Access to required equipments</span>
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
                src="images/host_an_event.png"
                alt="Stargazing Event"
                className="rounded-lg h-auto w-full aspect-[16/9] object-cover hidden sm:block"
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
