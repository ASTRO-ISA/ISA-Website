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

  // registering
  const [loadingRegWebId, setLoadingRegWebId] = useState(null);

  const { isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleUnregister = async (userId, webinarId) => {
    if(isLoggedIn){
      setLoadingRegWebId(webinarId);
      try {
        await api.patch(`/webinars/unregister/${webinarId}/${userId}`);
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
    } catch (err) {
      console.error("No featured webinar at the moment.");
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

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