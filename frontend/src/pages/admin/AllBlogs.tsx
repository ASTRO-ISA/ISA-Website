import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu";
  import {
    Calendar,
    Clock,
    MoreVertical,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { useToast } from "@/hooks/use-toast";
  import api from "@/lib/api";

const AllBlogs = () => {
  const [loadingUserBlogs, setLoadingUserBlogs] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  const {toast} = useToast();

  // to get all blogs
  const fetchBlogs = async () => {
    try {
      setLoadingUserBlogs(true);
      const res = await api.get("/blogs/all", {withCredentials: true});
      setUserBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs.", err);
    } finally {
      setLoadingUserBlogs(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const changeStatus = async (id, newStatus ) => {
    try{
        const res = await api.patch(`/blogs/status/${id}`, {status: newStatus }, {withCredentials: true});
        toast({
          description: `Status changed to ${newStatus}`
        })
        fetchBlogs();
    } catch (err) {
        toast({
            description: "Something went wrong changing the status."
        })
    }
  }

    // share block
    const handleShare = (blog) => {
    const shareUrl = `${window.location.origin}/blogs/${blog._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied.",
    });
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

    return (
      <>
        {/* Recent Blogs */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Pending Blogs</h2>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {loadingUserBlogs ? (
            <p>Loading...</p>
          ) : userBlogs.length === 0 ? (
            <p className="text-gray-500 italic">
              Nothing to see here right now!
            </p>
          ) : (
            (showAllUserBlogs ? userBlogs : userBlogs.slice(0, 3)).map((blog) => (
              <div key={blog._id} className="relative group">
                <Link
                  to={`/blogs/${blog._id}`}
                  className="cosmic-card group flex flex-col cursor-pointer relative"
                >
                  {/* Image */}
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
                      <h3 className="text-xl font-semibold mb-3">{blog.title}</h3>
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
  
                    {/* Footer with author and dropdown */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm text-gray-400">
                        Author: {(blog.author?.name || "Unknown").toUpperCase()}
                      </h4>
  
                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-1 h-auto bg-transparent hover:bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-5 h-5 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
  
                        <DropdownMenuContent
                          className="w-48"
                          onClick={(e) => e.stopPropagation()}
                          align="end"
                          side="top"
                        >
                          <DropdownMenuItem
                            onSelect={(e) => {
                              // e.preventDefault();
                              handleShare(blog);
                            }}
                          >
                            Share
                          </DropdownMenuItem>
  
                          <DropdownMenuItem
                            onSelect={(e) => {
                              // e.preventDefault();
                              changeStatus(blog._id, "approved");
                            }}
                          >
                            Approve
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={(e) => {
                              // e.preventDefault();
                              changeStatus(blog._id, "rejected");
                            }}
                          >
                            Reject
                          </DropdownMenuItem>
  
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
  
        {/* View all blogs button */}
        {userBlogs.length > 3 && !showAllUserBlogs && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllUserBlogs(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
            >
              View All Blogs
            </button>
          </div>
        )}
      </>
    );
  };

  export default AllBlogs;