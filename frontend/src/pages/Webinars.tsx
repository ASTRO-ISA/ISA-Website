import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, Users, Play, MoreVertical, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [liveWebinars, setLiveWebinars] = useState([]);
  const [upcomingWebinars, setUpcomingWebinars] = useState([]);
  const [pastWebinars, setPastWebinars] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [featuredId, setFeaturedId] = useState(null);
  const { isLoggedIn, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [noFeatured, setNoFeatured] = useState(false);
  const { toast } = useToast();
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    title: "",
    description: "",
    webinarDate: "",
    presenter: "",
    videoId: "",
    createdAt: "",
  });

  // to check if there is a featured webinar exist already, if it exist then we dont want to allow any more featured
  const isEmptyFeatured = 
  !featured._id &&
  !featured.thumbnail &&
  !featured.title &&
  !featured.description &&
  !featured.presenter &&
  !featured.videoId &&
  !featured.createdAt;
  // const upcomingWebinars = [
  //   {
  //     id: 1,
  //     title: "Exploring the James Webb Space Telescope Discoveries",
  //     presenter: "Dr. Anjali Gupta",
  //     date: "December 18, 2023",
  //     time: "7:00 PM - 8:30 PM",
  //     description: "Join us as Dr. Anjali Gupta discusses the latest discoveries from the James Webb Space Telescope and their implications for our understanding of the universe.",
  //     attendees: 245,
  //     image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=500"
  //   },
  //   {
  //     id: 2,
  //     title: "Careers in Space Science and Technology",
  //     presenter: "Panel of Industry Experts",
  //     date: "January 5, 2024",
  //     time: "6:00 PM - 7:30 PM",
  //     description: "Discover career paths in the growing space industry with insights from professionals working in different sectors of space science and technology.",
  //     attendees: 178,
  //     image: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?q=80&w=500"
  //   },
  //   {
  //     id: 3,
  //     title: "Amateur Astronomy: Getting Started with Limited Budget",
  //     presenter: "Rahul Mehra",
  //     date: "January 15, 2024",
  //     time: "7:30 PM - 9:00 PM",
  //     description: "Learn how to begin your astronomy journey with affordable equipment and free resources. Perfect for beginners and students.",
  //     attendees: 120,
  //     image: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=500"
  //   }
  // ];

  // const pastWebinars = [
  //   {
  //     id: 1,
  //     title: "Black Holes: Beyond the Event Horizon",
  //     presenter: "Dr. Vikram Shah",
  //     duration: "1h 23m",
  //     views: "1.2k",
  //     image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500"
  //   },
  //   {
  //     id: 2,
  //     title: "Satellite Design and Engineering Fundamentals",
  //     presenter: "Neha Kapoor",
  //     duration: "1h 45m",
  //     views: "876",
  //     image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?q=80&w=500"
  //   },
  //   {
  //     id: 3,
  //     title: "Exoplanets: The Search for Habitable Worlds",
  //     presenter: "Dr. Arjun Patel",
  //     duration: "1h 12m",
  //     views: "1.5k",
  //     image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500"
  //   },
  //   {
  //     id: 4,
  //     title: "The Future of Space Travel and Colonization",
  //     presenter: "Priya Sharma",
  //     duration: "1h 30m",
  //     views: "2.3k",
  //     image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=500"
  //   }
  // ];

  const fetchWebinars = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/webinars", { withCredentials: true });
      const allWebinars = res.data;
      setWebinars(res.data);
      setLiveWebinars(allWebinars.filter(webinar => webinar.type === "live"));
      setUpcomingWebinars(allWebinars.filter(webinar => webinar.type === "upcoming"));
      setPastWebinars(allWebinars.filter(webinar => webinar.type === "past"));
    } catch (error) {
      console.error("Error fetching webinars:", error.message);
    }
  };

  useEffect(() => {
    fetchWebinars();
  });

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

  // share block
  const handleShare = (webinar) => {
    const shareUrl = `${window.location.origin}/blogs/${webinar._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied."
    })
  };

  // to get featured event
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/webinars/featured");
        if (!res.data || Object.keys(res.data).length === 0) {
          setNoFeatured(true);
          setFeaturedId(null);
        } else {
          setFeatured(res.data);
          setFeaturedId(res.data._id);
        }
      } catch (err) {
        console.error("Error fetching blogs", err);
        setNoFeatured(true);
        setFeaturedId(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFeatured();
  }, []);
  
  // set as featured
  const handleSetFeatured = (webinar) => {
    if(!isEmptyFeatured){
      toast({
        title: "Already exist a featured webinar.",
        description: "Remove previous featured to set it featured."
      })
      return;
    }
    try{
      axios.patch(`http://localhost:3000/api/v1/webinars/featured/${webinar._id}`)
      toast({
        title: `webinar "${webinar.title}" set as featured.`
      })
    }
    catch (err) {
      console.error("Error setting featured!", err.message)
      toast({
        title: `Failed to set webinar "${webinar.title}" as featured!`
      })
    }
  };

  // remove featured
  const handleRemoveFeatured = (webinar) => {
    try{
      axios.patch(`http://localhost:3000/api/v1/blogs/featured/remove/${webinar._id}`)
      toast({
        title: `webinar removed "${webinar.title}" from featured`
      })
    }
    catch (err) {
      console.error("Error removing featured", err.message)
      toast({
        title: `Failed to remove webinar "${webinar.title}" from featured`
      })
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Webinars & Live Sessions</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Connect with scientists, astronauts, and industry experts through interactive talks and sessions.
          </p>
        </div>
        
        {/* Upcoming Webinars */}
        <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8">Upcoming Webinars</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {upcomingWebinars.length === 0 ? (
            <p className="text-gray-500 italic">No upcoming webinars right now!</p>
          ) : (
            upcomingWebinars.map((webinar) => (
              <div key={webinar._id} className="cosmic-card overflow-hidden group flex flex-col cursor-pointer relative">
                {/* Thumbnail */}
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    loading="lazy"
                    src={webinar.thumbnail}
                    alt={webinar.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <span className="text-white font-medium">{webinar.presenter}</span>
                  </div>
                </div>

                {/* Webinar Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{webinar.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{webinar.description}</p>

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
                        <span>{webinar.attendees} registered</span>
                      </div>
                    </div>
                  </div>

                  {/* Presenter & Menu */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm text-gray-400">
                      Presenter: {(webinar.presenter || "Unknown").toUpperCase()}
                    </h4>

                    <div className="relative z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === webinar._id ? null : webinar._id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-800"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>

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
            ))
          )}
        </div>
      </section>
        
        {/* Past Webinars */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Recent Webinar Recordings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pastWebinars.map((webinar) => (
            <div key={webinar._id} className="cosmic-card overflow-hidden group">
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
                <h3 className="font-semibold mb-1 text-white line-clamp-2">
                  {webinar.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Presenter: {webinar.presenter?.toUpperCase()}
                </p>
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
          
          <div className="cosmic-card p-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="lg:col-span-3 h-64 lg:h-auto relative">
                <img 
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-space-accent/80 flex items-center justify-center cursor-pointer hover:bg-space-accent transition-colors">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-3">{featured.title}</h3>
                <p className="text-gray-400 mb-6">
                  {featured.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  {/* <img 
                    src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100" 
                    alt="Dr. Rajesh Kumar"
                    className="w-12 h-12 rounded-full object-cover"
                  /> */}
                  <div>
                    <h4 className="font-semibold">{featured.presenter}</h4>
                    {/* <p className="text-sm text-gray-400">NASA Mars Exploration Program</p> */}
                  </div>
                </div>
                <a 
                  href="#" 
                  className="inline-flex items-center text-space-accent hover:underline"
                >
                  Watch full session
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Suggest a Speaker */}
        <section className="cosmic-card p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Suggest a Speaker or Topic</h2>
              <p className="text-gray-300 mb-6">
                Have a speaker or topic you'd like to see featured in our webinar series? We welcome your suggestions and are constantly looking for exciting new content.
              </p>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Suggested Speaker or Topic"
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                />
                <textarea
                  placeholder="Why this would be valuable (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-space-purple/20 border border-space-purple/50 rounded-md focus:outline-none focus:ring-2 focus:ring-space-accent"
                ></textarea>
                <button type="submit" className="bg-space-accent hover:bg-space-accent/80 text-white px-6 py-2 rounded transition-colors">
                  Submit Suggestion
                </button>
              </form>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?q=80&w=500" 
                alt="Space Speaker" 
                className="rounded-lg h-auto w-full"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Webinars;
