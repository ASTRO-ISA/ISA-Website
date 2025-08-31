// this is the main blog page where we will see all the featured blogs, recent blogs etc.
import { Calendar, Clock, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const UserBlogs = () => {
  const queryClient = useQueryClient();
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  const [showAllSavedBlogs, setShowAllSavedBlogs] = useState(false);
  const { userInfo } = useAuth();
  const { toast } = useToast();

const fetchBlogs = async ({ queryKey }) => {
  const [_key, userId] = queryKey;
  const res = await api.get(`/blogs/my-blogs/${userId}`);
  return res.data;
};

const fetchSavedBlogs = async () => {
  const res = await api.get("/users/saved-blogs");
  return res.data.savedBlogs;
};

const { data: userBlogs, isLoading: loadingUserBlogs } = useQuery({
  queryKey: ["blogs", userInfo?.user?._id],
  queryFn: fetchBlogs,
  enabled: !!userInfo?.user?._id, // only run if userId exists
});

const { data: savedBlogs, error, isLoading: loadingSavedBlogs } = useQuery({
  queryKey: ["saved-blogs"],
  queryFn: fetchSavedBlogs,
});

const mutateUnSaveBlog = useMutation({
  mutationFn: async (blogId) => {
    await api.delete(`/users/unsave-blog/${blogId}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["saved-blogs"] });
    toast({
      title: "Blog unsaved",
    });
  },
  onError: (error) => {
    console.error(error.message);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});

const handleUnsaveBlog = (blogId) => {
  mutateUnSaveBlog.mutate(blogId);
};

  if (loadingUserBlogs) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-100">Loading...</p>
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
    const shareUrl = `${window.location.origin}/blogs/${blog.slug}`;
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
            <h2 className="text-2xl font-bold">Your Writings</h2>
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
                    to={`/blogs/${blog.slug}`}
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

                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                          className="p-1 h-auto bg-transparent hover:bg-transparent"
                          onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent                     
                        className="w-48"
                      onClick={(e) => e.stopPropagation()}
                      align="end"
                      side="top"
                        
                        >
                          <DropdownMenuItem
                            onSelect={() => handleShare(blog)}
                          >
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {/* View all blogs button */}
          {/* if there are no blpgs, no need to show the see all events button */}
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

          {/* Saved Blogs */}
        </section>
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Saved Blogs</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingSavedBlogs ? (
              <p>Loading...</p>
            ) : savedBlogs.length === 0 ? (
              <p className="text-gray-500 italic">
              Nothing to see here right now! You can save a blog to read later, and it will appear here.
              </p>
            ) : (
              (showAllUserBlogs ? savedBlogs : savedBlogs.slice(0, 3)).map(
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

                        <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                          className="p-1 h-auto bg-transparent hover:bg-transparent"
                          onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent                             
                    className="w-48"
                    onClick={(e) => e.stopPropagation()}
                    align="end"
                    // className="bg-white text-black border border-gray-200 shadow-md z-[9999]"
                    side="top">
                  <DropdownMenuItem
                    onSelect={(e) => {
                      // e.preventDefault()
                      handleShare(blog)
                    }}
                  >
                    Share
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={(e) => {
                      // e.preventDefault()
                      handleUnsaveBlog(blog._id)
                    }}
                  >
                    Unsave
                  </DropdownMenuItem>
                </DropdownMenuContent>
                    </DropdownMenu>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {/* View all blogs button */}
          {/* if there are no blpgs, no need to show the see all events button */}
          {savedBlogs?.length > 3 && !showAllSavedBlogs && (
            <div className="text-center mt-10">
              <button onClick={() => setShowAllSavedBlogs(true)}>
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
