import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const FeaturedWebinars = () => {
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
      console.log(res.data)
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
                // setOpenMenuId(null)
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
    )
}

export default FeaturedWebinars;