import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Calendar,
  Clock,
  Users,
  Play,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Webinars = () => {
  // all webinars
  const [webinars, setWebinars] = useState([]);

  // category based on live, past and upcoming
  const [liveWebinars, setLiveWebinars] = useState([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);
  const [pastWebinars, setPastWebinars] = useState([]);

  // to open three dot menu in card (right now only visible in upcoming - fix later)
  const [openMenuId, setOpenMenuId] = useState(null);

  // featured blog
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    title: "",
    description: "",
    webinarDate: "",
    presenter: "",
    videoId: "",
  });

  // to mark a webinar as featured and also to check if there is a featured exist
  const [featuredId, setFeaturedId] = useState(null);

  // registering
  const [registering, setRegistering] = useState(false);

  const { isLoggedIn, isAdmin, userInfo } = useAuth();
  const { toast } = useToast();

  // to fetch all webinars
  const fetchWebinars = async () => {
    try {
      const res = await api.get("/webinars");
      const allWebinars = res.data;
      setWebinars(res.data);
      setLiveWebinars(allWebinars.filter((webinar) => webinar.type === "live"));
      setUpcomingWebinars(
        allWebinars.filter((webinar) => webinar.type === "upcoming")
      );
      setPastWebinars(allWebinars.filter((webinar) => webinar.type === "past"));
    } catch (error) {
      console.error("Error fetching webinars:", error.message);
    }
  };

  // to featch all webinars on first render
  useEffect(() => {
    fetchWebinars();
  }, []);

  // to get featured webinar
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/webinars/featured");
        if (res.status === 404) {
          console.log("No featured blog at the moment.");
        } else {
          setFeatured({
            _id: res.data._id,
            thumbnail: res.data.thumbnail,
            title: res.data.title,
            description: res.data.description,
            webinarDate: res.data.webinarDate,
            presenter: res.data.presenter,
            videoId: res.data.videoId,
          });
          setFeaturedId(res.data._id);
        }
      } catch (err) {
        console.error("Error fetching webinar", err);
        setFeaturedId(null);
      }
    };

    fetchFeatured();
  }, []);

  // set as featured and fetch it
  const handleSetFeatured = async (webinar) => {
    // if there is alredy a featured, new featured is not allowed
    if (featuredId !== null) {
      toast({
        title: "Already exist a featured webinar.",
        description: "Remove previous featured to set it featured.",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.patch(`/webinars/featured/${webinar._id}`);
      // if its set featured then add its id to the featuredId so we know there exist a featured blog
      setFeaturedId(webinar._id);
      toast({
        title: `Webinar "${webinar.title}" set as featured.`,
      });
    } catch (err) {
      setFeaturedId(null);
      console.error(
        `Failed to set webinar "${webinar.title}" as featured!`,
        err.message
      );
      toast({
        title: `Failed to set webinar "${webinar.title}" as featured!`,
      });
    }
  };

  // remove featured
  const handleRemoveFeatured = (webinar) => {
    try {
      api.patch(`/webinars/featured/remove/${webinar._id}`);
      setFeatured({
        _id: "",
        thumbnail: "",
        title: "",
        description: "",
        webinarDate: "",
        presenter: "",
        videoId: "",
      });
      setFeaturedId(null);
      toast({
        title: `"${webinar.title}" removed from featured.`,
      });
    } catch (err) {
      console.error(
        `Failed to remove webinar "${webinar.title}" from featured!`,
        err.message
      );
      toast({
        title: `Failed to remove webinar "${webinar.title}" from featured!`,
        variant: "destructive",
      });
    }
  };

  // registering a user for event
  const handleRegister = async (userId, webinarId) => {
    if (!userId) {
      toast({
        title: "Hold on!",
        description: "Please log in to register for the webinar.",
        variant: "destructive",
      });
      return;
    }

    setRegistering(true);

    try {
      await api.patch(`/webinars/register/${webinarId}/${userId}`, {});

      // update local webinar list
      setWebinars((prevWebinars) =>
        prevWebinars.map((webinar) =>
          webinar._id === webinarId
            ? {
                ...webinar,
                attendees: [...webinar.attendees, String(userId)],
              }
            : webinar
        )
      );

      // update upcoming list
      setUpcomingWebinars((prev) =>
        prev.map((webinar) =>
          webinar._id === webinarId
            ? {
                ...webinar,
                attendees: [...webinar.attendees, String(userId)],
              }
            : webinar
        )
      );

      toast({
        title: "Successfully registered!",
        description: "You've been added to the attendees list.",
      });
    } catch (err) {
      console.error("Error registering for webinar:", err);
      toast({
        title: "Registration failed",
        description: err?.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

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

  // share webinar
  const handleShare = (webinar) => {
    const shareUrl = `${window.location.origin}/blogs/${webinar._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied.",
    });
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Webinars & Live Sessions</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with scientists, astronauts, and industry experts through
            interactive talks and sessions.
          </p>
        </div>

        {/* Upcoming Webinars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Upcoming Webinars</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingWebinars.length === 0 ? (
              <p className="text-gray-500 italic">
                No upcoming webinars right now!
              </p>
            ) : (
              upcomingWebinars.map((webinar) => (
                <div
                  key={webinar._id}
                  className="cosmic-card overflow-hidden group flex flex-col relative"
                >
                  {/* Video or Thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    {webinar.videoId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${webinar.videoId}`}
                        title={webinar.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src={webinar.thumbnail}
                        alt={webinar.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">
                        {webinar.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        {webinar.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{formatDate(webinar.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{formatTime(webinar.createdAt)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Users className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{webinar.attendees.length} registered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <h4 className="text-sm text-gray-400">
                        Presenter:{" "}
                        {(webinar.presenter || "Unknown").toUpperCase()}
                      </h4>

                      <div className="relative z-10">
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpenMenuId(
                              openMenuId === webinar._id ? null : webinar._id
                            );
                          }}
                          className="p-1 rounded-full hover:bg-gray-800"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </Button>

                        {openMenuId === webinar._id && (
                          <div className="absolute right-0 bottom-full mb-2 w-40 bg-white text-black shadow-lg rounded-md z-[9999]">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleShare(webinar);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 hover:bg-gray-100 rounded-t-md flex items-center gap-2"
                            >
                              Share
                            </button>

                            {isAdmin && featuredId !== webinar._id && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSetFeatured(webinar);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                Set as Featured
                              </button>
                            )}

                            {isAdmin && featuredId === webinar._id && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleRemoveFeatured(webinar);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2 rounded-b-md"
                              >
                                Remove Featured
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() =>
                      handleRegister(userInfo?.user._id, webinar._id)
                    }
                    disabled={webinar.attendees?.includes(
                      String(userInfo?.user._id)
                    )}
                    className={`w-full py-2 transition-colors ${
                      webinar.attendees?.includes(String(userInfo?.user._id))
                        ? "bg-space-purple/30 hover:bg-space-purple/50 cursor-not-allowed"
                        : "bg-space-accent hover:bg-space-accent/90"
                    }`}
                  >
                    {webinar.attendees?.includes(String(userInfo?.user._id))
                      ? "Registered"
                      : "Register for this Webinar"}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Past Webinars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Recent Webinar Recordings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastWebinars.map((webinar) => (
              <div
                key={webinar._id}
                className="cosmic-card overflow-hidden group"
              >
                <div className="relative h-44 overflow-hidden">
                  {webinar.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${webinar.videoId}`}
                      title={webinar.title}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={webinar.thumbnail}
                      alt={webinar.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="p-4">
                  <p className="text-gray-400 text-sm">
                    {formatDate(webinar.webinarDate)}
                  </p>
                  <h3 className="text-xl font-semibold mb-1 text-white line-clamp-2">
                    {webinar.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {webinar.description}
                  </p>
                  {/* Presenter & Menu */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm text-gray-400">
                      Presenter:{" "}
                      {(webinar.presenter || "Unknown").toUpperCase()}
                    </h4>

                    <div className="relative z-10">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === webinar._id ? null : webinar._id
                          );
                        }}
                        className="p-1 rounded-full hover:bg-gray-800"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </Button>

                      {openMenuId === webinar._id && (
                        <div className="absolute right-0 bottom-full mb-2 w-40 bg-white text-black shadow-lg rounded-md z-[9999]">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleShare(webinar);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-2 hover:bg-gray-100 rounded-t-md flex items-center gap-2"
                          >
                            Share
                          </button>

                          {isAdmin && featuredId !== webinar._id && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSetFeatured(webinar);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            >
                              Set as Featured
                            </button>
                          )}

                          {isAdmin && featuredId === webinar._id && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleRemoveFeatured(webinar);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2 rounded-b-md"
                            >
                              Remove Featured
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
              View All Recordings
            </button>
          </div>
        </section>

        {/* Featured Session */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Talk</h2>

          {featured && (featured.videoId || featured.thumbnail) ? (
            <div
              className="cosmic-card p-0 overflow-hidden rounded-none"
              style={{ borderRadius: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="aspect-video md:aspect-[4/3] rounded-md overflow-hidden">
                  {featured.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${featured.videoId}`}
                      title={featured.title}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={featured.thumbnail}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="md:col-span-2 p-4 md:p-6">
                  <h3 className="text-2xl font-bold mb-2">{featured.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {featured.description}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-white">
                      Presenter:{" "}
                    </span>
                    {(featured.presenter || "Unknown").toUpperCase()}
                  </p>
                  {isAdmin && isLoggedIn ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFeatured(featured);
                        setOpenMenuId(null);
                      }}
                      className="p-2 border border-red-600 hover:text-red-800 hover:border-red-800 rounded text-red-600 flex items-center gap-2"
                    >
                      Remove Featured
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No featured webinar at the moment.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Webinars;
