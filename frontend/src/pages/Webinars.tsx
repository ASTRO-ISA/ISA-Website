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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Spinner from "@/components/ui/Spinner";

const Webinars = () => {
  // category based on live, past and upcoming
  const [liveWebinars, setLiveWebinars] = useState([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);
  const [pastWebinars, setPastWebinars] = useState([]);

  // to open dropdown in card
  const [openMenuId, setOpenMenuId] = useState(null);

  // to show thumbnail
  const [playingId, setPlayingId] = useState(null)

  // featured webinar
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    title: "",
    description: "",
    webinarDate: "",
    presenter: "",
    guest: [],
    videoId: "",
  });

  // to mark a webinar as featured and also to check if there is a featured exist
  const [featuredId, setFeaturedId] = useState(null);

  // registering
  const [loadingRegWebId, setLoadingRegWebId] = useState(null);

  const { isLoggedIn, isAdmin, userInfo } = useAuth();
  const { toast } = useToast();

  // to fetch all webinars
  const fetchUpcomingWebinars = async () => {
    try {
      const res = await api.get("/webinars/upcoming");
      setUpcomingWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error.message);
    }
  };

  // to featch all webinars on first render
  useEffect(() => {
    fetchUpcomingWebinars();
  }, []);

  const fetchPastWebinars = async () => {
    try {
      const res = await api.get("/webinars/past");
      setPastWebinars(res.data);
    } catch (error) {
      console.error("Error fetching webinars:", error.message);
    }
  };

  // to featch all webinars on first render
  useEffect(() => {
    fetchPastWebinars();
  }, []);

  // registering a user for webinar
  const handleRegister = async (userId, webinarId) => {
    if(isLoggedIn){
      setLoadingRegWebId(webinarId);
      try{
        const res = await api.patch(`/webinars/register/${webinarId}/${userId}`);
        fetchUpcomingWebinars();
        setLoadingRegWebId(null);
      } catch (err) {
        console.error("Error registering user for webinar.");
        setLoadingRegWebId(null);
      }
    } else {
      toast({
        title: "Hold on!",
        description: "Please login first to register for the webinar.",
        variant: "destructive",
      });
    }
  };

  const handleUnregister = async (userId, webinarId) => {
    if(isLoggedIn){
      setLoadingRegWebId(webinarId);
      try {
        await api.patch(`/webinars/unregister/${webinarId}/${userId}`);
        fetchUpcomingWebinars();
        setLoadingRegWebId(null);
      } catch (err) {
        toast({
          title: "Can't unregister.",
          description:
            "There seems to be a problem unregistering, please try again after some time.",
          variant: "destructive",
        });
        setLoadingRegWebId(null);
      }
    }
    else {
      toast({
        title: "Hold on!",
        description: "Please login first to unregister for the webinar.",
        variant: "destructive",
      });
    }
  };

  // to get featured webinar
  const fetchFeatured = async () => {
    try {
      const res = await api.get("/webinars/featured");
      if (res.status === 404) {
        console.log("No featured webinar at the moment.");
      } else {
        setFeatured({
          _id: res.data._id,
          thumbnail: res.data.thumbnail,
          title: res.data.title,
          description: res.data.description,
          webinarDate: res.data.webinarDate,
          presenter: res.data.presenter,
          guest: res.data.guests || [],
          videoId: res.data.videoId,
        });
        setFeaturedId(res.data._id);
      }
    } catch (err) {
      console.error("Error fetching featured webinar.");
      setFeaturedId(null);
    }
  };

  useEffect(() => {
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
      fetchFeatured();
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
        guest: [],
        videoId: "",
      });
      setFeaturedId(null);
      fetchFeatured();
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
    const webinarUrl = `${window.location.origin}/webinars?watch=${webinar._id}`
