import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Calendar, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Helmet } from "react-helmet-async";

const AllBlogs = () => {
  const [loadingUserBlogs, setLoadingUserBlogs] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  const [formData, setFormData] = useState<Record<string, { response: string }>>({});
  const { toast } = useToast();

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoadingUserBlogs(true);
      const res = await api.get("/blogs/all", { withCredentials: true });
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

  // Handle response input
  const handleResponseChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], response: value },
    }));
  };

  // Change status with optional response
  const changeStatus = async (id: string, newStatus: string) => {
    const response = formData[id]?.response?.trim() || "";

    // Require response only for rejection
    if (newStatus === "rejected" && !response) {
      toast({
        title: "Response required",
        description: "Please add a response before rejecting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.patch(
        `/blogs/status/${id}`,
        { status: newStatus, response },
        { withCredentials: true }
      );

      toast({
        description: `Blog marked as ${newStatus}${response ? ` with response: "${response}"` : ""}`,
      });
      fetchBlogs();
    } catch (err) {
      toast({
        description: "Something went wrong changing the status.",
        variant: "destructive",
      });
    }
  };

  // Share blog
  const handleShare = (blog) => {
    const shareUrl = `${window.location.origin}/blogs/${blog._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied.",
    });
  };

  // Format date
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Format time
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      <Helmet>
        <title>Admin: All Blogs | ISA-India</title>
        <meta name="description" content="Admin page for managing all blogs." />
      </Helmet>
      {/* Pending Blogs */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Pending Blogs</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loadingUserBlogs ? (
          <p>Loading...</p>
        ) : userBlogs.length === 0 ? (
          <p className="text-gray-500 italic">Nothing to see here right now!</p>
        ) : (
          (showAllUserBlogs ? userBlogs : userBlogs.slice(0, 3)).map((blog) => (
            <div key={blog._id} className="relative group">
              <Link
                to={`/blogs/${blog._id}`}
                className="cosmic-card group flex flex-col cursor-pointer relative"
              >
                {/* Thumbnail */}
                <div className="h-48 w-full relative overflow-hidden">
                  <img
                    loading="lazy"
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{blog.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{blog.description}</p>

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

                  {/* Footer */}
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
                        className="w-64 p-2"
                        onClick={(e) => e.stopPropagation()}
                        align="end"
                        side="top"
                      >
                        <DropdownMenuItem onSelect={() => handleShare(blog)}>
                          Share
                        </DropdownMenuItem>

                        {/* Admin Response Textarea */}
                        <textarea
                          onChange={(e) => handleResponseChange(blog._id, e.target.value)}
                          value={formData[blog._id]?.response || ""}
                          placeholder="Write admin response here..."
                          className="w-full p-2 mt-2 mb-2 text-sm text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-space-purple"
                        />

                        <DropdownMenuItem onSelect={() => changeStatus(blog._id, "approved")}>
                          Approve
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={() => changeStatus(blog._id, "rejected")}>
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

      {/* View all blogs */}
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