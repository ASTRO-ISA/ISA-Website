// this is the main blog page where we will see all the featured blogs, recent blogs etc.
import { Calendar, Clock, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";

const UserBlogs = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserBlogs, setLoadingUserBlogs] = useState(true);
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  //   const [featured, setFeatured] = useState({
  //     _id: "",
  //     thumbnail: "",
  //     title: "",
  //     description: "",
  //     content: "",
  //     author: {
  //       name: "",
  //       country: "",
  //     },
  //     createdAt: "",
  //   });
  const [openMenuId, setOpenMenuId] = useState(null);
  // to check if there is a featured blog exist already, if it exist then we dont want to allow any more featured
  //   const isEmptyFeatured =
  //     !featured._id &&
  //     !featured.thumbnail &&
  //     !featured.title &&
  //     !featured.description &&
  //     !featured.content &&
  //     !featured.author.name &&
  //     !featured.author.country &&
  //     !featured.createdAt;

  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { toast } = useToast();

  // to get all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingUserBlogs(true);
        const res = await axios.get("http://localhost:3000/api/v1/blogs");
        const userBlogs = res.data.filter(
          (blog) => blog.author._id == userInfo.user._id
        );
        setUserBlogs(userBlogs);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoadingUserBlogs(false);
      }
    };

    fetchBlogs();
  }, [userInfo.user._id]);

  if (loadingUserBlogs) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-100 mb-4"></div>
        <p className="text-gray-100">Loading blogs for you...</p>
      </div>
    );
  }
  if (!userBlogs) return <p>Nothing to see here right now.</p>;

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
  const handleShare = (blog) => {
    const shareUrl = `${window.location.origin}/blogs/${blog._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied.",
    });
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      <main className="container mx-auto px-4 pt-8 pb-16">
        {/* Recent Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">My Blogs</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingUserBlogs ? (
              <p>Loading...</p>
            ) : userBlogs.length === 0 ? (
              <p className="text-gray-500 italic">
                Nothing to see here right now! Your written blogs will appear
                here.
              </p>
            ) : (
              (showAllUserBlogs ? userBlogs : userBlogs.slice(0, 3)).map(
                (blog) => (
                  <Link
                    key={blog._id}
                    to={`/blogs/${blog._id}`}
                    className="cosmic-card group flex flex-col cursor-pointer relative"
                  >
                    {/* Image with overflow-hidden for zoom effect only */}
                    <div className="h-48 w-full relative overflow-hidden">
                      <img
                        loading="lazy"
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          {blog.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {blog.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(blog.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(blog.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* author and drop-up menu */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm text-gray-400">
                          Author:{" "}
                          {(blog.author?.name || "Unknown").toUpperCase()}
                        </h4>

                        <div className="relative z-10">
                          <Button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === blog._id ? null : blog._id
                              );
                            }}
                            className="p-1 rounded-full hover:bg-gray-800"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </Button>

                          {openMenuId === blog._id && (
                            <div className="absolute right-0 bottom-full mb-2 w-40 bg-white text-black shadow-lg rounded-md z-[9999]">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleShare(blog);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 hover:bg-gray-100 rounded-t-md flex items-center gap-2"
                              >
                                Share
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {/* View all blogs button */}
          {/* if there are no blpgs, no need to show the see all events button */}
          {blogs.length > 3 && !showAllUserBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllUserBlogs(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Blogs
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserBlogs;
