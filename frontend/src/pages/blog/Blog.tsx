import {
  Calendar,
  Clock,
  ExternalLink,
  MoreVertical,
  Share,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SuggestBlogTopic from "./SuggestBlogTopic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/api";
import { Helmet } from "react-helmet-async";

const Blog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // featured blog
  const [loadingFeaturedBlog, setLoadingFeaturedBlog] = useState(false);
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    slug: "",
    title: "",
    description: "",
    content: "",
    author: {
      name: "",
      // country: "",
    },
    createdAt: "",
  });
  const [featuredId, setFeaturedId] = useState<string | null>(null);

  // blogs weitten by users
  const [loadingUserBlogs, setLoadingUserBlogs] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  const [savedBlogs, setSavedBlogs] = useState<string[]>([]);

  // external blogs
  const [loadingExternalBlogs, setLoadingExternalBlogs] = useState(false);
  const [externalBlogs, setExternalBlogs] = useState([]);
  const [showAllExternalBlogs, setShowAllExternalBlogs] = useState(false);

  // external articles
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articles, setArticles] = useState([]);
  const [showAllArticles, setShowAllArticles] = useState(false);

  // 3 dot menu
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openFeaturedMenuId, setOpenFeaturedMenuId] = useState(null);

  // to get all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingUserBlogs(true);
        const res = await api.get("/blogs");
        setUserBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:");
      } finally {
        setLoadingUserBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // to get featured blog
  const fetchFeatured = async () => {
    try {
      setLoadingFeaturedBlog(true);
      const res = await api.get("/blogs/featured");
      if (!res.data || Object.keys(res.data).length === 0) {
        setFeaturedId(null);
        const emptyFeatured = {
          _id: "",
          thumbnail: "",
          title: "",
          slug: "",
          description: "",
          content: "",
          author: {
            name: "",
            // country: "",
          },
          createdAt: "",
        };
        setFeatured(emptyFeatured);
      } else {
        setFeatured(res.data);
        setFeaturedId(res.data._id);
        setLoadingFeaturedBlog(false);
      }
    } catch (err) {
      console.error("Error fetching blogs:");
      setFeaturedId(null);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  // set as featured
  const handleSetFeatured = async (blog) => {
    if (featuredId !== null) {
      toast({
        title: "Already exist a featured blog.",
        description: "Remove previous featured to set this featured.",
      });
      return;
    }
    try {
      await api.patch(`/blogs/featured/${blog._id}`);
      toast({
        description: `Blog "${blog.title}" set as featured.`,
      });
      await fetchFeatured();
    } catch (err) {
      // console.error("Error setting featured!", err.message);
      toast({
        description: `Failed to set blog "${blog.title}" as featured!`,
      });
    }
  };

  // remove featured
  const handleRemoveFeatured = async (blog) => {
    try {
      await api.patch(`/blogs/featured/remove/${blog._id}`);
      toast({
        description: `Blog removed "${blog.title}" from featured`,
      });
      await fetchFeatured();
    } catch (err) {
      console.error("Error removing featured", err.message);
      toast({
        description: `Failed to remove blog "${blog.title}" from featured`,
      });
    }
  };

  const handleAddToNewsletter = async (blog) => {
    try {
      await api.post(
        "/newsletter/draft/add",
        {
          type: "blog",
          id: blog._id,
        },
        { withCredentials: true }
      );
      toast({ description: "Added to newsletter draft!" });
    } catch (err) {
      toast({
        description: "Failed to add to draft",
        variant: "destructive",
      });
    } finally {
      setOpenMenuId(null);
    }
  };

  // to get external blogs
  useEffect(() => {
    const fetchExternalBlogs = async () => {
      try {
        setLoadingExternalBlogs(true);
        const res = await api.get(
          "/external-blogs/external"
        );
        setExternalBlogs(res.data);
      } catch (err) {
        console.error("Error fetching external blogs:");
      } finally {
        setLoadingExternalBlogs(false);
      }
    };

    fetchExternalBlogs();
  }, []);

  // to get external articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoadingArticles(true);
        const res = await api.get("/news/articles");
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching external blogs:");
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, []);

  const mutateSaveBlog = useMutation({
    mutationFn: async (blogId) => {
      await api.patch(
        `/users/save-blog/${blogId}`,
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-blogs"] });
      toast({
        title: "Blog saved!",
        description: "Saved blogs appears on the dashboard.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  //saving blogs to user
  const handleSaveBlog = (blogId) => {
    if (!isLoggedIn) {
      toast({
        description: "You need to login to save blogs.",
        variant: "destructive",
      });
      return;
    }
    mutateSaveBlog.mutate(blogId);
    setSavedBlogs((prev) => [...prev, blogId]);
  };

  const mutateUnsaveBlog = useMutation({
    mutationFn: async (blogId) => {
      await api.delete(`/users/unsave-blog/${blogId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-blogs"] });
      toast({
        description: "Blog is removed from saved.",
        variant: "success"
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
    if (!isLoggedIn) {
      toast({
        title: "Hold on!",
        description: "You need to login to unsave blogs.",
        variant: "destructive",
      });
      return;
    }
    mutateUnsaveBlog.mutate(blogId);
    setSavedBlogs((prev) => prev.filter((id) => id !== blogId)); // remove blogId
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

  // to check if the user is logged in before writing the blog, if the user is not logged in, he cannot write blog
  const handleWriteClick = () => {
    if (isLoggedIn) {
      // checking using auth context isLoggedIn state
      navigate("/write");
    } else {
      toast({
        title: "Hold on!",
        description: "Log in first to share your awesome thoughts!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <Navbar /> */}
            <Helmet>
              <title>Blogs | ISA-India</title>
              {/* <meta name="description" content="Learn about ISA-India's mission to expand access to space education in India." /> */}
            </Helmet>


      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blogs & News</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore real-time discoveries and personal perspectives from
            scientists, astronomers, and industry insiders; all in one cosmic
            stream.
          </p>
        </div>

        {/* Featured Blog */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured</h2>

          {featuredId === null ? (
            <p className="text-gray-500 italic text-center sm:text-start">
              No featured blog at the moment. Stay tuned!
            </p>
          ) : (
            <Link
              to={`/blogs/${featured.slug}`}
              className="cosmic-card group flex flex-col cursor-pointer relative max-w-md"
            >
              {/* Image */}
              <div className="h-60 relative overflow-hidden rounded-t-md">
                <img
                  loading="lazy"
                  src={featured.thumbnail}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 rounded-t-md" />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col justify-between bg-space-dark/80 rounded-b-md">
                <div>
                  {/* Category tag */}
                  <p className="uppercase text-xs font-bold tracking-widest text-space-accent mb-2">
                    Featured Blog
                  </p>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-white hover:underline">
                    {featured.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4">
                    {featured.description ||
                      "An exciting read that'll challenge your thinking."}
                  </p>

                  {/* Date & Time */}
                  <div className="space-y-2 mb-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                      {formatDate(featured.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-space-accent" />
                      {formatTime(featured.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Author + Admin */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-gray-400">
                    Author: {(featured.author?.name || "Unknown").toUpperCase()}
                  </h4>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-1 text-white bg-transparent hover:bg-transparent"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      // className=" text-white border border-gray-200 shadow-md z-[9999]"
                      side="top"
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          navigator.share
                            ? navigator.share({
                                title: featured.title,
                                text: "Check out this blog!",
                                url: `${window.location.origin}/blogs/${featured.slug}`,
                              })
                            : alert("Sharing not supported on this browser.")
                        }
                      >
                        Share
                      </DropdownMenuItem>

                      {savedBlogs.includes(featured._id) ? (
                      <DropdownMenuItem
                        onClick={() => handleUnsaveBlog(featured._id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        Unsave
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => handleSaveBlog(featured._id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        Save
                      </DropdownMenuItem>
                      )}

                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => handleRemoveFeatured(featured)}
                          className="text-red-600 hover:bg-red-100 flex items-center gap-2 cursor-pointer"
                        >
                          Remove Featured
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Link>
          )}
        </section>

        {/* Recent Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-center sm:text-start">Recent Blogs</h2>

            {/* Create Blog Button */}
            <button
              onClick={handleWriteClick}
              className="bg-space-accent text-white px-4 py-2 rounded hover:bg-space-accent/80 transition"
            >
              Create&nbsp;
              <i
                className="fa-solid fa-plus fa-lg"
                style={{ color: "white" }}
              ></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingUserBlogs ? (
              <p className="text-gray-500 italic text-center sm:text-start">Loading...</p>
            ) : userBlogs.length === 0 ? (
              <p className="text-gray-500 italic text-center sm:text-start">
                Nothing to see here right now!
              </p>
            ) : (
              (showAllUserBlogs ? userBlogs : userBlogs.slice(0, 3)).map(
                (blog) => (
                  <div key={blog._id} className="relative group">
                    <Link
                      to={`/blogs/${blog.slug}`}
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

                        {/* Footer with author and dropdown */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm text-gray-400">
                            Author:{" "}
                            {(blog.author?.name || "Unknown").toUpperCase()}
                          </h4>

                          {/* Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                              variant="ghost"
                              className="p-1 text-white bg-transparent hover:bg-transparent"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              >
                                <MoreVertical className="w-5 h-5 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              className="w-48"
                              onClick={(e) => e.stopPropagation()}
                              align="end"
                              // className="bg-white text-black border border-gray-200 shadow-md z-[9999]"
                              side="top"
                            >
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() =>
                                navigator.share
                                  ? navigator.share({
                                      title: blog.title,
                                      text: "Check out this blog!",
                                      url: `${window.location.origin}/blogs/${blog.slug}`,
                                    })
                                  : alert("Sharing not supported on this browser.")
                              }
                            >
                              Share
                            </DropdownMenuItem>

                            {savedBlogs.includes(blog._id) ? (
                            <DropdownMenuItem
                              onClick={() => handleUnsaveBlog(blog._id)}
                            >
                              Unsave
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleSaveBlog(blog._id)}
                            >
                              Save
                            </DropdownMenuItem>
                            )}

                              {isAdmin && (
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    handleAddToNewsletter(blog);
                                  }}
                                >
                                  Add to Newsletter
                                </DropdownMenuItem>
                              )}

                              {isAdmin && featuredId !== blog._id && (
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    handleSetFeatured(blog);
                                  }}
                                >
                                  Set as Featured
                                </DropdownMenuItem>
                              )}

                              {isAdmin && featuredId === blog._id && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={(e) => {
                                    handleRemoveFeatured(blog);
                                  }}
                                >
                                  Remove Featured
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Link>
                  </div>
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
          {userBlogs.length > 3 && showAllUserBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllUserBlogs(false)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View Less
              </button>
            </div>
          )}
        </section>

        {/* Astronomical Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-center sm:text-start">Astronomical Blogs</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingExternalBlogs ? (
              <p className="text-gray-500 italic text-center sm:text-start">Loading...</p>
            ) : externalBlogs.length === 0 ? (
              <p className="text-gray-500 italic text-center sm:text-start">
                Nothing to see here right now!
              </p>
            ) : (
              (showAllExternalBlogs
                ? externalBlogs
                : externalBlogs.slice(0, 3)
              ).map((blog) => (
                <Link
                  key={blog.id}
                  to={blog.url}
                  className="cosmic-card overflow-hidden group flex flex-col cursor-pointer"
                >
                  <div className="h-48 w-full relative">
                    <img
                      loading="lazy"
                      src={blog.image_url}
                      alt={blog.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2 min-h-[3rem]">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3 min-h-[3rem]">
                        {blog.summary}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{formatDate(blog.published_at)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-4 w-4 mr-2 text-space-accent" />
                          <span>{formatTime(blog.published_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <h4 className="text-sm text-gray-400">
                          Courtesy: {blog.authors?.[0]?.name || "Unknown"}
                        </h4>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* View all blogs button */}
          {/* if there are no events, no need to show the see all events button */}
          {externalBlogs.length > 3 && !showAllExternalBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllExternalBlogs(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Blogs
              </button>
            </div>
          )}
          {externalBlogs.length > 3 && showAllExternalBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllExternalBlogs(false)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View Less
              </button>
            </div>
          )}
        </section>

        {/* News */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-center sm:text-start">News Articles</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingArticles ? (
              <p className="text-gray-500 italic text-center sm:text-start">Loading...</p>
            ) : articles.length === 0 ? (
              <p className="text-gray-500 italic text-center sm:text-start">
                Nothing to see here right now!
              </p>
            ) : (
              (showAllArticles ? articles : articles.slice(0, 3)).map(
                (article) => (
                  <Link
                    key={article.id}
                    to={article.url}
                    className="cosmic-card overflow-hidden group flex flex-col cursor-pointer"
                  >
                    <div className="h-48 w-full relative">
                      <img
                        loading="lazy"
                        src={article.image_url}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-3 line-clamp-2 min-h-[3rem]">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 min-h-[3rem]">
                          {article.summary}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatDate(article.published_at)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-space-accent" />
                            <span>{formatTime(article.published_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <h4 className="text-sm text-gray-400">
                            Courtesy: {article.authors?.[0]?.name || "Unknown"}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              )
            )}
          </div>

          {articles.length > 3 && !showAllArticles && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllArticles(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Articles
              </button>
            </div>
          )}
          {articles.length > 3 && showAllArticles && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllArticles(false)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View Less
              </button>
            </div>
          )}
        </section>

        {/* Suggest a Blog Topic */}
        <SuggestBlogTopic />
      </main>
    </div>
  );
};

export default Blog;
