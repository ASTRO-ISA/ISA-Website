import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PastWebinars = () => {
  const [pastWebinars, setPastWebinars] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const [featuredId, setFeaturedId] = useState(null);

  const { isAdmin } = useAuth();
  const { toast } = useToast();

  // Helpers
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleShare = (webinar) => {
    const webinarUrl = `${window.location.origin}/webinars?watch=${webinar._id}`;
    if (navigator.share) {
      navigator.share({
        title: webinar.title,
        text: "Check out this webinar!",
        url: webinarUrl,
      });
    } else {
      navigator.clipboard.writeText(webinarUrl);
      toast({ description: "Link copied." });
    }
  };

  // API Calls
  const fetchPastWebinars = async () => {
    try {
      const res = await api.get("/webinars/past");
      setPastWebinars(res.data);
    } catch (error) {
      console.error("No past webinar at the moment.");
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await api.get("/webinars/featured");
      if (res.status !== 404) {
        setFeaturedId(res.data._id);
      }
    } catch (err) {
      console.error("No featured webinar at the moment.");
      setFeaturedId(null);
    }
  };

  useEffect(() => {
    fetchPastWebinars();
    fetchFeatured();
  }, []);

  // Featured Management
  const handleSetFeatured = async (webinar) => {
    if (featuredId) {
      toast({
        title: "Already exist a featured webinar.",
        description: "Remove previous featured to set a new one.",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.patch(`/webinars/featured/${webinar._id}`);
      setFeaturedId(webinar._id);
      fetchFeatured();
      toast({ description: `Webinar \"${webinar.title}\" set as featured.`, variant: "success" });
    } catch (err) {
      console.error(`Failed to set webinar as featured:`, err.message);
      toast({
        description: `Failed to set webinar \"${webinar.title}\" as featured!`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFeatured = async (webinar) => {
    try {
      await api.patch(`/webinars/featured/remove/${webinar._id}`);
      setFeaturedId(null);
      fetchFeatured();
      toast({ title: `\"${webinar.title}\" removed from featured.` });
    } catch (err) {
      console.error(`Failed to remove featured webinar:`, err.message);
      toast({
        description: `Failed to remove webinar \"${webinar.title}\" from featured!`,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-bold mb-8 text-center sm:text-start">Past Webinars</h2>

      {pastWebinars.length === 0 ? (
        <p className="text-gray-500 italic text-center sm:text-start">No past webinars at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastWebinars.map((webinar) => (
            <div key={webinar._id} className="cosmic-card overflow-hidden group">
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

                <div className="flex items-center justify-between">
                  <div>
                    {webinar.guests?.length > 0 && (
                      <p className="text-sm text-gray-400">
                        Guest: {webinar.guests.join(", ").toUpperCase()}
                      </p>
                    )}
                    <h4 className="text-sm text-gray-400">
                      Presenter: {(webinar.presenter || "Unknown").toUpperCase()}
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
                      <DropdownMenuItem onClick={() => handleShare(webinar)}>
                        Share
                      </DropdownMenuItem>

                      {isAdmin && featuredId !== webinar._id && (
                        <DropdownMenuItem onClick={() => handleSetFeatured(webinar)}>
                          Set as Featured
                        </DropdownMenuItem>
                      )}

                      {isAdmin && featuredId === webinar._id && (
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleRemoveFeatured(webinar)}
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
  );
};

export default PastWebinars;