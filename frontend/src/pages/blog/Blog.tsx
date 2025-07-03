// this is the main blog page where we will see all the featured blogs, recent blogs etc.
import { Calendar, Clock, ExternalLink, MoreVertical, Share, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import SuggestBlogTopic from "./SuggestBlogTopic";

const Blog = () => {
  const [userBlogs, setUserBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserBlogs, setLoadingUserBlogs] = useState(true);
  const [showAllUserBlogs, setShowAllUserBlogs] = useState(false);
  const [loadingExternalBlogs, setLoadingExternalBlogs] = useState(true);
  const [showAllExternalBlogs, setShowAllExternalBlogs] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [featured, setFeatured] = useState({
    _id: "",
    thumbnail: "",
    title: "",
    description: "",
    content: "",
    author: {
      name: "",
      country: "",
    },
    createdAt: "",
  });
  const [noFeatured, setNoFeatured] = useState(false);
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();

  // to get all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingUserBlogs(true);
        const res = await axios.get("http://localhost:3000/api/v1/blogs");
        setUserBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoadingUserBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // to get featured blog
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/blogs/featured");
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

  // to get external blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingExternalBlogs(true);
        const res = await axios.get(
          "http://localhost:3000/api/v2/blogs/external"
        );
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching external blogs", err);
      } finally {
        setLoadingExternalBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // to get external articles
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingArticles(true);
        const res = await axios.get(
          "http://localhost:3000/api/v1/news/articles"
        );
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching external blogs", err);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
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

  // share block
  const handleShare = (blog) => {
    const shareUrl = `${window.location.origin}/blogs/${blog._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied."
    })
  };
  
  // set as featured
  const handleSetFeatured = (blog) => {
    try{
      axios.patch(`http://localhost:3000/api/v1/blogs/featured/${blog._id}`)
      toast({
        title: `Blog set "${blog.title}" as featured`
      })
    }
    catch (err) {
      console.error("Error setting featured", err.message)
      toast({
        title: `Failed to set blog "${blog.title}" as featured`
      })
    }
  };

  // remove featured
  const handleRemoveFeatured = (blog) => {
    try{
      axios.patch(`http://localhost:3000/api/v1/blogs/featured/remove/${blog._id}`)
      toast({
        title: `Blog removed "${blog.title}" from featured`
      })
    }
    catch (err) {
      console.error("Error removing featured", err.message)
      toast({
        title: `Failed to remove blog "${blog.title}" from featured`
      })
    }
  };

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <Navbar /> */}

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blogs & News</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore real-time discoveries and personal perspectives from
            scientists, astronomers, and industry insiders — all in one cosmic
            stream.
          </p>
        </div>

        {/* Featured Blog */}
        <section className="mb-16">
  <h2 className="text-2xl font-bold mb-8">Featured</h2>

  {noFeatured ? (
    <p className="text-gray-500 italic">No featured blog at the moment. Stay tuned!</p>
  ) : (
    <div className="grid grid-cols-5 gap-6 items-center">
      {/* Left Image (2 columns) */}
      <div className="col-span-2 relative">
        <Link to={`/blogs/${featured._id}`}>
          <div className="relative w-full h-full">
            <img
              loading="lazy"
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full max-h-72 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/30 rounded-xl" />
          </div>
        </Link>
      </div>

      {/* Right Text (3 columns) */}
      <div className="col-span-3 flex flex-col justify-center">
        <p className="text-sm text-gray-400 sm:mb-2">
          {formatDate(featured.createdAt)} at {formatTime(featured.createdAt)}
        </p>
        <Link to={`/blogs/${featured._id}`}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-3 hover:underline">
            {featured.title}
          </h3>
        </Link>
        <p className="text-gray-400 mb-6 hidden sm:block">{featured.description}</p>

        <div className="mb-4">
          <h4 className="text-sm text-gray-400">
            Author: {(featured.author?.name || "Unknown Author").toUpperCase()}
          </h4>
                        {isAdmin && featuredId === featured._id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFeatured(featured);
                            setOpenMenuId(null);
                          }}
                          className="py-2 hover:underline rounded text-red-600 flex items-center gap-2"
                        >
                        Remove Featured
                        </button>
                        )}
        </div>
      </div>
    </div>
  )}
</section>

        {/* Recent Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Blogs</h2>

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
              <p>Loading...</p>
            ) : userBlogs.length === 0 ? (
              <p className="text-gray-500 italic">Nothing to see here right now!</p>
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

                {/* author and drop-up menu */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm text-gray-400">
                    Author: {(blog.author?.name || "Unknown").toUpperCase()}
                  </h4>

                  <div className="relative z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === blog._id ? null : blog._id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-800"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>

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
                        {/* if you are admin then only you will see the button */}
                        {isAdmin && featuredId !== blog._id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSetFeatured(blog);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 hover:bg-gray-100 rounded-b-md flex items-center gap-2"
                        >
                        Set as Featured
                        </button>
                      )}

                      {isAdmin && featuredId === blog._id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFeatured(blog);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-2 hover:bg-red-100 rounded-b-md  text-red-600 flex items-center gap-2"
                        >
                        Remove Featured
                        </button>
                      )}
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

        {/* Astronomical Blogs */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Astronomical Blogs</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingExternalBlogs ? (
              <p>Loading...</p>
            ) : blogs.length === 0 ? (
              <p className="text-gray-500 italic">Nothing to see here right now!</p>
            ) : (
              (showAllExternalBlogs ? blogs : blogs.slice(0, 3)).map((blog) => (
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
          {blogs.length > 3 && !showAllExternalBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllExternalBlogs(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Blogs
              </button>
            </div>
          )}
        </section>

        {/* News */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">News Articles</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loadingArticles ? (
              <p>Loading...</p>
            ) : articles.length === 0 ? (
              <p className="text-gray-500 italic">Nothing to see here right now!</p>
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

          {blogs.length > 3 && !showAllExternalBlogs && (
            <div className="text-center mt-10">
              <button
                onClick={() => setShowAllArticles(true)}
                className="inline-flex items-center justify-center px-6 py-3 border border-space-purple text-space-light hover:bg-space-purple/20 rounded-md text-lg font-medium transition-colors"
              >
                View All Articles
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