navigator.clipboard.writeText(webinarUrl)
    toast({
      title: "Link copied.",
    });
    // const shareUrl = `${window.location.origin}/blogs/${webinar._id}`;
    // navigator.clipboard.writeText(shareUrl);
    // toast({
    //   title: "Link copied.",
    // });
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
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg">
  {playingId === webinar._id ? (
    <iframe
      src={`https://www.youtube.com/embed/${webinar.videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
      title={webinar.title}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  ) : (
    <div
      className="w-full h-full cursor-pointer"
      onClick={() => setPlayingId(webinar._id)}
    >
      <img
        src={webinar.thumbnail}
        alt={webinar.title}
        className="w-full h-full object-cover"
      />
    </div>
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
                      <div>
                      {webinar.guests && webinar.guests.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Guest: {webinar.guests.join(', ').toUpperCase()}
                      </p>
                      )}
                      <h4 className="text-sm text-gray-400">
                        Presenter:{" "}
                        {(webinar.presenter || "Unknown").toUpperCase()}
                      </h4>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1 rounded-full hover:bg-gray-800"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="left" align="end" className="w-40">
                        <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          navigator.share
                            ? navigator.share({
                                title: webinar.title,
                                text: "Check out this webinar!",
                                url: `${window.location.origin}/webinars?watch=${webinar._id}`,
                              })
                            : alert("Sharing not supported on this browser.")
                        }
                      >
                        Share
                      </DropdownMenuItem>

                          {isAdmin && featuredId !== webinar._id && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                // e.preventDefault()
                                e.stopPropagation()
                                handleSetFeatured(webinar)
                              }}
                            >
                              Set as Featured
                            </DropdownMenuItem>
                          )}

                          {isAdmin && featuredId === webinar._id && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                // e.preventDefault()
                                e.stopPropagation()
                                handleRemoveFeatured(webinar)
                              }}
                              className="text-red-600"
                            >
                              Remove Featured
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
  onClick={() =>
    webinar.attendees.some((a) => a._id.toString() === userInfo?.user._id.toString())
      ? handleUnregister(userInfo?.user._id, webinar._id)
      : handleRegister(userInfo?.user._id, webinar._id)
  }
  className={`w-full md:w-auto px-6 py-3 rounded-md transition text-white font-semibold flex justify-center
    ${
      isLoggedIn && webinar.attendees.some((a) => a._id.toString() === userInfo?.user._id.toString())
        ? "bg-space-purple/30 hover:bg-space-purple/50"
        : "bg-space-accent hover:bg-space-accent/80"
    }`}
>
  {loadingRegWebId === webinar._id ? (
    <Spinner />
  ) : isLoggedIn &&
    webinar.attendees.some((a) => a._id.toString() === userInfo?.user._id.toString()) ? (
    "Unregister"
  ) : (
    "Register for this Webinar"
  )}
</button>
                </div>
              ))
            )}
          </div>
        </section>

{/* Featured Session */}
<section className="mb-16">
  <h2 className="text-2xl font-bold mb-8">Featured Talk</h2>

  {featured && (featured.videoId || featured.thumbnail) ? (
    <div className="cosmic-card p-0 overflow-hidden rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          {featured.thumbnail && (
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="md:col-span-2 p-4 md:p-6">
          <p className="text-sm text-space-accent mb-1">
            {formatDate(featured.webinarDate)}
          </p>

          <h3 className="text-2xl font-bold mb-2">{featured.title}</h3>

          <p className="text-gray-400 mb-4 line-clamp-3">
            {featured.description}
          </p>

          <p className="text-sm text-gray-400 mb-2">
            <span className="text-gray-400">Presenter: </span>
            {(featured.presenter || 'Unknown').toUpperCase()}
          </p>

          {featured.guest && featured.guest.length > 0 && (
            <p className="text-sm text-gray-400 mb-2">
              <span className="text-gray-400">Guests: </span>
              {featured.guest.join(', ').toUpperCase()}
            </p>
          )}

          {isAdmin && isLoggedIn && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleRemoveFeatured(featured)
                setOpenMenuId(null)
              }}
              className="p-1 border border-red-600 hover:text-red-800 hover:border-red-800 rounded text-red-600 flex items-center gap-2"
            >
              Remove Featured
            </button>
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

        {/* Past Webinars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Past Webinars</h2>

          {pastWebinars.length === 0 ? (
            <p className="text-gray-500 italic">No past webinars at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastWebinars.map((webinar) => (
                <div
                  key={webinar._id}
                  className="cosmic-card overflow-hidden group"
                >
<div className="relative w-full aspect-video overflow-hidden rounded-lg">
  {playingId === webinar._id ? (
    <iframe
      src={`https://www.youtube.com/embed/${webinar.videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1`}
      title={webinar.title}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  ) : (
    <div
      className="w-full h-full cursor-pointer"
      onClick={() => setPlayingId(webinar._id)}
    >
      <img
        src={webinar.thumbnail}
        alt={webinar.title}
        className="w-full h-full object-cover"
      />
    </div>
  )}
</div>

                  <div className="p-4">
                    <p className="text-space-accent text-sm">
                      {formatDate(webinar.webinarDate)}
                    </p>
                    <h3 className="text-xl font-semibold mb-1 text-white line-clamp-2 min-h-[3rem]">
                      {webinar.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 min-h-[3rem]">
                      {webinar.description}
                    </p>

                    {/* Presenter & Dropdown */}
                    <div className="flex items-center justify-between">
                    <div>
                      {webinar.guests && webinar.guests.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Guest: {webinar.guests.join(', ').toUpperCase()}
                      </p>
                      )}
                      <h4 className="text-sm text-gray-400">
                        Presenter:{" "}
                        {(webinar.presenter || "Unknown").toUpperCase()}
                      </h4>
                      </div>


                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1 rounded-full hover:bg-gray-800"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={(e) => {
                              // e.preventDefault()
                              handleShare(webinar)
                            }}
                          >
                            Share
                          </DropdownMenuItem>

                          {isAdmin && featuredId !== webinar._id && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                // e.preventDefault()
                                handleSetFeatured(webinar)
                              }}
                            >
                              Set as Featured
                            </DropdownMenuItem>
                          )}

                          {isAdmin && featuredId === webinar._id && (
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                // e.preventDefault()
                                handleRemoveFeatured(webinar)
                              }}
                            >
                              Remove Featured
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pastWebinars.length > 3 && (
            <div className="text-center mt-10">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors">
                View All
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Webinars;
